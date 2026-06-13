# Portfolio Content Block — Design Spec

**Date:** 2026-06-13  
**Block type:** `portfolio-content`  
**Category:** Advance

---

## Purpose

A full-width 2-column split section for showcasing a portfolio project. Left column holds either the brand text stack (logo → heading → body) or a desktop mockup image, right column holds the other. Users add multiple instances per page — one per project — stacking them vertically with alternating themes and image positions.

---

## Visual Design (Figma nodes)

| Item | Node | Theme | Image side |
|---|---|---|---|
| SVVAP — Digital Payment | 1393:11596 | light (yellow) | right |
| Annatto — AI-powered Business Plan | 1393:11610 | dark | left |

### Layout — pixel-exact values

```
Section padding: py 96px, px 120px
Inner container: max-width 1200px, px 40px
Flex row:        space-between, align-items center
Column widths:   flex: 1 each (equal halves)
Column gap:      space-between (implied by padding within max-w container)
```

### Text column (top → bottom)

| Element | Spec |
|---|---|
| Logo image | height auto, max-width 160px (light) / 138px (dark); object-contain |
| Gap (logo → heading) | 32px |
| Heading | Work Sans Bold, 36px, line-height 40px |
| Body text | Work Sans Regular, 16px, line-height 26px, max-width 448px |
| All gaps | 32px |

### Image column

| Element | Spec |
|---|---|
| Mockup image | max-width 600px, height auto ≈ 486–528px, object-contain |
| Alignment | flex-end (pushed to far side of column) |

### Theme variants

| Token | Light (yellow) | Dark |
|---|---|---|
| Section background | `#ffd15b` | `#4a4a4a` |
| Heading color | `#111827` | `#ffd15b` |
| Body text color | `#1f2937` | `#ffffff` |

---

## Content Fields

| Field key | Type | Default |
|---|---|---|
| `pfTheme` | `'light' \| 'dark'` | `'light'` |
| `pfImagePosition` | `'left' \| 'right'` | `'right'` |
| `pfLogo` | MediaRef \| null | null |
| `pfHeading` | string | `'Project Name: Tagline'` |
| `pfBody` | string | `'Describe the project and the problem it solves.'` |
| `pfMockup` | MediaRef \| null | null |

---

## Architecture

### Files to create

- `src/components/block/Advance/PortfolioContentSection.tsx`

### Files to modify

| File | Change |
|---|---|
| `src/components/LayoutBuilder/types.ts` | Add `'portfolio-content'` to ADVANCE_BLOCK_TYPES; add `pf*` fields |
| `src/components/LayoutBuilder/BlockPicker.tsx` | Icon `🗂` + label `'Portfolio Content'` |
| `src/components/LayoutBuilder/utils/defaultOverrides.ts` | Default light theme, image right |
| `src/components/LayoutBuilder/fields/ContentFields.tsx` | Editor fields |
| `src/components/LayoutBuilder/utils/previewResolver.tsx` | Preview entry |
| `src/components/block/Advance/index.ts` | Export |
| `src/components/block/index.ts` | Re-export |
| `src/lib/layout-renderer.tsx` | Switch case |

---

## Responsive behaviour

| Breakpoint | Layout |
|---|---|
| ≥ 1024px | Two columns side by side |
| < 1024px | Stack: text column on top, image below (regardless of imagePosition) |
| < 768px | Padding collapses to 24px; image max-width 100% |

---

## Acceptance criteria

1. Light (yellow) instance matches Figma node 1393:11596 pixel-exactly.
2. Dark instance matches Figma node 1393:11610 pixel-exactly.
3. `pfImagePosition: 'left'` puts mockup on the left, text on the right.
4. Block appears in the Advance section of the block picker under "Portfolio Content".
5. All six content fields are editable in the properties panel.
6. Frontend renders at 1440px, 1024px, 768px, 375px — stacks correctly on mobile.
