// Lightweight in-memory rate limiter.
//
// NOTE: this is best-effort only. On serverless / multi-instance deployments
// (e.g. Vercel) each instance keeps its own counters, so this slows abuse
// rather than enforcing a hard global cap. For strong guarantees back it with
// a shared store (the Turso DB, Upstash Redis, etc.).

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Records a hit against `key` and reports whether it is within `limit` hits
 * per `windowMs`. Uses a fixed window that resets once it elapses.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Opportunistically prune expired buckets so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  bucket.count++;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Extracts the best-guess client IP from request/proxy headers. */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip") || "unknown";
}
