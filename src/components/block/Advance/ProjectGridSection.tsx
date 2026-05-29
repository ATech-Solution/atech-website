// Project Grid Section — 3×N project cards with optional category filter tabs
// Supports two content modes: 'collection' (auto-fetch Portfolio) and 'manual' (static items)

import { ProjectGridFilter, type ProjectItem } from './ProjectGridFilter'

export interface ProjectGridData {
  projectHeading?:       string
  projectSubheading?:    string
  projectContentSource?: 'collection' | 'manual'
  projectLimit?:         number
  projectCategory?:      string
  projectOrderBy?:       'publishedAt_desc' | 'publishedAt_asc'
  projectItems?:         ProjectItem[]
  showCategoryFilter?:   'yes' | 'no'
  projectLoadMoreType?:  'pagination' | 'load-more' | 'link'
  projectLoadMoreLabel?: string
  projectLoadMoreUrl?:   string
}

// ── Collection fetch ──────────────────────────────────────────────────────────

export async function fetchPortfolioItems(data: ProjectGridData): Promise<ProjectItem[]> {
  try {
    const limit   = data.projectLimit ?? 9
    const orderBy = data.projectOrderBy ?? 'publishedAt_desc'
    const sort    = orderBy === 'publishedAt_asc' ? 'publishedAt' : '-publishedAt'

    const base = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'
    const url  = new URL('/api/portfolio', base)
    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('sort', sort)
    url.searchParams.set('depth', '2')
    if (data.projectCategory) {
      url.searchParams.set('where[categories.slug][equals]', data.projectCategory)
    }

    const res  = await fetch(url.toString(), { next: { revalidate: 60 } })
    const json = await res.json()

    return (json.docs ?? []).map((item: any): ProjectItem => {
      const cats: string[] = (item.categories ?? []).map((c: any) => c.name).filter(Boolean)
      return {
        projectTitle:         item.title ?? '',
        projectDesc:          item.excerpt ?? '',
        projectTag:           cats[0] ?? '',
        projectType:          cats[1] ?? '',
        projectCta:           'View Case Study',
        projectUrl:           `/static/portfolio/${item.slug}`,
        projectImage:         item.featuredImage?.url
          ? { url: item.featuredImage.url, alt: item.featuredImage.alt ?? item.title ?? '' }
          : null,
        projectAllCategories: cats,
      }
    })
  } catch {
    return []
  }
}

// ── Normalize manual items (add projectAllCategories) ─────────────────────────

function normalizeManualItems(items: ProjectItem[]): ProjectItem[] {
  return items.map((item) => ({
    ...item,
    projectAllCategories:
      item.projectAllCategories?.length
        ? item.projectAllCategories
        : [item.projectTag].filter(Boolean) as string[],
  }))
}

// ── Default export: sync component for preview / manual mode ─────────────────

export default function ProjectGridSection({ data }: { data: ProjectGridData }) {
  return (
    <ProjectGridFilter
      heading={data.projectHeading}
      subheading={data.projectSubheading}
      items={normalizeManualItems(data.projectItems ?? [])}
      showCategoryFilter={(data.showCategoryFilter ?? 'no') !== 'no'}
      loadMoreType={data.projectLoadMoreType ?? 'load-more'}
      loadMoreLabel={data.projectLoadMoreLabel}
      loadMoreUrl={data.projectLoadMoreUrl}
    />
  )
}

// ── Async server component for layout-renderer (supports collection mode) ─────

export async function ProjectGridServerSection({ data }: { data: ProjectGridData }) {
  try {
    const items =
      (data.projectContentSource ?? 'manual') === 'collection'
        ? await fetchPortfolioItems(data)
        : normalizeManualItems(data.projectItems ?? [])

    return (
      <ProjectGridFilter
        heading={data.projectHeading}
        subheading={data.projectSubheading}
        items={items}
        showCategoryFilter={(data.showCategoryFilter ?? 'yes') !== 'no'}
        loadMoreType={data.projectLoadMoreType ?? 'load-more'}
        loadMoreLabel={data.projectLoadMoreLabel}
        loadMoreUrl={data.projectLoadMoreUrl}
      />
    )
  } catch {
    return null
  }
}
