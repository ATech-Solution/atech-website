import type { MetadataRoute } from 'next'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

async function getSettings() {
  try {
    const payload = await getPayloadHMR({ config })
    return await payload.findGlobal({ slug: 'settings', depth: 0 })
  } catch {
    return null
  }
}

async function queryCollection(payload: any, collection: string, fields: string[]) {
  try {
    const result = await payload.find({
      collection,
      where: { _status: { equals: 'published' } },
      depth: 0,
      limit: 1000,
      select: fields.reduce((acc, f) => ({ ...acc, [f]: true }), {}),
    })
    return result.docs ?? []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings()
  const baseUrl = (settings as any)?.canonicalDomain ?? 'https://atech.software'

  let payload: any
  try {
    payload = await getPayloadHMR({ config })
  } catch {
    return []
  }

  const [pages, posts, portfolio, jobs] = await Promise.all([
    queryCollection(payload, 'pages', ['slug', 'updatedAt', 'meta']),
    queryCollection(payload, 'posts', ['slug', 'updatedAt', 'meta']),
    queryCollection(payload, 'portfolio', ['slug', 'updatedAt', 'meta']),
    queryCollection(payload, 'job-vacancies', ['slug', 'updatedAt', 'meta']),
  ])

  const entries: MetadataRoute.Sitemap = []

  const addEntries = (docs: any[], pathPrefix: string, changefreq: 'weekly' | 'monthly', priority: number) => {
    for (const doc of docs) {
      if (doc.meta?.noIndex) continue
      const slug = doc.slug === 'home' ? '' : doc.slug ?? ''
      entries.push({
        url: `${baseUrl}/${pathPrefix}${slug}`.replace(/\/\//g, '/').replace(/\/$/, '') || baseUrl,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
        changeFrequency: changefreq,
        priority,
      })
    }
  }

  addEntries(pages, '', 'weekly', 0.9)
  addEntries(posts, 'article/', 'monthly', 0.7)
  addEntries(portfolio, 'portfolio/', 'monthly', 0.6)
  addEntries(jobs, 'careers/', 'weekly', 0.8)

  return entries
}
