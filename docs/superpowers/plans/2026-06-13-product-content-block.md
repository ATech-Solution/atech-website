# Product Content Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `product-content` advance block — a full-width product showcase section with dark/light theme toggle — wired end-to-end from layout builder to frontend renderer.

**Architecture:** Single new block type `product-content` following the same self-contained CSS pattern as `CaseStudyScrollSection`. Each page instance is an independent block with its own content and theme. No server component needed.

**Tech Stack:** Next.js 14 App Router, TypeScript, self-contained CSS-in-JS (`<style>` tag injection), Work Sans font via CSS variable.

---

### Task 1: Create the Advance block component

**Files:**
- Create: `src/components/block/Advance/ProductContentSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface MediaRef { url: string; alt?: string }

export interface ProductContentSectionData {
  pcTheme?:    'dark' | 'light'
  pcTitle?:    string
  pcImage?:    MediaRef | null
  pcBody?:     string
  pcCtaLabel?: string
  pcCtaUrl?:   string
}

const CSS = `
  .pcs {
    box-sizing: border-box;
    padding: 96px clamp(24px, calc((100% - 1024px) / 2), 208px);
  }
  .pcs--dark  { background: #2b2b2b; }
  .pcs--light { background: #ffffff; }

  .pcs__inner {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .pcs__heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 30px;
    line-height: 36px;
    margin: 0;
    word-break: break-word;
  }
  .pcs--dark  .pcs__heading { color: #ffd25e; }
  .pcs--light .pcs__heading { color: #111827; }

  .pcs__image-wrap {
    width: 100%;
    height: 422px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .pcs__image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .pcs__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3a3a3a;
    color: #6b7280;
    font-size: 14px;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
  }

  .pcs__body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 14px;
    line-height: 22.75px;
    margin: 0;
  }
  .pcs--dark  .pcs__body { color: #d1d5db; }
  .pcs--light .pcs__body { color: #4b5563; }

  .pcs__cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 10px 24px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    transition: opacity 0.15s ease;
    align-self: flex-start;
  }
  .pcs__cta:hover { opacity: 0.85; }
  .pcs--dark  .pcs__cta { background: #ffffff; color: #111827; }
  .pcs--light .pcs__cta { background: #2b2b2b; color: #ffffff; }

  .pcs__arrow {
    width: 10.5px;
    height: 12px;
    flex-shrink: 0;
    display: block;
  }

  @media (max-width: 767px) {
    .pcs { padding: 64px 24px; }
    .pcs__image-wrap { height: auto; aspect-ratio: 16/9; }
  }
`

let injected = false

export default function ProductContentSection({ data }: { data: ProductContentSectionData }) {
  const theme     = data.pcTheme    ?? 'dark'
  const title     = data.pcTitle    ?? ''
  const image     = data.pcImage    ?? null
  const body      = data.pcBody     ?? ''
  const ctaLabel  = data.pcCtaLabel ?? 'Learn more'
  const ctaUrl    = data.pcCtaUrl   ?? '#'
  const isDark    = theme === 'dark'

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <section className={`pcs pcs--${theme}`}>
      <div className="pcs__inner">
        {title && <h2 className="pcs__heading">{title}</h2>}

        <div className="pcs__image-wrap">
          {image?.url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={image.url} alt={image.alt ?? title} />
            : <div className="pcs__image-placeholder">No image selected</div>
          }
        </div>

        {body && <p className="pcs__body">{body}</p>}

        {ctaLabel && (
          <Link href={ctaUrl} className="pcs__cta">
            <span>{ctaLabel}</span>
            <svg className="pcs__arrow" viewBox="0 0 10.5 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L9.5 6L1 11" stroke={isDark ? '#111827' : '#ffffff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify file exists**

```bash
ls src/components/block/Advance/ProductContentSection.tsx
```

Expected: file listed with no error.

---

### Task 2: Register block type in types.ts

**Files:**
- Modify: `src/components/LayoutBuilder/types.ts`

- [ ] **Step 1: Add `'product-content'` to ADVANCE_BLOCK_TYPES**

In `types.ts`, find the line:
```ts
  'step-scroll',
] as const
```
Change to:
```ts
  'step-scroll',
  'product-content',
] as const
```

- [ ] **Step 2: Add content fields to BlockOverrides**

In `types.ts`, find the `// ── Step Scroll ──` comment block. After the `iibPins` array closing and before the `// ── Article Main Grid ──` section, add the new fields. Specifically, find:
```ts
    // ── Article Main Grid ─────────────────────────────────────────────────────
    mainGridSectionLabel?:  string
```
And insert before it:
```ts
    // ── Product Content ───────────────────────────────────────────────────────
    pcTheme?:    'dark' | 'light'
    pcTitle?:    string
    pcImage?:    MediaRef | null
    pcBody?:     string
    pcCtaLabel?: string
    pcCtaUrl?:   string

```

---

### Task 3: Add to BlockPicker

**Files:**
- Modify: `src/components/LayoutBuilder/BlockPicker.tsx`

- [ ] **Step 1: Add icon**

Find in `BLOCK_ICONS`:
```ts
  'step-scroll': '🪜',
}
```
Change to:
```ts
  'step-scroll': '🪜',
  'product-content': '📦',
}
```

- [ ] **Step 2: Add label**

Find in `BLOCK_LABELS`:
```ts
  'step-scroll': 'Step Scroll',
```
Change to:
```ts
  'step-scroll': 'Step Scroll',
  'product-content': 'Product Content',
```

---

### Task 4: Add default overrides

**Files:**
- Modify: `src/components/LayoutBuilder/utils/defaultOverrides.ts`

- [ ] **Step 1: Add case**

Find near the end of the `switch` in `getDefaultOverrides`, the `default:` line:
```ts
    default:
      return {}
  }
}
```
Insert before it:
```ts
    case 'product-content':
      return {
        content: {
          pcTheme:    'dark',
          pcTitle:    'Product Name: Your Tagline Here',
          pcBody:     'Describe what makes this product unique. Focus on the problem it solves and the value it delivers to your users.',
          pcCtaLabel: 'Learn more',
          pcCtaUrl:   '#',
        },
      }

```

---

### Task 5: Add Content Fields editor

**Files:**
- Modify: `src/components/LayoutBuilder/fields/ContentFields.tsx`

- [ ] **Step 1: Add the field component function**

Find in `ContentFields.tsx`:
```ts
// ── Quote-Intro fields ────────────────────────────────────────────────────────
function QuoteIntroFields
```
Insert before it:
```ts
// ── Product Content fields ────────────────────────────────────────────────────
function ProductContentFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Theme">
        <select className="lb-input lb-input--select" value={ov.pcTheme ?? 'dark'} onChange={(e) => set('pcTheme', e.target.value)}>
          <option value="dark">Dark (#2b2b2b background)</option>
          <option value="light">Light (white background)</option>
        </select>
      </Field>
      <Field label="Title">
        <input className="lb-input" value={ov.pcTitle ?? ''} onChange={(e) => set('pcTitle', e.target.value)} placeholder="Product Name: Tagline" />
      </Field>
      <MediaField label="Product Image" value={ov.pcImage?.url ?? ''} onChange={(ref) => set('pcImage', ref)} />
      <Field label="Body Text">
        <textarea className="lb-input lb-input--textarea" rows={4} value={ov.pcBody ?? ''} onChange={(e) => set('pcBody', e.target.value)} placeholder="Product description..." />
      </Field>
      <Field label="CTA Label">
        <input className="lb-input" value={ov.pcCtaLabel ?? ''} onChange={(e) => set('pcCtaLabel', e.target.value)} placeholder="Learn more" />
      </Field>
      <Field label="CTA URL">
        <input className="lb-input" value={ov.pcCtaUrl ?? ''} onChange={(e) => set('pcCtaUrl', e.target.value)} placeholder="/product-page" />
      </Field>
    </>
  )
}

```

- [ ] **Step 2: Register in the render switch**

Find:
```ts
        {blockType === 'step-scroll'            && <StepScrollFields          ov={ov} set={set} />}
```
Change to:
```ts
        {blockType === 'step-scroll'            && <StepScrollFields          ov={ov} set={set} />}
        {blockType === 'product-content'        && <ProductContentFields      ov={ov} set={set} />}
```

---

### Task 6: Add preview resolver entry

**Files:**
- Modify: `src/components/LayoutBuilder/utils/previewResolver.tsx`

- [ ] **Step 1: Import ProductContentSection**

Find the imports block near the top. Find:
```ts
  StepScrollSection,
} from '@/components/block'
```
Change to:
```ts
  StepScrollSection,
  ProductContentSection,
} from '@/components/block'
```

- [ ] **Step 2: Add switch case**

Find:
```ts
    case 'step-scroll':
      return withStyle(<StepScrollSection data={data as any} />, blockStyle)
```
Add after it:
```ts
    case 'product-content':
      return withStyle(<ProductContentSection data={data as any} />, blockStyle)
```

---

### Task 7: Export from Advance/index.ts and block/index.ts

**Files:**
- Modify: `src/components/block/Advance/index.ts`
- Modify: `src/components/block/index.ts`

- [ ] **Step 1: Export from Advance/index.ts**

Find at the end of `Advance/index.ts`:
```ts
export { default as StepScrollSection                } from './StepScrollSection'
```
Add after it:
```ts
export { default as ProductContentSection            } from './ProductContentSection'
```

- [ ] **Step 2: Check block/index.ts exports from Advance**

In `src/components/block/index.ts`, find where it re-exports StepScrollSection and add ProductContentSection alongside it. Find:
```ts
  StepScrollSection,
```
Add `ProductContentSection,` to the same export block.

---

### Task 8: Wire into layout-renderer.tsx

**Files:**
- Modify: `src/lib/layout-renderer.tsx`

- [ ] **Step 1: Add to import list**

Find in `layout-renderer.tsx`:
```ts
  StepScrollSection,
```
Add `ProductContentSection,` to the same destructured import from `@/components/block`.

- [ ] **Step 2: Add switch case**

Find:
```ts
    case 'step-scroll':
      return wrapAdvanced(<StepScrollSection data={data} />)
```
Add after it:
```ts
    case 'product-content':
      return wrapAdvanced(<ProductContentSection data={data} />)
```

---

### Task 9: Build check and commit

- [ ] **Step 1: Run TypeScript check**

```bash
cd /Users/tansams/Documents/GitHub/atech-website && npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors (or only pre-existing unrelated errors).

- [ ] **Step 2: Commit**

```bash
git add src/components/block/Advance/ProductContentSection.tsx \
        src/components/block/Advance/index.ts \
        src/components/block/index.ts \
        src/components/LayoutBuilder/types.ts \
        src/components/LayoutBuilder/BlockPicker.tsx \
        src/components/LayoutBuilder/utils/defaultOverrides.ts \
        src/components/LayoutBuilder/fields/ContentFields.tsx \
        src/components/LayoutBuilder/utils/previewResolver.tsx \
        src/lib/layout-renderer.tsx
git commit -m "feat(product-content): add product-content advance block with dark/light theme"
```
