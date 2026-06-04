# Multilanguage AI Translation System — Design Spec

**Date:** 2026-05-22  
**Status:** Approved  
**Author:** brainstorming session  
**Extends:** [2026-05-21-multilanguage-plugin-design.md](./2026-05-21-multilanguage-plugin-design.md)

---

## Context

The multilanguage plugin (see prior spec) is live with English (`en`) and Traditional Chinese (`zh-hk`). The site needs to scale to 4 languages — adding **Simplified Chinese (`zh-cn`)** and **Indonesian (`id`)** — and needs AI-assisted translation so editors don't have to manually write content in all 4 languages.

Goals:
- Add zh-cn and id as first-class Payload locales
- Provide AI translation triggered from two admin surfaces (per-page sidebar + Translation Manager bulk)
- AI-translated content always saves as **Draft** — editor reviews before publishing
- Support all collections (Pages, Posts, Navigation, Portfolio, FAQs, Testimonials, Job Vacancies, Blocks) including Layout Builder pages with embedded blocks

---

## Language Configuration

| Code | Language | Status |
|------|----------|--------|
| `en` | English | Live (source) |
| `zh-hk` | Traditional Chinese / Cantonese | Live |
| `zh-cn` | Simplified Chinese | Add |
| `id` | Indonesian | Add |

**Slugs are shared across all locales.** `/en/about-us`, `/zh-cn/about-us`, `/id/about-us` all use the same slug value `about-us`. The locale prefix is handled by the middleware routing layer.

---

## Architecture

### Document-level Translation API

**Endpoint:** `POST /api/plugins/multilanguage/translate`

**Request:**
```json
{
  "collection": "pages",
  "id": "abc123",
  "targetLocales": ["zh-cn", "id"]
}
```

**Response:**
```json
{
  "success": true,
  "translated": { "zh-cn": "draft", "id": "draft" },
  "errors": {}
}
```

**Flow per target locale:**
1. Fetch full document in `locale: 'en'` via Payload local API
2. Pass document through `fieldExtractor` — recursively walk all fields, collect `{ fieldPath, type, value }` for every `text`, `textarea`, and `richText` field (including fields nested inside blocks, arrays, and groups)
3. Call Claude Sonnet 4.6 with a batch translation prompt: all extracted strings at once, translated to the target language
4. For `text`/`textarea` fields: map translated strings back to field paths
5. For `richText` (Lexical JSON) fields: walk the Lexical AST, replace every text node's `text` property with its translation, preserve all formatting marks, links, and structure
6. Call `payload.update({ collection, id, locale: targetLocale, data: translatedData, draft: true })`

**Overwrite rule:** Overwrite all fields unconditionally. Editors who want to preserve a manual translation should publish it before running AI translate.

### Field Extractor (`src/plugins/multilanguage/fieldExtractor.ts`)

Recursive function that walks a Payload document and returns an ordered list of translatable string segments:

```ts
type TranslatableField = {
  path: string        // dot-notation path, e.g. 'layout.1.content.heading'
  type: 'text' | 'textarea' | 'richtext-nodes'
  value: string | LexicalNode[]
}

function extractFields(doc: Record<string, unknown>, prefix?: string): TranslatableField[]
```

Handles:
- Top-level named fields
- `array` fields (iterate by index)
- `blocks` fields (polymorphic arrays — iterate by index, enter each block's fields)
- `group` fields (recurse into nested object)
- `richText` (Lexical JSON) — extract all leaf text nodes as a unit

Fields NOT extracted: `upload`, `relationship`, `checkbox`, `number`, `select`, `date`, `email`, `url`, `code`, `json`.

### Translation Prompt

Extend `src/features/aiContent/buildContentPrompt.ts` with a new `translate` action:

```ts
const LOCALE_NAMES = {
  'en':    'English',
  'zh-hk': 'Traditional Chinese (繁體中文)',
  'zh-cn': 'Simplified Chinese (简体中文)',
  'id':    'Bahasa Indonesia',
}
```

The translation prompt sends all extracted strings as a numbered JSON array and instructs Claude to return a matching numbered JSON array of translations. Using JSON array format ensures reliable field-to-index mapping without parsing issues.

System prompt for translation action:
```
You are a professional translator. Translate the provided strings from English to {targetLanguage}.
Rules:
- Preserve HTML tags, markdown formatting, and placeholders unchanged
- Maintain the same tone and register as the source
- Return ONLY a valid JSON array of translated strings, same length and order as input
- No explanations, no commentary
```

---

## Admin UX

### A — Per-page Translation Sidebar

A new React component added to all collection editors via Payload's `afterDocumentControls` hook (or as a custom sidebar field). Appears in the right sidebar of every document editor.

**Component:** `src/app/(payload)/admin/plugins/multilanguage/TranslationSidebar.tsx`

UI:
```
┌─ AI Translations ──────────────────────────────┐
│                                                │
│  zh-hk  Traditional Chinese    60% complete   │
│  zh-cn  Simplified Chinese      0% complete   │
│  id     Indonesian              0% complete   │
│                                                │
│  Translate to:                                 │
│  ☑ zh-hk   ☑ zh-cn   ☑ id                   │
│                                                │
│  [Translate Now]                               │
│                                                │
│  Status: —                                    │
└────────────────────────────────────────────────┘
```

After translation:
- Status line shows: "3 drafts saved — review before publishing"
- Each locale pill shows updated % (re-fetches from translation-status API)

### B — Translation Manager Bulk Action

Extends the existing Translation Manager view at `/admin/multilanguage/translations`.

UI additions to the existing table:
- Add checkbox column (leftmost)
- "Select All" checkbox in header
- "Translate Selected" button appears when ≥1 row is checked
- Target locale selector dropdown next to button (default: all non-100% locales)
- Per-row progress indicator replaces the [AI] button during translation: `Translating... → ✓ Draft saved → ✗ Error`

The bulk action calls the translate API sequentially (one document at a time) to avoid rate limits and allow per-row progress display.

---

## Collections Covered

All collections with localized fields are in scope:

| Collection | Notes |
|------------|-------|
| `pages` | Main CMS pages including Layout Builder pages |
| `posts` | Blog posts |
| `navigation` | Header menu items, footer columns, copyright text |
| `settings` | Site-wide global settings with localized text |
| `portfolio` | Portfolio items and categories |
| `faqs` / `faq_categories` | FAQ items and categories |
| `testimonials` | Testimonial content |
| `job_vacancies` | Job posting content |
| `blocks` | Reusable content blocks |

Layout Builder pages: when a page uses the Layout Builder, the embedded blocks' localized fields are included in the Payload fetch response (as `layout[n].fields...`). The field extractor recurses into these, so block content is translated alongside page-level fields.

---

## Data Migration

Adding zh-cn and id to `payload.config.ts` is **schema-free** — `_locale` is a plain TEXT column with no SQL constraint. New locale rows appear automatically when Payload saves content in that locale for the first time.

What does require a migration:
- Updating the `language_settings_active_locales` table to add zh-cn and id entries (so the Language Settings global shows them in the admin)

```ts
// src/migrations/YYYYMMDD_add_zh_cn_id_locales.ts
// Data-only migration: insert zh-cn and id into language_settings_active_locales
await db.run(sql`INSERT INTO language_settings_active_locales (code, label, enabled, ...) VALUES ('zh-cn', 'Simplified Chinese', 1, ...) ON CONFLICT DO NOTHING`)
await db.run(sql`INSERT INTO language_settings_active_locales (code, label, enabled, ...) VALUES ('id', 'Indonesian', 1, ...) ON CONFLICT DO NOTHING`)
```

The seed in `src/plugins/multilanguage/seed.ts` is also updated for fresh installs.

---

## Files to Create / Modify

| File | Change |
|------|--------|
| `src/payload.config.ts` | Add `zh-cn` and `id` to `localization.locales` |
| `src/app/(frontend)/[locale]/layout.tsx` | Add `zh-cn` and `id` to `generateStaticParams` fallback |
| `src/plugins/multilanguage/LanguageSettingsGlobal.ts` | Add zh-cn and id to `defaultValue` |
| `src/plugins/multilanguage/seed.ts` | Add zh-cn and id to seed `activeLocales` |
| `src/features/aiContent/buildContentPrompt.ts` | Add zh-cn and id language mapping; add `translate` action |
| `src/app/api/plugins/multilanguage/translate/route.ts` | **NEW** — translation API endpoint |
| `src/plugins/multilanguage/fieldExtractor.ts` | **NEW** — recursive field extractor |
| `src/app/(payload)/admin/plugins/multilanguage/TranslationSidebar.tsx` | **NEW** — per-page sidebar panel |
| `src/app/(payload)/admin/plugins/multilanguage/page.tsx` | Extend Translation Manager with bulk action UI |
| `src/migrations/YYYYMMDD_add_zh_cn_id_locales.ts` | **NEW** — locale infrastructure migration |
| `src/migrations/index.ts` | Register new migration |

---

## Verification Checklist

1. `npm run dev` starts without TypeScript errors
2. Admin → Language Settings: shows 4 active locales (en, zh-hk, zh-cn, id)
3. Frontend: `/zh-cn/` and `/id/` redirect or serve content (middleware)
4. Admin → Edit Homepage → AI Translations sidebar → "Translate Now" → 3 drafts created in Payload
5. Admin → Translation Manager → select 3 pages → "Translate Selected" → per-row "Draft saved" status
6. Admin → Edit Homepage → switch locale to zh-cn → translated text visible in fields (as draft)
7. Publish zh-cn draft → visit `/zh-cn/` → page renders in Simplified Chinese
8. Layout Builder page: `/zh-cn/services` — block text shows in Simplified Chinese, not English fallback
9. Indonesian → same checks for `/id/` routes
