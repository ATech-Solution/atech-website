// Portfolio Main Section — full project grid with category filter + load more
// Reuses ProjectGridFilter for rendering; fetches from Portfolio collection by default.

import { ProjectGridFilter, type ProjectItem } from './ProjectGridFilter'

export interface PortfolioMainData {
  projectHeading?:       string
  projectSubheading?:    string
  projectContentSource?: 'collection' | 'manual'
  projectLimit?:         number
  projectOrderBy?:       'publishedAt_desc' | 'publishedAt_asc'
  showCategoryFilter?:   'yes' | 'no'
}

async function fetchItems(data: PortfolioMainData): Promise<ProjectItem[]> {
  try {
    const limit  = data.projectLimit ?? 9
    const sort   = (data.projectOrderBy ?? 'publishedAt_desc') === 'publishedAt_asc' ? 'publishedAt' : '-publishedAt'
    const base   = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'
    const url    = new URL('/api/portfolio', base)
    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('sort', sort)
    url.searchParams.set('depth', '2')

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

// ── Default export: sync (manual / layout builder preview) ───────────────────

export default function PortfolioMainSection({ data }: { data: PortfolioMainData }) {
  return (
    <ProjectGridFilter
      heading={data.projectHeading ?? 'Featured Projects'}
      subheading={data.projectSubheading ?? 'A curated selection of our most impactful work across various industries and technologies.'}
      items={[]}
      showCategoryFilter={(data.showCategoryFilter ?? 'yes') !== 'no'}
    />
  )
}

// ── Server component: fetches collection data ─────────────────────────────────

export async function PortfolioMainServerSection({ data }: { data: PortfolioMainData }) {
  try {
    const items =
      (data.projectContentSource ?? 'collection') === 'collection'
        ? await fetchItems(data)
        : []

    return (
      <ProjectGridFilter
        heading={data.projectHeading ?? 'Featured Projects'}
        subheading={data.projectSubheading ?? 'A curated selection of our most impactful work across various industries and technologies.'}
        items={items}
        showCategoryFilter={(data.showCategoryFilter ?? 'yes') !== 'no'}
      />
    )
  } catch {
    return null
  }
}
