import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Humanizer ──────────────────────────────────────────────────────────────────
// Strips patterns that AI-detection tools flag as machine-generated writing.

const AI_VOCAB = [
  /\bdelve\b/gi, /\belevate\b/gi, /\bunlock\b/gi, /\btransform\b/gi,
  /\bempower\b/gi, /\bnavigate\b/gi, /\bfoster\b/gi, /\bleverage\b/gi,
  /\bseamless(?:ly)?\b/gi, /\btailored\b/gi, /\brobust\b/gi,
  /\bgroundbreaking\b/gi, /\bcutting-edge\b/gi, /\bstate-of-the-art\b/gi,
  /\binnovative\b/gi, /\bcomprehensive\b/gi,
]

const AI_VOCAB_REPLACEMENTS: Record<string, string> = {
  'delve': 'dig', 'elevate': 'improve', 'unlock': 'access', 'transform': 'change',
  'empower': 'help', 'navigate': 'work through', 'foster': 'build', 'leverage': 'use',
  'seamlessly': 'smoothly', 'seamless': 'smooth', 'tailored': 'built',
  'robust': 'solid', 'groundbreaking': 'new', 'cutting-edge': 'modern',
  'state-of-the-art': 'modern', 'innovative': 'new', 'comprehensive': 'complete',
}

const FILLER_OPENERS = [
  /^In today's (fast-paced |digital |modern |rapidly evolving )?world[,.]?\s*/i,
  /^In the (digital |modern |current )?age of[^,]+,\s*/i,
  /^As (we|businesses|companies|organizations) (navigate|move|head) (into|toward)[^,]+,\s*/i,
  /^Whether you('re| are)[^,]+,\s*/i,
]

function humanize(text: string): string {
  let out = text.trim()

  // Remove em-dash overuse — replace with comma or rewrite
  out = out.replace(/\s*—\s*/g, ' — ')
  const emDashCount = (out.match(/—/g) || []).length
  if (emDashCount > 1) {
    out = out.replace(/\s*—\s*/g, ', ')
  }

  // Strip filler openers
  for (const pattern of FILLER_OPENERS) {
    out = out.replace(pattern, '')
  }
  out = out.charAt(0).toUpperCase() + out.slice(1)

  // Replace AI vocabulary
  for (const pattern of AI_VOCAB) {
    const word = pattern.source.replace(/\\b/g, '').replace(/\(ly\)\?/g, 'ly')
    const plainWord = word.replace(/[()\\?]/g, '').toLowerCase()
    const replacement = AI_VOCAB_REPLACEMENTS[plainWord] ?? plainWord
    out = out.replace(pattern, (match) => {
      // Preserve casing
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1)
      }
      return replacement
    })
  }

  // Break up passive voice stacking (basic heuristic)
  out = out.replace(/\bis being\b/g, 'is')
  out = out.replace(/\bwas being\b/g, 'was')

  // Remove parenthetical hedging
  out = out.replace(/\(note that[^)]*\)/gi, '')
  out = out.replace(/\(please note[^)]*\)/gi, '')

  return out.trim()
}

// ── Prompt builders ────────────────────────────────────────────────────────────

type FieldType = 'meta.title' | 'meta.description' | 'meta.ogTitle' | 'meta.ogDescription' | 'seo.llmsEntry'

function buildPrompt(field: FieldType, doc: Record<string, any>, collectionSlug: string): string {
  const title = doc.title ?? doc.name ?? ''
  const excerpt = doc.excerpt ?? doc.summary ?? ''
  const body = typeof doc.content === 'string' ? doc.content.slice(0, 400) : ''
  const context = [title, excerpt, body].filter(Boolean).join('\n').slice(0, 500)

  const collectionLabel: Record<string, string> = {
    pages: 'web page', posts: 'blog post', portfolio: 'portfolio case study', 'job-vacancies': 'job listing',
  }
  const type = collectionLabel[collectionSlug] ?? 'page'

  switch (field) {
    case 'meta.title':
      return `Write an SEO meta title for this ${type}. Requirements: 50–60 characters, include the primary topic naturally, no clickbait, no brand suffix. Return ONLY the title text, nothing else.\n\nContent:\n${context}`

    case 'meta.description':
      return `Write an SEO meta description for this ${type}. Requirements: 150–160 characters, summarise what the reader will get, include a natural call to action, conversational tone. Return ONLY the description text, nothing else.\n\nContent:\n${context}`

    case 'meta.ogTitle':
      return `Write a social media sharing title for this ${type}. Requirements: under 70 characters, punchy and specific, make someone want to click when they see it in a feed. Return ONLY the title text.\n\nContent:\n${context}`

    case 'meta.ogDescription':
      return `Write a social media sharing description for this ${type}. Requirements: under 200 characters, conversational tone as if a colleague is sharing it, specific detail beats generic benefit. Return ONLY the description text.\n\nContent:\n${context}`

    case 'seo.llmsEntry':
      return `Write a single plain-English sentence summarising this ${type} for AI assistants (ChatGPT, Perplexity, Claude). Requirements: one sentence, factual, describes what the page covers and who it is for, no marketing language. Return ONLY the sentence.\n\nContent:\n${context}`
  }
}

// ── Main export ────────────────────────────────────────────────────────────────

export async function generateSeoContent(opts: {
  field: FieldType
  doc: Record<string, any>
  collectionSlug: string
}): Promise<string> {
  const prompt = buildPrompt(opts.field, opts.doc, opts.collectionSlug)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as any).text)
    .join('')
    .trim()

  return humanize(raw)
}
