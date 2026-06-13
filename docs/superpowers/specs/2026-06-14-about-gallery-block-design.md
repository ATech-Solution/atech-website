# About Gallery Block — Design Spec

**Date:** 2026-06-14
**Block type:** `about-gallery`
**Category:** Advance

---

## Purpose

A full-width "People" gallery section: a left featured team photo beside a multi-paragraph text column (hero zone), followed by a 10-image masonry photo grid below. Used on About pages to humanise the company with real team photos.

---

## Visual Design (Figma node 1418:11215)

### Section wrapper

| Property | Value |
|---|---|
| Background | `#4a4a4a` |
| Padding (vertical) | 96px top and bottom |
| Padding (horizontal) | 96px left and right (on inner container) |
| Max width | 1440px (centered inner container) |
| Layout | flex-col, gap 48px between hero zone and grid zone |

---

### Zone 1 — Hero split

Two equal columns, `gap: 64px`, `align-items: flex-start`.

**Left column:**

| Property | Value |
|---|---|
| flex | 1 |
| Height | 400px |
| Border-radius | 16px |
| Image | object-cover, overflow hidden |

**Right column:**

| Property | Value |
|---|---|
| flex | 1 |
| Layout | flex-col, justify-content: space-between (distributes 5 text blocks across 400px height) |
| Heading font | Work Sans Medium (500), 30px, line-height 36px, color `#ffd25e` |
| Body font | Work Sans Regular (400), 14px, line-height 22.75px, color `#e5e7eb` |
| Body paragraphs | 4 separate editable paragraphs (agBody1–agBody4) |

---

### Zone 2 — Masonry photo grid

4-column CSS grid, `gap: 16px`. Fixed 10-slot layout with explicit `grid-column` / `grid-row` placements:

| Slot | grid-column | grid-row | height |
|---|---|---|---|
| 1 | 1 | 1 | 160px |
| 2 | 2 | 1 | 160px |
| 3 | 3 / span 2 | 1 | 160px |
| 4 | 1 / span 2 | 2 | 192px |
| 5 | 3 | 2 | 192px |
| 6 | 4 | 2 | 192px |
| 7 | 1 | 3 | 160px |
| 8 | 2 | 3 | 160px |
| 9 | 3 / span 2 | 3 / span 2 | 336px (rows 3+4, 160+16+160) |
| 10 | 1 / span 2 | 4 | 160px |

Each cell: `border-radius: 12px`, `overflow: hidden`, image `object-cover` filling 100%.

---

## Content Fields

| Field key | Type | Default |
|---|---|---|
| `agHeroImage` | MediaRef \| null | null |
| `agHeading` | string | `'People is our greatest asset.'` |
| `agBody1` | string | `'Behind every successful project is a team that cares.'` |
| `agBody2` | string | paragraph 2 (see defaultOverrides) |
| `agBody3` | string | paragraph 3 (see defaultOverrides) |
| `agBody4` | string | paragraph 4 (see defaultOverrides) |
| `agGalleryImages` | Array<MediaRef \| null> (10 items) | 10 nulls |

---

## Architecture

### File to create

- `src/components/block/Advance/AboutGallerySection.tsx`

### Files to modify

| File | Change |
|---|---|
| `src/components/LayoutBuilder/types.ts` | Add `'about-gallery'` to ADVANCE_BLOCK_TYPES; add `ag*` fields |
| `src/components/LayoutBuilder/BlockPicker.tsx` | Icon `🖼` + label `'About Gallery'` |
| `src/components/LayoutBuilder/utils/defaultOverrides.ts` | Default content |
| `src/components/LayoutBuilder/fields/ContentFields.tsx` | Editor fields |
| `src/components/LayoutBuilder/utils/previewResolver.tsx` | Import + switch case |
| `src/components/block/Advance/index.ts` | Export |
| `src/components/block/index.ts` | Re-export |
| `src/lib/layout-renderer.tsx` | Import + switch case |

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| ≥ 1024px | Hero: 2-col side-by-side, Grid: 4-col masonry |
| < 1024px | Hero: 1-col stacked (image top, text below) |
| < 768px | Grid: 2-col (slots become 2-wide, heights scale down) |
| < 480px | Grid: 1-col, section padding 24px |

---

## Acceptance Criteria

1. Section renders with `#4a4a4a` background — matches Figma 1418:11215 screenshot.
2. Hero zone: left 400px image + right text with yellow heading and 4 light-grey paragraphs.
3. Grid zone: 10 masonry slots with correct column/row spans, all images object-cover with 12px radius.
4. All 7 text fields + hero image + 10 gallery image slots editable in properties panel.
5. TypeScript check passes with zero errors.
6. Block appears in picker as "About Gallery" with 🖼 icon.
7. Responsive: hero stacks at <1024px, grid collapses on mobile.
