// In-memory rate limiter with DB persistence fallback.
// The in-memory Map is the fast path for every request.
// Counts are reset per time window (1 minute by default).

interface RateWindow {
  count: number
  windowStart: number
}

const windowMap = new Map<string, RateWindow>()

function getKey(ip: string, endpoint: string): string {
  return `${ip}::${endpoint}`
}

export interface RateLimitResult {
  allowed: boolean
  retryAfter: number  // seconds
  remaining: number
}

export function checkRateLimitSync(
  ip: string,
  endpoint: string,
  max: number,
  windowMs = 60_000,
): RateLimitResult {
  const key = getKey(ip, endpoint)
  const now = Date.now()
  const entry = windowMap.get(key)

  if (!entry || now - entry.windowStart >= windowMs) {
    windowMap.set(key, { count: 1, windowStart: now })
    return { allowed: true, retryAfter: 0, remaining: max - 1 }
  }

  entry.count += 1

  if (entry.count > max) {
    const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000)
    return { allowed: false, retryAfter, remaining: 0 }
  }

  return { allowed: true, retryAfter: 0, remaining: max - entry.count }
}

// Periodic cleanup of stale windows (every 5 min)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of windowMap.entries()) {
      if (now - entry.windowStart > 120_000) windowMap.delete(key)
    }
  }, 5 * 60_000)
}
