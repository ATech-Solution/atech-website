# About Content 1 Block — Design Spec

**Date:** 2026-06-13  
**Block type:** `about-content-1`  
**Category:** Advance

---

## Purpose

A full-width 2-column "about" statement section: a bold heading + body paragraph on the left, a team photo on the right. Fixed single dark theme. Used on About pages to make a strong opening statement about company mission/differentiation.

---

## Visual Design (Figma node 1418:11151)

### Layout — pixel-exact values

```
Section background: #363636
Section padding:    96px all sides
Inner container:    full width, flex-row, gap 64px, align-items center
Column widths:      flex: 1 each (equal halves)
```

### Left column (text)

| Element | Spec |
|---|---|
| Heading | Work Sans Medium (`font-weight: 500`), 36px, line-height 40px, color `#ffd25e` |
| Gap (heading → body) | 24px |
| Body text | Work Sans Regular, 14px, line-height 22.75px, color `#d1d5db` |
| Column bottom padding | 24px |

### Right column (image)

| Element | Spec |
|---|---|
| Image container | width 100%, height 400px, border-radius 16px, overflow hidden |
| Image | object-fit: cover, fills container |
| Placeholder | shown when no image selected |

---

## Content Fields

| Field key | Type | Default |
|---|---|---|
| `ac1Heading` | string | `'Most tech projects fail. Not because of bad ideas, but the wrong team.'` |
| `ac1Body` | string | `'We started ATech because we saw too many good businesses stuck...'` |
| `ac1Image` | MediaRef \| null | null |

---

## Architecture

### File to create

- `src/components/block/Advance/AboutContent1Section.tsx`

### Files to modify

| File | Change |
|---|---|
| `src/components/LayoutBuilder/types.ts` | Add `'about-content-1'` to ADVANCE_BLOCK_TYPES; add `ac1*` fields |
| `src/components/LayoutBuilder/BlockPicker.tsx` | Icon `💡` + label `'About Content 1'` |
| `src/components/LayoutBuilder/utils/defaultOverrides.ts` | Default content |
| `src/components/LayoutBuilder/fields/ContentFields.tsx` | Editor fields |
| `src/components/LayoutBuilder/utils/previewResolver.tsx` | Preview entry |
| `src/components/block/Advance/index.ts` | Export |
| `src/components/block/index.ts` | Re-export |
| `src/lib/layout-renderer.tsx` | Switch case |

---

## Responsive behaviour

| Breakpoint | Layout |
|---|---|
| ≥ 1024px | Two equal columns side by side, gap 64px |
| < 1024px | Stack: text top, image below |
| < 768px | Padding collapses to 24px |

---

## Acceptance criteria

1. Renders with `#363636` background, yellow heading, grey body — matches Figma 1418:11151 screenshot.
2. Image is 400px tall with 16px rounded corners and object-cover.
3. Block appears in Advance section of block picker as "About Content 1".
4. All three fields (heading, body, image) editable in properties panel.
5. TypeScript check passes.
6. Responsive: stacks on mobile.
