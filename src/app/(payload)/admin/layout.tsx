import type { Metadata } from 'next'
import React from 'react'
import { headers } from 'next/headers'
import fs from 'fs'
import path from 'path'
import { getFaviconUrl } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const icon = await getFaviconUrl()
  return { icons: [{ rel: 'icon', url: icon }] }
}

interface IpCache {
  blocklist: Array<{ ip: string; reason?: string }>
  allowlist: Array<{ ip: string }>
  enabled: boolean
}

function readIpCache(): IpCache {
  try {
    const cachePath = path.resolve(process.cwd(), 'data', 'ip-cache.json')
    if (!fs.existsSync(cachePath)) return { blocklist: [], allowlist: [], enabled: false }
    return JSON.parse(fs.readFileSync(cachePath, 'utf8')) as IpCache
  } catch {
    return { blocklist: [], allowlist: [], enabled: false }
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cache = readIpCache()

  if (cache.enabled) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? headerList.get('x-real-ip')
      ?? 'unknown'

    const blocked = cache.blocklist.some((e) => e.ip === ip)
    const allowlistActive = cache.allowlist.length > 0
    const allowed = !allowlistActive || cache.allowlist.some((e) => e.ip === ip)

    if (blocked || !allowed) {
      return (
        <html lang="en">
          <body style={{ margin: 0, background: '#0d0d0d', color: '#fff', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, fontWeight: 800, color: '#dc2626' }}>403</div>
              <div style={{ fontSize: 18, marginTop: 8, color: 'rgba(255,255,255,0.6)' }}>Access Forbidden</div>
              <div style={{ fontSize: 13, marginTop: 4, color: 'rgba(255,255,255,0.3)' }}>Your IP address is not permitted to access this area.</div>
            </div>
          </body>
        </html>
      )
    }
  }

  return <>{children}</>
}
