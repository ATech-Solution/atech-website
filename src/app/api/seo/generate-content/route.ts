import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import Anthropic from '@anthropic-ai/sdk'
import { buildContentPrompt } from '@/features/aiContent/buildContentPrompt'
import { humanize } from '@/plugins/seo/generateSeoContent'

type Action = 'draft' | 'expand' | 'rewrite' | 'summarize'

const ALLOWED_ACTIONS: Action[] = ['draft', 'expand', 'rewrite', 'summarize']
const ALLOWED_COLLECTIONS = ['pages', 'posts', 'portfolio', 'job-vacancies']

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  let body: {
    action?: string
    prompt?: string
    selectedText?: string
    collectionSlug?: string
    docId?: string
    locale?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { action, prompt = '', selectedText = '', collectionSlug, docId, locale = 'en' } = body

  if (!action || !ALLOWED_ACTIONS.includes(action as Action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  if (action === 'draft' && !prompt.trim()) {
    return NextResponse.json({ error: 'prompt is required for draft action' }, { status: 400 })
  }

  if (['expand', 'rewrite', 'summarize'].includes(action) && !selectedText.trim()) {
    return NextResponse.json({ error: 'selectedText is required for this action' }, { status: 400 })
  }

  if (collectionSlug && !ALLOWED_COLLECTIONS.includes(collectionSlug)) {
    return NextResponse.json({ error: 'Invalid collectionSlug' }, { status: 400 })
  }

  let docTitle = ''
  let docExcerpt = ''

  if (docId && collectionSlug) {
    try {
      const payload = await getPayload({ config })
      const doc = await payload.findByID({
        collection: collectionSlug as any,
        id: docId,
        locale: locale as any,
        depth: 0,
      })
      if (doc) {
        docTitle = (doc as any).title ?? (doc as any).name ?? ''
        docExcerpt = (doc as any).excerpt ?? (doc as any).summary ?? ''
      }
    } catch {
      // doc fetch is best-effort; proceed without context
    }
  }

  try {
    const { system, user } = buildContentPrompt({
      action: action as Action,
      prompt: prompt.trim(),
      selectedText: selectedText.slice(0, 4000),
      docTitle,
      docExcerpt,
      locale,
    })

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system,
      messages: [{ role: 'user', content: user }],
    })

    const raw = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as any).text)
      .join('')
      .trim()

    if (!raw) {
      return NextResponse.json({ error: 'Empty response — try a different prompt' }, { status: 400 })
    }

    return NextResponse.json({ value: humanize(raw) })
  } catch (err) {
    console.error('[AI content generate]', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
