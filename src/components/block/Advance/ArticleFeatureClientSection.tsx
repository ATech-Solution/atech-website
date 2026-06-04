'use client'

// Article Feature Client Section — collection mode wrapper.
// Listens for the article-filter block's CustomEvent ('article-category-change')
// and fetches: 1) the featured post in that category, 2) falls back to most-recent.
// No URL changes — page stays completely still.

import { useState, useEffect } from 'react'
import ArticleFeatureSection, { type ArticleFeatureData } from './ArticleFeatureSection'

const ARTICLE_CATEGORY_EVENT = 'article-category-change'

function buildPostUrl(category: string, featuredOnly: boolean): string {
  const url = new URL('/api/posts', window.location.origin)
  url.searchParams.set('where[status][equals]', 'published')
  url.searchParams.set('limit', '1')
  url.searchParams.set('sort', '-publishedAt')
  url.searchParams.set('depth', '2')
  if (category) {
    url.searchParams.set('where[categories.slug][equals]', category)
  }
  if (featuredOnly) {
    url.searchParams.set('where[featured][equals]', 'true')
  }
  return url.toString()
}

function mapItemToFeatData(item: any, base: ArticleFeatureData): ArticleFeatureData {
  return {
    ...base,
    artFeatImage:    item.featuredImage?.url
      ? { url: item.featuredImage.url, alt: item.featuredImage.alt ?? item.title ?? '' }
      : null,
    artFeatCategory: (item.categories ?? [])[0]?.name ?? '',
    artFeatDate:     item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })
      : '',
    artFeatTitle:    item.title ?? '',
    artFeatDesc:     item.excerpt ?? '',
    artFeatCtaUrl:   `/article/${item.slug}`,
  }
}

async function loadFeaturedForCategory(
  category: string,
  base: ArticleFeatureData,
  onResult: (d: ArticleFeatureData) => void,
  signal?: { cancelled: boolean },
) {
  try {
    const featRes  = await fetch(buildPostUrl(category, true))
    const featJson = await featRes.json()
    const featured = featJson.docs?.[0]
    if (signal?.cancelled) return

    if (featured) { onResult(mapItemToFeatData(featured, base)); return }

    const recentRes  = await fetch(buildPostUrl(category, false))
    const recentJson = await recentRes.json()
    const recent     = recentJson.docs?.[0]
    if (signal?.cancelled) return

    if (recent) onResult(mapItemToFeatData(recent, base))
  } catch {
    // silently keep previous data
  }
}

export function ArticleFeatureClientSection({ data }: { data: ArticleFeatureData }) {
  const [featData, setFeatData] = useState<ArticleFeatureData>(data)

  // Fetch the latest featured article on initial mount
  useEffect(() => {
    const signal = { cancelled: false }
    loadFeaturedForCategory('', data, setFeatData, signal)
    return () => { signal.cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for category selections from the article-filter block
  useEffect(() => {
    function handler(e: Event) {
      const category = (e as CustomEvent<{ category: string }>).detail?.category ?? ''
      const signal   = { cancelled: false }
      loadFeaturedForCategory(category, data, setFeatData, signal)
      return () => { signal.cancelled = true }
    }

    window.addEventListener(ARTICLE_CATEGORY_EVENT, handler)
    return () => window.removeEventListener(ARTICLE_CATEGORY_EVENT, handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ArticleFeatureSection data={featData} />
}
