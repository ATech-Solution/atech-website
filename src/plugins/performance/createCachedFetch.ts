// src/plugins/performance/createCachedFetch.ts
import { cache } from 'react'
import { unstable_cache } from 'next/cache'

/**
 * Wraps an async function with two caching layers:
 *   1. unstable_cache — persists across requests on the server
 *   2. React cache()  — deduplicates within a single render tree
 *
 * Usage:
 *   export const getFrontpage = withPerfCache(
 *     async (locale: string) => payload.find(...),
 *     ['perf:frontpage'],
 *     { revalidate: 60, tags: ['perf:frontpage', 'perf:pages'] }
 *   )
 */
export function withPerfCache<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyPrefix: string[],
  options: { revalidate?: number; tags?: string[] } = {},
): (...args: TArgs) => Promise<TReturn> {
  const revalidate = options.revalidate ?? 60
  const tags       = options.tags ?? keyPrefix

  const crossRequestCached = unstable_cache(fn, keyPrefix, { revalidate, tags })
  return cache(crossRequestCached)
}

// Alias for backwards-compat with spec reference
export const createCachedFetch = withPerfCache
