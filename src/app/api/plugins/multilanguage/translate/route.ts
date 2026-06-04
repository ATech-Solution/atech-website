import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import Anthropic from '@anthropic-ai/sdk'
import { extractFields, applyTranslations } from '@/plugins/multilanguage/fieldExtractor'

const LOCALE_NAMES: Record<string, string> = {
  'en':    'English',
  'zh-hk': 'Traditional Chinese (繁體中文)',
  'zh-cn': 'Simplified Chinese (简体中文)',
  'id':    'Bahasa Indonesia',
}

const TRANSLATABLE_COLLECTIONS = [
  'pages', 'posts', 'portfolio', 'faqs', 'testimonials',
  'job-vacancies', 'blocks',
]

const TRANSLATABLE_GLOBALS = ['navigation', 'settings']

// Build a flat list of translatable strings from extracted fields
// RichText fields get their texts joined with a separator
function buildStringList(fields: ReturnType<typeof extractFields>): string[] {
  return fields.map((f) => {
    if (f.type === 'richtext') {
      try {
        const { texts } = JSON.parse(f.value) as { texts: string[] }
        return texts.join('\n__SPLIT__\n')
      } catch { return '' }
    }
    return f.value
  })
}

async function translateStrings(
  client: Anthropic,
  strings: string[],
  targetLocale: string,
): Promise<string[]> {
  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale
  const payload = JSON.stringify(strings)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: `You are a professional translator. Translate JSON arrays of strings from English to ${targetLang}.
Rules:
- Return ONLY a valid JSON array of strings, same length and same order as the input
- Preserve markdown formatting, HTML tags, and placeholders unchanged
- Translate __SPLIT__ delimiter lines as-is (keep them exactly: \\n__SPLIT__\\n)
- Maintain the same tone and register as the source text
- No explanations or commentary outside the JSON array`,
    messages: [
      {
        role: 'user',
        content: `Translate this JSON array to ${targetLang}:\n${payload}`,
      },
    ],
  })

  const raw = message.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as any).text)
    .join('')
    .trim()

  // Strip markdown code block if present
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  const parsed = JSON.parse(cleaned)

  if (!Array.isArray(parsed) || parsed.length !== strings.length) {
    throw new Error(`Translation returned ${Array.isArray(parsed) ? parsed.length : 'non-array'}, expected ${strings.length}`)
  }

  return parsed as string[]
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  let body: {
    collection?: string
    globalSlug?: string
    id?: string | number
    targetLocales?: string[]
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { collection, globalSlug, id, targetLocales } = body

  if (!targetLocales || targetLocales.length === 0) {
    return NextResponse.json({ error: 'targetLocales is required' }, { status: 400 })
  }

  const validTargets = targetLocales.filter((l) => l !== 'en' && LOCALE_NAMES[l])
  if (validTargets.length === 0) {
    return NextResponse.json({ error: 'No valid target locales (cannot translate to en)' }, { status: 400 })
  }

  if (!collection && !globalSlug) {
    return NextResponse.json({ error: 'collection or globalSlug is required' }, { status: 400 })
  }

  if (collection && !TRANSLATABLE_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: `Collection "${collection}" is not translatable` }, { status: 400 })
  }

  if (globalSlug && !TRANSLATABLE_GLOBALS.includes(globalSlug)) {
    return NextResponse.json({ error: `Global "${globalSlug}" is not translatable` }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    // Fetch the source document in English
    let sourceDoc: Record<string, unknown>
    if (globalSlug) {
      sourceDoc = (await payload.findGlobal({ slug: globalSlug as any, locale: 'en' as any, depth: 2 })) as any
    } else if (id) {
      sourceDoc = (await payload.findByID({
        collection: collection as any,
        id,
        locale: 'en' as any,
        depth: 2,
      })) as any
    } else {
      return NextResponse.json({ error: 'id is required for collection translation' }, { status: 400 })
    }

    // Extract translatable fields
    const fields = extractFields(sourceDoc)
    if (fields.length === 0) {
      return NextResponse.json({
        success: true,
        translated: Object.fromEntries(validTargets.map((l) => [l, 'no-fields'])),
      })
    }

    const strings = buildStringList(fields)
    const translated: Record<string, string> = {}
    const errors: Record<string, string> = {}

    // Non-localized top-level keys stored in the main collection table (not in _locales).
    // Passing them in a locale-scoped update overwrites the SHARED column — the last
    // locale processed wins and all other locales see its content.  Strip them entirely.
    const NON_LOCALIZED_KEYS = new Set([
      'id', 'createdAt', 'updatedAt', 'publishedAt',
      'status', '_status',
      'slug', 'parent', 'breadcrumbs',
      'isFrontpage', 'portfolioDetailTemplate', 'articleDetailTemplate',
      'seoTopics',
    ])

    for (const targetLocale of validTargets) {
      try {
        const translatedStrings = await translateStrings(client, strings, targetLocale)
        const updatedDoc = applyTranslations(sourceDoc, fields, translatedStrings) as Record<string, unknown>

        // Strip non-localized keys — only localized fields should reach Payload's update.
        const updateData: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(updatedDoc)) {
          if (!NON_LOCALIZED_KEYS.has(k)) updateData[k] = v
        }

        if (globalSlug) {
          // Globals like Navigation/Settings have versions.drafts — save without draft flag
          // (direct save; editor can revert via version history if needed)
          await payload.updateGlobal({
            slug: globalSlug as any,
            locale: targetLocale as any,
            data: updateData,
          } as any)
        } else {
          await payload.update({
            collection: collection as any,
            id: id!,
            locale: targetLocale as any,
            data: updateData,
          } as any)
        }

        translated[targetLocale] = 'saved'
      } catch (err) {
        console.error(`[translate] ${collection ?? globalSlug} → ${targetLocale}:`, err)
        errors[targetLocale] = err instanceof Error ? err.message : 'Unknown error'
      }
    }

    return NextResponse.json({ success: true, translated, errors })
  } catch (err) {
    console.error('[translate] Fatal error:', err)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
