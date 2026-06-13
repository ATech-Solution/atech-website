# About Content 1 Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an `about-content-1` advance block — a dark charcoal 2-column section with a bold yellow statement heading + body on the left and a rounded team photo on the right — wired end-to-end from layout builder to frontend renderer.

**Architecture:** Single new block type `about-content-1` following the same self-contained CSS-in-JS (`<style>` injection) pattern as `ProductContentSection` and `PortfolioContentSection`. Fixed dark theme, text always left, image always right. No server component needed.

**Tech Stack:** Next.js 14 App Router, TypeScript, self-contained CSS via `<style>` tag, Work Sans font via CSS variable.

---

### Task 1: Create the Advance block component

**Files:**
- Create: `src/components/block/Advance/AboutContent1Section.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useEffect } from 'react'

interface MediaRef { url: string; alt?: string }

export interface AboutContent1SectionData {
  ac1Heading?: string
  ac1Body?:    string
  ac1Image?:   MediaRef | null
}

const CSS = `
  .ac1s {
    box-sizing: border-box;
    background: #363636;
    padding: 96px;
  }

  .ac1s__inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 64px;
    width: 100%;
  }

  .ac1s__text-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
    min-width: 0;
    padding-bottom: 24px;
  }

  .ac1s__heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 500;
    font-size: 36px;
    line-height: 40px;
    color: #ffd25e;
    margin: 0;
    word-break: break-word;
  }

  .ac1s__body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 14px;
    line-height: 22.75px;
    color: #d1d5db;
    margin: 0;
  }

  .ac1s__image-col {
    flex: 1;
    min-width: 0;
  }

  .ac1s__image-wrap {
    width: 100%;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }

  .ac1s__image-wrap img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .ac1s__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #4a4a4a;
    color: #6b7280;
    font-size: 14px;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
  }

  @media (max-width: 1023px) {
    .ac1s__inner { flex-direction: column; }
    .ac1s__text-col { padding-bottom: 0; }
  }

  @media (max-width: 767px) {
    .ac1s { padding: 64px 24px; }
    .ac1s__image-wrap { height: 280px; }
  }
`

let injected = false

export default function AboutContent1Section({ data }: { data: AboutContent1SectionData }) {
  const heading = data.ac1Heading ?? ''
  const body    = data.ac1Body    ?? ''
  const image   = data.ac1Image   ?? null

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <section className="ac1s">
      <div className="ac1s__inner">
        <div className="ac1s__text-col">
          {heading && <h2 className="ac1s__heading">{heading}</h2>}
          {body    && <p  className="ac1s__body">{body}</p>}
        </div>
        <div className="ac1s__image-col">
          <div className="ac1s__image-wrap">
            {image?.url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={image.url} alt={image.alt ?? heading} />
              : <div className="ac1s__image-placeholder">No image selected</div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify file created**

```bash
ls src/components/block/Advance/AboutContent1Section.tsx
```

Expected: file listed with no error.

---

### Task 2: Register block type in types.ts + BlockPicker

**Files:**
- Modify: `src/components/LayoutBuilder/types.ts`
- Modify: `src/components/LayoutBuilder/BlockPicker.tsx`

- [ ] **Step 1: Add `'about-content-1'` to ADVANCE_BLOCK_TYPES in types.ts**

Find:
```ts
  'portfolio-content',
] as const
```
Change to:
```ts
  'portfolio-content',
  'about-content-1',
] as const
```

- [ ] **Step 2: Add `ac1*` content fields to BlockOverrides in types.ts**

Find:
```ts
    // ── Portfolio Content ─────────────────────────────────────────────────────
    pfTheme?:         'light' | 'dark'
```
Insert before it:
```ts
    // ── About Content 1 ──────────────────────────────────────────────────────
    ac1Heading?: string
    ac1Body?:    string
    ac1Image?:   MediaRef | null

```

- [ ] **Step 3: Add icon to BlockPicker**

Find:
```ts
  'portfolio-content': '🗂',
}
```
Change to:
```ts
  'portfolio-content': '🗂',
  'about-content-1': '💡',
}
```

- [ ] **Step 4: Add label to BlockPicker**

Find:
```ts
  'portfolio-content': 'Portfolio Content',
```
Change to:
```ts
  'portfolio-content': 'Portfolio Content',
  'about-content-1': 'About Content 1',
```

---

### Task 3: Default overrides + ContentFields + previewResolver

**Files:**
- Modify: `src/components/LayoutBuilder/utils/defaultOverrides.ts`
- Modify: `src/components/LayoutBuilder/fields/ContentFields.tsx`
- Modify: `src/components/LayoutBuilder/utils/previewResolver.tsx`

- [ ] **Step 1: Add default overrides**

Find in `defaultOverrides.ts`:
```ts
    case 'portfolio-content':
      return {
```
Insert before it:
```ts
    case 'about-content-1':
      return {
        content: {
          ac1Heading: 'Most tech projects fail. Not because of bad ideas, but the wrong team.',
          ac1Body:    'We started ATech because we saw too many good businesses stuck, waiting on slow agencies, burning money on the wrong hires, shipping products that didn\'t fit the market. We do it differently. One team. Software, AI, talent, and strategy, working together from Hong Kong, with roots across Malaysia and Indonesia. Built for Asian businesses. Trusted by global brands.',
        },
      }

```

- [ ] **Step 2: Add ContentFields function**

Find in `ContentFields.tsx`:
```ts
// ── Portfolio Content fields ──────────────────────────────────────────────────
function PortfolioContentFields
```
Insert before it:
```ts
// ── About Content 1 fields ────────────────────────────────────────────────────
function AboutContent1Fields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Heading">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.ac1Heading ?? ''} onChange={(e) => set('ac1Heading', e.target.value)} placeholder="Bold statement heading..." />
      </Field>
      <Field label="Body Text">
        <textarea className="lb-input lb-input--textarea" rows={5} value={ov.ac1Body ?? ''} onChange={(e) => set('ac1Body', e.target.value)} placeholder="About body paragraph..." />
      </Field>
      <MediaField label="Team Photo" value={ov.ac1Image?.url ?? ''} onChange={(ref) => set('ac1Image', ref)} />
    </>
  )
}

```

- [ ] **Step 3: Register ContentFields in the render switch**

Find:
```ts
        {blockType === 'portfolio-content'      && <PortfolioContentFields    ov={ov} set={set} />}
```
Add after it:
```ts
        {blockType === 'about-content-1'        && <AboutContent1Fields       ov={ov} set={set} />}
```

- [ ] **Step 4: Import + add previewResolver switch case**

Find in `previewResolver.tsx`:
```ts
  PortfolioContentSection,
} from '@/components/block'
```
Change to:
```ts
  PortfolioContentSection,
  AboutContent1Section,
} from '@/components/block'
```

Find:
```ts
    case 'portfolio-content':
      return withStyle(<PortfolioContentSection data={data as any} />, blockStyle)
```
Add after it:
```ts
    case 'about-content-1':
      return withStyle(<AboutContent1Section data={data as any} />, blockStyle)
```

---

### Task 4: Export from index files + wire layout-renderer

**Files:**
- Modify: `src/components/block/Advance/index.ts`
- Modify: `src/components/block/index.ts`
- Modify: `src/lib/layout-renderer.tsx`

- [ ] **Step 1: Export from Advance/index.ts**

Find:
```ts
export { default as PortfolioContentSection           } from './PortfolioContentSection'
```
Add after it:
```ts
export { default as AboutContent1Section              } from './AboutContent1Section'
```

- [ ] **Step 2: Re-export from block/index.ts**

Find:
```ts
  PortfolioContentSection,
} from './Advance'
```
Change to:
```ts
  PortfolioContentSection,
  AboutContent1Section,
} from './Advance'
```

- [ ] **Step 3: Import in layout-renderer.tsx**

Find:
```ts
  PortfolioContentSection,
  DynamicFormSection,
```
Change to:
```ts
  PortfolioContentSection,
  AboutContent1Section,
  DynamicFormSection,
```

- [ ] **Step 4: Add switch case in layout-renderer.tsx**

Find:
```ts
    case 'portfolio-content':
      return wrapAdvanced(<PortfolioContentSection data={data} />)
```
Add after it:
```ts
    case 'about-content-1':
      return wrapAdvanced(<AboutContent1Section data={data} />)
```

---

### Task 5: Build check and commit

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -40
```

Expected: no output (zero errors).

- [ ] **Step 2: Commit**

```bash
git add \
  src/components/block/Advance/AboutContent1Section.tsx \
  src/components/block/Advance/index.ts \
  src/components/block/index.ts \
  src/components/LayoutBuilder/types.ts \
  src/components/LayoutBuilder/BlockPicker.tsx \
  src/components/LayoutBuilder/utils/defaultOverrides.ts \
  src/components/LayoutBuilder/fields/ContentFields.tsx \
  src/components/LayoutBuilder/utils/previewResolver.tsx \
  src/lib/layout-renderer.tsx \
  docs/superpowers/plans/2026-06-13-about-content-1-block.md
git commit -m "feat(about-content-1): add about-content-1 advance block — dark 2-col heading + team photo"
```
