# Quote-Intro Block — Design Spec

**Date:** 2026-06-12
**Figma nodes:** 1400:11620 (quote), 1400:11625 (intro)

## Goal

Extend the `quote` advance block (commit a5f1294) into a combined `quote-intro` block that handles both:
- **Quote mode:** 24px/500 text with curly quote marks (existing behaviour)
- **Intro mode:** 30px/700 bold heading without quote marks (Figma node 1400:11625)

## Why extend rather than create new

The two designs share 100% of their layout: white bg, 96px padding, flex column centered, 24px gap, identical body text style. Only the heading size, weight, and quote marks differ. A single `quoteStyle` field makes one block do the work of two.

## Block identity

- **Block type:** `'quote-intro'` (renamed from `'quote'`)
- **Component:** `QuoteIntroSection.tsx` (renamed from `QuoteSection.tsx`)
- **Picker label:** `Quote / Intro`
- **Picker icon:** `💬`

## Fields

| Field | Key | Type | Default |
|-------|-----|------|---------|
| Style | `quoteStyle` | `'quote' \| 'intro'` | `'quote'` |
| Main Text | `quoteText` | string (textarea) | Mode-appropriate sample |
| Body Text | `quoteBody` | string (textarea) | Supporting description |

## Visual spec

### Shared (both modes)
```
Section
  background: #ffffff
  padding: 96px (all sides)
  display: flex; flex-direction: column; align-items: center; gap: 24px

Body text
  font-family: var(--font-work-sans, sans-serif)
  font-size: 16px; font-weight: 400; color: #4b5563
  text-align: center; max-width: 768px; line-height: 24px; margin: 0
```

### Quote mode (quoteStyle === 'quote' or undefined)
```
Main text
  font-size: 24px; font-weight: 500; color: #111827
  text-align: center; max-width: 896px; line-height: 40px; margin: 0
  wrapped in curly quotes: "…" (&ldquo;/&rdquo;)
```

### Intro mode (quoteStyle === 'intro')
```
Main text
  font-size: 30px; font-weight: 700; color: #111827
  text-align: center; max-width: 896px; line-height: 36px; margin: 0
  NO quote marks
```

### Mobile (≤767px)
- padding collapses to `40px 24px`
- font sizes and max-widths unchanged

## Default overrides

```ts
case 'quote-intro':
  content: {
    quoteStyle: 'quote',
    quoteText: 'I want to scale my IT team without high hiring costs.',
    quoteBody: 'We source and manage IT talent from Malaysia, Indonesia, and China...',
  }
```

## Pipeline (all 9 files from quote block, renamed)

1. `src/components/block/Advance/QuoteIntroSection.tsx` — RENAMED from QuoteSection.tsx
2. `src/components/block/Advance/index.ts` — update export
3. `src/components/block/index.ts` — update named export
4. `src/components/LayoutBuilder/types.ts` — `'quote'` → `'quote-intro'`; add `quoteStyle?`
5. `src/components/LayoutBuilder/utils/defaultOverrides.ts` — `case 'quote-intro'`
6. `src/components/LayoutBuilder/BlockPicker.tsx` — `'quote-intro'` key
7. `src/components/LayoutBuilder/fields/ContentFields.tsx` — `QuoteIntroFields` + Style dropdown
8. `src/components/LayoutBuilder/utils/previewResolver.tsx` — `case 'quote-intro'`
9. `src/lib/layout-renderer.tsx` — `case 'quote-intro'`
