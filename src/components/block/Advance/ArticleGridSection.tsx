// Article Grid Section — heading + subheading + 3×N article cards with Load More
// Supports two content modes: 'collection' (auto-fetch Posts) and 'manual' (static items)
// Interactive Load More handled by ArticleGridClient (client component).

import Link from 'next/link'
import { ArticleGridClient } from './ArticleGridClient'

interface MediaRef { url: string; alt?: string }

export interface ArticleItem {
  articleCategory?: string
  articleDate?:     string
  articleTitle?:    string
  articleDesc?:     string
  articleCta?:      string
  articleUrl?:      string
  articleImage?:    MediaRef | null
}

export interface ArticleGridData {
  heading?:               string
  subheading?:            string
  sectionLabel?:          string
  articleContentSource?:  'collection' | 'manual'
  articlePostsLimit?:     number
  articlePostsCategory?:  string
  articlePostsOrderBy?:   'publishedAt_desc' | 'publishedAt_asc'
  articleItems?:          ArticleItem[]
  articleLoadMoreType?:   'none' | 'link'
  articleLoadMoreUrl?:    string
  articleLoadMoreLabel?:  string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

async function fetchCollectionPosts(data: ArticleGridData): Promise<{ items: ArticleItem[]; totalDocs: number }> {
  try {
    const limit    = data.articlePostsLimit ?? 6
    const orderBy  = data.articlePostsOrderBy ?? 'publishedAt_desc'
    const sortSign = orderBy === 'publishedAt_asc' ? '' : '-'

    const base = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'
    const url  = new URL('/api/posts', base)
    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('sort', `${sortSign}publishedAt`)
    url.searchParams.set('depth', '1')
    if (data.articlePostsCategory) {
      url.searchParams.set('where[categories.slug][equals]', data.articlePostsCategory)
    }

    const res  = await fetch(url.toString(), { next: { revalidate: 60 } })
    const json = await res.json()

    const items: ArticleItem[] = (json.docs ?? []).map((post: any): ArticleItem => ({
      articleCategory: post.categories?.[0]?.name ?? '',
      articleDate:     post.publishedAt ? formatDate(post.publishedAt) : '',
      articleTitle:    post.title ?? '',
      articleDesc:     post.excerpt ?? '',
      articleCta:      'Read More',
      articleUrl:      `/article/${post.slug}`,
      articleImage:    post.featuredImage?.url
        ? { url: post.featuredImage.url, alt: post.featuredImage.alt ?? post.title ?? '' }
        : null,
    }))

    return { items, totalDocs: json.totalDocs ?? items.length }
  } catch {
    return { items: [], totalDocs: 0 }
  }
}

// ── Fallback shell — used only by previewResolver (admin preview, no Load More) ─

function ArrowSmIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
      <path d="M1 6h9M5 1.5l4.5 4.5L5 10.5" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PreviewCard({ item }: { item: ArticleItem }) {
  return (
    <div className="flex flex-col overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
      <div className="relative w-full shrink-0" style={{ height: '192px', background: '#d4d4d4' }}>
        {item.articleImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.articleImage.url} alt={item.articleImage.alt ?? ''} className="absolute inset-0 w-full h-full object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-2">
          {item.articleCategory && (
            <span className="px-3 py-1 text-xs" style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {item.articleCategory}
            </span>
          )}
          {item.articleDate && (
            <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>{item.articleDate}</span>
          )}
        </div>
        {item.articleTitle && (
          <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', fontWeight: 400, color: '#171717', lineHeight: '1.4' }}>
            {item.articleTitle}
          </h3>
        )}
        {item.articleDesc && (
          <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.625' }}>
            {item.articleDesc}
          </p>
        )}
        {item.articleCta && item.articleUrl && (
          <Link href={item.articleUrl} className="inline-flex items-center gap-2 mt-1 hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717' }}>
            {item.articleCta}
            <ArrowSmIcon />
          </Link>
        )}
      </div>
    </div>
  )
}

export function ArticleGridShell({ data, items }: { data: ArticleGridData; items: ArticleItem[] }) {
  const { heading, subheading, sectionLabel } = data
  return (
    <section id="articles" className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {sectionLabel && (
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: '4px', height: '32px', background: '#171717' }} />
            <span className="text-xs tracking-[0.7px] uppercase" style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {sectionLabel}
            </span>
          </div>
        )}
        {(heading || subheading) && (
          <div className="flex flex-col items-center gap-4 text-center" style={{ maxWidth: '768px', margin: '0 auto 4rem' }}>
            {heading && (
              <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 400, color: '#171717', lineHeight: '1' }}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="max-w-2xl" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.556' }}>
                {subheading}
              </p>
            )}
          </div>
        )}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {items.map((item, i) => <PreviewCard key={i} item={item} />)}
          </div>
        )}

        {data.articleLoadMoreType === 'link' && data.articleLoadMoreUrl && (
          <div className="flex justify-center mt-12">
            <Link
              href={data.articleLoadMoreUrl}
              style={{
                display:    'inline-flex',
                alignItems: 'center',
                gap:        '8px',
                padding:    '18px 34px',
                background: '#ffffff',
                border:     '2px solid #171717',
                color:      '#171717',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '16px',
                fontWeight: 400,
                lineHeight: '24px',
                textDecoration: 'none',
              }}
            >
              {data.articleLoadMoreLabel || 'Load More Articles'}
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
                <path d="M1 8h10M6 2l5 6-5 6" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

// ── Default export: sync for preview / manual mode ────────────────────────────

export default function ArticleGridSection({ data }: { data: ArticleGridData }) {
  const items = data.articleItems ?? []
  // Manual mode: no Load More (all items are already configured)
  return <ArticleGridShell data={data} items={items} />
}

// ── Async server component — collection mode with Load More ───────────────────

export async function ArticleGridServerSection({ data }: { data: ArticleGridData }) {
  try {
    if ((data.articleContentSource ?? 'manual') === 'collection') {
      const { items, totalDocs } = await fetchCollectionPosts(data)
      return <ArticleGridClient data={data} initialItems={items} totalDocs={totalDocs} />
    }
    // Manual mode: use simple shell (no load more)
    return <ArticleGridShell data={data} items={data.articleItems ?? []} />
  } catch {
    return <ArticleGridShell data={data} items={[]} />
  }
}
