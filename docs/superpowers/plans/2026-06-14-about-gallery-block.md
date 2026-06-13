# About Gallery Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an `about-gallery` advance block — dark `#4a4a4a` section with a 2-col hero (400px team photo + yellow-heading text column) above a 10-slot masonry photo grid — wired end-to-end from layout builder to frontend renderer.

**Architecture:** Single `AboutGallerySection` component using the same self-contained CSS injection pattern (`let injected = false`) as other Advance blocks. The masonry grid uses explicit CSS `grid-column` / `grid-row` placements for the 10 fixed slots. Text column uses `justify-content: space-between` to distribute paragraphs across 400px height matching Figma.

**Tech Stack:** Next.js 14 App Router, TypeScript, self-contained CSS via `<style>` tag injection, Work Sans via CSS variable.

---

### Task 1: Create the Advance block component

**Files:**
- Create: `src/components/block/Advance/AboutGallerySection.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useEffect } from 'react'

interface MediaRef { url: string; alt?: string }

export interface AboutGallerySectionData {
  agHeroImage?:      MediaRef | null
  agHeading?:        string
  agBody1?:          string
  agBody2?:          string
  agBody3?:          string
  agBody4?:          string
  agGalleryImages?:  (MediaRef | null)[]
}

const CSS = `
  .agallery {
    box-sizing: border-box;
    background: #4a4a4a;
    padding: 96px;
    display: flex;
    flex-direction: column;
    gap: 48px;
    width: 100%;
  }

  /* ── Zone 1: Hero split ──────────────────────────────────────────────── */
  .agallery__hero {
    display: flex;
    flex-direction: row;
    gap: 64px;
    align-items: flex-start;
    width: 100%;
  }

  .agallery__hero-image-col {
    flex: 1;
    min-width: 0;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }

  .agallery__hero-image-col img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .agallery__hero-image-placeholder {
    width: 100%;
    height: 100%;
    background: #5a5a5a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 14px;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
  }

  .agallery__hero-text-col {
    flex: 1;
    min-width: 0;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .agallery__heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 500;
    font-size: 30px;
    line-height: 36px;
    color: #ffd25e;
    margin: 0;
  }

  .agallery__body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 14px;
    line-height: 22.75px;
    color: #e5e7eb;
    margin: 0;
  }

  /* ── Zone 2: Masonry grid ─────────────────────────────────────────────── */
  .agallery__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    width: 100%;
  }

  /* Shared cell styles */
  .agallery__cell {
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    background: #5a5a5a;
  }

  .agallery__cell img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Fixed slot placements */
  .agallery__cell--1  { grid-column: 1;          grid-row: 1; height: 160px; }
  .agallery__cell--2  { grid-column: 2;          grid-row: 1; height: 160px; }
  .agallery__cell--3  { grid-column: 3 / span 2; grid-row: 1; height: 160px; }
  .agallery__cell--4  { grid-column: 1 / span 2; grid-row: 2; height: 192px; }
  .agallery__cell--5  { grid-column: 3;          grid-row: 2; height: 192px; }
  .agallery__cell--6  { grid-column: 4;          grid-row: 2; height: 192px; }
  .agallery__cell--7  { grid-column: 1;          grid-row: 3; height: 160px; }
  .agallery__cell--8  { grid-column: 2;          grid-row: 3; height: 160px; }
  .agallery__cell--9  { grid-column: 3 / span 2; grid-row: 3 / span 2; height: 336px; }
  .agallery__cell--10 { grid-column: 1 / span 2; grid-row: 4; height: 160px; }

  /* ── Responsive ──────────────────────────────────────────────────────── */
  @media (max-width: 1023px) {
    .agallery__hero {
      flex-direction: column;
    }
    .agallery__hero-image-col {
      width: 100%;
      height: 300px;
    }
    .agallery__hero-text-col {
      height: auto;
      gap: 16px;
    }
  }

  @media (max-width: 767px) {
    .agallery__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .agallery__cell--1  { grid-column: 1;          grid-row: 1; height: 140px; }
    .agallery__cell--2  { grid-column: 2;          grid-row: 1; height: 140px; }
    .agallery__cell--3  { grid-column: 1 / span 2; grid-row: 2; height: 140px; }
    .agallery__cell--4  { grid-column: 1 / span 2; grid-row: 3; height: 160px; }
    .agallery__cell--5  { grid-column: 1;          grid-row: 4; height: 160px; }
    .agallery__cell--6  { grid-column: 2;          grid-row: 4; height: 160px; }
    .agallery__cell--7  { grid-column: 1;          grid-row: 5; height: 140px; }
    .agallery__cell--8  { grid-column: 2;          grid-row: 5; height: 140px; }
    .agallery__cell--9  { grid-column: 1 / span 2; grid-row: 6; height: 200px; }
    .agallery__cell--10 { grid-column: 1 / span 2; grid-row: 7; height: 140px; }
  }

  @media (max-width: 479px) {
    .agallery { padding: 64px 24px; }
    .agallery__grid { grid-template-columns: 1fr; }
    .agallery__cell--1,
    .agallery__cell--2,
    .agallery__cell--3,
    .agallery__cell--4,
    .agallery__cell--5,
    .agallery__cell--6,
    .agallery__cell--7,
    .agallery__cell--8,
    .agallery__cell--9,
    .agallery__cell--10 {
      grid-column: 1;
      grid-row: auto;
      height: 200px;
    }
  }
`

let injected = false

const SLOT_COUNT = 10

export default function AboutGallerySection({ data }: { data: AboutGallerySectionData }) {
  const heroImage    = data.agHeroImage      ?? null
  const heading      = data.agHeading        ?? ''
  const body1        = data.agBody1          ?? ''
  const body2        = data.agBody2          ?? ''
  const body3        = data.agBody3          ?? ''
  const body4        = data.agBody4          ?? ''
  const galleryImgs  = data.agGalleryImages  ?? []

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <section className="agallery">
      {/* Zone 1: Hero split */}
      <div className="agallery__hero">
        <div className="agallery__hero-image-col">
          {heroImage?.url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={heroImage.url} alt={heroImage.alt ?? heading} />
            : <div className="agallery__hero-image-placeholder">No image selected</div>
          }
        </div>
        <div className="agallery__hero-text-col">
          {heading && <h2 className="agallery__heading">{heading}</h2>}
          {body1   && <p  className="agallery__body">{body1}</p>}
          {body2   && <p  className="agallery__body">{body2}</p>}
          {body3   && <p  className="agallery__body">{body3}</p>}
          {body4   && <p  className="agallery__body">{body4}</p>}
        </div>
      </div>

      {/* Zone 2: Masonry grid */}
      <div className="agallery__grid">
        {Array.from({ length: SLOT_COUNT }).map((_, i) => {
          const img = galleryImgs[i] ?? null
          return (
            <div key={i} className={`agallery__cell agallery__cell--${i + 1}`}>
              {img?.url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={img.url} alt={img.alt ?? `Gallery photo ${i + 1}`} />
                : null
              }
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

---

### Task 2: Register block type + fields in types.ts

**Files:**
- Modify: `src/components/LayoutBuilder/types.ts`

- [ ] **Step 1: Add `'about-gallery'` to ADVANCE_BLOCK_TYPES**

Find:
```ts
  'about-content-2',
] as const
```
Change to:
```ts
  'about-content-2',
  'about-gallery',
] as const
```

- [ ] **Step 2: Add `ag*` content fields to BlockOverrides**

Find:
```ts
    // ── About Content 2 ──────────────────────────────────────────────────────
    ac2Heading?:       string
```
Insert before it:
```ts
    // ── About Gallery ────────────────────────────────────────────────────────
    agHeroImage?:     MediaRef | null
    agHeading?:       string
    agBody1?:         string
    agBody2?:         string
    agBody3?:         string
    agBody4?:         string
    agGalleryImages?: (MediaRef | null)[]

```

---

### Task 3: BlockPicker icon + label

**Files:**
- Modify: `src/components/LayoutBuilder/BlockPicker.tsx`

- [ ] **Step 1: Add icon**

Find:
```ts
  'about-content-2': '🎯',
}
```
Change to:
```ts
  'about-content-2': '🎯',
  'about-gallery': '🖼',
}
```

- [ ] **Step 2: Add label**

Find:
```ts
  'about-content-2': 'About Content 2',
```
Change to:
```ts
  'about-content-2': 'About Content 2',
  'about-gallery': 'About Gallery',
```

---

### Task 4: Default overrides

**Files:**
- Modify: `src/components/LayoutBuilder/utils/defaultOverrides.ts`

- [ ] **Step 1: Add case for `'about-gallery'`**

Find:
```ts
    case 'about-content-2':
      return {
```
Insert before it:
```ts
    case 'about-gallery':
      return {
        content: {
          agHeading: 'People is our greatest asset.',
          agBody1:   'Behind every successful project is a team that cares.',
          agBody2:   'At ATech, we believe technology is built by people, for people. While we deliver software, AI, QA, and digital solutions, our greatest strength is the people behind them.',
          agBody3:   'Beyond work, our culture is shaped through shared experiences, from industry events and client meetings to company gatherings and team celebrations. These moments reflect the collaboration, passion, and connections that drive us forward.',
          agBody4:   'The photos below offer a glimpse into the people behind ATech, because great technology starts with great people.',
          agGalleryImages: Array.from({ length: 10 }, () => null),
        },
      }

```

---

### Task 5: ContentFields editor UI

**Files:**
- Modify: `src/components/LayoutBuilder/fields/ContentFields.tsx`

- [ ] **Step 1: Add `AboutGalleryFields` component**

Find:
```ts
// ── About Content 2 fields ────────────────────────────────────────────────────
function AboutContent2Fields(
```
Insert before it:
```ts
// ── About Gallery fields ──────────────────────────────────────────────────────
function AboutGalleryFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const imgs: (MediaRef | null)[] = ov.agGalleryImages ?? Array.from({ length: 10 }, () => null)

  const setImg = (i: number, ref: MediaRef | null) => {
    const next = [...imgs]
    next[i] = ref
    set('agGalleryImages', next)
  }

  return (
    <>
      <MediaField label="Hero Image (left)" value={ov.agHeroImage?.url ?? ''} onChange={(ref) => set('agHeroImage', ref)} />
      <Field label="Heading">
        <input className="lb-input" value={ov.agHeading ?? ''} onChange={(e) => set('agHeading', e.target.value)} placeholder="People is our greatest asset." />
      </Field>
      <Field label="Body 1 (intro line)">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.agBody1 ?? ''} onChange={(e) => set('agBody1', e.target.value)} placeholder="Short intro sentence..." />
      </Field>
      <Field label="Body 2">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.agBody2 ?? ''} onChange={(e) => set('agBody2', e.target.value)} placeholder="Paragraph 2..." />
      </Field>
      <Field label="Body 3">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.agBody3 ?? ''} onChange={(e) => set('agBody3', e.target.value)} placeholder="Paragraph 3..." />
      </Field>
      <Field label="Body 4 (closing)">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.agBody4 ?? ''} onChange={(e) => set('agBody4', e.target.value)} placeholder="Closing line..." />
      </Field>
      <Field label="— Gallery Photos —"><span /></Field>
      {Array.from({ length: 10 }).map((_, i) => (
        <MediaField
          key={i}
          label={`Photo ${i + 1}${[2,3,9,4,10].includes(i+1) ? (i+1===9 ? ' (wide+tall)' : ' (wide)') : ''}`}
          value={imgs[i]?.url ?? ''}
          onChange={(ref) => setImg(i, ref)}
        />
      ))}
    </>
  )
}

```

- [ ] **Step 2: Register in the render switch**

Find:
```ts
        {blockType === 'about-content-2'        && <AboutContent2Fields       ov={ov} set={set} />}
```
Add after it:
```ts
        {blockType === 'about-gallery'           && <AboutGalleryFields        ov={ov} set={set} />}
```

---

### Task 6: previewResolver

**Files:**
- Modify: `src/components/LayoutBuilder/utils/previewResolver.tsx`

- [ ] **Step 1: Import component**

Find:
```ts
  AboutContent2Section,
} from '@/components/block'
```
Change to:
```ts
  AboutContent2Section,
  AboutGallerySection,
} from '@/components/block'
```

- [ ] **Step 2: Add switch case**

Find:
```ts
    case 'about-content-2':
      return withStyle(<AboutContent2Section data={data as any} />, blockStyle)
```
Add after it:
```ts
    case 'about-gallery':
      return withStyle(<AboutGallerySection data={data as any} />, blockStyle)
```

---

### Task 7: Export from index files + wire layout-renderer

**Files:**
- Modify: `src/components/block/Advance/index.ts`
- Modify: `src/components/block/index.ts`
- Modify: `src/lib/layout-renderer.tsx`

- [ ] **Step 1: Export from Advance/index.ts**

Find:
```ts
export { default as AboutContent2Section              } from './AboutContent2Section'
```
Add after it:
```ts
export { default as AboutGallerySection               } from './AboutGallerySection'
```

- [ ] **Step 2: Re-export from block/index.ts**

Find:
```ts
  AboutContent2Section,
} from './Advance'
```
Change to:
```ts
  AboutContent2Section,
  AboutGallerySection,
} from './Advance'
```

- [ ] **Step 3: Import in layout-renderer.tsx**

Find:
```ts
  AboutContent2Section,
  DynamicFormSection,
```
Change to:
```ts
  AboutContent2Section,
  AboutGallerySection,
  DynamicFormSection,
```

- [ ] **Step 4: Add switch case in layout-renderer.tsx**

Find:
```ts
    case 'about-content-2':
      return wrapAdvanced(<AboutContent2Section data={data} />)
```
Add after it:
```ts
    case 'about-gallery':
      return wrapAdvanced(<AboutGallerySection data={data} />)
```

---

### Task 8: Build check and commit

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -40
```

Expected: no output (zero errors).

- [ ] **Step 2: Commit**

```bash
git add \
  src/components/block/Advance/AboutGallerySection.tsx \
  src/components/block/Advance/index.ts \
  src/components/block/index.ts \
  src/components/LayoutBuilder/types.ts \
  src/components/LayoutBuilder/BlockPicker.tsx \
  src/components/LayoutBuilder/utils/defaultOverrides.ts \
  src/components/LayoutBuilder/fields/ContentFields.tsx \
  src/components/LayoutBuilder/utils/previewResolver.tsx \
  src/lib/layout-renderer.tsx \
  docs/superpowers/plans/2026-06-14-about-gallery-block.md
git commit -m "feat(about-gallery): add about-gallery advance block — team hero + 10-slot masonry grid"
```
