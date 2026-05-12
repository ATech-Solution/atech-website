// Article Grid Section — heading + subheading + 3×N article cards
// Supports two content modes: 'collection' (auto-fetch Posts) and 'manual' (static items)

import Link from 'next/link'

const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/45a54d06-5558-4992-9e87-c9de50d83829'

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
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

export async function fetchCollectionPosts(data: ArticleGridData): Promise<ArticleItem[]> {
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

    return (json.docs ?? []).map((post: any): ArticleItem => ({
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
  } catch {
    return []
  }
}

// ── Article card ──────────────────────────────────────────────────────────────

function ArticleCard({ item }: { item: ArticleItem }) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}
    >
      {/* Cover image */}
      <div className="relative w-full shrink-0" style={{ height: '192px', background: '#d4d4d4' }}>
        {item.articleImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.articleImage.url}
            alt={item.articleImage.alt ?? item.articleTitle ?? ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-6">
        {/* Category + date */}
        <div className="flex items-center gap-2">
          {item.articleCategory && (
            <span
              className="px-3 py-1 text-xs"
              style={{
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                color: '#171717',
                fontFamily: 'var(--font-work-sans, sans-serif)',
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
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '1.25rem',
              fontWeight: 400,
              color: '#171717',
              lineHeight: '1.4',
            }}
          >
            {item.articleTitle}
          </h3>
        )}

        {/* Short description */}
        {item.articleDesc && (
          <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.625' }}>
            {item.articleDesc}
          </p>
        )}

        {/* Read More link */}
        {item.articleCta && item.articleUrl && (
          <Link
            href={item.articleUrl}
            className="inline-flex items-center gap-2 mt-1 transition-opacity duration-200 hover:opacity-70"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717' }}
          >
            {item.articleCta}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ARROW_ICON} alt="" style={{ width: '10.5px', height: '12px', objectFit: 'contain' }} />
          </Link>
        )}
      </div>
    </div>
  )
}

// ── Shared layout shell (sync — safe for both server and client contexts) ─────

export function ArticleGridShell({ data, items }: { data: ArticleGridData; items: ArticleItem[] }) {
  const { heading, subheading, sectionLabel } = data

  return (
    <section id="articles" className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {/* Section label */}
        {sectionLabel && (
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: '4px', height: '32px', background: '#171717' }} />
            <span
              className="text-xs tracking-[0.7px] uppercase"
              style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              {sectionLabel}
            </span>
          </div>
        )}

        {/* Heading block */}
        {(heading || subheading) && (
          <div
            className="flex flex-col items-center gap-4 text-center"
            style={{ maxWidth: '768px', margin: '0 auto 4rem' }}
          >
            {heading && (
              <h2
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: 'clamp(2rem, 3vw, 3rem)',
                  fontWeight: 400,
                  color: '#171717',
                  lineHeight: '1',
                }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className="max-w-2xl"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.556' }}
              >
                {subheading}
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
      </div>
    </section>
  )
}

// ── Default export: sync component for preview (manual mode only) ─────────────

export default function ArticleGridSection({ data }: { data: ArticleGridData }) {
  return <ArticleGridShell data={data} items={data.articleItems ?? []} />
}

// ── Async server component for layout-renderer (supports collection mode) ─────

export async function ArticleGridServerSection({ data }: { data: ArticleGridData }) {
  const items =
    (data.articleContentSource ?? 'manual') === 'collection'
      ? await fetchCollectionPosts(data)
      : (data.articleItems ?? [])

  return <ArticleGridShell data={data} items={items} />
}
