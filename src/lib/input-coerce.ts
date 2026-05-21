/** Shared coercion helpers for mapping untrusted request bodies to typed columns. */

/** Coerce to a finite number, or null for empty/invalid input. */
export function num(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

/** Trim to a non-empty string, or null. */
export function str(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

/**
 * Coerce to a strict boolean. Only `true` or the string "true" (case-insensitive)
 * is truthy; everything else (including "false" and "0") is false. Avoids the
 * `Boolean("false") === true` trap.
 */
export function bool(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  return false;
}
