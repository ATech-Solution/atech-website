import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Cache the settings for 30 seconds to avoid hammering the DB on every request
let cache: { enabled: boolean; expiresAt: number } | null = null

export async function GET() {
  const now = Date.now()

  if (cache && now < cache.expiresAt) {
    return NextResponse.json(
      { maintenanceMode: cache.enabled },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      },
    )
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const settings = await payload.findGlobal({ slug: 'settings' })

    const enabled = Boolean((settings as any).maintenanceMode)
    cache = { enabled, expiresAt: now + 30_000 }

    return NextResponse.json(
      { maintenanceMode: enabled },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      },
    )
  } catch {
    // Fail open — never block real traffic on a DB error
    return NextResponse.json({ maintenanceMode: false })
  }
}
