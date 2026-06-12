# Quote Block — Design Spec

**Date:** 2026-06-12
**Figma node:** 1400:11620

## Goal

Add a `quote` advance block to the layout builder. A minimal centered pull-quote section: one large quote text + one supporting body text. No author, no avatar, no carousel.

## Why a new block (not repurposing existing)

- `testimonial` (basic): uses `data.items` array with a multi-card grid — wrong data shape and wrong visual pattern.
- `testimonials` (advance): full carousel with avatar/rating/company — far too complex.
- Neither can be restyled without breaking existing usage or misrepresenting the block name semantically.

## Fields

| Field | Key | Type | Default |
|-------|-----|------|---------|
| Quote Text | `quoteText` | string (textarea) | `"I want to scale my IT team without high hiring costs."` |
| Body Text | `quoteBody` | string (textarea) | `We source and manage IT talent from Malaysia, Indonesia, and China, trained professionals who slot into your team and hit the ground running. You get the capacity. We handle the rest.` |

## Visual Spec (pixel-exact from Figma 1400:11620)

```
Section
  background: #ffffff
  padding: 96px (all sides)
  display: flex; flex-direction: column; align-items: center; gap: 24px

  Quote text (<p> or <blockquote>)
    font-family: var(--font-work-sans, sans-serif)
    font-size: 24px
    font-weight: 500
    color: #111827
    text-align: center
    max-width: 896px
    line-height: 40px
    content wrapped in curly quotes: "…"

  Body text (<p>)
    font-family: var(--font-work-sans, sans-serif)
    font-size: 16px
    font-weight: 400
    color: #4b5563
    text-align: center
    max-width: 768px
    line-height: 24px
```

## Mobile (≤767px)

- padding collapses to `40px 24px`
- max-width constraints remain (they're narrower than viewport anyway → width: 100%)
- font sizes unchanged

## Pipeline (6 files)

1. `src/components/block/Advance/QuoteSection.tsx` — NEW component
2. `src/components/block/Advance/index.ts` — export
3. `src/components/block/index.ts` — named export
4. `src/components/LayoutBuilder/types.ts` — add `'quote'` to ADVANCE_BLOCK_TYPES; add `quoteText?`, `quoteBody?` to BlockOverrides.content
5. `src/components/LayoutBuilder/utils/defaultOverrides.ts` — `case 'quote'` with sample text
6. `src/components/LayoutBuilder/BlockPicker.tsx` — icon `'💬'` + label `'Quote'`
7. `src/components/LayoutBuilder/fields/ContentFields.tsx` — `QuoteFields` component + wire
8. `src/components/LayoutBuilder/utils/previewResolver.tsx` — `case 'quote'`
9. `src/lib/layout-renderer.tsx` — `case 'quote'`
