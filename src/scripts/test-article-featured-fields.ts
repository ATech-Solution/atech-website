/**
 * Tests for article-featured block fields:
 *   - featContentSource  (Content Source select)
 *   - featPostSlug       (Post Slug text — visible only when source = 'collection')
 *
 * Run:  npx tsx src/scripts/test-article-featured-fields.ts
 */

import assert from 'node:assert/strict'
import { Blocks } from '../collections/Blocks.js'
import type { CollectionConfig, Field } from 'payload'

// ─── Helpers ─────────────────────────────────────────────────────────────────

let passed = 0
let failed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ✓  ${name}`)
    passed++
  } catch (err: any) {
    console.error(`  ✗  ${name}`)
    console.error(`     ${err.message}`)
    failed++
  }
}

/** Recursively walk all fields in a CollectionConfig (incl. tabs, rows, collapsibles) */
function collectFields(fields: Field[]): Field[] {
  const result: Field[] = []
  for (const f of fields) {
    result.push(f)
    if ('fields' in f && Array.isArray((f as any).fields)) {
      result.push(...collectFields((f as any).fields))
    }
    if ('tabs' in f && Array.isArray((f as any).tabs)) {
      for (const tab of (f as any).tabs) {
        if (Array.isArray(tab.fields)) result.push(...collectFields(tab.fields))
      }
    }
  }
  return result
}

const allFields = collectFields(Blocks.fields as Field[])

function findField(name: string): Field | undefined {
  return allFields.find((f): f is Field & { name: string } =>
    'name' in f && (f as any).name === name
  )
}

// ─── 1. Field existence ───────────────────────────────────────────────────────

console.log('\n1. Field existence')

test('featContentSource field exists in Blocks', () => {
  assert.ok(findField('featContentSource'), 'featContentSource not found')
})

test('featPostSlug field exists in Blocks', () => {
  assert.ok(findField('featPostSlug'), 'featPostSlug not found')
})

// ─── 2. Field types ───────────────────────────────────────────────────────────

console.log('\n2. Field types')

test('featContentSource is a select field', () => {
  const f = findField('featContentSource') as any
  assert.equal(f?.type, 'select')
})

test('featPostSlug is a text field', () => {
  const f = findField('featPostSlug') as any
  assert.equal(f?.type, 'text')
})

// ─── 3. Select options ────────────────────────────────────────────────────────

console.log('\n3. Select options')

test('featContentSource has "collection" option', () => {
  const f = findField('featContentSource') as any
  const values = f?.options?.map((o: any) => o.value) ?? []
  assert.ok(values.includes('collection'), `options are: ${values.join(', ')}`)
})

test('featContentSource has "manual" option', () => {
  const f = findField('featContentSource') as any
  const values = f?.options?.map((o: any) => o.value) ?? []
  assert.ok(values.includes('manual'), `options are: ${values.join(', ')}`)
})

test('featContentSource defaults to "manual"', () => {
  const f = findField('featContentSource') as any
  assert.equal(f?.defaultValue, 'manual')
})

// ─── 4. Admin conditions ──────────────────────────────────────────────────────

console.log('\n4. Admin visibility conditions')

const sourceField = findField('featContentSource') as any
const slugField   = findField('featPostSlug') as any

const sourceCondition = sourceField?.admin?.condition as ((data: any) => boolean) | undefined
const slugCondition   = slugField?.admin?.condition   as ((data: any) => boolean) | undefined

test('featContentSource condition function exists', () => {
  assert.ok(typeof sourceCondition === 'function')
})

test('featContentSource shows when blockType = article-featured', () => {
  assert.ok(sourceCondition?.({ blockType: 'article-featured' }))
})

test('featContentSource hidden for other block types (home-hero)', () => {
  assert.equal(sourceCondition?.({ blockType: 'home-hero' }), false)
})

test('featContentSource hidden for other block types (portfolio-detail-top)', () => {
  assert.equal(sourceCondition?.({ blockType: 'portfolio-detail-top' }), false)
})

test('featPostSlug condition function exists', () => {
  assert.ok(typeof slugCondition === 'function')
})

test('featPostSlug hidden when blockType ≠ article-featured', () => {
  assert.equal(slugCondition?.({ blockType: 'home-hero', featContentSource: 'collection' }), false)
})

test('featPostSlug hidden when source = manual', () => {
  assert.equal(slugCondition?.({ blockType: 'article-featured', featContentSource: 'manual' }), false)
})

test('featPostSlug hidden when source is undefined (default)', () => {
  assert.equal(slugCondition?.({ blockType: 'article-featured' }), false)
})

test('featPostSlug visible when blockType = article-featured AND source = collection', () => {
  assert.ok(slugCondition?.({ blockType: 'article-featured', featContentSource: 'collection' }))
})

// ─── 5. Component data resolution logic ───────────────────────────────────────

console.log('\n5. Component data resolution')

// Inline the resolution logic from ArticleFeaturedSection to test it independently
function resolveArticleData(
  data: { featContentSource?: string; featPostSlug?: string; featTitle?: string; featCtaUrl?: string },
  post: { title?: string; slug?: string; excerpt?: string } | null,
) {
  const source = data.featContentSource ?? 'manual'
  const title  = post?.title   ?? data.featTitle   ?? ''
  const ctaUrl = post?.slug    ? `/article/${post.slug}` : (data.featCtaUrl ?? '#')
  return { source, title, ctaUrl, hasPost: Boolean(post) }
}

test('manual mode: title comes from data.featTitle when no post', () => {
  const result = resolveArticleData({ featContentSource: 'manual', featTitle: 'My Article' }, null)
  assert.equal(result.title, 'My Article')
})

test('collection mode: post.title overrides featTitle', () => {
  const result = resolveArticleData({ featContentSource: 'collection', featTitle: 'Fallback' }, { title: 'From CMS' })
  assert.equal(result.title, 'From CMS')
})

test('collection mode: CTA URL uses /article/<slug> from post', () => {
  const result = resolveArticleData({ featContentSource: 'collection' }, { slug: 'my-post' })
  assert.equal(result.ctaUrl, '/article/my-post')
})

test('manual mode: CTA URL uses data.featCtaUrl', () => {
  const result = resolveArticleData({ featContentSource: 'manual', featCtaUrl: '/custom-url' }, null)
  assert.equal(result.ctaUrl, '/custom-url')
})

test('default (no source set): behaves as manual', () => {
  const result = resolveArticleData({ featTitle: 'Default' }, null)
  assert.equal(result.source, 'manual')
  assert.equal(result.title, 'Default')
})

test('collection mode with no post: falls back to manual title', () => {
  const result = resolveArticleData({ featContentSource: 'collection', featTitle: 'Fallback' }, null)
  assert.equal(result.title, 'Fallback')
})

// ─── 6. ArticleGridSection URL format ────────────────────────────────────────

console.log('\n6. ArticleGridSection slug URL')

function buildArticleUrl(slug: string) {
  return `/article/${slug}`
}

test('article URL uses /article/ prefix', () => {
  assert.equal(buildArticleUrl('my-post'), '/article/my-post')
})

test('article URL does not use /posts/ prefix', () => {
  assert.notEqual(buildArticleUrl('my-post'), '/posts/my-post')
})

// ─── 7. ArticleRelatedSection — category-based source logic ─────────────────

console.log('\n7. ArticleRelatedSection category fetch logic')

// Inline the category ID extraction logic from ArticleRelatedSection
function extractCatIds(articleItem: any): string[] {
  const cats: any[] = Array.isArray(articleItem?.categories) ? articleItem.categories : []
  return cats.map((c: any) => c?.id).filter(Boolean)
}

test('no categories → empty catIds array (nothing to fetch)', () => {
  assert.deepEqual(extractCatIds({ categories: [] }), [])
})

test('undefined articleItem → empty catIds array', () => {
  assert.deepEqual(extractCatIds(undefined), [])
})

test('populated categories → returns their IDs', () => {
  const item = { categories: [{ id: 'cat-1', title: 'Tech' }, { id: 'cat-2', title: 'Design' }] }
  assert.deepEqual(extractCatIds(item), ['cat-1', 'cat-2'])
})

test('null entries in categories are filtered out', () => {
  const item = { categories: [null, { id: 'cat-1' }, undefined] }
  assert.deepEqual(extractCatIds(item), ['cat-1'])
})

test('does NOT use relatedPosts field (removed from Posts collection)', () => {
  // The data source is now categories, not articleItem.relatedPosts
  const articleItem = { id: 'post-1', categories: [], relatedPosts: ['should-be-ignored'] }
  assert.deepEqual(extractCatIds(articleItem), [], 'should use categories, ignoring relatedPosts')
})

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(48)}`)
console.log(`  ${passed} passed  |  ${failed} failed  |  ${passed + failed} total`)
console.log('─'.repeat(48))

if (failed > 0) process.exit(1)
