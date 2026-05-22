// Recursively extracts translatable string values from a Payload document.
// Returns an ordered list so indices can be used to map translations back.

export type ExtractedField = {
  path: string
  type: 'text' | 'richtext'
  value: string
}

const SKIP_KEYS = new Set([
  'id', '_id', 'slug', 'url', 'href', 'src', 'link', 'email',
  'type', 'blockType', 'status', 'role', 'color', 'icon', 'style',
  'createdAt', 'updatedAt', 'publishedAt', '_status', 'locale',
  '_locale', 'code', 'version', 'format', 'indent', 'direction',
  'relationTo', 'value', 'uploadedTo',
  // Non-localized fields — stored in the main collection table (shared across all locales).
  'breadcrumbs', 'parent', 'seoTopics',
  'isFrontpage', 'portfolioDetailTemplate', 'articleDetailTemplate',
  // Layout Builder block structural fields (not user-visible content)
  'blockStyle', 'advanced', 'templateSnapshot', 'blockId', 'blockTemplateName', 'order',
])

// UUID / numeric ID pattern — skip these strings
const ID_RE = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i

// Keys ending with these suffixes contain URLs, positions, or config flags — not user-visible text
const URL_KEY_RE = /(?:Url|Href|Embed|Src|Position|Pos|Source)$/i

function isLexical(v: unknown): v is { root: unknown } {
  return typeof v === 'object' && v !== null && 'root' in v
}

// Extract all text from Lexical nodes (returns flat string for translation)
function extractLexicalText(node: any): string[] {
  if (!node || typeof node !== 'object') return []
  const texts: string[] = []
  if (node.type === 'text' && typeof node.text === 'string' && node.text.trim()) {
    texts.push(node.text)
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      texts.push(...extractLexicalText(child))
    }
  }
  return texts
}

// Rebuild Lexical AST, replacing text nodes using a mutable index into `translations`
function applyLexicalTranslations(node: any, translations: string[], idx: { n: number }): any {
  if (!node || typeof node !== 'object') return node
  const result = { ...node }
  if (result.type === 'text' && typeof result.text === 'string' && result.text.trim()) {
    result.text = translations[idx.n] ?? result.text
    idx.n++
  }
  if (Array.isArray(result.children)) {
    result.children = result.children.map((c: any) => applyLexicalTranslations(c, translations, idx))
  }
  return result
}

export function extractFields(
  obj: Record<string, unknown>,
  prefix = '',
): ExtractedField[] {
  const result: ExtractedField[] = []

  for (const [key, val] of Object.entries(obj)) {
    if (SKIP_KEYS.has(key)) continue
    const path = prefix ? `${prefix}.${key}` : key

    if (typeof val === 'string') {
      if (!val.trim()) continue
      if (ID_RE.test(val)) continue
      if (URL_KEY_RE.test(key)) continue
      result.push({ path, type: 'text', value: val })
    } else if (isLexical(val)) {
      const texts = extractLexicalText((val as any).root)
      if (texts.length > 0) {
        // Store the full Lexical JSON + extracted texts together
        result.push({
          path,
          type: 'richtext',
          value: JSON.stringify({ lexical: val, texts }),
        })
      }
    } else if (Array.isArray(val)) {
      val.forEach((item, i) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          result.push(...extractFields(item as Record<string, unknown>, `${path}.${i}`))
        }
      })
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      result.push(...extractFields(val as Record<string, unknown>, path))
    }
  }

  return result
}

// Rebuild the document with translated values for the given extracted fields
export function applyTranslations(
  original: Record<string, unknown>,
  fields: ExtractedField[],
  translations: string[],
): Record<string, unknown> {
  const doc = structuredClone(original)

  fields.forEach((field, i) => {
    const translated = translations[i]
    if (!translated) return

    const segments = field.path.split('.')
    let cursor: any = doc

    for (let s = 0; s < segments.length - 1; s++) {
      const seg = segments[s]!
      if (cursor == null) return
      cursor = cursor[seg]
    }

    const lastKey = segments[segments.length - 1]!
    if (cursor == null || lastKey == null) return

    if (field.type === 'text') {
      cursor[lastKey] = translated
    } else if (field.type === 'richtext') {
      try {
        const { lexical, texts } = JSON.parse(field.value) as { lexical: any; texts: string[] }
        const translatedTexts = translated.split('\n__SPLIT__\n')
        const idx = { n: 0 }
        const newRoot = applyLexicalTranslations(lexical.root, translatedTexts, idx)
        cursor[lastKey] = { ...lexical, root: newRoot }
      } catch {
        // Keep original if rebuild fails
      }
    }
  })

  return doc
}
