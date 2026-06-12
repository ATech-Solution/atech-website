# Case Study Scroll Block — Design Spec

**Date:** 2026-06-12
**Figma nodes:** 1407:10752 (single row), 1410:11159 (3-item scroll stack)
**Reference:** https://bridge434.qodeinteractive.com/ (scroll animation style)

## Goal

A `case-study-scroll` advance block that renders a vertical stack of case study rows. Each row animates as it enters the viewport: the left image slides in from the top, the right content slides up from the bottom (split-direction entrance, bridge434 style). The yellow 4px left border fills in after they land. Configurable number of items via Layout Builder.

## Block Identity

- **Block type:** `'case-study-scroll'`
- **Component:** `CaseStudyScrollSection.tsx`
- **Picker label:** `Case Study — Scroll`
- **Picker icon:** `📜`

## Visual Layout (pixel-exact from Figma)

```
Section
  background: #ffffff
  padding: 80px 208px (desktop)
  padding: 40px 24px (mobile ≤767px)

  Per-item row (each case study):
    max-width: 1024px
    display: flex; flex-direction: row; align-items: center; gap: 64px
    margin: 0 auto
    padding-bottom: 80px (gap between items; last item no padding-bottom)

    Left column — image (flex-shrink: 0; width: 478.97px)
      display: flex; justify-content: flex-end; align-items: flex-start
      Image card:
        width: 400px; height: 400px
        border-radius: 16px
        overflow: hidden
        box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)
        background: #e5e7eb (fallback)
        <img> object-fit: cover; width: 100%; height: 100%

    Right column — content (flex: 1; padding-left: 32px; position: relative; gap: 15.4px)
      display: flex; flex-direction: column; gap: 15.4px

      Left border (absolute)
        position: absolute; left: 0; top: 0; bottom: 0; width: 4px
        background: #e5e7eb; border-radius: 2px
        Yellow fill (child):
          position: absolute; left: 0; width: 100%; top: 0
          background: #ffd25e; border-radius: 2px
          height: 0 → 100% (animated on scroll trigger)
          transition: height 0.5s ease-out 0.2s

      Client logo area (height: 64px; overflow: hidden)
        <img> max-height: 64px; width: auto; object-fit: contain

      Heading
        font-family: Work Sans; font-size: 36px; font-weight: 700
        line-height: 40px; color: #111827

      Body text
        font-family: Work Sans; font-size: 14px; font-weight: 400
        line-height: 22.75px; color: #4b5563
```

## Mobile Layout (≤767px)

```
Per-item row:
  flex-direction: column
  gap: 24px
  padding-bottom: 40px

Left column:
  width: 100%; justify-content: center
  Image card: width: 100%; height: 260px (not 400px square)

Right column:
  padding-left: 20px (smaller left border offset)
  Left border still shown
```

## Scroll-Trigger Animation

**Mechanism:** `IntersectionObserver` API, threshold `0.2` (20% of row visible), fires once per row.

**Desktop (≥768px):**

| Target | From | To | Duration | Easing | Delay |
|--------|------|-----|----------|--------|-------|
| Left image col | `translateY(-50px) opacity:0` | `translateY(0) opacity:1` | 0.75s | ease-out | 0s |
| Right content col | `translateY(50px) opacity:0` | `translateY(0) opacity:1` | 0.75s | ease-out | 0.12s |
| Yellow border fill | `height: 0` | `height: 100%` | 0.5s | ease-out | 0.2s |

**Mobile (≤767px):** Both image and content use `translateY(30px) opacity:0` → `translateY(0) opacity:1` (no split direction — simpler on narrow screens). Same timing.

**Initial CSS state:** `.css-row--hidden .css-image-col` and `.css-row--hidden .css-content-col` start invisible. JS removes `--hidden` class when IntersectionObserver fires, triggering CSS transitions.

**SSR safety:** Rows render visible by default (no JS = fully visible). JS adds `--hidden` class on mount before IntersectionObserver is set up, so there's no flash if JS loads.

## Block Fields

Fields live in `BlockOverrides.content` as an array. Each item:

```ts
interface CaseStudyScrollItem {
  cssImage?:      MediaRef | null  // 400×400 case photo
  cssClientLogo?: MediaRef | null  // client brand logo, max-height 64px
  cssHeading?:    string           // 36px bold heading
  cssBody?:       string           // 14px body paragraph
}

// In BlockOverrides.content:
caseScrollItems?: CaseStudyScrollItem[]
```

Default: 3 items with sample content.

## Pipeline Files (9 total)

1. `src/components/block/Advance/CaseStudyScrollSection.tsx` — NEW component
2. `src/components/block/Advance/index.ts` — add export
3. `src/components/block/index.ts` — add named export
4. `src/components/LayoutBuilder/types.ts` — add `'case-study-scroll'` + fields
5. `src/components/LayoutBuilder/utils/defaultOverrides.ts` — add `case 'case-study-scroll'`
6. `src/components/LayoutBuilder/BlockPicker.tsx` — add icon + label
7. `src/components/LayoutBuilder/fields/ContentFields.tsx` — add `CaseStudyScrollFields` + wire
8. `src/components/LayoutBuilder/utils/previewResolver.tsx` — add import + case
9. `src/lib/layout-renderer.tsx` — add import + case

## Spec Self-Review

- ✅ No TBDs or TODOs — all dimensions pulled from Figma exactly
- ✅ SSR safety handled: render-visible → JS adds hidden → IntersectionObserver removes it
- ✅ Mobile breakpoint defined with concrete dimensions
- ✅ Array field uses prefixed names (`cssImage`, `cssClientLogo`, etc.) to avoid collision with existing `clientLogo`/`caseImage` fields used by FeaturedCaseStudy
- ✅ Animation fires once — no re-trigger on scroll-back
- ✅ Scope is single block, single component file — appropriate for one plan
