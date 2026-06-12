# Quote Block — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `quote` advance block to the layout builder — a minimal centered pull-quote section with a large quote text and a smaller body text, matching Figma node 1400:11620 pixel-exactly.

**Architecture:** Single new component `QuoteSection.tsx` in `src/components/block/Advance/`. Registered across the standard 6-point pipeline: types → defaultOverrides → BlockPicker → ContentFields → previewResolver → layout-renderer. No external state, no pagination, no avatar — just two editable text fields.

**Tech Stack:** Next.js 14, React 18, TypeScript, inline `React.CSSProperties` (project convention for advance blocks).

---

## File Map

| Action | File | What changes |
|--------|------|--------------|
| **Create** | `src/components/block/Advance/QuoteSection.tsx` | New component |
| **Modify** | `src/components/block/Advance/index.ts` | Add default export |
| **Modify** | `src/components/block/index.ts` | Add named export |
| **Modify** | `src/components/LayoutBuilder/types.ts` | Add `'quote'` to `ADVANCE_BLOCK_TYPES`; add fields to `BlockOverrides.content` |
| **Modify** | `src/components/LayoutBuilder/utils/defaultOverrides.ts` | Add `case 'quote'` |
| **Modify** | `src/components/LayoutBuilder/BlockPicker.tsx` | Add icon + label |
| **Modify** | `src/components/LayoutBuilder/fields/ContentFields.tsx` | Add `QuoteFields`; wire to `blockType === 'quote'` |
| **Modify** | `src/components/LayoutBuilder/utils/previewResolver.tsx` | Add `case 'quote'` |
| **Modify** | `src/lib/layout-renderer.tsx` | Add import + `case 'quote'` |

---

### Task 1: Create `QuoteSection.tsx` component

**Files:**
- Create: `src/components/block/Advance/QuoteSection.tsx`

**Pixel-exact Figma spec (node 1400:11620):**
- Section: `background: #ffffff; padding: 96px; display: flex; flex-direction: column; align-items: center; gap: 24px`
- Quote text: `font-size: 24px; font-weight: 500; color: #111827; text-align: center; max-width: 896px; line-height: 40px` — wrapped in curly quotes `"…"`
- Body text: `font-size: 16px; font-weight: 400; color: #4b5563; text-align: center; max-width: 768px; line-height: 24px`
- Mobile `≤767px`: `padding: 40px 24px`

- [ ] **Step 1: Write the file**

```tsx
// Quote Section — Layout Builder (Advance)
// Centered pull-quote: large quote text + smaller body text. Figma node 1400:11620.

const CSS = `
  .quotesection {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 96px;
  }

  @media (max-width: 767px) {
    .quotesection { padding: 40px 24px; }
  }
`

export interface QuoteSectionData {
  quoteText?: string
  quoteBody?: string
}

export default function QuoteSection({ data }: { data: QuoteSectionData }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="quotesection">
        {data.quoteText && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '24px',
              fontWeight: 500,
              color: '#111827',
              textAlign: 'center',
              maxWidth: '896px',
              lineHeight: '40px',
              margin: 0,
            }}
          >
            &ldquo;{data.quoteText}&rdquo;
          </p>
        )}

        {data.quoteBody && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '16px',
              fontWeight: 400,
              color: '#4b5563',
              textAlign: 'center',
              maxWidth: '768px',
              lineHeight: '24px',
              margin: 0,
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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "QuoteSection" | head -5
```

Expected: no output (zero errors).

---

### Task 2: Register exports

**Files:**
- Modify: `src/components/block/Advance/index.ts`
- Modify: `src/components/block/index.ts`

- [ ] **Step 1: Add to `Advance/index.ts`**

Find the last export line (currently `export { default as DynamicFormSection } from './DynamicFormSection'` or similar). Add after it:

```ts
export { default as QuoteSection                  } from './QuoteSection'
```

- [ ] **Step 2: Add to `block/index.ts`**

Find the line `ClientsSection,` in the named exports. Add after it:

```ts
  QuoteSection,
```

---

### Task 3: Register in `types.ts`

**Files:**
- Modify: `src/components/LayoutBuilder/types.ts`

- [ ] **Step 1: Add `'quote'` to `ADVANCE_BLOCK_TYPES`**

Find this line (currently the last entry):

```ts
  'clients',
] as const
```

Replace with:

```ts
  'clients',
  'quote',
] as const
```

- [ ] **Step 2: Add fields to `BlockOverrides.content`**

Find this comment block:

```ts
    // ── Clients ───────────────────────────────────────────────────────────────
    clientsHeading?:   string
```

Add after the clients block (after `clientItems?:`):

```ts
    // ── Quote ─────────────────────────────────────────────────────────────────
    quoteText?: string
    quoteBody?: string
```

---

### Task 4: Add default overrides

**Files:**
- Modify: `src/components/LayoutBuilder/utils/defaultOverrides.ts`

- [ ] **Step 1: Add `case 'quote'`**

Find:

```ts
    case 'clients':
      return {
```

Add before it:

```ts
    case 'quote':
      return {
        content: {
          quoteText: 'I want to scale my IT team without high hiring costs.',
          quoteBody: 'We source and manage IT talent from Malaysia, Indonesia, and China, trained professionals who slot into your team and hit the ground running. You get the capacity. We handle the rest.',
        },
      }

```

---

### Task 5: Register in `BlockPicker.tsx`

**Files:**
- Modify: `src/components/LayoutBuilder/BlockPicker.tsx`

- [ ] **Step 1: Add icon**

Find:

```ts
  'clients': '🏢',
```

Add after it:

```ts
  'quote': '💬',
```

- [ ] **Step 2: Add label**

Find:

```ts
  'clients': 'Clients',
```

Add after it:

```ts
  'quote': 'Quote',
```

---

### Task 6: Add admin fields in `ContentFields.tsx`

**Files:**
- Modify: `src/components/LayoutBuilder/fields/ContentFields.tsx`

The `Field` and `TextArea` helpers (or standard `<textarea>`) are already available in the file. Use `Field` + `<textarea className="lb-input lb-input--textarea">` matching the pattern used elsewhere (e.g. `SubscribeFields`).

- [ ] **Step 1: Add `QuoteFields` function**

Find the line:

```tsx
{blockType === 'clients'               && <ClientsFields             ov={ov} set={set} />}
```

Add a `QuoteFields` function **before** the `export default` (or near other field functions — before the render return). Add it near `ClientsFields` at the bottom of the function list:

```tsx
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

- [ ] **Step 2: Wire `QuoteFields` into the render block**

Find:

```tsx
        {blockType === 'clients'               && <ClientsFields             ov={ov} set={set} />}
```

Add after it:

```tsx
        {blockType === 'quote'                 && <QuoteFields               ov={ov} set={set} />}
```

---

### Task 7: Register in `previewResolver.tsx`

**Files:**
- Modify: `src/components/LayoutBuilder/utils/previewResolver.tsx`

- [ ] **Step 1: Add import**

Find the `ClientsSection` import line (near top of file with other advance block imports). Add after it:

```ts
import { QuoteSection } from '../../block/Advance'
```

- [ ] **Step 2: Add `case 'quote'`**

Find:

```ts
    case 'clients':
      return withStyle(<ClientsSection data={data as any} />, blockStyle)
```

Add after it:

```ts
    case 'quote':
      return withStyle(<QuoteSection data={data as any} />, blockStyle)
```

---

### Task 8: Register in `layout-renderer.tsx`

**Files:**
- Modify: `src/lib/layout-renderer.tsx`

- [ ] **Step 1: Add import**

Find line 74 (the `ClientsSection` import):

```ts
  ClientsSection,
```

Add after it:

```ts
  QuoteSection,
```

- [ ] **Step 2: Add `case 'quote'`**

Find:

```ts
    case 'clients':
      return wrapAdvanced(<ClientsSection data={data} />)
```

Add after it:

```ts
    case 'quote':
      return wrapAdvanced(<QuoteSection data={data} />)
```

---

### Task 9: Final type-check and commit

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1 | tail -10
```

Expected: no output (zero errors project-wide).

- [ ] **Step 2: Commit**

```bash
git add \
  src/components/block/Advance/QuoteSection.tsx \
  src/components/block/Advance/index.ts \
  src/components/block/index.ts \
  src/components/LayoutBuilder/types.ts \
  src/components/LayoutBuilder/utils/defaultOverrides.ts \
  src/components/LayoutBuilder/BlockPicker.tsx \
  src/components/LayoutBuilder/fields/ContentFields.tsx \
  src/components/LayoutBuilder/utils/previewResolver.tsx \
  src/lib/layout-renderer.tsx \
  docs/superpowers/specs/2026-06-12-quote-block-design.md \
  docs/superpowers/plans/2026-06-12-quote-block.md

git commit -m "feat(quote-block): add Quote advance block matching Figma node 1400:11620

- Centered pull-quote section: large 24px/500 quote + 16px/400 body text
- Pixel-exact: #111827 quote, #4b5563 body, 896px/768px max-widths, 96px padding
- Curly quotes rendered via HTML entities
- Mobile: padding collapses to 40px 24px at ≤767px
- Wired to layout builder preview (previewResolver) and frontend (layout-renderer)"
```
