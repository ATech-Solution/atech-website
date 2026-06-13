# About Content 2 Block — Design Spec

**Date:** 2026-06-14
**Block type:** `about-content-2`
**Category:** Advance

---

## Purpose

A three-zone "Mission, Vision & Values" section: centered section heading at the top, two side-by-side cards (Mission / Vision) in the middle, and a full-width yellow Values strip at the bottom. Used on About pages to communicate company identity and values.

---

## Visual Design (Figma node 1418:11161)

### Section wrapper

| Property | Value |
|---|---|
| Background | `#ffffff` (white) |
| Padding | 96px all sides |
| Layout | flex-col, gap 64px between the three zones |

---

### Zone 1 — Section heading

| Property | Value |
|---|---|
| Text | Editable, default "Our Mission & Vision" |
| Font | Work Sans Medium (500), 30px, line-height 36px |
| Color | `#111827` |
| Alignment | center |

---

### Zone 2 — Mission / Vision cards

2-column CSS grid, `gap: 32px`, each column `flex: 1 / minmax(0,1fr)`.

**Each card:**

| Property | Value |
|---|---|
| Background | `#f9fafb` |
| Padding | 40px |
| Border-radius | 16px |
| Layout | flex-col, gap 16px |

**Icon box (inside card):**

| Property | Value |
|---|---|
| Size | 48×48px |
| Background | `#363636` |
| Border-radius | 8px |
| Display | flex, align-items center, justify-content center |
| Icon image | user-uploaded MediaRef, rendered at 100% up to 24px |

**Card title:**

| Property | Value |
|---|---|
| Padding-top before title | 8px (pt-8px wrapper) |
| Font | Work Sans SemiBold (600), 20px, line-height 28px |
| Color | `#111827` |

**Card body:**

| Property | Value |
|---|---|
| Font | Work Sans Regular (400), 14px, line-height 22.75px |
| Color | `#6b7280` |

---

### Zone 3 — Values strip

| Property | Value |
|---|---|
| Background | `#ffd25e` |
| Padding | 40px |
| Border-radius | 16px |
| Layout | flex-col, gap 32px |

**Values heading:**

| Property | Value |
|---|---|
| Font | Work Sans SemiBold (600), 20px, line-height 28px |
| Color | `#111827` |
| Alignment | center |

**Values grid:**

| Property | Value |
|---|---|
| Layout | 4-column CSS grid, `gap: 32px` |
| Item layout | flex-col, align-items center |
| Icon | user-uploaded MediaRef, max 24px height |
| Title font | Work Sans SemiBold (600), 16px, line-height 24px, `#111827`, center |
| Desc font | Work Sans Regular (400), 12px, line-height 16px, `#1f2937`, center |
| Desc padding-top | 4px |

---

## Content Fields

| Field key | Type | Default |
|---|---|---|
| `ac2Heading` | string | `'Our Mission & Vision'` |
| `ac2MissionIcon` | MediaRef \| null | null |
| `ac2MissionTitle` | string | `'Our Mission'` |
| `ac2MissionBody` | string | mission text (see defaultOverrides) |
| `ac2VisionIcon` | MediaRef \| null | null |
| `ac2VisionTitle` | string | `'Our Vision'` |
| `ac2VisionBody` | string | vision text (see defaultOverrides) |
| `ac2ValuesHeading` | string | `'Our Values'` |
| `ac2Values` | Array<{ valueIcon, valueTitle, valueDesc }> | 4 items: Innovation, Integrity, Excellence, Collaboration |

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| ≥ 768px | 2-col Mission/Vision, 4-col Values |
| < 768px | 1-col Mission/Vision (stacked), 2×2 Values grid |
| < 480px | 1-col Mission/Vision, 1-col Values |

---

## Architecture

### File to create

- `src/components/block/Advance/AboutContent2Section.tsx`

### Files to modify

| File | Change |
|---|---|
| `src/components/LayoutBuilder/types.ts` | Add `'about-content-2'` to ADVANCE_BLOCK_TYPES; add `ac2*` fields |
| `src/components/LayoutBuilder/BlockPicker.tsx` | Icon `🎯` + label `'About Content 2'` |
| `src/components/LayoutBuilder/utils/defaultOverrides.ts` | Default content |
| `src/components/LayoutBuilder/fields/ContentFields.tsx` | Editor fields |
| `src/components/LayoutBuilder/utils/previewResolver.tsx` | Import + switch case |
| `src/components/block/Advance/index.ts` | Export |
| `src/components/block/index.ts` | Re-export |
| `src/lib/layout-renderer.tsx` | Import + switch case |

---

## Acceptance Criteria

1. Section renders with white bg, 96px padding, three stacked zones — matches Figma 1418:11161.
2. Mission/Vision cards have `#f9fafb` bg, `#363636` icon boxes, correct typography.
3. Values strip is `#ffd25e`, 4-col grid, correct small typography.
4. All fields editable in properties panel (heading, cards, values array).
5. TypeScript check passes with zero errors.
6. Block appears in picker as "About Content 2" with 🎯 icon.
7. Responsive: stacks correctly on mobile.
