# Case Study Scroll Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `case-study-scroll` advance block to the Layout Builder that renders a vertical list of case studies, each animating in with a split-direction entrance (image from top, content from bottom) via IntersectionObserver.

**Architecture:** Single `CaseStudyScrollSection.tsx` client component; IntersectionObserver adds/removes CSS classes per row to trigger transitions; SSR-safe (rows render visible by default, JS adds hidden class on mount). Wired into all 9 Layout Builder pipeline files.

**Tech Stack:** Next.js 14, React 18 (`useEffect`/`useRef`), TypeScript, CSS-in-JS (`dangerouslySetInnerHTML`), IntersectionObserver API.

---

### Task 1: Create CaseStudyScrollSection.tsx

**Files:**
- Create: `src/components/block/Advance/CaseStudyScrollSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useEffect, useRef } from 'react'

interface MediaRef { url: string; alt?: string }

export interface CaseStudyScrollItem {
  cssImage?:      MediaRef | null
  cssClientLogo?: MediaRef | null
  cssHeading?:    string
  cssBody?:       string
}

export interface CaseStudyScrollSectionData {
  caseScrollItems?: CaseStudyScrollItem[]
}

const CSS = `
  .cssection {
    background: #ffffff;
    padding: 80px 208px;
    box-sizing: border-box;
  }
  .cssection__row {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 64px;
    padding-bottom: 80px;
  }
  .cssection__row:last-child { padding-bottom: 0; }
  .cssection__imgcol {
    flex-shrink: 0;
    width: 478.97px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }
  .cssection__card {
    width: 400px;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1);
    background: #e5e7eb;
    flex-shrink: 0;
  }
  .cssection__card img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .cssection__contentcol {
    flex: 1;
    padding-left: 32px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 15.4px;
  }
  .cssection__border {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
  }
  .cssection__borderfill {
    position: absolute;
    top: 0; left: 0; width: 100%;
    height: 0;
    background: #ffd25e;
    border-radius: 2px;
    transition: height 0.5s ease-out 0.2s;
  }
  .cssection__borderfill--visible { height: 100%; }
  .cssection__logo {
    height: 64px;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .cssection__logo img {
    max-height: 64px; width: auto; object-fit: contain;
  }
  .cssection__heading {
    font-family: var(--font-work-sans, sans-serif);
    font-size: 36px; font-weight: 700; line-height: 40px;
    color: #111827; margin: 0;
  }
  .cssection__body {
    font-family: var(--font-work-sans, sans-serif);
    font-size: 14px; font-weight: 400; line-height: 22.75px;
    color: #4b5563; margin: 0;
  }
  .cssection__imgcol--hidden {
    opacity: 0;
    transform: translateY(-50px);
    transition: opacity 0.75s ease-out, transform 0.75s ease-out;
  }
  .cssection__contentcol--hidden {
    opacity: 0;
    transform: translateY(50px);
    transition: opacity 0.75s ease-out 0.12s, transform 0.75s ease-out 0.12s;
  }
  .cssection__imgcol--visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.75s ease-out, transform 0.75s ease-out;
  }
  .cssection__contentcol--visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.75s ease-out 0.12s, transform 0.75s ease-out 0.12s;
  }
  @media (max-width: 767px) {
    .cssection { padding: 40px 24px; }
    .cssection__row { flex-direction: column; gap: 24px; padding-bottom: 40px; }
    .cssection__imgcol { width: 100%; justify-content: center; }
    .cssection__card { width: 100%; height: 260px; }
    .cssection__imgcol--hidden { transform: translateY(30px); }
    .cssection__imgcol--visible { transform: translateY(0); }
  }
`

export default function CaseStudyScrollSection({ data }: { data: CaseStudyScrollSectionData }) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const items   = data.caseScrollItems ?? []

  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[]

    rows.forEach((row) => {
      const img     = row.querySelector('.cssection__imgcol')     as HTMLElement | null
      const content = row.querySelector('.cssection__contentcol') as HTMLElement | null
      if (img)     img.classList.add('cssection__imgcol--hidden')
      if (content) content.classList.add('cssection__contentcol--hidden')
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const row     = entry.target as HTMLDivElement
          const img     = row.querySelector('.cssection__imgcol')     as HTMLElement | null
          const content = row.querySelector('.cssection__contentcol') as HTMLElement | null
          const fill    = row.querySelector('.cssection__borderfill') as HTMLElement | null
          if (img) {
            img.classList.remove('cssection__imgcol--hidden')
            img.classList.add('cssection__imgcol--visible')
          }
          if (content) {
            content.classList.remove('cssection__contentcol--hidden')
            content.classList.add('cssection__contentcol--visible')
          }
          if (fill) fill.classList.add('cssection__borderfill--visible')
          observer.unobserve(row)
        })
      },
      { threshold: 0.2 }
    )

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [items.length])

  if (items.length === 0) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="cssection">
        {items.map((item, i) => (
          <div
            key={i}
            className="cssection__row"
            ref={(el) => { rowRefs.current[i] = el }}
          >
            <div className="cssection__imgcol">
              <div className="cssection__card">
                {item.cssImage?.url && (
                  <img src={item.cssImage.url} alt={item.cssImage.alt ?? 'Case study'} />
                )}
              </div>
            </div>
            <div className="cssection__contentcol">
              <div className="cssection__border">
                <div className="cssection__borderfill" />
              </div>
              {item.cssClientLogo?.url && (
                <div className="cssection__logo">
                  <img src={item.cssClientLogo.url} alt={item.cssClientLogo.alt ?? 'Client logo'} />
                </div>
              )}
              {item.cssHeading && <h3 className="cssection__heading">{item.cssHeading}</h3>}
              {item.cssBody    && <p  className="cssection__body">{item.cssBody}</p>}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify file created**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: (errors are fine at this stage — other pipeline files not yet updated)

---

### Task 2: Wire exports (Advance/index.ts + block/index.ts)

**Files:**
- Modify: `src/components/block/Advance/index.ts` (line 70 — after QuoteIntroSection)
- Modify: `src/components/block/index.ts` (line 72 — after QuoteIntroSection)

- [ ] **Step 1: Add to Advance/index.ts**

After `export { default as QuoteIntroSection } from './QuoteIntroSection'`, add:
```ts
export { default as CaseStudyScrollSection            } from './CaseStudyScrollSection'
```

- [ ] **Step 2: Add to block/index.ts**

After `QuoteIntroSection,` in the exports block, add:
```ts
  CaseStudyScrollSection,
```

---

### Task 3: Update types.ts

**Files:**
- Modify: `src/components/LayoutBuilder/types.ts`

- [ ] **Step 1: Add to ADVANCE_BLOCK_TYPES array** (after `'case-study'`)

```ts
  'case-study',
  'case-study-scroll',
```

- [ ] **Step 2: Add fields to BlockOverrides.content** (after Case Study section)

```ts
    // ── Case Study Scroll ─────────────────────────────────────────────────────
    caseScrollItems?: Array<{
      cssImage?:      MediaRef | null
      cssClientLogo?: MediaRef | null
      cssHeading?:    string
      cssBody?:       string
    }>
```

---

### Task 4: Update defaultOverrides.ts

**Files:**
- Modify: `src/components/LayoutBuilder/utils/defaultOverrides.ts`

- [ ] **Step 1: Add case** (after `case 'case-study':` block, before `case 'clients':`)

```ts
    case 'case-study-scroll':
      return {
        content: {
          caseScrollItems: [
            {
              cssImage:      null,
              cssClientLogo: null,
              cssHeading:    'Digital Transformation & System Integration',
              cssBody:       'Built a cross-border dev team for a trading platform. Lower costs, faster shipping, tighter HK–Indonesia collaboration.',
            },
            {
              cssImage:      null,
              cssClientLogo: null,
              cssHeading:    'Business Process Re-engineering',
              cssBody:       'Digitised home-based health coaching operations for elderly care. Less admin, better patient outcomes.',
            },
            {
              cssImage:      null,
              cssClientLogo: null,
              cssHeading:    'Data Analytics & Performance Optimization',
              cssBody:       'Supported AI-driven clinic analytics for Medtrik. Real-time insights on patient flow, doctor performance, and financials.',
            },
          ],
        },
      }
```

---

### Task 5: Update BlockPicker.tsx

**Files:**
- Modify: `src/components/LayoutBuilder/BlockPicker.tsx`

- [ ] **Step 1: Add icon** (after `'case-study': '📋'`)

```ts
  'case-study': '📋',
  'case-study-scroll': '📜',
```

- [ ] **Step 2: Add label** (after `'case-study': 'Case Study'`)

```ts
  'case-study': 'Case Study',
  'case-study-scroll': 'Case Study — Scroll',
```

---

### Task 6: Update ContentFields.tsx

**Files:**
- Modify: `src/components/LayoutBuilder/fields/ContentFields.tsx`

- [ ] **Step 1: Add CaseStudyScrollFields function** (before `// ── Quote-Intro fields` comment at line 2801)

```tsx
// ── Case Study Scroll fields ──────────────────────────────────────────────────
function CaseStudyScrollFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.caseScrollItems ?? []
  function setItems(next: any[]) { set('caseScrollItems', next) }
  return (
    <Field label="Case Study Items">
      <div className="lb-items">
        {items.map((item: any, i: number) => (
          <div key={i} className="lb-item">
            <div className="lb-item__header">
              <span>Item {i + 1}</span>
              <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); setItems(a) }}>✕</button>
            </div>
            <MediaField
              label="Case Image (400×400)"
              value={item?.cssImage?.url ?? ''}
              onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], cssImage: ref }; setItems(a) }}
            />
            <MediaField
              label="Client Logo"
              value={item?.cssClientLogo?.url ?? ''}
              onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], cssClientLogo: ref }; setItems(a) }}
            />
            <Field label="Heading">
              <input
                className="lb-input"
                value={item?.cssHeading ?? ''}
                onChange={(e) => { const a = [...items]; a[i] = { ...a[i], cssHeading: e.target.value }; setItems(a) }}
                placeholder="Digital Transformation & System Integration"
              />
            </Field>
            <Field label="Body">
              <textarea
                className="lb-input lb-input--textarea"
                rows={3}
                value={item?.cssBody ?? ''}
                onChange={(e) => { const a = [...items]; a[i] = { ...a[i], cssBody: e.target.value }; setItems(a) }}
                placeholder="Brief case study description..."
              />
            </Field>
          </div>
        ))}
        <button
          className="lb-items__add"
          onClick={() => setItems([...items, { cssImage: null, cssClientLogo: null, cssHeading: '', cssBody: '' }])}
        >+ Add Case Study</button>
      </div>
    </Field>
  )
}
```

- [ ] **Step 2: Wire in render** (after `{blockType === 'case-study' && <CaseStudyFields ov={ov} set={set} />}`)

```tsx
        {blockType === 'case-study-scroll'     && <CaseStudyScrollFields     ov={ov} set={set} />}
```

---

### Task 7: Update previewResolver.tsx

**Files:**
- Modify: `src/components/LayoutBuilder/utils/previewResolver.tsx`

- [ ] **Step 1: Add import** (after `CaseStudySection,`)

```ts
  CaseStudySection,
  CaseStudyScrollSection,
```

- [ ] **Step 2: Add case** (after `case 'case-study':`)

```tsx
    case 'case-study-scroll':
      return withStyle(<CaseStudyScrollSection data={data as any} />, blockStyle)
```

---

### Task 8: Update layout-renderer.tsx

**Files:**
- Modify: `src/lib/layout-renderer.tsx`

- [ ] **Step 1: Add import** (after `CaseStudySection,`)

```ts
  CaseStudySection,
  CaseStudyScrollSection,
```

- [ ] **Step 2: Add case** (after `case 'case-study':`)

```tsx
    case 'case-study-scroll':
      return wrapAdvanced(<CaseStudyScrollSection data={data} />)
```

---

### Task 9: TypeScript check + commit

**Files:** All modified above

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit 2>&1`
Expected: no output (zero errors)

- [ ] **Step 2: Commit**

```bash
git add src/components/block/Advance/CaseStudyScrollSection.tsx \
        src/components/block/Advance/index.ts \
        src/components/block/index.ts \
        src/components/LayoutBuilder/types.ts \
        src/components/LayoutBuilder/utils/defaultOverrides.ts \
        src/components/LayoutBuilder/BlockPicker.tsx \
        src/components/LayoutBuilder/fields/ContentFields.tsx \
        src/components/LayoutBuilder/utils/previewResolver.tsx \
        src/lib/layout-renderer.tsx \
        docs/superpowers/plans/2026-06-12-case-study-scroll-block.md

git commit -m "feat(layout-builder): add case-study-scroll block with split-direction scroll animation"
```
