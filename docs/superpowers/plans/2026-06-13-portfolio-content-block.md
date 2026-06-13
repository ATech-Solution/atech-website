# Portfolio Content Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `portfolio-content` advance block — a 2-column split section (text + mockup image) with light/dark theme and left/right image position toggle — wired end-to-end from layout builder to frontend renderer.

**Architecture:** Single new block type `portfolio-content` using the same self-contained CSS-in-JS pattern as `ProductContentSection`. Two equal flex columns; the `pfImagePosition` prop swaps which column renders text vs. image. No server component needed.

**Tech Stack:** Next.js 14 App Router, TypeScript, self-contained CSS (`<style>` injection), Work Sans font via CSS variable.

---

### Task 1: Create the Advance block component

**Files:**
- Create: `src/components/block/Advance/PortfolioContentSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useEffect } from 'react'

interface MediaRef { url: string; alt?: string }

export interface PortfolioContentSectionData {
  pfTheme?:         'light' | 'dark'
  pfImagePosition?: 'left' | 'right'
  pfLogo?:          MediaRef | null
  pfHeading?:       string
  pfBody?:          string
  pfMockup?:        MediaRef | null
}

const CSS = `
  .pfcs {
    box-sizing: border-box;
    padding: 96px 120px;
  }
  .pfcs--light { background: #ffd15b; }
  .pfcs--dark  { background: #4a4a4a; }

  .pfcs__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    min-height: 458px;
  }

  /* image-left: mockup col first, text col second */
  .pfcs__inner--img-left  { flex-direction: row; }
  .pfcs__inner--img-right { flex-direction: row-reverse; }

  .pfcs__text-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: flex-start;
    min-width: 0;
  }

  .pfcs__image-col {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
  }
  .pfcs__inner--img-left .pfcs__image-col {
    justify-content: flex-start;
  }

  .pfcs__logo {
    max-width: 160px;
    max-height: 94px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  .pfcs__logo-placeholder {
    width: 160px;
    height: 56px;
    background: rgba(0,0,0,0.1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: rgba(0,0,0,0.4);
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
  }

  .pfcs__heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 700;
    font-size: 36px;
    line-height: 40px;
    margin: 0;
    word-break: break-word;
  }
  .pfcs--light .pfcs__heading { color: #111827; }
  .pfcs--dark  .pfcs__heading { color: #ffd15b; }

  .pfcs__body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
    max-width: 448px;
    margin: 0;
  }
  .pfcs--light .pfcs__body { color: #1f2937; }
  .pfcs--dark  .pfcs__body { color: #ffffff; }

  .pfcs__mockup {
    width: 100%;
    max-width: 600px;
    height: auto;
    object-fit: contain;
    display: block;
  }
  .pfcs__mockup-placeholder {
    width: 100%;
    max-width: 600px;
    height: 460px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.08);
    border-radius: 8px;
    font-size: 14px;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    color: rgba(0,0,0,0.35);
  }

  @media (max-width: 1023px) {
    .pfcs__inner,
    .pfcs__inner--img-left,
    .pfcs__inner--img-right {
      flex-direction: column !important;
      min-height: unset;
    }
    .pfcs__image-col { justify-content: center; }
    .pfcs__mockup { max-width: 100%; }
  }

  @media (max-width: 767px) {
    .pfcs { padding: 64px 24px; }
    .pfcs__inner { padding: 0; gap: 32px; }
  }
`

let injected = false

export default function PortfolioContentSection({ data }: { data: PortfolioContentSectionData }) {
  const theme         = data.pfTheme         ?? 'light'
  const imagePosition = data.pfImagePosition ?? 'right'
  const logo          = data.pfLogo          ?? null
  const heading       = data.pfHeading       ?? ''
  const body          = data.pfBody          ?? ''
  const mockup        = data.pfMockup        ?? null

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  const innerClass = `pfcs__inner pfcs__inner--img-${imagePosition}`

  const textCol = (
    <div className="pfcs__text-col">
      {logo?.url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={logo.url} alt={logo.alt ?? heading} className="pfcs__logo" />
        : <div className="pfcs__logo-placeholder">No logo</div>
      }
      {heading && <h2 className="pfcs__heading">{heading}</h2>}
      {body    && <p  className="pfcs__body">{body}</p>}
    </div>
  )

  const imageCol = (
    <div className="pfcs__image-col">
      {mockup?.url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={mockup.url} alt={mockup.alt ?? heading} className="pfcs__mockup" />
        : <div className="pfcs__mockup-placeholder">No mockup image</div>
      }
    </div>
  )

  return (
    <section className={`pfcs pfcs--${theme}`}>
      <div className={innerClass}>
        {imagePosition === 'left'  && imageCol}
        {textCol}
        {imagePosition === 'right' && imageCol}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify file created**

```bash
ls src/components/block/Advance/PortfolioContentSection.tsx
```

Expected: file listed with no error.

---

### Task 2: Register block type in types.ts

**Files:**
- Modify: `src/components/LayoutBuilder/types.ts`

- [ ] **Step 1: Add `'portfolio-content'` to ADVANCE_BLOCK_TYPES**

Find:
```ts
  'product-content',
] as const
```
Change to:
```ts
  'product-content',
  'portfolio-content',
] as const
```

- [ ] **Step 2: Add content fields to BlockOverrides**

Find:
```ts
    // ── Product Content ───────────────────────────────────────────────────────
    pcTheme?:    'dark' | 'light'
```
Insert before it:
```ts
    // ── Portfolio Content ─────────────────────────────────────────────────────
    pfTheme?:         'light' | 'dark'
    pfImagePosition?: 'left' | 'right'
    pfLogo?:          MediaRef | null
    pfHeading?:       string
    pfBody?:          string
    pfMockup?:        MediaRef | null

```

---

### Task 3: Add to BlockPicker

**Files:**
- Modify: `src/components/LayoutBuilder/BlockPicker.tsx`

- [ ] **Step 1: Add icon**

Find:
```ts
  'product-content': '📦',
}
```
Change to:
```ts
  'product-content': '📦',
  'portfolio-content': '🗂',
}
```

- [ ] **Step 2: Add label**

Find:
```ts
  'product-content': 'Product Content',
```
Change to:
```ts
  'product-content': 'Product Content',
  'portfolio-content': 'Portfolio Content',
```

---

### Task 4: Add default overrides

**Files:**
- Modify: `src/components/LayoutBuilder/utils/defaultOverrides.ts`

- [ ] **Step 1: Add case**

Find:
```ts
    case 'product-content':
      return {
```
Insert before it:
```ts
    case 'portfolio-content':
      return {
        content: {
          pfTheme:         'light',
          pfImagePosition: 'right',
          pfHeading:       'Project Name: Tagline Here',
          pfBody:          'Describe the project and the business problem it solves for the client.',
        },
      }

```

---

### Task 5: Add ContentFields editor

**Files:**
- Modify: `src/components/LayoutBuilder/fields/ContentFields.tsx`

- [ ] **Step 1: Add field component function**

Find:
```ts
// ── Product Content fields ────────────────────────────────────────────────────
function ProductContentFields
```
Insert before it:
```ts
// ── Portfolio Content fields ──────────────────────────────────────────────────
function PortfolioContentFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Theme">
        <select className="lb-input lb-input--select" value={ov.pfTheme ?? 'light'} onChange={(e) => set('pfTheme', e.target.value)}>
          <option value="light">Light (yellow background)</option>
          <option value="dark">Dark (#4a4a4a background)</option>
        </select>
      </Field>
      <Field label="Image Position">
        <select className="lb-input lb-input--select" value={ov.pfImagePosition ?? 'right'} onChange={(e) => set('pfImagePosition', e.target.value)}>
          <option value="right">Right (text left, image right)</option>
          <option value="left">Left (image left, text right)</option>
        </select>
      </Field>
      <MediaField label="Brand Logo" value={ov.pfLogo?.url ?? ''} onChange={(ref) => set('pfLogo', ref)} />
      <Field label="Heading">
        <input className="lb-input" value={ov.pfHeading ?? ''} onChange={(e) => set('pfHeading', e.target.value)} placeholder="Project Name: Tagline" />
      </Field>
      <Field label="Body Text">
        <textarea className="lb-input lb-input--textarea" rows={4} value={ov.pfBody ?? ''} onChange={(e) => set('pfBody', e.target.value)} placeholder="Project description..." />
      </Field>
      <MediaField label="Mockup Image" value={ov.pfMockup?.url ?? ''} onChange={(ref) => set('pfMockup', ref)} />
    </>
  )
}

```

- [ ] **Step 2: Register in the render switch**

Find:
```ts
        {blockType === 'product-content'        && <ProductContentFields      ov={ov} set={set} />}
```
Change to:
```ts
        {blockType === 'product-content'        && <ProductContentFields      ov={ov} set={set} />}
        {blockType === 'portfolio-content'      && <PortfolioContentFields    ov={ov} set={set} />}
```

---

### Task 6: Add preview resolver entry

**Files:**
- Modify: `src/components/LayoutBuilder/utils/previewResolver.tsx`

- [ ] **Step 1: Import PortfolioContentSection**

Find:
```ts
  ProductContentSection,
} from '@/components/block'
```
Change to:
```ts
  ProductContentSection,
  PortfolioContentSection,
} from '@/components/block'
```

- [ ] **Step 2: Add switch case**

Find:
```ts
    case 'product-content':
      return withStyle(<ProductContentSection data={data as any} />, blockStyle)
```
Add after it:
```ts
    case 'portfolio-content':
      return withStyle(<PortfolioContentSection data={data as any} />, blockStyle)
```

---

### Task 7: Export from index files

**Files:**
- Modify: `src/components/block/Advance/index.ts`
- Modify: `src/components/block/index.ts`

- [ ] **Step 1: Export from Advance/index.ts**

Find:
```ts
export { default as ProductContentSection             } from './ProductContentSection'
```
Add after it:
```ts
export { default as PortfolioContentSection           } from './PortfolioContentSection'
```

- [ ] **Step 2: Re-export from block/index.ts**

Find:
```ts
  ProductContentSection,
} from './Advance'
```
Change to:
```ts
  ProductContentSection,
  PortfolioContentSection,
} from './Advance'
```

---

### Task 8: Wire into layout-renderer.tsx

**Files:**
- Modify: `src/lib/layout-renderer.tsx`

- [ ] **Step 1: Add to import**

Find:
```ts
  ProductContentSection,
  DynamicFormSection,
```
Change to:
```ts
  ProductContentSection,
  PortfolioContentSection,
  DynamicFormSection,
```

- [ ] **Step 2: Add switch case**

Find:
```ts
    case 'product-content':
      return wrapAdvanced(<ProductContentSection data={data} />)
```
Add after it:
```ts
    case 'portfolio-content':
      return wrapAdvanced(<PortfolioContentSection data={data} />)
```

---

### Task 9: Build check and commit

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -40
```

Expected: no output (zero errors).

- [ ] **Step 2: Commit**

```bash
git add \
  src/components/block/Advance/PortfolioContentSection.tsx \
  src/components/block/Advance/index.ts \
  src/components/block/index.ts \
  src/components/LayoutBuilder/types.ts \
  src/components/LayoutBuilder/BlockPicker.tsx \
  src/components/LayoutBuilder/utils/defaultOverrides.ts \
  src/components/LayoutBuilder/fields/ContentFields.tsx \
  src/components/LayoutBuilder/utils/previewResolver.tsx \
  src/lib/layout-renderer.tsx \
  docs/superpowers/plans/2026-06-13-portfolio-content-block.md
git commit -m "feat(portfolio-content): add portfolio-content advance block with light/dark theme and image position toggle"
```
