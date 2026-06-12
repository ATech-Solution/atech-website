# Case Study Block — Design Spec

**Date:** 2026-06-12
**Figma nodes:** 1400:11665 (dark1/right), 1400:11677 (light/left), 1400:11689 (dark2/right)

## Goal

A single `case-study` advance block that covers all three Figma case study row variants — dark charcoal, white, and darker background — via a `csVariant` field and `imagePosition` toggle.

## Why a new block (not extending FeaturedCaseStudySection)

`FeaturedCaseStudySection` has section label, feature checklist, floating platform badge, and CTA button. The three Figma nodes are a simpler pattern: just accent heading + primary heading + body + logo + screenshot card. No overlap.

## Block identity

- **Block type:** `'case-study'`
- **Component:** `CaseStudySection.tsx`
- **Picker label:** `Case Study`
- **Picker icon:** `📋`

## Fields

| Field | Key | Type | Default |
|-------|-----|------|---------|
| Background Variant | `csVariant` | `'light' \| 'dark1' \| 'dark2'` | `'light'` |
| Image Position | `imagePosition` | `'left' \| 'right'` | `'right'` |
| Accent Heading | `headingAccent` | string | — |
| Accent First | `headingAccentFirst` | boolean | `false` |
| Main Heading | `headingPrimary` | string | — |
| Body Text | `body` | string | — |
| Client Logo | `clientLogo` | MediaRef \| null | null |
| Case Image | `caseImage` | MediaRef \| null | null |

## Variant color tokens

| Variant | Section bg | Accent color | Primary heading | Body color |
|---------|-----------|--------------|-----------------|------------|
| `light` | `#ffffff` | `#111827` | `#111827` | `#4b5563` |
| `dark1` | `#464646` | `#ffd15b` | `#ffffff` | `#e5e7eb` |
| `dark2` | `#2c2c2c` | `#ffd15b` | `#ffffff` | `#d1d5db` |

## Visual spec (pixel-exact from Figma)

```
Section
  padding: 80px 144px
  background: per variant

  Inner container
    max-width: 1152px
    display: flex; flex-direction: row; align-items: center; justify-content: space-between
    gap: 48px (between the two columns)

  Content column (flex: 1)
    display: flex; flex-direction: column; gap: 24px

    Heading (accent segment)
      font-size: 30px; font-weight: 700; line-height: 36px
      color: variant accent color
      rendered first if headingAccentFirst=true, last if false
      white-space: pre-wrap

    Heading (primary segment)
      font-size: 30px; font-weight: 700; line-height: 36px
      color: variant primary heading color
      white-space: pre-wrap

    Note: accent + primary rendered as one <h3> with two <span> blocks

    Body text
      font-size: 14px; font-weight: 400; line-height: 22.75px (1.625em)
      color: variant body color
      padding-bottom: 8px

    Client logo
      <img> max-height: 64px; width: auto; object-fit: contain

  Image column (flex: 1)
    justify-content: imagePosition === 'left' ? flex-start : flex-end

    Screenshot card
      width: 448px; height: 320px
      border-radius: 12px
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)
      overflow: hidden
      background: #e5e7eb (fallback)
      <img> fills card: width 100%; height 100%; object-fit: cover
```

## Column order

- `imagePosition === 'right'`: content col first, image col second
- `imagePosition === 'left'`: image col first, content col second

## Mobile (≤767px)

- Single column, flex-direction: column
- Padding: 40px 24px
- Image card: width 100%; height: 220px (content above, image below)
- Content always on top regardless of imagePosition

## Pipeline (9 files)

1. `src/components/block/Advance/CaseStudySection.tsx` — NEW component
2. `src/components/block/Advance/index.ts` — add export
3. `src/components/block/index.ts` — add named export
4. `src/components/LayoutBuilder/types.ts` — add `'case-study'` + fields
5. `src/components/LayoutBuilder/utils/defaultOverrides.ts` — add `case 'case-study'`
6. `src/components/LayoutBuilder/BlockPicker.tsx` — add icon + label
7. `src/components/LayoutBuilder/fields/ContentFields.tsx` — add `CaseStudyFields` + wire
8. `src/components/LayoutBuilder/utils/previewResolver.tsx` — add `case 'case-study'`
9. `src/lib/layout-renderer.tsx` — add import + `case 'case-study'`
