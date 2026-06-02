// src/plugins/performance/withPerformance.ts
import type { NextConfig } from 'next'

export interface WithPerformanceOptions {
  /** Master switch. When false, returns config unchanged. Default: true */
  enabled?: boolean
  /** Remove unoptimized: true in production. Default: true */
  imageOptimization?: boolean
  /** Replace no-store with no-cache + s-maxage for proxy caching. Default: true */
  fixCacheHeaders?: boolean
  /** s-maxage TTL in seconds. Default: 60 */
  htmlCacheTtl?: number
  /** stale-while-revalidate in seconds. Default: 600 */
  staleWhileRevalidate?: number
}

export function withPerformance(
  config: NextConfig,
  options: WithPerformanceOptions = {},
): NextConfig {
  const {
    enabled            = true,
    imageOptimization  = true,
    fixCacheHeaders    = true,
    htmlCacheTtl       = 60,
    staleWhileRevalidate = 600,
  } = options

  if (!enabled) return config

  let patched: NextConfig = { ...config }

  // ── Patch 1: Image optimization ────────────────────────────────────────────
  // Removes unoptimized: true so sharp is used in production for WebP/AVIF output.
  if (imageOptimization) {
    patched = {
      ...patched,
      images: {
        ...patched.images,
        unoptimized: false,
      },
    }
  }

  // ── Patch 2: Cache headers ─────────────────────────────────────────────────
  // Appends a headers rule that overrides Cache-Control for HTML pages.
  // Security headers (from security/headers.ts) are NOT touched — they live on
  // a separate source pattern and a different header key.
  // API routes are excluded so they keep no-store behavior.
  if (fixCacheHeaders) {
    const originalHeaders = config.headers
    patched = {
      ...patched,
      headers: async () => {
        const existing = originalHeaders ? await originalHeaders() : []
        return [
          ...existing,
          {
            // Matches all routes EXCEPT _next/static, _next/image, and /api/
            source: '/((?!_next/static|_next/image|api/).*)',
            headers: [
              {
                key: 'Cache-Control',
                value: `no-cache, s-maxage=${htmlCacheTtl}, stale-while-revalidate=${staleWhileRevalidate}`,
              },
            ],
          },
        ]
      },
    }
  }

  return patched
}
