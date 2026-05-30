# Plan: Full CRUD + Filtering + Sorting for Inquiries & Buy Requests

## Goal
Make the admin **Inquiries** and **Buy Requests** screens fully manageable: create,
read, update, delete, plus filtering, sorting, and search. Today both are read-only
lists with a single status-change dropdown.

## Current state
- `GET` (read): lists exist (server components).
- `PATCH /api/admin/{inquiries,buy-requests}/[id]`: status update only.
- No DELETE, no manual create, no full edit, no filter/sort/search.
- Models: `CustomerInquiry`, `BuyRequest` (see prisma/schema.prisma). Neither has an
  admin-only **internal notes** field.

## Scope decisions (need your call — defaults marked ✅)
1. **Manual create by admin?** ✅ Yes — lets staff log a phone/walk-in lead.
2. **Full edit of all fields, or just status + internal notes + delete?**
   ✅ Full edit (every field editable in a modal/drawer) — most flexible.
3. **Internal admin notes field?** ✅ Yes — add `adminNotes String?` to both models
   (requires a Prisma migration + `db push` to Turso prod).
4. **Filter/sort location:** ✅ Client-side (dataset is small) — instant, no API churn.

## Phases

### Phase 1 — Schema: internal notes
- Add `adminNotes String?` to `CustomerInquiry` and `BuyRequest`.
- `prisma migrate dev` locally; `prisma db push` to Turso prod at deploy.
- Success: `npx prisma validate` passes; types regenerate.

### Phase 2 — API routes (CRUD)
- `POST /api/admin/inquiries` + `POST /api/admin/buy-requests` — manual create
  (requireAuth, whitelist fields, normalize/validate like the public actions).
- Extend `[id]` routes: add `PUT` (full edit, whitelisted) and `DELETE`.
- Reuse the field-whitelist pattern from `lib/couch-input.ts`.
- Success: each verb returns correct status; auth enforced; vitest covers validation.

### Phase 3 — Filter/sort/search UI (shared)
- New `<RecordsToolbar>` + client wrappers `InquiriesContent` / `BuyRequestsContent`
  (mirrors the existing `InventoryFilter` / `InventoryContent` pattern).
- **Filter:** status (multi), source; **Search:** name/email/phone;
  Inquiries also style/color; Buy Requests also style/condition.
- **Sort:** newest/oldest (date), name A–Z, status; +budget (inquiry) / asking price (buy req).
- Empty/zero-result states.
- Success: filtering/sorting works with no full-page reload.

### Phase 4 — Row actions (edit/delete/create UI)
- Edit drawer/modal with all fields incl. `adminNotes`; Save → `PUT`.
- Delete button with confirm → `DELETE`.
- "Add lead" button → create form (same drawer in create mode).
- Keep the existing quick status dropdown.
- Success: create/edit/delete reflected immediately via `router.refresh()`.

### Phase 5 — Verify & ship
- `tsc --noEmit`, `vitest`, `next build` all green.
- `prisma db push` to prod, commit, push to `main` (auto-deploys), smoke-test routes.

## Rollback
- Code: revert the feature commits on `main` (Vercel redeploys previous).
- Schema: `adminNotes` is nullable/additive — safe to leave; if needed, drop the column.

## Out of scope (unless you say otherwise)
- Bulk actions / CSV export.
- Email notifications on new inquiry (separate meeting item #4).
- Pagination (dataset small; revisit if volume grows).
