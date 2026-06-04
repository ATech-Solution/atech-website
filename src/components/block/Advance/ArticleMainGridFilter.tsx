'use client'

// ArticleMainGridFilter — true AJAX paging.
// Each page navigation fetches only that page from /api/posts (limit=pageSize&page=N).
// Category changes come from the article-filter block via window CustomEvent —
// no URL changes, the page stays completely still.
// Initial data is server-seeded; hasMounted ref prevents a redundant first fetch.

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const ARTICLE_CATEGORY_EVENT = 'article-category-change'

export interface MainGridArticle {
  mgImage?:    { url: string; alt?: string } | null
  mgCategory?: string
  mgDate?:     string
  mgTitle?:    string
  mgExcerpt?:  string
  mgCtaLabel?: string
  mgCtaUrl?:   string
}

interface ArticleMainGridFilterProps {
  sectionLabel?:   string
  initialItems:    MainGridArticle[]  // server-fetched page 1
  totalDocs:       number             // total match count from API
  pageSize?:       number             // items per page (= API limit)
  contentSource?:  'collection' | 'manual'
  orderBy?:        'publishedAt_desc' | 'publishedAt_asc'
  // Bottom action: numbered pagination (default) | append-on-click | external link
  loadMoreType?:   'pagination' | 'load-more' | 'link'
  loadMoreLabel?:  string
  loadMoreUrl?:    string
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <path d="M1 7h10M5 2l5 5-5 5" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Larger arrow for load-more / link buttons (matches article-grid Figma spec)
function ArrowRightLgIcon() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
      <path d="M1 8h10M6 2l5 6-5 6" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
      <path d="M8 2L2 8l6 6" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
      <path d="M2 2l6 6-6 6" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Article card ──────────────────────────────────────────────────────────────

function ArticleCard({ mgImage, mgCategory, mgDate, mgTitle, mgExcerpt, mgCtaLabel, mgCtaUrl }: MainGridArticle) {
  const cta = mgCtaLabel || 'Read More'
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', background: '#525252', overflow: 'hidden', flexShrink: 0 }}>
        {mgImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mgImage.url} alt={mgImage.alt ?? mgTitle ?? ''} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(mgCategory || mgDate) && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {mgCategory && (
              <span style={{ background: '#f5f5f5', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '12px', fontWeight: 400, color: '#171717', letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: '16px', padding: '4px 10px' }}>
                {mgCategory}
              </span>
            )}
            {mgDate && (
              <span style={{ paddingLeft: '12px', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', fontWeight: 400, color: '#737373', lineHeight: '20px' }}>
                {mgDate}
              </span>
            )}
          </div>
        )}

        {mgTitle && (
          <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '20px', fontWeight: 400, color: '#171717', lineHeight: '28px', margin: 0 }}>
            {mgTitle}
          </h3>
        )}

        {mgExcerpt && (
          <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', fontWeight: 400, color: '#525252', lineHeight: '24px', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {mgExcerpt}
          </p>
        )}

        {mgCtaUrl ? (
          <Link href={mgCtaUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', paddingTop: '4px', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', fontWeight: 400, color: '#171717', textDecoration: 'none' }} className="hover:opacity-70 transition-opacity duration-200">
            {cta} <ArrowRightIcon />
          </Link>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', paddingTop: '4px', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', color: '#171717' }}>
            {cta} <ArrowRightIcon />
          </span>
        )}
      </div>
    </div>
  )
}

// ── Pagination button ─────────────────────────────────────────────────────────

function PageButton({ label, active, disabled, onClick }: { label: React.ReactNode; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width:          '40px',
        height:         '40px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     active ? '#171717' : '#ffffff',
        border:         `1px solid ${active ? '#171717' : '#d4d4d4'}`,
        color:          active ? '#ffffff' : '#404040',
        fontFamily:     'var(--font-work-sans, sans-serif)',
        fontSize:       '16px',
        fontWeight:     400,
        cursor:         disabled ? 'default' : 'pointer',
        opacity:        disabled ? 0.4 : 1,
        flexShrink:     0,
        transition:     'background 0.15s, border-color 0.15s, color 0.15s',
      }}
    >
      {label}
    </button>
  )
}

function buildPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

// ── Data mapping ──────────────────────────────────────────────────────────────

function mapPostToArticle(item: any): MainGridArticle {
  return {
    mgImage:    item.featuredImage?.url ? { url: item.featuredImage.url, alt: item.featuredImage.alt ?? item.title ?? '' } : null,
    mgCategory: (item.categories ?? [])[0]?.name ?? '',
    mgDate:     item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
    mgTitle:    item.title ?? '',
    mgExcerpt:  item.excerpt ?? '',
    mgCtaLabel: 'Read More',
    mgCtaUrl:   `/article/${item.slug}`,
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export function ArticleMainGridFilter({
  sectionLabel,
  initialItems,
  totalDocs:    initialTotalDocs,
  pageSize      = 9,
  contentSource = 'manual',
  orderBy       = 'publishedAt_desc',
  loadMoreType  = 'pagination',
  loadMoreLabel,
  loadMoreUrl,
}: ArticleMainGridFilterProps) {
  const [categoryParam,    setCategoryParam]    = useState('')
  const [items,            setItems]            = useState<MainGridArticle[]>(initialItems)
  const [totalDocs,        setTotalDocs]        = useState(initialTotalDocs)
  const [loading,          setLoading]          = useState(false)
  const [page,             setPage]             = useState(1)
  // Used only in 'load-more' mode: tracks the last appended page
  const [loadedPage,       setLoadedPage]       = useState(1)
  const [appendLoading,    setAppendLoading]    = useState(false)

  // Skip the first effect run — use server-seeded data on initial render
  const hasMounted = useRef(false)

  // Listen for category selections from the article-filter block
  useEffect(() => {
    function handler(e: Event) {
      const cat = (e as CustomEvent<{ category: string }>).detail?.category ?? ''
      setCategoryParam(cat)
    }
    window.addEventListener(ARTICLE_CATEGORY_EVENT, handler)
    return () => window.removeEventListener(ARTICLE_CATEGORY_EVENT, handler)
  }, [])

  // ── Fetch a specific page from the API ──────────────────────────────────────
  async function fetchPage(pageNum: number, category: string): Promise<{ items: MainGridArticle[]; totalDocs: number }> {
    const sort = orderBy === 'publishedAt_asc' ? 'publishedAt' : '-publishedAt'
    const url  = new URL('/api/posts', window.location.origin)
    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('limit', String(pageSize))
    url.searchParams.set('page',  String(pageNum))
    url.searchParams.set('sort',  sort)
    url.searchParams.set('depth', '2')
    if (category) url.searchParams.set('where[categories.slug][equals]', category)
    const res  = await fetch(url.toString())
    const json = await res.json()
    return { items: (json.docs ?? []).map(mapPostToArticle), totalDocs: json.totalDocs ?? 0 }
  }

  // ── React to category / source / order changes ──────────────────────────────
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    setPage(1)

    if (contentSource !== 'collection') {
      // Manual mode: filter client-side by category slug
      if (!categoryParam) {
        setItems(initialItems)
        setTotalDocs(initialItems.length)
      } else {
        const filtered = initialItems.filter(
          item => (item.mgCategory ?? '').toLowerCase().replace(/\s+/g, '-') === categoryParam.toLowerCase()
        )
        setItems(filtered)
        setTotalDocs(filtered.length)
      }
      return
    }

    setLoading(true)
    setLoadedPage(1)
    fetchPage(1, categoryParam)
      .then(({ items: newItems, totalDocs: newTotal }) => {
        setItems(newItems)
        setTotalDocs(newTotal)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [categoryParam, contentSource, orderBy])

  // ── Append next page (load-more mode only) ──────────────────────────────────
  async function appendNextPage() {
    if (appendLoading || contentSource !== 'collection') return
    setAppendLoading(true)
    try {
      const { items: newItems } = await fetchPage(loadedPage + 1, categoryParam)
      setItems(prev => [...prev, ...newItems])
      setLoadedPage(p => p + 1)
    } catch {}
    setAppendLoading(false)
  }

  // ── Navigate to a page ──────────────────────────────────────────────────────
  async function goTo(p: number) {
    const target = Math.max(1, Math.min(p, totalPages))
    if (target === page) return

    if (contentSource !== 'collection') {
      // Manual: just slice locally
      setPage(target)
      return
    }

    setLoading(true)
    setPage(target)
    try {
      const { items: newItems } = await fetchPage(target, categoryParam)
      setItems(newItems)
    } catch {}
    setLoading(false)
  }

  // ── Derived values ──────────────────────────────────────────────────────────
  const effectiveTotalDocs = contentSource === 'collection' ? totalDocs : items.length
  const totalPages         = Math.max(1, Math.ceil(effectiveTotalDocs / pageSize))
  // load-more / link: show all items as-is (accumulated or just first page)
  // pagination: collection = current page from API; manual = local slice
  const visible = (loadMoreType === 'load-more' || loadMoreType === 'link')
    ? items
    : contentSource === 'collection'
      ? items
      : items.slice((page - 1) * pageSize, page * pageSize)
  const pageList = buildPages(page, totalPages)
  const hasMoreToLoad = contentSource === 'collection' && items.length < totalDocs

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section style={{ background: 'var(--section-bg, #fafafa)', padding: '80px' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '46px' }}>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '4px', height: '32px', background: '#171717', flexShrink: 0 }} />
          <span style={{ paddingLeft: '12px', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', fontWeight: 400, color: '#171717', letterSpacing: '0.7px', textTransform: 'uppercase', lineHeight: '20px' }}>
            {sectionLabel || 'Latest Articles'}
          </span>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', color: '#737373' }}>
            Loading articles…
          </div>
        )}

        {/* Article grid */}
        {!loading && visible.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '32px' }}>
            {visible.map((item, i) => <ArticleCard key={i} {...item} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', color: '#737373' }}>
            No articles found.
          </div>
        )}

        {/* ── Load More button — appends next page to the grid ── */}
        {loadMoreType === 'load-more' && hasMoreToLoad && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={appendNextPage}
              disabled={appendLoading}
              style={{
                display:     'inline-flex',
                alignItems:  'center',
                gap:         '8px',
                padding:     '18px 34px',
                background:  '#ffffff',
                border:      '2px solid #171717',
                color:       '#171717',
                fontFamily:  'var(--font-work-sans, sans-serif)',
                fontSize:    '16px',
                fontWeight:  400,
                lineHeight:  '24px',
                cursor:      appendLoading ? 'default' : 'pointer',
                opacity:     appendLoading ? 0.7 : 1,
                transition:  'opacity 0.2s',
              }}
            >
              {appendLoading ? 'Loading…' : (loadMoreLabel || 'Load More Articles')}
              {!appendLoading && <ArrowRightLgIcon />}
            </button>
          </div>
        )}

        {/* ── Link button — navigates to another page ── */}
        {loadMoreType === 'link' && loadMoreUrl && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              href={loadMoreUrl}
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
                transition:     'opacity 0.2s',
              }}
              className="hover:opacity-70"
            >
              {loadMoreLabel || 'View All Articles'}
              <ArrowRightLgIcon />
            </Link>
          </div>
        )}

        {/* ── Numbered pagination (default) — 40×40 buttons, 8px gap, ellipsis ── */}
        {(loadMoreType === 'pagination' || !loadMoreType) && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PageButton label={<ChevronLeft />} disabled={page === 1 || loading} onClick={() => goTo(page - 1)} />

              {pageList.map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', color: '#737373', padding: '0 12px' }}>
                    ...
                  </span>
                ) : (
                  <PageButton key={p} label={p} active={p === page} disabled={loading} onClick={() => goTo(p as number)} />
                )
              )}

              <PageButton label={<ChevronRight />} disabled={page === totalPages || loading} onClick={() => goTo(page + 1)} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
