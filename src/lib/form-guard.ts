import { headers } from "next/headers";
import { rateLimit, clientIp } from "./rate-limit";

// Hidden field name used as a spam honeypot. Real users never see or fill it;
// bots that fill every field will trip it.
export const HONEYPOT_FIELD = "website";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 254;
}

export function isBot(formData: FormData): boolean {
  const trap = formData.get(HONEYPOT_FIELD);
  return typeof trap === "string" && trap.trim().length > 0;
}

/**
 * Best-effort per-IP throttle for unauthenticated public form submissions.
 * Defaults to 5 submissions per 10 minutes.
 */
export async function throttlePublicForm(
  name: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): Promise<boolean> {
  const ip = clientIp(await headers());
  return rateLimit(`form:${name}:${ip}`, limit, windowMs).ok;
}
