import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateSeoContent } from '@/plugins/seo/generateSeoContent'

type FieldType = 'meta.title' | 'meta.description' | 'meta.ogTitle' | 'meta.ogDescription' | 'seo.llmsEntry'

const ALLOWED_FIELDS: FieldType[] = [
  'meta.title', 'meta.description', 'meta.ogTitle', 'meta.ogDescription', 'seo.llmsEntry',
]

const ALLOWED_COLLECTIONS = ['pages', 'posts', 'portfolio', 'job-vacancies']

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  let body: { collectionSlug?: string; docId?: string; field?: string; locale?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { collectionSlug, docId, field, locale = 'en' } = body

  if (!collectionSlug || !ALLOWED_COLLECTIONS.includes(collectionSlug)) {
    return NextResponse.json({ error: 'Invalid collectionSlug' }, { status: 400 })
  }
  if (!field || !ALLOWED_FIELDS.includes(field as FieldType)) {
    return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
  }
  if (!docId) {
    return NextResponse.json({ error: 'docId required' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })

    const doc = await payload.findByID({
      collection: collectionSlug as any,
      id: docId,
      locale: locale as any,
      depth: 0,
    })

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const value = await generateSeoContent({
      field: field as FieldType,
      doc: doc as Record<string, any>,
      collectionSlug,
    })

    return NextResponse.json({ value })
  } catch (err) {
    console.error('[SEO generate]', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
