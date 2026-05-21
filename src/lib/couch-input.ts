import { couchStyles, couchColors } from "@/lib/config";
import { num, str } from "@/lib/input-coerce";

export const validStyles: readonly string[] = couchStyles.map((s) => s.value);
export const validColors: readonly string[] = couchColors;
export const validStatuses: readonly string[] = ["available", "pending", "sold"];

type RawBody = Record<string, unknown>;

/**
 * Maps an untrusted request body to the exact set of Couch columns we allow
 * clients to set, coercing types. Prevents mass-assignment of any other field.
 * `partial` keeps only the keys actually present (for PATCH/PUT-style updates).
 */
export function buildCouchData(body: RawBody, { partial = false } = {}) {
  const data: Record<string, unknown> = {};
  const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k);
  const set = (k: string, v: unknown) => {
    if (!partial || has(k)) data[k] = v;
  };

  if (!partial || has("title")) set("title", str(body.title) ?? "");
  if (!partial || has("style")) set("style", body.style);
  if (!partial || has("color")) set("color", body.color);
  if (!partial || has("fabricType")) set("fabricType", str(body.fabricType) ?? "");
  set("length", num(body.length));
  set("width", num(body.width));
  set("height", num(body.height));
  set("notes", str(body.notes));
  set("buyPrice", num(body.buyPrice));
  set("sellPrice", num(body.sellPrice));
  if (!partial || has("status")) set("status", body.status);
  if (!partial || has("featured")) set("featured", Boolean(body.featured));

  return data;
}

/** Validates style/color/status. Returns an error message or null. */
export function validateCouchData(data: Record<string, unknown>): string | null {
  if (data.style !== undefined && !validStyles.includes(data.style as string)) {
    return `Invalid style: ${data.style}`;
  }
  if (data.color !== undefined && !validColors.includes(data.color as string)) {
    return `Invalid color: ${data.color}`;
  }
  if (data.status !== undefined && !validStatuses.includes(data.status as (typeof validStatuses)[number])) {
    return `Invalid status: ${data.status}`;
  }
  return null;
}
