import { couchStyles, couchColors, conditions } from "@/lib/config";
import { num, str, bool } from "@/lib/input-coerce";

export const validStyles: readonly string[] = couchStyles.map((s) => s.value);
export const validColors: readonly string[] = couchColors;
export const validConditions: readonly string[] = conditions.map((c) => c.value);

export const validInquiryStatuses: readonly string[] = ["new", "contacted", "converted", "closed"];
export const validBuyRequestStatuses: readonly string[] = ["new", "reviewing", "accepted", "declined"];

type RawBody = Record<string, unknown>;

function makeSetter(body: RawBody, data: Record<string, unknown>, partial: boolean) {
  const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k);
  return (k: string, v: unknown) => {
    if (!partial || has(k)) data[k] = v;
  };
}

/**
 * Maps an untrusted request body to the exact set of CustomerInquiry columns we
 * allow admins to set, coercing types. Prevents mass-assignment of any other field
 * (id, createdAt, leads, etc.). `partial` keeps only the keys actually present.
 */
export function buildInquiryData(body: RawBody, { partial = false } = {}) {
  const data: Record<string, unknown> = {};
  const set = makeSetter(body, data, partial);

  if (!partial || Object.prototype.hasOwnProperty.call(body, "name")) {
    set("name", str(body.name) ?? "");
  }
  if (!partial || Object.prototype.hasOwnProperty.call(body, "email")) {
    set("email", str(body.email) ?? "");
  }
  set("phone", str(body.phone));
  set("preferredStyle", str(body.preferredStyle));
  set("preferredColor", str(body.preferredColor));
  if (!partial || Object.prototype.hasOwnProperty.call(body, "hasSleeper")) {
    set("hasSleeper", bool(body.hasSleeper));
  }
  if (!partial || Object.prototype.hasOwnProperty.call(body, "hasReclining")) {
    set("hasReclining", bool(body.hasReclining));
  }
  set("budgetMin", num(body.budgetMin));
  set("budgetMax", num(body.budgetMax));
  set("message", str(body.message));
  if (!partial || Object.prototype.hasOwnProperty.call(body, "status")) {
    set("status", body.status);
  }
  set("source", str(body.source));
  set("adminNotes", str(body.adminNotes));

  return data;
}

/**
 * Validates inquiry status/style/color. Returns an error message or null.
 * Style/color are only validated when a non-empty value is provided (lenient,
 * matching the public inquiry form which stores them as free strings).
 */
export function validateInquiryData(data: Record<string, unknown>): string | null {
  if (
    data.status !== undefined &&
    data.status !== null &&
    !validInquiryStatuses.includes(data.status as string)
  ) {
    return `Invalid status: ${data.status}`;
  }
  if (
    data.preferredStyle !== undefined &&
    data.preferredStyle !== null &&
    !validStyles.includes(data.preferredStyle as string)
  ) {
    return `Invalid style: ${data.preferredStyle}`;
  }
  if (
    data.preferredColor !== undefined &&
    data.preferredColor !== null &&
    !validColors.includes(data.preferredColor as string)
  ) {
    return `Invalid color: ${data.preferredColor}`;
  }
  return null;
}

/**
 * Maps an untrusted request body to the exact set of BuyRequest columns we allow
 * admins to set, coercing types. Prevents mass-assignment. `partial` keeps only
 * the keys actually present.
 */
export function buildBuyRequestData(body: RawBody, { partial = false } = {}) {
  const data: Record<string, unknown> = {};
  const set = makeSetter(body, data, partial);

  if (!partial || Object.prototype.hasOwnProperty.call(body, "name")) {
    set("name", str(body.name) ?? "");
  }
  if (!partial || Object.prototype.hasOwnProperty.call(body, "email")) {
    set("email", str(body.email) ?? "");
  }
  set("phone", str(body.phone));
  set("brand", str(body.brand));
  set("style", str(body.style));
  set("color", str(body.color));
  set("condition", str(body.condition));
  set("age", str(body.age));
  set("askingPrice", num(body.askingPrice));
  set("description", str(body.description));
  if (!partial || Object.prototype.hasOwnProperty.call(body, "images")) {
    // images is stored as a JSON string column. Accept an existing JSON string
    // as-is, an array to be serialized, or null for anything else.
    if (typeof body.images === "string") {
      set("images", str(body.images));
    } else if (Array.isArray(body.images)) {
      set("images", JSON.stringify(body.images));
    } else {
      set("images", null);
    }
  }
  if (!partial || Object.prototype.hasOwnProperty.call(body, "status")) {
    set("status", body.status);
  }
  set("source", str(body.source));
  set("adminNotes", str(body.adminNotes));

  return data;
}

/**
 * Validates buy-request status/style/color/condition. Returns an error message or
 * null. Style/color/condition are only validated when a non-empty value is
 * provided (lenient, matching the public sell form which stores free strings).
 */
export function validateBuyRequestData(data: Record<string, unknown>): string | null {
  if (
    data.status !== undefined &&
    data.status !== null &&
    !validBuyRequestStatuses.includes(data.status as string)
  ) {
    return `Invalid status: ${data.status}`;
  }
  if (
    data.style !== undefined &&
    data.style !== null &&
    !validStyles.includes(data.style as string)
  ) {
    return `Invalid style: ${data.style}`;
  }
  if (
    data.color !== undefined &&
    data.color !== null &&
    !validColors.includes(data.color as string)
  ) {
    return `Invalid color: ${data.color}`;
  }
  if (
    data.condition !== undefined &&
    data.condition !== null &&
    !validConditions.includes(data.condition as string)
  ) {
    return `Invalid condition: ${data.condition}`;
  }
  return null;
}
