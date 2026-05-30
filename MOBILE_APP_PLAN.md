# Colorado Couch Farm — Mobile App Plan (v1)

## 1. TL;DR

Build a greenfield **Expo SDK 54 / React Native** worker app in a **pnpm Turborepo** alongside the existing Next.js web app, shipping to **TestFlight + Google Play Internal Testing** via EAS Build/Submit/Update. Reuse the current Next.js REST API and `Session` table — add a single `POST /api/auth/mobile/login` that returns an opaque bearer token (stored in `expo-secure-store`), version mobile-facing endpoints under `/api/v1/*`, and add cursor pagination. Payments go through **Stripe Tap-to-Pay** (Terminal SDK on iPhone XS+ / NFC Android 11+) — the same Stripe account replaces the web "Demo Mode" checkout via Stripe Checkout, with one webhook updating `Sale.paid`. Push via **Expo Push Service** (free, multiplexes APNs + FCM) drives re-engagement on new inquiries, buy-requests, and sale receipts. UX is a 4-tab bottom-nav shell (Home / Inventory / Leads / More) with a camera-first add-couch flow and a sticky bottom action bar on detail screens.

## 2. Open decisions for the owner

1. **Stripe or Square?** Recommend Stripe. **Override only if Petrali Roofing already processes through Square** — in that case consolidate on Square for a single 1099-K / payout / dashboard.
2. **Merchant legal entity?** Colorado Couch Farm LLC (if it exists separately) or Petrali Roofing DBA. Determines which EIN goes on Stripe KYC and which bank receives payouts.
3. **Apple Developer Program enrollment — in whose name?** Business entity (needs D-U-N-S, 1–3 days approval) or Jeff personally (faster, but app ownership tied to him). Same call for Google Play Console ($25 one-time).
4. **Monorepo migration: green-light moving the existing Next.js repo into a Turborepo `apps/web` now**, or keep separate and accept type drift? Strong recommendation: monorepo. The Vercel project just needs Root Directory + build command updated; 30 minutes of risk on a preview deployment.
5. **Worker device inventory:** confirm Brian's and Elijah's actual phones. Tap-to-Pay needs iPhone XS+ on iOS 16.7+, or NFC Android 11+ with Google Mobile Services. Older devices force a $49 Stripe Reader M2 fallback.
6. **Can a `sales`-role user record sales + collect payment**, or admin-only? Recommendation: yes, sales can sell. Anything else neuters the app for the two people who'll use it most.

## 3. Architecture at a glance

One Turborepo, two apps, three shared packages. Mobile is Expo managed workflow on SDK 54 with the New Architecture, Expo Router v5 for file-based navigation, TanStack Query v5 for server state, Zustand for the small amount of true client state (auth session, draft-couch form, upload queue). Distribution via EAS Build → TestFlight + Play Internal, OTA via EAS Update channels (`production` / `preview` / `development`). All dev happens against a **dev client** (not Expo Go) so Stripe Terminal, notifications, and any other native modules work.

- **Repo layout:** `apps/web` (existing Next.js, moved verbatim), `apps/mobile` (new Expo), `packages/types` (Prisma type re-exports + Zod schemas), `packages/api-client` (typed fetch wrapper), `packages/brand` (colors, logo, fonts)
- **Mobile stack:** Expo SDK 54, Expo Router v5, React 19, TanStack Query v5 + persist-client, Zustand, expo-secure-store, expo-notifications, expo-image-picker/camera, expo-image-manipulator, `@stripe/stripe-terminal-react-native`
- **Tooling:** shared `tsconfig.base.json`, ESLint flat config (`eslint-config-expo` + shared rules), Prettier at root, Husky + lint-staged, GitHub Actions running `turbo run lint test build`
- **Distribution:** EAS Build (dev/preview/production profiles), EAS Submit using the existing ASC API key at `/Users/jeff/Development/FastLane/AuthKey_G228482V89.p8` for iOS and a new Google Play service-account JSON for Android, EAS Update with `runtimeVersion: 'appVersion'`
- **Observability:** Sentry via `@sentry/react-native` config plugin (scrub `Authorization` header)

## 4. Auth & API changes needed in the web repo

In priority order. Total surface is ~15 lines in `src/lib/auth.ts` plus a handful of new routes — no existing `/api/admin/*` handler needs to change.

1. **Add `client` column to `Session`** (`web | ios | android`) — Prisma migration.
2. **Refactor `src/lib/auth.ts`:** extract `getSessionFromToken(token)`, make `getSession()` try the cookie first then fall back to `Authorization: Bearer <token>` via `headers()`. Every `requireAuth()` caller keeps working untouched.
3. **`POST /api/auth/mobile/login`** — accepts email + password, returns `{ token, user, expiresAt }` JSON (no `Set-Cookie`). Token is the same opaque `Session.id` you already issue. Default lifetime 30–90 days with sliding expiration (throttled: only extend when `expiresAt < now + 29 days`).
4. **`POST /api/auth/mobile/logout`** — deletes the bearer token row.
5. **Version mobile endpoints under `/api/v1/*`** — start with `inventory`, `inquiries`, `buy-requests`. Add cursor pagination (`?limit=50&cursor=<id>&sort=createdAt:desc`) returning `{ items, nextCursor }`. Use compound `(createdAt, id)` cursor to avoid collision skips. Keep current unversioned routes alive for the web admin until later migration.
6. **Response shaper `toMobileV1(model)`** — thin layer so Prisma field renames don't break the mobile contract.
7. **`POST /api/devices` + `DELETE /api/devices/:token`** — upsert Expo push token against the current session, bump `lastSeenAt`. (See §5.)
8. **`/api/stripe/webhook`** (Node runtime, raw body) — verify signature with `STRIPE_WEBHOOK_SECRET`, handle `payment_intent.succeeded` → mark `Sale.paid=true`, `charge.refunded` → mark `Sale.refunded=true`. (See §6.)
9. **`POST /api/stripe/payment-intent`** — admin/sales auth, creates a PaymentIntent with `payment_method_types=['card_present']`, idempotency key derived from `Sale.id`, returns `client_secret`.
10. **Hygiene:** rate-limit `/api/auth/mobile/login` (reuse `src/lib/rate-limit.ts`), scrub `Authorization` from Sentry/logs, document the bearer flow in `docs/MOBILE_API.md`.

Skip JWT, skip OAuth PKCE, skip Accept-Version headers. Opaque tokens + URL versioning are the lowest-friction path that reuses what's already there.

## 5. Push notifications — owner setup

Use **Expo Push Service** (free, one server SDK call fans out to APNs + FCM). Owner has to provision the upstream credentials regardless — Expo just multiplexes.

**Owner action items (start day one — Apple approval is the critical path):**

1. **Apple Developer Program** — enroll the business entity at developer.apple.com ($99/yr, needs D-U-N-S for org; 1–2 day approval).
2. **Register bundle ID** — suggest `us.coloradocouchfarm.workers`, enable Push Notifications capability, request the **Tap to Pay on iPhone entitlement** the same day (separate Apple approval, can take days).
3. **APNs auth key** — Certificates, IDs & Profiles → Keys → "+", enable APNs, download the `.p8` (one-time download). Stash in `~/secure/`, back up to 1Password. Capture Key ID + Team ID.
4. **Google Play Console** — $25 one-time, register the org developer account, create the app listing under package name `us.coloradocouchfarm.workers`.
5. **Firebase project** — create project, add Android app with the package name, download `google-services.json`. Then Project Settings → Service Accounts → Generate new private key → download the FCM service account JSON. Store at `~/secure/google-play-service-account.json` (chmod 600).
6. **Upload to Expo** — `eas credentials` walks through uploading the `.p8` (with Key ID/Team ID) and the FCM JSON.

**Server work this triggers:**

- `DeviceToken` Prisma model (`userId`, `token` unique, `platform`, `appVersion`, `lastSeenAt`) + migration.
- `POST /api/devices` and `DELETE /api/devices/:token` endpoints (already listed in §4).
- `src/lib/push.ts` mirroring the never-throw contract of `src/lib/email.ts` — exports `sendPush()`, `pushNewInquiry()`, `pushNewBuyRequest()`, `pushSaleConfirmation()`. No-op if `EXPO_ACCESS_TOKEN` is missing.
- Wire `pushNewInquiry` / `pushNewBuyRequest` into the existing `notifyNewInquiry` / `notifyNewBuyRequest` (additive — email remains the durable audit trail).
- Receipts cleanup: on each send, delete tokens flagged `DeviceNotRegistered`.
- Add `EXPO_ACCESS_TOKEN` to Vercel env (production + preview).

Per-role defaults at user-create time: admin gets new-inquiry + new-buy-request + sale-confirmation; sales gets new-inquiry + sale-confirmation. No settings UI in v1 — add toggles when Brian or Elijah ask. Push payload always includes `{ screen, id }` for deep-link routing; the app re-fetches the entity server-side after the tap (don't trust IDs from the payload for anything but navigation).

## 6. Payments

**Stripe Tap-to-Pay via `@stripe/stripe-terminal-react-native`, single Stripe account on the Couch Farm legal entity.** Workers tap the customer's card or phone directly to their own iPhone/Android — zero hardware. The same Stripe account replaces the web "Demo Mode" checkout via Stripe Checkout, so online and in-person sales both fire `payment_intent.succeeded` to one `/api/stripe/webhook` and flip `Sale.paid=true`. PCI scope stays SAQ A on both paths because card data never touches your servers. Owner completes KYC (EIN, owner SSN last 4, DOB, business address, bank for payouts) in ~15 minutes at dashboard.stripe.com, then settlement is gated on Stripe approval (typically 1–5 business days).

**Stripe vs. alternatives:** Stripe wins on RN SDK quality, webhook ergonomics, unified online + in-person ledger, and replacing Demo Mode with near-zero extra work; **only switch to Square if Petrali Roofing already processes through Square** (consolidated 1099-K and payouts are worth more than the ~$1–2/couch fee delta). PayPal Zettle and Stripe Connect are wrong for this use case.

DB additions: `Sale.stripePaymentIntentId`, `Sale.paidAt`, `Sale.refundedAt`, `Sale.paymentMethod` enum (`card_present | card_online | cash | check`). Cash/check stays as manual admin entry. Refund UX is admin-gated in-app (one button hitting `paymentIntents.refund`).

## 7. Core screens & flows (v1)

**Navigation shell:** 4-tab bottom nav — **Home / Inventory / Leads / More**. Role gating is invisible: sales users simply never see the Team row under More. No greyed-out controls, no "access denied" modals.

**Screen set:**

- **Sign in** — email + password, biometric unlock on relaunch (FaceID/TouchID), forgot-password deep-links to web
- **Home** — greeting + 3 tappable cards: Available count, New leads (badge), Today's sales
- **Inventory list** — single-column card list (hero photo, cream price chip bottom-left, status pill top-right), search bar, filter chips (Available / Pending / Sold), pull-to-refresh, FAB "Add Couch" bottom-right
- **Add Couch** — tap FAB → native camera opens immediately → multi-shot capture (thumbnails strip at bottom) → Done → form (photo grid drag-to-reorder, Title, Price, Condition segmented, Dimensions optional, Description optional). Photos upload in background with per-thumbnail progress rings; Save enabled as soon as title + price + ≥1 photo exist
- **Couch detail** — hero carousel, price, status, dims, description, sticky bottom bar `[Edit] [Share Link] [Mark Sold]`
- **Edit Couch** — same form as Add, pre-filled
- **Leads** — segmented top control `[Inquiries | Buy Requests]`, card list with unread dots
- **Inquiry detail** — customer info + message + linked couch card, actions `[Call] [Text] [Email] [Mark Responded] [Archive]`
- **Buy Request detail** — seller info + photos + asking price, actions `[Call] [Text] [Make Offer] [Decline] [Archive]`
- **Record Sale + Tap-to-Pay** — from couch detail [Mark Sold] → customer name + email + sale price → `[Collect Payment]` launches Stripe Tap-to-Pay sheet → success → couch auto-set Sold, sale recorded, Stripe-hosted receipt emailed, confetti. Fallback `[Record Cash/Other]` for non-card sales
- **More** — Account, Notifications, Team (admin only)

**Happy-path flows:**

1. **Intake a couch in a driveway:** Inventory → FAB → camera → 4 shots → Done → type title + price → Save. Photos finish uploading in the background; worker is already on to the next couch.
2. **Sell a couch in person:** Couch detail → Mark Sold → enter customer name + email + price → Collect Payment → tap card to phone → done. Receipt + push fire automatically.
3. **Respond to a new inquiry:** Push notification arrives → tap → deep-links to Inquiry detail → tap Call (or Text) → Mark Responded.
4. **Process a buy request:** Push → Buy Request detail → review photos → Make Offer (free-text + amount, sends via Resend) → Mark Pending.

**Empty states** get the cow logo + one line + a primary action. **Errors** are inline toasts for transient stuff; full-screen "Can't reach Couch Farm" card for network. **Offline:** thin cyan banner at top, write actions disabled with a tooltip (no offline queue in v1 — workers have LTE 99% of the time, and conflict resolution on a 2-person team isn't worth the bugs).

**Brand:** keep navy `#0F2A44` / cyan `#34C0D9` / cream `#F4EFE6` and the cow circle. Type pair: Fraunces (variable italic, headings/hero numerals) + Inter (UI/body), both OFL-free.

## 8. Phased rollout

Estimates are agent-side: subagent dispatches + wall-clock minutes for code work. Owner-side credential approvals (Apple, Stripe KYC) are wall-clock blockers running in parallel.

### Phase 0 — Foundations (parallelizable, kick off day one)
- **Goal:** Unblock all downstream work.
- **Owner deliverables:** Apple Dev Program enrollment, bundle ID + Tap-to-Pay entitlement requested, Google Play Console signup, Firebase project + FCM JSON, Stripe KYC submitted, decision on monorepo + merchant entity.
- **Agent deliverables:** Turborepo migration (move Next.js → `apps/web`, verify Vercel preview deploy), `packages/{types,api-client,brand}` scaffolded, shared eslint/prettier/tsconfig, GitHub Actions CI.
- **Effort:** ~3–4 dispatches, ~60–90 min wall-clock.
- **Exit:** Web still deploys on Vercel from `apps/web`. CI green. Owner has credentials in flight.

### Phase 1 — Mobile shell + auth + API v1
- **Goal:** A dev client on Brian's and Elijah's phones that signs in and lists inventory.
- **Deliverables:** Expo app scaffolded (Router v5, TanStack Query, Zustand, SecureStore), `/api/auth/mobile/{login,logout}`, `getSession()` accepts Bearer token, `/api/v1/admin/inventory` with cursor pagination, login screen, inventory list screen (cards, pull-to-refresh), dev clients built and installed.
- **Effort:** ~5–7 dispatches, ~3–4 hours wall-clock + EAS build queue.
- **Exit:** Sign in → see inventory list on a physical device. Hot reload working against prod API.

### Phase 2 — Inventory CRUD + camera-first add flow
- **Goal:** Workers can intake couches from the field end-to-end.
- **Deliverables:** Couch detail screen, camera-first Add flow with background upload + progress rings, `expo-image-manipulator` compression to ~1.5 MB JPEG, Edit Couch, Mark Sold (manual entry path), `/api/v1/admin/inquiries` + `/api/v1/admin/buy-requests` + their detail screens, response shaper `toMobileV1()`.
- **Effort:** ~6–8 dispatches, ~4–5 hours wall-clock.
- **Exit:** Brian can intake a real couch in the warehouse in under 90 seconds, photos and all.

### Phase 3 — Payments (Stripe Tap-to-Pay) + replace web Demo Mode
- **Goal:** A worker can collect payment on a phone; web checkout is real.
- **Deliverables:** `@stripe/stripe-terminal-react-native` wired (StripeTerminalProvider, connection-token endpoint, discoverReaders tapToPay, connect, collect, confirm), `/api/stripe/payment-intent`, `/api/stripe/webhook` (signature-verified), `Sale` model additions, Record Sale screen + receipt-email path via Resend, web Demo Mode replaced with Stripe Checkout, admin-gated refund button.
- **Effort:** ~6–10 dispatches, ~4–6 hours wall-clock. **Blocked on Apple Tap-to-Pay entitlement + Stripe KYC approval.**
- **Exit:** A real $20 test charge taps successfully on a worker's phone, settles to the bank, `Sale.paid=true` via webhook, customer receives Stripe receipt. Web checkout takes a card.

### Phase 4 — Push notifications + polish + ship to TestFlight / Play Internal
- **Goal:** App is in workers' hands daily; they don't have to refresh anything.
- **Deliverables:** `DeviceToken` model, `/api/devices`, `src/lib/push.ts` wired into existing notify functions, mobile permission flow + token registration + deep-link handler, receipts cleanup, Sentry, More tab (Account / Notifications / Team admin-only), empty states + error states + offline banner, `eas submit` to TestFlight + Play Internal, owner training doc.
- **Effort:** ~6–9 dispatches, ~3–4 hours wall-clock + store-review queue.
- **Exit:** Brian and Elijah receive a push when a new inquiry hits, tap it, land on the detail screen, call the customer. App is live in TestFlight and Play Internal.

## 9. Top 5 risks

1. **Apple Tap-to-Pay entitlement approval (days–weeks)** — start the request the same day the bundle ID is registered. Without it, Phase 3 stalls regardless of code readiness.
2. **Stripe KYC stalls** on sole-prop/DBA name mismatches with IRS records. Owner should have EIN + legal name pulled up before sitting down. Plan 1–5 business days from submission to first payout.
3. **Worker device incompatibility** — if either phone is pre-XS iPhone or non-GMS Android, Tap-to-Pay is out and you're either buying a $49 Stripe Reader M2 or sending Payment Links by SMS. Confirm hardware before Phase 3.
4. **Webhook signature verification skipped** — common greenfield bug that lets anyone POST a fake "payment succeeded" event and flip `Sale.paid=true`. Always use `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`; runtime must be `nodejs` for raw body access.
5. **EAS Update + native module mismatch** — pushing an OTA update that imports a native API absent from the installed binary crash-loops the app. Mitigate with `runtimeVersion: 'appVersion'` so each native build only accepts compatible JS bundles.

## 10. Out of scope for v1

- True offline-first sync / mutation queue (online-required with graceful offline banner instead)
- Customer-facing mobile app (workers only)
- In-app chat thread with the customer (call/text/email handoff is fine)
- Map view + delivery route optimization
- AI-assisted title/description from photos, voice-to-text, background-removed marketing photos
- Barcode/QR tag scanning at the warehouse
- Stripe Tax automatic sales-tax calculation (hardcode Colorado Springs combined rate for v1, owner remits manually)
- Apple/Google Wallet receipt passes, tip prompt at POS, save-card-for-repeat-buyer
- Sale-confirmation push to the customer (would require customer app or SMS)
- Dark mode, iPad split-view layout
- Settings UI for per-category notification toggles (role-based defaults only)
- Webhook/SSE real-time inquiry stream (push notifications cover this)
- Migrating the web admin off the legacy unversioned `/api/admin/*` routes onto `/api/v1/*` (defer)
- Reports / analytics tab (lives under More if/when needed)
