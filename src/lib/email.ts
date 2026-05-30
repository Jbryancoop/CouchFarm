import { Resend } from "resend";
import { prisma } from "./db";

const FROM =
  process.env.EMAIL_FROM ||
  "Colorado Couch Farm <notifications@coloradocouchfarm.com>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coloradocouchfarm.com";

let _resend: Resend | null = null;
function client(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

/**
 * Send an email via Resend. Never throws — failures are logged so form
 * submissions don't break. No-ops with a warning if RESEND_API_KEY isn't set.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const c = client();
  if (!c) {
    console.warn("[email] RESEND_API_KEY not set — skipping send");
    return;
  }
  const recipients = Array.isArray(to) ? to : [to];
  if (recipients.length === 0) return;

  try {
    const { error } = await c.emails.send({
      from: FROM,
      to: recipients,
      subject,
      html,
      replyTo,
    });
    if (error) console.error("[email] Resend error:", error);
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

/** Active-admin email list for staff notifications. */
export async function getAdminRecipients(): Promise<string[]> {
  const admins = await prisma.user.findMany({
    where: { active: true, role: "admin" },
    select: { email: true },
  });
  return admins.map((a) => a.email);
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const row = (label: string, value: string | number | null | undefined) =>
  value === null || value === undefined || value === ""
    ? ""
    : `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${esc(label)}</td><td style="padding:4px 0;color:#111">${esc(String(value))}</td></tr>`;

function wrap(title: string, intro: string, table: string, ctaUrl: string, ctaLabel: string) {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
  <h2 style="margin:0 0 8px;font-size:18px">${esc(title)}</h2>
  <p style="margin:0 0 16px;color:#444;font-size:14px">${esc(intro)}</p>
  <table style="border-collapse:collapse;font-size:14px;width:100%">${table}</table>
  <p style="margin:24px 0 0"><a href="${ctaUrl}" style="background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600;display:inline-block;font-size:14px">${esc(ctaLabel)}</a></p>
  <p style="margin:24px 0 0;color:#999;font-size:12px">Reply to this email to respond to the customer directly.</p>
</div>`;
}

type Inquiry = {
  name: string;
  email: string;
  phone: string | null;
  preferredStyle: string | null;
  preferredColor: string | null;
  hasSleeper: boolean;
  hasReclining: boolean;
  budgetMin: number | null;
  budgetMax: number | null;
  message: string | null;
  source: string | null;
};

export async function notifyNewInquiry(inquiry: Inquiry): Promise<void> {
  const to = await getAdminRecipients();
  if (to.length === 0) return;

  const budget =
    inquiry.budgetMin || inquiry.budgetMax
      ? `${inquiry.budgetMin ? `$${inquiry.budgetMin}` : "any"} – ${inquiry.budgetMax ? `$${inquiry.budgetMax}` : "any"}`
      : null;

  const table =
    row("Name", inquiry.name) +
    row("Email", inquiry.email) +
    row("Phone", inquiry.phone) +
    row("Preferred style", inquiry.preferredStyle) +
    row("Preferred color", inquiry.preferredColor) +
    row("Sleeper", inquiry.hasSleeper ? "Yes" : "") +
    row("Reclining", inquiry.hasReclining ? "Yes" : "") +
    row("Budget", budget) +
    row("Message", inquiry.message) +
    row("Source", inquiry.source);

  const html = wrap(
    "New customer inquiry",
    `${inquiry.name} is looking for a couch.`,
    table,
    `${SITE_URL}/admin/inquiries`,
    "View in admin"
  );

  await sendEmail({
    to,
    subject: `New inquiry — ${inquiry.name}`,
    html,
    replyTo: inquiry.email,
  });
}

type BuyRequest = {
  name: string;
  email: string;
  phone: string | null;
  brand: string | null;
  style: string | null;
  color: string | null;
  condition: string | null;
  age: string | null;
  askingPrice: number | null;
  description: string | null;
  source: string | null;
};

export async function notifyNewBuyRequest(req: BuyRequest): Promise<void> {
  const to = await getAdminRecipients();
  if (to.length === 0) return;

  const table =
    row("Name", req.name) +
    row("Email", req.email) +
    row("Phone", req.phone) +
    row("Brand", req.brand) +
    row("Style", req.style) +
    row("Color", req.color) +
    row("Condition", req.condition) +
    row("Age", req.age) +
    row("Asking price", req.askingPrice !== null ? `$${req.askingPrice}` : null) +
    row("Description", req.description) +
    row("Source", req.source);

  const html = wrap(
    "New couch buy-request",
    `${req.name} wants to sell a couch.`,
    table,
    `${SITE_URL}/admin/buy-requests`,
    "View in admin"
  );

  await sendEmail({
    to,
    subject: `New buy-request — ${req.name}`,
    html,
    replyTo: req.email,
  });
}
