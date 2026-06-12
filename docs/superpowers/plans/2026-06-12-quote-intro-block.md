# Quote-Intro Block — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the `quote` advance block to `quote-intro` and extend it with a `quoteStyle` field so one block handles both the centered pull-quote (24px/500 + curly quotes) and the bold intro section (30px/700, no quotes) matching Figma nodes 1400:11620 and 1400:11625.

**Architecture:** Replace `QuoteSection.tsx` with `QuoteIntroSection.tsx` (adds `quoteStyle: 'quote' | 'intro'` prop that switches font-size, font-weight, and quote marks). Update all 8 registration files from `'quote'` → `'quote-intro'` and `QuoteSection` → `QuoteIntroSection`. The shared layout (white bg, 96px padding, flex column center, 24px gap, identical body text) is unchanged.

**Tech Stack:** Next.js 14, React 18, TypeScript, inline `React.CSSProperties`, scoped CSS string (project convention for advance blocks).

---

## File Map

| Action | File | Change |
|--------|------|--------|
| **Replace** | `src/components/block/Advance/QuoteSection.tsx` → `QuoteIntroSection.tsx` | New file with `quoteStyle` mode; delete old |
| **Modify** | `src/components/block/Advance/index.ts` | Rename export |
| **Modify** | `src/components/block/index.ts` | Rename named export |
| **Modify** | `src/components/LayoutBuilder/types.ts` | `'quote'` → `'quote-intro'`; add `quoteStyle?` |
| **Modify** | `src/components/LayoutBuilder/utils/defaultOverrides.ts` | `case 'quote'` → `case 'quote-intro'`; add `quoteStyle` |
| **Modify** | `src/components/LayoutBuilder/BlockPicker.tsx` | Keys + label updated |
| **Modify** | `src/components/LayoutBuilder/fields/ContentFields.tsx` | `QuoteFields` → `QuoteIntroFields`; add Style dropdown |
| **Modify** | `src/components/LayoutBuilder/utils/previewResolver.tsx` | Import + case updated |
| **Modify** | `src/lib/layout-renderer.tsx` | Import + case updated |

---

### Task 1: Create `QuoteIntroSection.tsx` and delete `QuoteSection.tsx`

**Files:**
- Create: `src/components/block/Advance/QuoteIntroSection.tsx`
- Delete: `src/components/block/Advance/QuoteSection.tsx`

- [ ] **Step 1: Write `QuoteIntroSection.tsx`**

```tsx
// Quote-Intro Section — Layout Builder (Advance)
// Two modes via quoteStyle:
//   'quote' (default): 24px/500 centered text with curly quotes — Figma 1400:11620
//   'intro':           30px/700 bold heading, no quotes        — Figma 1400:11625

const CSS = `
  .quoteintrosection {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 96px;
  }

  @media (max-width: 767px) {
    .quoteintrosection { padding: 40px 24px; }
  }
`

export interface QuoteIntroSectionData {
  quoteStyle?: 'quote' | 'intro'
  quoteText?:  string
  quoteBody?:  string
}

export default function QuoteIntroSection({ data }: { data: QuoteIntroSectionData }) {
  const isIntro = data.quoteStyle === 'intro'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="quoteintrosection">
        {data.quoteText && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   isIntro ? '30px' : '24px',
              fontWeight: isIntro ? 700    : 500,
              color:      '#111827',
              textAlign:  'center',
              maxWidth:   '896px',
              lineHeight: isIntro ? '36px' : '40px',
              margin:     0,
            }}
          >
            {isIntro ? data.quoteText : <>&ldquo;{data.quoteText}&rdquo;</>}
          </p>
        )}

        {data.quoteBody && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '16px',
              fontWeight: 400,
              color:      '#4b5563',
              textAlign:  'center',
              maxWidth:   '768px',
              lineHeight: '24px',
              margin:     0,
            }}
          >
            {data.quoteBody}
          </p>
        )}
      </section>
    </>
  )
}
```

- [ ] **Step 2: Delete the old file**

```bash
rm src/components/block/Advance/QuoteSection.tsx
```

- [ ] **Step 3: Verify TypeScript compiles (will fail until all registrations updated)**

```bash
npx tsc --noEmit 2>&1 | grep -i "quotesection\|quoteintro" | head -10
```

Expected: errors about `QuoteSection` not found (correct — registrations not yet updated).

---

### Task 2: Update exports

**Files:**
- Modify: `src/components/block/Advance/index.ts`
- Modify: `src/components/block/index.ts`

- [ ] **Step 1: Update `Advance/index.ts`**

Find:
```ts
export { default as QuoteSection                      } from './QuoteSection'
```
Replace with:
```ts
export { default as QuoteIntroSection                 } from './QuoteIntroSection'
```

- [ ] **Step 2: Update `block/index.ts`**

Find:
```ts
  QuoteSection,
```
Replace with:
```ts
  QuoteIntroSection,
```

---

### Task 3: Update `types.ts`

**Files:**
- Modify: `src/components/LayoutBuilder/types.ts`

- [ ] **Step 1: Rename block type**

Find:
```ts
  'clients',
  'quote',
] as const
```
Replace with:
```ts
  'clients',
  'quote-intro',
] as const
```

- [ ] **Step 2: Add `quoteStyle` field**

Find:
```ts
    // ── Quote ─────────────────────────────────────────────────────────────────
    quoteText?: string
    quoteBody?: string
```
Replace with:
```ts
    // ── Quote-Intro ───────────────────────────────────────────────────────────
    quoteStyle?: 'quote' | 'intro'
    quoteText?:  string
    quoteBody?:  string
```

---

### Task 4: Update `defaultOverrides.ts`

**Files:**
- Modify: `src/components/LayoutBuilder/utils/defaultOverrides.ts`

- [ ] **Step 1: Update the case**

Find:
```ts
    case 'quote':
      return {
        content: {
          quoteText: 'I want to scale my IT team without high hiring costs.',
          quoteBody: 'We source and manage IT talent from Malaysia, Indonesia, and China, trained professionals who slot into your team and hit the ground running. You get the capacity. We handle the rest.',
        },
      }
```
Replace with:
```ts
    case 'quote-intro':
      return {
        content: {
          quoteStyle: 'quote',
          quoteText:  'I want to scale my IT team without high hiring costs.',
          quoteBody:  'We source and manage IT talent from Malaysia, Indonesia, and China, trained professionals who slot into your team and hit the ground running. You get the capacity. We handle the rest.',
        },
      }
```

---

### Task 5: Update `BlockPicker.tsx`

**Files:**
- Modify: `src/components/LayoutBuilder/BlockPicker.tsx`

- [ ] **Step 1: Update icon key**

Find:
```ts
  'quote': '💬',
```
Replace with:
```ts
  'quote-intro': '💬',
```

- [ ] **Step 2: Update label key**

Find:
```ts
  'quote': 'Quote',
```
Replace with:
```ts
  'quote-intro': 'Quote / Intro',
```

---

### Task 6: Update `ContentFields.tsx`

**Files:**
- Modify: `src/components/LayoutBuilder/fields/ContentFields.tsx`

- [ ] **Step 1: Replace `QuoteFields` with `QuoteIntroFields`**

Find:
```tsx
// ── Quote fields ──────────────────────────────────────────────────────────────
function QuoteFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Quote Text">
        <textarea
          className="lb-input lb-input--textarea"
          rows={3}
          value={ov.quoteText ?? ''}
          onChange={(e) => set('quoteText', e.target.value)}
          placeholder='"I want to scale my IT team without high hiring costs."'
        />
      </Field>

      <Field label="Body Text">
        <textarea
          className="lb-input lb-input--textarea"
          rows={4}
          value={ov.quoteBody ?? ''}
          onChange={(e) => set('quoteBody', e.target.value)}
          placeholder="Supporting description text..."
        />
      </Field>
    </>
  )
}
```

Replace with:
```tsx
// ── Quote-Intro fields ────────────────────────────────────────────────────────
function QuoteIntroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Style">
        <select
          className="lb-input lb-input--select"
          value={ov.quoteStyle ?? 'quote'}
          onChange={(e) => set('quoteStyle', e.target.value)}
        >
          <option value="quote">Quote — 24px medium with curly quotes</option>
          <option value="intro">Intro Section — 30px bold heading, no quotes</option>
        </select>
      </Field>

      <Field label="Main Text">
        <textarea
          className="lb-input lb-input--textarea"
          rows={3}
          value={ov.quoteText ?? ''}
          onChange={(e) => set('quoteText', e.target.value)}
          placeholder="Enter quote or heading text..."
        />
      </Field>

      <Field label="Body Text">
        <textarea
          className="lb-input lb-input--textarea"
          rows={4}
          value={ov.quoteBody ?? ''}
          onChange={(e) => set('quoteBody', e.target.value)}
          placeholder="Supporting description text..."
        />
      </Field>
    </>
  )
}
```

- [ ] **Step 2: Update the wire**

Find:
```tsx
        {blockType === 'quote'                 && <QuoteFields               ov={ov} set={set} />}
```
Replace with:
```tsx
        {blockType === 'quote-intro'           && <QuoteIntroFields          ov={ov} set={set} />}
```

---

### Task 7: Update `previewResolver.tsx`

**Files:**
- Modify: `src/components/LayoutBuilder/utils/previewResolver.tsx`

- [ ] **Step 1: Update import**

Find:
```ts
  QuoteSection,
```
Replace with:
```ts
  QuoteIntroSection,
```

- [ ] **Step 2: Update case**

Find:
```ts
    case 'quote':
      return withStyle(<QuoteSection data={data as any} />, blockStyle)
```
Replace with:
```ts
    case 'quote-intro':
      return withStyle(<QuoteIntroSection data={data as any} />, blockStyle)
```

---

### Task 8: Update `layout-renderer.tsx`

**Files:**
- Modify: `src/lib/layout-renderer.tsx`

- [ ] **Step 1: Update import**

Find:
```ts
  QuoteSection,
```
Replace with:
```ts
  QuoteIntroSection,
```

- [ ] **Step 2: Update case**

Find:
```ts
    case 'quote':
      return wrapAdvanced(<QuoteSection data={data} />)
```
Replace with:
```ts
    case 'quote-intro':
      return wrapAdvanced(<QuoteIntroSection data={data} />)
```

---

### Task 9: Type-check and commit

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1 | tail -10
```

Expected: no output (zero errors project-wide).

- [ ] **Step 2: Commit**

```bash
git add \
  src/components/block/Advance/QuoteIntroSection.tsx \
  src/components/block/Advance/index.ts \
  src/components/block/index.ts \
  src/components/LayoutBuilder/types.ts \
  src/components/LayoutBuilder/utils/defaultOverrides.ts \
  src/components/LayoutBuilder/BlockPicker.tsx \
  src/components/LayoutBuilder/fields/ContentFields.tsx \
  src/components/LayoutBuilder/utils/previewResolver.tsx \
  src/lib/layout-renderer.tsx \
  docs/superpowers/specs/2026-06-12-quote-intro-block-design.md \
  docs/superpowers/plans/2026-06-12-quote-intro-block.md

git rm src/components/block/Advance/QuoteSection.tsx

git commit -m "feat(quote-intro): rename quote→quote-intro block, add intro mode for Figma 1400:11625

- quoteStyle='quote' (default): 24px/500 + curly quotes (existing behaviour)
- quoteStyle='intro': 30px/700 bold heading, no quotes — matches Figma 1400:11625
- Renamed QuoteSection → QuoteIntroSection across all 9 pipeline files
- Block type 'quote' → 'quote-intro', picker label 'Quote / Intro'
- Admin: Style dropdown + Main Text + Body Text fields"
```
