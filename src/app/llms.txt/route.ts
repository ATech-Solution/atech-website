import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { formatLlmsTxt } from '@/plugins/seo/llmstxt'

async function queryPublished(payload: any, collection: string) {
  try {
    const result = await payload.find({
      collection,
      where: { _status: { equals: 'published' } },
      depth: 0,
      limit: 500,
    })
    return result.docs ?? []
  } catch {
    return []
  }
}

export async function GET() {
  try {
    const payload = await getPayloadHMR({ config })
    const settings: any = await payload.findGlobal({ slug: 'settings', depth: 1 }).catch(() => null)

    if (settings?.llmsTxtEnabled === false) {
      return new NextResponse('# llms.txt disabled\n', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const siteName = settings?.siteName ?? 'ATech'
    const siteDescription = settings?.siteDescription ?? 'ATech — software consultancy based in Indonesia.'

    const [pages, posts, portfolio, jobs] = await Promise.all([
      queryPublished(payload, 'pages'),
      queryPublished(payload, 'posts'),
      queryPublished(payload, 'portfolio'),
      queryPublished(payload, 'job-vacancies'),
    ])

    const toEntries = (docs: any[], prefix: string) =>
      docs
        .filter((d) => !d.meta?.noIndex && (d.seo?.llmsEntry || d.meta?.description || d.excerpt))
        .map((d) => ({
          title: d.title ?? d.name ?? '',
          slug: `${prefix}${d.slug === 'home' ? '' : d.slug ?? ''}`.replace(/\/\//g, '/'),
          summary: d.seo?.llmsEntry || d.meta?.description || d.excerpt || '',
        }))

    const txt = formatLlmsTxt(siteName, siteDescription, [
      { heading: 'Pages', entries: toEntries(pages, '/') },
      { heading: 'Articles', entries: toEntries(posts, '/article/') },
      { heading: 'Portfolio', entries: toEntries(portfolio, '/portfolio/') },
      { heading: 'Careers', entries: toEntries(jobs, '/careers/') },
    ])

    return new NextResponse(txt, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('[llms.txt]', err)
    return new NextResponse('# Error generating llms.txt\n', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
