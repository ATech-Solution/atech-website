import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 120

const TRANSLATABLE_COLLECTIONS = ['pages', 'posts', 'portfolio'] as const

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locales = (searchParams.get('locales') ?? 'en,id').split(',').filter(Boolean)

    const payload = await getPayloadClient()
    const results: Record<string, Record<string, { total: number; translated: number }>> = {}

    for (const collection of TRANSLATABLE_COLLECTIONS) {
      results[collection] = {}

      for (const locale of locales) {
        const res = await payload.find({
          collection: collection as any,
          locale: locale as any,
          limit: 0,
          depth: 0,
        })
        const total = res.totalDocs

        // Count docs that have a title in this locale (non-empty means translated)
        const translated = await payload.find({
          collection: collection as any,
          locale: locale as any,
          where: { title: { not_equals: '' } },
          limit: 0,
          depth: 0,
        })

        results[collection][locale] = { total, translated: translated.totalDocs }
      }
    }

    return NextResponse.json({ locales, results })
  } catch {
    return NextResponse.json({ locales: [], results: {} })
  }
}
