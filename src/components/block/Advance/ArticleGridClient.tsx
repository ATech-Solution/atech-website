'use client'

// Article Grid Client — interactive grid with "Load More Articles" button.
// Receives server-fetched initial items + totalDocs; fetches subsequent pages
// from the client side on each Load More click.

import { useState } from 'react'
import Link from 'next/link'
import type { ArticleGridData, ArticleItem } from './ArticleGridSection'

// ── Icons ─────────────────────────────────────────────────────────────────────

function ArrowSmIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
      <path d="M1 6h9M5 1.5l4.5 4.5L5 10.5" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowLgIcon({ loading }: { loading?: boolean }) {
  if (loading) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ animation: 'spin 0.8s linear infinite' }}>
        <circle cx="8" cy="8" r="6" stroke="#171717" strokeWidth="1.5" strokeDasharray="25 10" />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </svg>
    )
  }
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
      <path d="M1 8h10M6 2l5 6-5 6" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Article card ──────────────────────────────────────────────────────────────

function ArticleCard({ item }: { item: ArticleItem }) {
  return (
    <div className="flex flex-col overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
      {/* Cover image */}
      <div className="relative w-full shrink-0" style={{ height: '192px', background: '#d4d4d4' }}>
        {item.articleImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.articleImage.url}
            alt={item.articleImage.alt ?? item.articleTitle ?? ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-6">
        {/* Category + date */}
        <div className="flex items-center gap-2">
          {item.articleCategory && (
            <span
              className="px-3 py-1 text-xs"
              style={{
                background:  '#f5f5f5',
                border:      '1px solid #e5e5e5',
                color:       '#171717',
                fontFamily:  'var(--font-work-sans, sans-serif)',
                borderRadius: 0,
              }}
            >
              {item.articleCategory}
            </span>
          )}
          {item.articleDate && (
            <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
              {item.articleDate}
            </span>
          )}
        </div>

        {/* Title */}
        {item.articleTitle && (
          <h3
            className="pt-1"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', fontWeight: 400, color: '#171717', lineHeight: '1.4' }}
          >
            {item.articleTitle}
          </h3>
        )}

        {/* Excerpt */}
        {item.articleDesc && (
          <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.625' }}>
            {item.articleDesc}
          </p>
        )}

        {/* Read More */}
        {item.articleCta && item.articleUrl && (
          <Link
            href={item.articleUrl}
            className="inline-flex items-center gap-2 mt-1 transition-opacity duration-200 hover:opacity-70"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717' }}
          >
            {item.articleCta}
            <ArrowSmIcon />
          </Link>
        )}
      </div>
    </div>
  )
}

// ── Client grid ───────────────────────────────────────────────────────────────

interface ArticleGridClientProps {
  data:         ArticleGridData
  initialItems: ArticleItem[]
  totalDocs:    number
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function mapPost(post: any): ArticleItem {
  return {
    articleCategory: post.categories?.[0]?.name ?? '',
    articleDate:     post.publishedAt ? formatDate(post.publishedAt) : '',
    articleTitle:    post.title ?? '',
    articleDesc:     post.excerpt ?? '',
    articleCta:      'Read More',
    articleUrl:      `/article/${post.slug}`,
    articleImage:    post.featuredImage?.url
      ? { url: post.featuredImage.url, alt: post.featuredImage.alt ?? post.title ?? '' }
      : null,
  }
}

export function ArticleGridClient({ data, initialItems, totalDocs }: ArticleGridClientProps) {
  const [items,   setItems]   = useState<ArticleItem[]>(initialItems)
  const [loading, setLoading] = useState(false)

  const isCollection = (data.articleContentSource ?? 'manual') === 'collection'
  const batchSize    = data.articlePostsLimit ?? 6
  const hasMore      = isCollection && items.length < totalDocs

  async function loadMore() {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const nextPage = Math.floor(items.length / batchSize) + 1
      const sort     = data.articlePostsOrderBy === 'publishedAt_asc' ? 'publishedAt' : '-publishedAt'

      const url = new URL('/api/posts', window.location.origin)
      url.searchParams.set('where[status][equals]', 'published')
      url.searchParams.set('limit', String(batchSize))
      url.searchParams.set('page',  String(nextPage))
      url.searchParams.set('sort',  sort)
      url.searchParams.set('depth', '1')
      if (data.articlePostsCategory) {
        url.searchParams.set('where[categories.slug][equals]', data.articlePostsCategory)
      }

      const res   = await fetch(url.toString())
      const json  = await res.json()
      const batch = (json.docs ?? []).map(mapPost)
      setItems(prev => [...prev, ...batch])
    } catch {
      // silently ignore network errors
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="articles" className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>

        {/* Section label */}
        {data.sectionLabel && (
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: '4px', height: '32px', background: '#171717' }} />
            <span
              className="text-xs tracking-[0.7px] uppercase"
              style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              {data.sectionLabel}
            </span>
          </div>
        )}

        {/* Heading block */}
        {(data.heading || data.subheading) && (
          <div className="flex flex-col items-center gap-4 text-center" style={{ maxWidth: '768px', margin: '0 auto 4rem' }}>
            {data.heading && (
              <h2
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   'clamp(2rem, 3vw, 3rem)',
                  fontWeight: 400,
                  color:      '#171717',
                  lineHeight: '1',
                }}
              >
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p
                className="max-w-2xl"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.556' }}
              >
                {data.subheading}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {items.map((item, i) => (
              <ArticleCard key={i} item={item} />
            ))}
          </div>
        )}

        {/* Load More — link type: always visible when configured */}
        {data.articleLoadMoreType === 'link' && data.articleLoadMoreUrl && (
          <div className="flex justify-center mt-12">
            <Link
              href={data.articleLoadMoreUrl}
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '8px',
                padding:        '18px 34px',
                background:     '#ffffff',
                border:         '2px solid #171717',
                color:          '#171717',
                fontFamily:     'var(--font-work-sans, sans-serif)',
                fontSize:       '16px',
                fontWeight:     400,
                lineHeight:     '24px',
                textDecoration: 'none',
              }}
            >
              {data.articleLoadMoreLabel || 'Load More Articles'}
              <ArrowLgIcon />
            </Link>
          </div>
        )}

        {/* Load More Articles button — AJAX pagination (collection mode, no link override) */}
        {hasMore && data.articleLoadMoreType !== 'link' && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '8px',
                padding:        '18px 34px',
                background:     '#ffffff',
                border:         '2px solid #171717',
                color:          '#171717',
                fontFamily:     'var(--font-work-sans, sans-serif)',
                fontSize:       '16px',
                fontWeight:     400,
                lineHeight:     '24px',
                cursor:         loading ? 'default' : 'pointer',
                opacity:        loading ? 0.7 : 1,
                transition:     'opacity 0.2s',
              }}
            >
              {loading ? 'Loading…' : 'Load More Articles'}
              <ArrowLgIcon loading={loading} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
