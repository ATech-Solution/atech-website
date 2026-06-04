import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const pluginsResult = await payload.find({
      collection: 'plugins',
      where: { slug: { equals: 'multilanguage' }, status: { equals: 'active' } },
      limit: 1,
    })
    const isActive = pluginsResult.docs.length > 0

    if (!isActive) {
      return NextResponse.json({ isActive: false, autoDetect: false, defaultLocale: 'en', activeLocales: [] })
    }

    const settings = await payload.findGlobal({ slug: 'language-settings' as any })

    return NextResponse.json({
      isActive: true,
      autoDetect: (settings as any)?.autoDetect ?? true,
      defaultLocale: (settings as any)?.defaultLocale ?? 'en',
      activeLocales: ((settings as any)?.activeLocales ?? [])
        .filter((l: any) => l.enabled)
        .map((l: any) => ({ code: l.code, label: l.label })),
    })
  } catch {
    return NextResponse.json({ isActive: false, autoDetect: false, defaultLocale: 'en', activeLocales: [] })
  }
}
