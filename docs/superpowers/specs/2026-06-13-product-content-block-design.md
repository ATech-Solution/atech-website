# Product Content Block — Design Spec

**Date:** 2026-06-13  
**Block type:** `product-content`  
**Category:** Advance

---

## Purpose

A full-width section block for showcasing a single product with its heading, image, body description, and a CTA link. Users add multiple instances to a page — one per product — stacking them vertically. Each instance is independently styled via a dark/light theme toggle.

---

## Visual Design (Figma nodes)

| Item | Node | Theme |
|---|---|---|
| Product 1 — Knoco AI | 1417:10544 | dark |
| Product 2 — Teamtrics 2.0 | 1417:10558 | light |
| Product 3 — Onesik AI | 1417:10570 | dark |

### Layout — pixel-exact values

```
Section padding:  top/bottom 96px, left/right 208px (clamp to fluid on mobile)
Inner container:  max-width 1024px, full-width
Flex direction:   column
```

#### Elements (top → bottom)

| Element | Spec |
|---|---|
| Heading | Work Sans SemiBold, 30px, line-height 36px |
| Gap (heading → image) | 48px (dark/prod-1), 31.4px (light/prod-2, dark/prod-3) — use 32px unified |
| Image | width 100%, height 422px, border-radius 12px, object-fit: cover |
| Gap (image → body) | ~23px |
| Body text | Work Sans Regular, 14px, line-height 22.75px (1.625rem) |
| Gap (body → CTA) | ~23px |
| CTA button | border-radius 4px, padding: 10px 24px, font 14px SemiBold, gap 12px (text + arrow icon) |

### Theme variants

| Token | Dark | Light |
|---|---|---|
| Section background | `#2b2b2b` | `#ffffff` |
| Heading color | `#ffd25e` | `#111827` |
| Body text color | `#d1d5db` | `#4b5563` |
| Button background | `#ffffff` | `#2b2b2b` |
| Button text color | `#111827` | `#ffffff` |

### CTA button

- White rounded pill on dark; dark rounded pill on light
- Contains text label + right-arrow icon (SVG, 10.5×12px)
- `border-radius: 4px` (not fully rounded)

---

## Content Fields

| Field key | Type | Default |
|---|---|---|
| `pcTheme` | `'dark' \| 'light'` | `'dark'` |
| `pcTitle` | string | `'Product Name: Tagline'` |
| `pcImage` | MediaRef \| null | null |
| `pcBody` | string | `'Product description…'` |
| `pcCtaLabel` | string | `'Learn more'` |
| `pcCtaUrl` | string | `'#'` |

---

## Architecture

### Files to create

- `src/components/block/Advance/ProductContentSection.tsx` — the block component (self-contained CSS, no Tailwind dependency)

### Files to modify

| File | Change |
|---|---|
| `src/components/LayoutBuilder/types.ts` | Add `'product-content'` to `ADVANCE_BLOCK_TYPES`; add `pc*` fields to `BlockOverrides['content']` |
| `src/components/LayoutBuilder/BlockPicker.tsx` | Add icon `📦` and label `'Product Content'` |
| `src/components/LayoutBuilder/utils/defaultOverrides.ts` | Add `case 'product-content'` with dark theme defaults |
| `src/components/LayoutBuilder/fields/ContentFields.tsx` | Add editor fields for `pcTheme`, `pcTitle`, `pcImage`, `pcBody`, `pcCtaLabel`, `pcCtaUrl` |
| `src/components/LayoutBuilder/utils/previewResolver.tsx` | Add preview label returning `pcTitle` |
| `src/components/block/Advance/index.ts` | Export `ProductContentSection` |
| `src/components/block/index.ts` | Re-export |
| `src/lib/layout-renderer.tsx` | Import + switch case `'product-content'` |

---

## Component Structure

```tsx
// ProductContentSection.tsx
interface ProductContentSectionData {
  pcTheme?:    'dark' | 'light'
  pcTitle?:    string
  pcImage?:    MediaRef | null
  pcBody?:     string
  pcCtaLabel?: string
  pcCtaUrl?:   string
}
```

Self-contained CSS injected once via a `<style>` tag (same pattern as `CaseStudyScrollSection`). No Tailwind utility classes.

---

## Responsive behaviour

| Breakpoint | Horizontal padding |
|---|---|
| ≥ 1440px | 208px |
| ≥ 1024px | 80px |
| ≥ 768px | 40px |
| < 768px | 24px |

Image height stays fixed at 422px on desktop, collapses to `auto` (aspect-ratio 16/9) on mobile.

---

## Acceptance criteria

1. Dark theme instance matches Figma node 1417:10544 screenshot pixel-exactly.
2. Light theme instance matches Figma node 1417:10558 screenshot pixel-exactly.
3. Block appears in the Advance section of the block picker.
4. Content fields (title, image, body, CTA) are editable in the properties panel.
5. Theme toggle switches colors instantly in the preview.
6. Frontend renders correctly at 1440px, 1024px, 768px, 375px widths.
