interface Bucket {
  count: number;
  windowStart: number;
}

const HOUR_MS = 60 * 60 * 1000;
const buckets = new Map<string, Bucket>();

function getLimit(): number {
  const raw = process.env['INQUIRY_RATE_LIMIT_PER_HOUR'];
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return 10;
}

export function checkRateLimit(key: string): {
  ok: boolean;
  remaining: number;
  resetMs: number;
} {
  const now = Date.now();
  const limit = getLimit();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart > HOUR_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return { ok: true, remaining: limit - 1, resetMs: HOUR_MS };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetMs: HOUR_MS - (now - existing.windowStart),
    };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return {
    ok: true,
    remaining: limit - existing.count,
    resetMs: HOUR_MS - (now - existing.windowStart),
  };
}

// Lightweight periodic cleanup so the map doesn't grow unbounded.
// Runs at most once every 5 minutes.
let lastSweep = 0;
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

export function sweepRateLimits(): void {
  const now = Date.now();
  if (now - lastSweep < SWEEP_INTERVAL_MS) {
    return;
  }
  lastSweep = now;
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.windowStart > HOUR_MS) {
      buckets.delete(key);
    }
  }
}
