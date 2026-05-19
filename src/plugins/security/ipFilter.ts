import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

const CACHE_PATH = path.resolve(process.cwd(), 'data', 'ip-cache.json')

interface IpCache {
  blocklist: Array<{ ip: string; reason?: string }>
  allowlist: Array<{ ip: string }>
  enabled: boolean
  updatedAt: string
}

const EMPTY_CACHE: IpCache = { blocklist: [], allowlist: [], enabled: false, updatedAt: '' }

export function readIpCache(): IpCache {
  try {
    if (!fs.existsSync(CACHE_PATH)) return EMPTY_CACHE
    const raw = fs.readFileSync(CACHE_PATH, 'utf8')
    return JSON.parse(raw) as IpCache
  } catch {
    return EMPTY_CACHE
  }
}

export function writeIpCacheFile(settings: {
  ipFilterEnabled?: boolean
  ipBlocklist?: Array<{ ip: string; reason?: string }>
  ipAllowlist?: Array<{ ip: string }>
}): void {
  try {
    const dir = path.dirname(CACHE_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const cache: IpCache = {
      blocklist: settings.ipBlocklist ?? [],
      allowlist: settings.ipAllowlist ?? [],
      enabled: settings.ipFilterEnabled ?? false,
      updatedAt: new Date().toISOString(),
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8')
  } catch (err) {
    console.error('[SecurityPlugin] Failed to write ip-cache.json:', err)
  }
}

export function isIpBlocked(ip: string, cache: IpCache): boolean {
  if (!cache.enabled) return false
  return cache.blocklist.some((entry) => entry.ip === ip)
}

export function isIpAllowed(ip: string, cache: IpCache): boolean {
  if (!cache.enabled) return true
  if (cache.allowlist.length === 0) return true
  return cache.allowlist.some((entry) => entry.ip === ip)
}

// Registers afterChange hook on settings global to refresh ip-cache.json
export function registerIpFilterHook(payload: Payload) {
  const settings = payload.config.globals?.find((g) => g.slug === 'settings')
  if (!settings) return

  const existing = settings.hooks?.afterChange ?? []
  settings.hooks = {
    ...settings.hooks,
    afterChange: [
      ...existing,
      async ({ doc }) => {
        writeIpCacheFile({
          ipFilterEnabled: (doc as any)?.ipFilterEnabled ?? false,
          ipBlocklist: (doc as any)?.ipBlocklist ?? [],
          ipAllowlist: (doc as any)?.ipAllowlist ?? [],
        })
      },
    ],
  }
}

// Seed the cache file on plugin init with current settings
export async function seedIpCache(payload: Payload): Promise<void> {
  try {
    const settings = await payload.findGlobal({ slug: 'settings' }) as any
    writeIpCacheFile({
      ipFilterEnabled: settings?.ipFilterEnabled ?? false,
      ipBlocklist: settings?.ipBlocklist ?? [],
      ipAllowlist: settings?.ipAllowlist ?? [],
    })
  } catch {
    writeIpCacheFile({})
  }
}
