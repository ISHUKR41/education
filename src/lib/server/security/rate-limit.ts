/**
 * FILE: rate-limit.ts
 * LOCATION: src/lib/server/security/rate-limit.ts
 * PURPOSE: Lightweight in-memory rate limiting for sensitive API routes. This
 *          protects the MVP from repeated auth and matchmaking requests while
 *          keeping the API shape ready for Redis/Upstash in production.
 * USED BY: Auth API routes and battle matchmaking API route
 * LAST UPDATED: 2026-05-11
 */

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

type RateLimitGlobal = typeof globalThis & {
  __eduquestRateLimits?: Map<string, RateLimitBucket>;
};

/** Lazily creates one shared bucket map for the current server process. */
function getBuckets(): Map<string, RateLimitBucket> {
  const globalForRateLimit = globalThis as RateLimitGlobal;
  globalForRateLimit.__eduquestRateLimits ??= new Map();
  return globalForRateLimit.__eduquestRateLimits;
}

/** Builds a stable client key from proxy headers with a safe local fallback. */
export function getClientKey(request: Request, suffix: string): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "local-development";
  return `${suffix}:${ip}`;
}

/**
 * Checks and updates a fixed-window rate limit bucket.
 * Production deployments should swap this adapter for Redis-backed counters.
 */
export function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const buckets = getBuckets();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: 0,
  };
}
