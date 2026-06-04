// Article Main Grid Section — Layout Builder variant (Advance)
// Used by: article-main-grid block type
// #fafafa background, 3-column article grid with true AJAX pagination.
// Server fetches only page 1; ArticleMainGridFilter handles subsequent pages client-side.

import { ArticleMainGridFilter, type MainGridArticle } from './ArticleMainGridFilter'

export interface ArticleMainGridData {
  mainGridSectionLabel?:  string
  mainGridContentSource?: 'collection' | 'manual'
  mainGridLimit?:         number   // legacy — no longer used for collection mode
  mainGridPageSize?:      number
  mainGridCategory?:      string
  mainGridOrderBy?:       'publishedAt_desc' | 'publishedAt_asc'
  mainGridItems?:         MainGridArticle[]
  mainGridLoadMoreType?:  'pagination' | 'load-more' | 'link'
  mainGridLoadMoreLabel?: string
  mainGridLoadMoreUrl?:   string
}

async function fetchFirstPage(data: ArticleMainGridData): Promise<{ items: MainGridArticle[]; totalDocs: number }> {
  try {
    const pageSize = data.mainGridPageSize ?? 9
    const sort     = (data.mainGridOrderBy ?? 'publishedAt_desc') === 'publishedAt_asc' ? 'publishedAt' : '-publishedAt'
    const base     = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'
    const url      = new URL('/api/posts', base)
    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('limit', String(pageSize))
    url.searchParams.set('page',  '1')
    url.searchParams.set('sort',  sort)
    url.searchParams.set('depth', '2')
    if (data.mainGridCategory) {
      url.searchParams.set('where[categories.slug][equals]', data.mainGridCategory)
    }

    const res  = await fetch(url.toString(), { next: { revalidate: 60 } })
    const json = await res.json()

    const items: MainGridArticle[] = (json.docs ?? []).map((item: any): MainGridArticle => ({
      mgImage:    item.featuredImage?.url
        ? { url: item.featuredImage.url, alt: item.featuredImage.alt ?? item.title ?? '' }
        : null,
      mgCategory: (item.categories ?? [])[0]?.name ?? '',
      mgDate:     item.publishedAt
        ? new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '',
      mgTitle:    item.title ?? '',
      mgExcerpt:  item.excerpt ?? '',
      mgCtaLabel: 'Read More',
      mgCtaUrl:   `/article/${item.slug}`,
    }))

    return { items, totalDocs: json.totalDocs ?? items.length }
  } catch {
    return { items: [], totalDocs: 0 }
  }
}

// ── Sync component for preview / manual mode ──────────────────────────────────
export default function ArticleMainGridSection({ data }: { data: ArticleMainGridData }) {
  const items = data.mainGridItems ?? []
  return (
    <ArticleMainGridFilter
      sectionLabel={data.mainGridSectionLabel}
      initialItems={items}
      totalDocs={items.length}
      pageSize={data.mainGridPageSize ?? 9}
      contentSource={data.mainGridContentSource ?? 'manual'}
      orderBy={data.mainGridOrderBy ?? 'publishedAt_desc'}
      loadMoreType={data.mainGridLoadMoreType ?? 'pagination'}
      loadMoreLabel={data.mainGridLoadMoreLabel}
      loadMoreUrl={data.mainGridLoadMoreUrl}
    />
  )
}

// ── Async server component — seeds page 1, client handles the rest ────────────
export async function ArticleMainGridServerSection({ data }: { data: ArticleMainGridData }) {
  try {
    const isCollection = (data.mainGridContentSource ?? 'manual') === 'collection'

    if (isCollection) {
      const { items, totalDocs } = await fetchFirstPage(data)
      return (
        <ArticleMainGridFilter
          sectionLabel={data.mainGridSectionLabel}
          initialItems={items}
          totalDocs={totalDocs}
          pageSize={data.mainGridPageSize ?? 9}
          contentSource="collection"
          orderBy={data.mainGridOrderBy ?? 'publishedAt_desc'}
        />
      )
    }

    // Manual mode
    const items = data.mainGridItems ?? []
    return (
      <ArticleMainGridFilter
        sectionLabel={data.mainGridSectionLabel}
        initialItems={items}
        totalDocs={items.length}
        pageSize={data.mainGridPageSize ?? 9}
        contentSource="manual"
        orderBy={data.mainGridOrderBy ?? 'publishedAt_desc'}
      />
    )
  } catch {
    return null
  }
}
