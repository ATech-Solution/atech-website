/**
 * Server-side Payload data fetching helpers.
 * These run only on the server — never shipped to the browser.
 */
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import config from '@payload-config'

// Singleton so the connection is reused across requests during dev
let payloadInstance: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config })
  }
  return payloadInstance
}

/** Fetch a single page by its slug */
export async function getPage(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

/** Fetch the global navigation config */
export async function getNavigation() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation' })
}

/** Fetch the site theme global (cached; busted by revalidateTag('theme') in Theme afterChange hook) */
export const getTheme = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'theme' }).catch(() => null)
  },
  ['theme'],
  { tags: ['theme'] },
)

/**
 * Batch-fetch block templates by ID.
 * Returns a map of { [id]: blockDoc } for merging with layoutBuilder overrides.
 */
export async function getBlockTemplates(ids: string[]): Promise<Record<string, any>> {
  if (!ids.length) return {}
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'blocks',
    where: { id: { in: ids } },
    limit: ids.length,
  })
  return Object.fromEntries(result.docs.map((doc) => [String(doc.id), doc]))
}
