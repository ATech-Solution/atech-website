import type { MetadataRoute } from 'next'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

export default async function robots(): Promise<MetadataRoute.Robots> {
  let settings: any = null
  try {
    const payload = await getPayloadHMR({ config })
    settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
  } catch {
    // fall through to defaults
  }

  const baseUrl = settings?.canonicalDomain ?? 'https://atech.software'
  const customDisallow: string[] = (settings?.robotsDisallow ?? []).map((r: any) => r.path).filter(Boolean)
  const crawlDelay: number | undefined = settings?.crawlDelay ?? undefined

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', ...customDisallow],
      ...(crawlDelay ? { crawlDelay } : {}),
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
