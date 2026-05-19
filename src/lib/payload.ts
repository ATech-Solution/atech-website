/**
 * Server-side Payload data fetching helpers.
 * These run only on the server — never shipped to the browser.
 */
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import config from '@payload-config'

// Singleton so the connection is reused across requests during dev
let payloadInstance: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config })
  }
  return payloadInstance
}

/** Fetch the page marked as the site frontpage (isFrontpage: true) */
export async function getFrontpage() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { isFrontpage: { equals: true }, status: { equals: 'published' } },
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

/** Fetch a single page by its slug */
export async function getPage(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

/** Fetch the global navigation config */
export async function getNavigation() {
  try {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'navigation' })
  } catch {
    return null
  }
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

export const getSettings = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'settings' }).catch(() => null)
  },
  ['settings'],
  { tags: ['settings'] },
)

/** Fetch a single portfolio item by slug, with categories and featuredImage populated */
export async function getPortfolioItem(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'portfolio',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

/** Fetch the Page marked as the portfolio detail template */
export async function getPortfolioTemplatePage() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { portfolioDetailTemplate: { equals: true } },
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

/** Fetch a single post (article) by slug, with categories and featuredImage populated */
export async function getPostItem(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

/** Fetch the Page marked as the article detail template */
export async function getArticleTemplatePage() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { articleDetailTemplate: { equals: true } },
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

/** Fetch all active plugins (cached; bust with revalidateTag('plugins')) */
export const getActivePlugins = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'plugins',
        where: { status: { equals: 'active' } },
        limit: 100,
      })
      return result.docs
    } catch {
      return []
    }
  },
  ['active-plugins'],
  { tags: ['plugins'] },
)

export interface LoggedInUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
  showAdminMenu?: boolean
}

/**
 * Return the currently logged-in Payload user, or null if no valid session.
 * Decodes the payload-token JWT to get the user ID, then fetches fresh data
 * from the DB so field values (like showAdminMenu) are always current.
 */
export async function getLoggedInUser(): Promise<LoggedInUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return null

    // Decode without verifying — we only need the user ID and expiry
    const { decodeJwt } = await import('jose')
    const decoded = decodeJwt(token) as { id?: string; exp?: number }

    if (!decoded.id || !decoded.exp || decoded.exp * 1000 < Date.now()) return null

    const payload = await getPayloadClient()
    const user = await payload.findByID({
      collection: 'users',
      id: decoded.id,
      depth: 0,
    })
    if (!user) return null

    return {
      id:            String(user.id),
      email:         user.email,
      firstName:     (user as any).firstName ?? undefined,
      lastName:      (user as any).lastName  ?? undefined,
      role:          (user as any).role      ?? undefined,
      showAdminMenu: (user as any).showAdminMenu ?? false,
    }
  } catch {
    return null
  }
}

/** Return the favicon URL from the theme global, with a static fallback */
export async function getFaviconUrl(): Promise<string> {
  try {
    const theme = await getTheme()
    const url = (theme as any)?.favicon?.url
    if (url) return url
  } catch {
    // non-fatal
  }
  return '/images/favicon-.png'
}

/**
 * Batch-fetch block templates by ID.
 * Returns a map of { [id]: blockDoc } for merging with layoutBuilder overrides.
 */
export async function getBlockTemplates(ids: string[]): Promise<Record<string, any>> {
  if (!ids.length) return {}
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'blocks',
      where: { id: { in: ids } },
      limit: ids.length,
    })
    return Object.fromEntries(result.docs.map((doc) => [String(doc.id), doc]))
  } catch {
    return {}
  }
}
