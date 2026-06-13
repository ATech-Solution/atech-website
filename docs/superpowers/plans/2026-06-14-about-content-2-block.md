# About Content 2 Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an `about-content-2` advance block — Mission, Vision & Values section with a centered heading, two `#f9fafb` cards with dark icon boxes, and a full-width `#ffd25e` values strip — wired end-to-end from layout builder to frontend renderer.

**Architecture:** Single new block type `about-content-2` following the same self-contained CSS-in-JS (`<style>` injection, module-level `injected` guard) pattern as `AboutContent1Section`. Three fixed zones: section heading → 2-col cards → values strip. No theme variant. Values are an editable array.

**Tech Stack:** Next.js 14 App Router, TypeScript, self-contained CSS via `<style>` tag, Work Sans font via CSS variable.

---

### Task 1: Create the Advance block component

**Files:**
- Create: `src/components/block/Advance/AboutContent2Section.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useEffect } from 'react'

interface MediaRef { url: string; alt?: string }

interface ValueItem {
  valueIcon?:  MediaRef | null
  valueTitle?: string
  valueDesc?:  string
}

export interface AboutContent2SectionData {
  ac2Heading?:       string
  ac2MissionIcon?:   MediaRef | null
  ac2MissionTitle?:  string
  ac2MissionBody?:   string
  ac2VisionIcon?:    MediaRef | null
  ac2VisionTitle?:   string
  ac2VisionBody?:    string
  ac2ValuesHeading?: string
  ac2Values?:        ValueItem[]
}

const CSS = `
  .ac2s {
    box-sizing: border-box;
    background: #ffffff;
    padding: 96px;
    display: flex;
    flex-direction: column;
    gap: 64px;
    width: 100%;
  }

  /* ── Zone 1: Section heading ──────────────────────────────────────────── */
  .ac2s__section-heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 500;
    font-size: 30px;
    line-height: 36px;
    color: #111827;
    text-align: center;
    margin: 0;
  }

  /* ── Zone 2: Mission / Vision cards ──────────────────────────────────── */
  .ac2s__cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
    width: 100%;
  }

  .ac2s__card {
    box-sizing: border-box;
    background: #f9fafb;
    border-radius: 16px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ac2s__card-icon-box {
    width: 48px;
    height: 48px;
    min-width: 48px;
    background: #363636;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .ac2s__card-icon-box img {
    width: auto;
    height: auto;
    max-width: 24px;
    max-height: 24px;
    object-fit: contain;
    display: block;
  }

  .ac2s__card-title-wrap {
    padding-top: 8px;
  }

  .ac2s__card-title {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #111827;
    margin: 0;
  }

  .ac2s__card-body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 14px;
    line-height: 22.75px;
    color: #6b7280;
    margin: 0;
  }

  /* ── Zone 3: Values strip ────────────────────────────────────────────── */
  .ac2s__values-strip {
    box-sizing: border-box;
    background: #ffd25e;
    border-radius: 16px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
  }

  .ac2s__values-heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #111827;
    text-align: center;
    margin: 0;
  }

  .ac2s__values-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 32px;
    width: 100%;
  }

  .ac2s__value-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .ac2s__value-icon {
    width: auto;
    height: 24px;
    object-fit: contain;
    display: block;
  }

  .ac2s__value-title {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #111827;
    margin: 0;
    text-align: center;
  }

  .ac2s__value-desc {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #1f2937;
    margin: 0;
    padding-top: 4px;
    text-align: center;
  }

  .ac2s__value-icon-placeholder {
    width: 24px;
    height: 24px;
    background: rgba(0,0,0,0.15);
    border-radius: 4px;
    display: block;
  }

  /* ── Responsive ─────────────────────────────────────────────────────── */
  @media (max-width: 767px) {
    .ac2s__cards { grid-template-columns: 1fr; }
    .ac2s__values-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 479px) {
    .ac2s { padding: 64px 24px; }
    .ac2s__values-grid { grid-template-columns: 1fr; }
  }
`

let injected = false

export default function AboutContent2Section({ data }: { data: AboutContent2SectionData }) {
  const heading       = data.ac2Heading       ?? ''
  const missionIcon   = data.ac2MissionIcon   ?? null
  const missionTitle  = data.ac2MissionTitle  ?? ''
  const missionBody   = data.ac2MissionBody   ?? ''
  const visionIcon    = data.ac2VisionIcon    ?? null
  const visionTitle   = data.ac2VisionTitle   ?? ''
  const visionBody    = data.ac2VisionBody    ?? ''
  const valuesHeading = data.ac2ValuesHeading ?? ''
  const values        = data.ac2Values        ?? []

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <section className="ac2s">
      {/* Zone 1: section heading */}
      {heading && <h2 className="ac2s__section-heading">{heading}</h2>}

      {/* Zone 2: Mission / Vision cards */}
      <div className="ac2s__cards">
        {/* Mission card */}
        <div className="ac2s__card">
          <div className="ac2s__card-icon-box">
            {missionIcon?.url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={missionIcon.url} alt={missionIcon.alt ?? 'Mission icon'} />
              : <span style={{ width: 16, height: 16, background: 'rgba(255,255,255,0.3)', borderRadius: 2, display: 'block' }} />
            }
          </div>
          <div className="ac2s__card-title-wrap">
            {missionTitle && <h3 className="ac2s__card-title">{missionTitle}</h3>}
          </div>
          {missionBody && <p className="ac2s__card-body">{missionBody}</p>}
        </div>

        {/* Vision card */}
        <div className="ac2s__card">
          <div className="ac2s__card-icon-box">
            {visionIcon?.url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={visionIcon.url} alt={visionIcon.alt ?? 'Vision icon'} />
              : <span style={{ width: 16, height: 16, background: 'rgba(255,255,255,0.3)', borderRadius: 2, display: 'block' }} />
            }
          </div>
          <div className="ac2s__card-title-wrap">
            {visionTitle && <h3 className="ac2s__card-title">{visionTitle}</h3>}
          </div>
          {visionBody && <p className="ac2s__card-body">{visionBody}</p>}
        </div>
      </div>

      {/* Zone 3: Values strip */}
      <div className="ac2s__values-strip">
        {valuesHeading && <h3 className="ac2s__values-heading">{valuesHeading}</h3>}
        {values.length > 0 && (
          <div className="ac2s__values-grid">
            {values.map((v, i) => (
              <div key={i} className="ac2s__value-item">
                {v.valueIcon?.url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={v.valueIcon.url} alt={v.valueIcon.alt ?? v.valueTitle ?? ''} className="ac2s__value-icon" />
                  : <span className="ac2s__value-icon-placeholder" />
                }
                {v.valueTitle && <p className="ac2s__value-title">{v.valueTitle}</p>}
                {v.valueDesc  && <p className="ac2s__value-desc">{v.valueDesc}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

---

### Task 2: Register block type + fields in types.ts

**Files:**
- Modify: `src/components/LayoutBuilder/types.ts`

- [ ] **Step 1: Add `'about-content-2'` to ADVANCE_BLOCK_TYPES**

Find:
```ts
  'about-content-1',
] as const
```
Change to:
```ts
  'about-content-1',
  'about-content-2',
] as const
```

- [ ] **Step 2: Add `ac2*` content fields to BlockOverrides**

Find:
```ts
    // ── About Content 1 ──────────────────────────────────────────────────────
    ac1Heading?: string
```
Insert before it:
```ts
    // ── About Content 2 ──────────────────────────────────────────────────────
    ac2Heading?:       string
    ac2MissionIcon?:   MediaRef | null
    ac2MissionTitle?:  string
    ac2MissionBody?:   string
    ac2VisionIcon?:    MediaRef | null
    ac2VisionTitle?:   string
    ac2VisionBody?:    string
    ac2ValuesHeading?: string
    ac2Values?:        Array<{ valueIcon?: MediaRef | null; valueTitle?: string; valueDesc?: string }>

```

---

### Task 3: BlockPicker icon + label

**Files:**
- Modify: `src/components/LayoutBuilder/BlockPicker.tsx`

- [ ] **Step 1: Add icon**

Find:
```ts
  'about-content-1': '💡',
}
```
Change to:
```ts
  'about-content-1': '💡',
  'about-content-2': '🎯',
}
```

- [ ] **Step 2: Add label**

Find:
```ts
  'about-content-1': 'About Content 1',
```
Change to:
```ts
  'about-content-1': 'About Content 1',
  'about-content-2': 'About Content 2',
```

---

### Task 4: Default overrides

**Files:**
- Modify: `src/components/LayoutBuilder/utils/defaultOverrides.ts`

- [ ] **Step 1: Add case for `'about-content-2'`**

Find:
```ts
    case 'about-content-1':
      return {
```
Insert before it:
```ts
    case 'about-content-2':
      return {
        content: {
          ac2Heading:       'Our Mission & Vision',
          ac2MissionTitle:  'Our Mission',
          ac2MissionBody:   'As the premier partner for operational excellence, we empower businesses to thrive in the hybrid era. We provide the essential tools and platforms, strategic consultancy, and operational services to build resilient, agile, and scalable, human-centric organizations.',
          ac2VisionTitle:   'Our Vision',
          ac2VisionBody:    'To create a world where work is defined by outcomes, not locations, unlocking human potential and enabling any organization to achieve seamless, integrated growth. We turn bold ideas into market-ready products and operational challenges into sustainable competitive advantages.',
          ac2ValuesHeading: 'Our Values',
          ac2Values: [
            { valueTitle: 'Innovation',   valueDesc: 'Constantly pushing boundaries' },
            { valueTitle: 'Integrity',    valueDesc: 'Honest and transparent partnerships' },
            { valueTitle: 'Excellence',   valueDesc: 'Delivering quality in everything' },
            { valueTitle: 'Collaboration', valueDesc: 'Working together for success' },
          ],
        },
      }

```

---

### Task 5: ContentFields editor UI

**Files:**
- Modify: `src/components/LayoutBuilder/fields/ContentFields.tsx`

- [ ] **Step 1: Add `AboutContent2Fields` component**

Find:
```ts
// ── About Content 1 fields ────────────────────────────────────────────────────
function AboutContent1Fields
```
Insert before it:
```ts
// ── About Content 2 fields ────────────────────────────────────────────────────
function AboutContent2Fields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const values: Array<{ valueIcon?: { url: string } | null; valueTitle?: string; valueDesc?: string }> = ov.ac2Values ?? []

  const setValueField = (i: number, key: string, val: unknown) => {
    const next = values.map((v, idx) => idx === i ? { ...v, [key]: val } : v)
    set('ac2Values', next)
  }

  const addValue = () => set('ac2Values', [...values, { valueTitle: '', valueDesc: '' }])
  const removeValue = (i: number) => set('ac2Values', values.filter((_, idx) => idx !== i))

  return (
    <>
      <Field label="Section Heading">
        <input className="lb-input" value={ov.ac2Heading ?? ''} onChange={(e) => set('ac2Heading', e.target.value)} placeholder="Our Mission & Vision" />
      </Field>

      <Field label="— Mission —"><span /></Field>
      <MediaField label="Mission Icon" value={ov.ac2MissionIcon?.url ?? ''} onChange={(ref) => set('ac2MissionIcon', ref)} />
      <Field label="Mission Title">
        <input className="lb-input" value={ov.ac2MissionTitle ?? ''} onChange={(e) => set('ac2MissionTitle', e.target.value)} placeholder="Our Mission" />
      </Field>
      <Field label="Mission Body">
        <textarea className="lb-input lb-input--textarea" rows={4} value={ov.ac2MissionBody ?? ''} onChange={(e) => set('ac2MissionBody', e.target.value)} placeholder="Mission statement..." />
      </Field>

      <Field label="— Vision —"><span /></Field>
      <MediaField label="Vision Icon" value={ov.ac2VisionIcon?.url ?? ''} onChange={(ref) => set('ac2VisionIcon', ref)} />
      <Field label="Vision Title">
        <input className="lb-input" value={ov.ac2VisionTitle ?? ''} onChange={(e) => set('ac2VisionTitle', e.target.value)} placeholder="Our Vision" />
      </Field>
      <Field label="Vision Body">
        <textarea className="lb-input lb-input--textarea" rows={4} value={ov.ac2VisionBody ?? ''} onChange={(e) => set('ac2VisionBody', e.target.value)} placeholder="Vision statement..." />
      </Field>

      <Field label="Values Heading">
        <input className="lb-input" value={ov.ac2ValuesHeading ?? ''} onChange={(e) => set('ac2ValuesHeading', e.target.value)} placeholder="Our Values" />
      </Field>

      {values.map((v, i) => (
        <div key={i} style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Value {i + 1}</span>
            <button style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => removeValue(i)}>Remove</button>
          </div>
          <MediaField label="Icon" value={v.valueIcon?.url ?? ''} onChange={(ref) => setValueField(i, 'valueIcon', ref)} />
          <Field label="Title">
            <input className="lb-input" value={v.valueTitle ?? ''} onChange={(e) => setValueField(i, 'valueTitle', e.target.value)} placeholder="Value name" />
          </Field>
          <Field label="Description">
            <input className="lb-input" value={v.valueDesc ?? ''} onChange={(e) => setValueField(i, 'valueDesc', e.target.value)} placeholder="Short description" />
          </Field>
        </div>
      ))}
      <button className="lb-btn lb-btn--secondary" style={{ marginTop: 8, width: '100%' }} onClick={addValue}>+ Add Value</button>
    </>
  )
}

```

- [ ] **Step 2: Register in the render switch**

Find:
```ts
        {blockType === 'about-content-1'        && <AboutContent1Fields       ov={ov} set={set} />}
```
Add after it:
```ts
        {blockType === 'about-content-2'        && <AboutContent2Fields       ov={ov} set={set} />}
```

---

### Task 6: previewResolver

**Files:**
- Modify: `src/components/LayoutBuilder/utils/previewResolver.tsx`

- [ ] **Step 1: Import component**

Find:
```ts
  AboutContent1Section,
} from '@/components/block'
```
Change to:
```ts
  AboutContent1Section,
  AboutContent2Section,
} from '@/components/block'
```

- [ ] **Step 2: Add switch case**

Find:
```ts
    case 'about-content-1':
      return withStyle(<AboutContent1Section data={data as any} />, blockStyle)
```
Add after it:
```ts
    case 'about-content-2':
      return withStyle(<AboutContent2Section data={data as any} />, blockStyle)
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
export { default as AboutContent1Section              } from './AboutContent1Section'
```
Add after it:
```ts
export { default as AboutContent2Section              } from './AboutContent2Section'
```

- [ ] **Step 2: Re-export from block/index.ts**

Find:
```ts
  AboutContent1Section,
} from './Advance'
```
Change to:
```ts
  AboutContent1Section,
  AboutContent2Section,
} from './Advance'
```

- [ ] **Step 3: Import in layout-renderer.tsx**

Find:
```ts
  AboutContent1Section,
  DynamicFormSection,
```
Change to:
```ts
  AboutContent1Section,
  AboutContent2Section,
  DynamicFormSection,
```

- [ ] **Step 4: Add switch case in layout-renderer.tsx**

Find:
```ts
    case 'about-content-1':
      return wrapAdvanced(<AboutContent1Section data={data} />)
```
Add after it:
```ts
    case 'about-content-2':
      return wrapAdvanced(<AboutContent2Section data={data} />)
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
  src/components/block/Advance/AboutContent2Section.tsx \
  src/components/block/Advance/index.ts \
  src/components/block/index.ts \
  src/components/LayoutBuilder/types.ts \
  src/components/LayoutBuilder/BlockPicker.tsx \
  src/components/LayoutBuilder/utils/defaultOverrides.ts \
  src/components/LayoutBuilder/fields/ContentFields.tsx \
  src/components/LayoutBuilder/utils/previewResolver.tsx \
  src/lib/layout-renderer.tsx \
  docs/superpowers/plans/2026-06-14-about-content-2-block.md
git commit -m "feat(about-content-2): add about-content-2 advance block — mission/vision cards + values strip"
```
