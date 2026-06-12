# Clients Block — Layout Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fully editable "Clients / Trusted By" block to the layout builder — matching the Figma design pixel-exactly — with configurable logo array, grayscale toggle, and paginated logo display (arrows + dot indicators).

**Architecture:** New `ClientsSection` React component in `src/components/block/Advance/` renders logos from a `clientItems` array with optional grayscale effect and client-side pagination state. The layout builder wires it up through the existing pattern: types → defaultOverrides → ContentFields → BlockPicker → previewResolver → block/index export.

**Tech Stack:** Next.js 14, React 18, TypeScript, inline CSS (project convention for advance blocks), no new dependencies.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| **Create** | `src/components/block/Advance/ClientsSection.tsx` | Visual component — heading, logo grid, pagination |
| **Modify** | `src/components/block/Advance/index.ts` | Export `ClientsSection` |
| **Modify** | `src/components/LayoutBuilder/types.ts` | Add `'clients'` to `ADVANCE_BLOCK_TYPES`; add content fields to `BlockOverrides` |
| **Modify** | `src/components/LayoutBuilder/utils/defaultOverrides.ts` | Add `case 'clients'` with sample logos |
| **Modify** | `src/components/LayoutBuilder/fields/ContentFields.tsx` | Add `ClientsFields` component + register in switch |
| **Modify** | `src/components/LayoutBuilder/BlockPicker.tsx` | Add icon `🏢` + label `Clients` |
| **Modify** | `src/components/LayoutBuilder/utils/previewResolver.tsx` | Import + register `case 'clients'` |

---

### Task 1: Create `ClientsSection` visual component

**Files:**
- Create: `src/components/block/Advance/ClientsSection.tsx`

- [ ] **Step 1: Create the component file**

```tsx
'use client'

import { useState } from 'react'

interface ClientItem {
  clientName?: string
  clientLogo?: { url: string; alt?: string } | null
  clientUrl?:  string
}

interface ClientsData {
  heading?:        string
  clientItems?:    ClientItem[]
  clientsPageSize?: number
  grayscale?:      boolean
}

export default function ClientsSection({ data }: { data: ClientsData }) {
  const {
    heading        = 'Trusted by',
    clientItems    = [],
    clientsPageSize = 6,
    grayscale      = true,
  } = data

  const pageSize   = Math.max(1, Number(clientsPageSize) || 6)
  const totalPages = Math.max(1, Math.ceil(clientItems.length / pageSize))
  const [page, setPage] = useState(0)

  const visibleItems = clientItems.slice(page * pageSize, page * pageSize + pageSize)

  return (
    <section className="clients-section" style={sectionStyle}>
      {/* Heading */}
      <div style={headingWrapStyle}>
        <p style={headingStyle}>{heading}</p>
      </div>

      {/* Logo row */}
      <div style={logoRowStyle}>
        {/* Prev arrow */}
        {totalPages > 1 && (
          <button
            aria-label="Previous"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            style={{ ...arrowStyle, opacity: page === 0 ? 0.3 : 1 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M13 4L7 10l6 6" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Logos */}
        <div style={logosInnerStyle}>
          {visibleItems.length === 0 ? (
            <p style={{ color: '#9ca3af', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px' }}>
              No client logos added yet.
            </p>
          ) : (
            visibleItems.map((item, i) => {
              const logoEl = item.clientLogo?.url ? (
                <img
                  src={item.clientLogo.url}
                  alt={item.clientLogo.alt || item.clientName || `Client ${i + 1}`}
                  style={{
                    maxHeight:  '48px',
                    maxWidth:   '140px',
                    objectFit:  'contain',
                    display:    'block',
                    filter:     grayscale ? 'grayscale(1)' : 'none',
                    opacity:    grayscale ? 0.7 : 1,
                    transition: 'opacity 0.2s, filter 0.2s',
                  }}
                />
              ) : (
                <div style={placeholderStyle}>
                  <span style={{ color: '#9ca3af', fontSize: '11px' }}>{item.clientName || `Logo ${i + 1}`}</span>
                </div>
              )

              return (
                <div key={i} style={logoItemStyle}>
                  {item.clientUrl ? (
                    <a href={item.clientUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', lineHeight: 0 }}>
                      {logoEl}
                    </a>
                  ) : logoEl}
                </div>
              )
            })
          )}
        </div>

        {/* Next arrow */}
        {totalPages > 1 && (
          <button
            aria-label="Next"
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            style={{ ...arrowStyle, opacity: page === totalPages - 1 ? 0.3 : 1 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M7 4l6 6-6 6" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {totalPages > 1 && (
        <div style={dotsStyle}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              aria-label={`Page ${i + 1}`}
              onClick={() => setPage(i)}
              style={{
                ...dotStyle,
                background: i === page ? '#111827' : '#d1d5db',
                transform:  i === page ? 'scale(1.25)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .clients-section { padding: 40px 24px !important; }
        }
      `}</style>
    </section>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const sectionStyle: React.CSSProperties = {
  background:     '#ffffff',
  padding:        '64px 96px',
  display:        'flex',
  flexDirection:  'column',
  gap:            '48px',
  alignItems:     'center',
  width:          '100%',
  boxSizing:      'border-box',
}

const headingWrapStyle: React.CSSProperties = {
  display:        'flex',
  flexDirection:  'column',
  alignItems:     'center',
  width:          '100%',
}

const headingStyle: React.CSSProperties = {
  fontFamily:  'var(--font-work-sans, sans-serif)',
  fontWeight:  500,
  fontSize:    '24px',
  lineHeight:  '32px',
  color:       '#111827',
  textAlign:   'center',
  margin:      0,
}

const logoRowStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  gap:            '16px',
  width:          '100%',
  justifyContent: 'center',
}

const logosInnerStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  gap:            '80px',
  flex:           '1 0 0',
  minHeight:      '89px',
  flexWrap:       'wrap',
}

const logoItemStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  flexShrink:     0,
}

const placeholderStyle: React.CSSProperties = {
  width:          '120px',
  height:         '48px',
  background:     '#f3f4f6',
  borderRadius:   '6px',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
}

const arrowStyle: React.CSSProperties = {
  width:          '36px',
  height:         '36px',
  borderRadius:   '50%',
  border:         '1px solid #e5e7eb',
  background:     '#ffffff',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  cursor:         'pointer',
  flexShrink:     0,
  transition:     'opacity 0.2s',
  padding:        0,
}

const dotsStyle: React.CSSProperties = {
  display:  'flex',
  gap:      '8px',
  alignItems: 'center',
}

const dotStyle: React.CSSProperties = {
  width:        '8px',
  height:       '8px',
  borderRadius: '50%',
  border:       'none',
  cursor:       'pointer',
  padding:      0,
  transition:   'background 0.2s, transform 0.2s',
}
```

- [ ] **Step 2: Verify the file compiles** (no build step needed — TypeScript errors will surface in Task 7's build check)

---

### Task 2: Export `ClientsSection` from block index

**Files:**
- Modify: `src/components/block/Advance/index.ts`

- [ ] **Step 1: Add the export line**

Open `src/components/block/Advance/index.ts` and append after the last export:

```ts
export { default as ClientsSection                   } from './ClientsSection'
```

(Keep alphabetical order consistent with the file's existing style.)

---

### Task 3: Register `'clients'` in layout builder types

**Files:**
- Modify: `src/components/LayoutBuilder/types.ts`

- [ ] **Step 1: Add `'clients'` to `ADVANCE_BLOCK_TYPES`**

In `types.ts`, find the `ADVANCE_BLOCK_TYPES` array and add `'clients'` at the end (before the closing `] as const`):

```ts
  'subscribe',
  'clients',       // ← add this line
] as const
```

- [ ] **Step 2: Add content-field types to `BlockOverrides`**

In the `BlockOverrides` interface, inside the `content?:` block, add after the `// ── Subscribe` section:

```ts
    // ── Clients ───────────────────────────────────────────────────────────────
    clientsHeading?:   string
    clientsGrayscale?: boolean
    clientsPageSize?:  number
    clientItems?: Array<{ clientName?: string; clientLogo?: MediaRef | null; clientUrl?: string }>
```

---

### Task 4: Add default overrides for `'clients'`

**Files:**
- Modify: `src/components/LayoutBuilder/utils/defaultOverrides.ts`

- [ ] **Step 1: Add the `case 'clients'` block**

Find the `case 'partnership':` block (near the end of the switch). Insert the new case immediately before `default:`:

```ts
    case 'clients':
      return {
        content: {
          clientsHeading:  'Trusted by',
          clientsGrayscale: true,
          clientsPageSize:  6,
          clientItems: [
            { clientName: 'Quality HealthCare', clientLogo: null, clientUrl: '' },
            { clientName: 'BOCI',               clientLogo: null, clientUrl: '' },
            { clientName: 'Bank of China',      clientLogo: null, clientUrl: '' },
            { clientName: 'CCB',                clientLogo: null, clientUrl: '' },
            { clientName: 'Emperor Group',      clientLogo: null, clientUrl: '' },
          ],
        },
      }
```

---

### Task 5: Add `ClientsFields` panel in `ContentFields.tsx`

**Files:**
- Modify: `src/components/LayoutBuilder/fields/ContentFields.tsx`

- [ ] **Step 1: Add the `ClientsFields` component function**

Find the `function PartnershipFields(...)` definition and insert the new function immediately before it:

```tsx
function ClientsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.clientItems ?? []

  function setItems(next: any[]) { set('clientItems', next) }

  return (
    <>
      <Field label="Section Heading">
        <input
          className="lb-input"
          value={ov.clientsHeading ?? ''}
          onChange={(e) => set('clientsHeading', e.target.value)}
          placeholder="Trusted by"
        />
      </Field>

      <Row>
        <Field label="Logos per page">
          <input
            className="lb-input"
            type="number"
            min={1}
            max={20}
            value={ov.clientsPageSize ?? 6}
            onChange={(e) => set('clientsPageSize', Number(e.target.value))}
          />
        </Field>
        <Field label="Grayscale logos">
          <select
            className="lb-input lb-input--select"
            value={ov.clientsGrayscale === false ? 'color' : 'grayscale'}
            onChange={(e) => set('clientsGrayscale', e.target.value === 'grayscale')}
          >
            <option value="grayscale">Grayscale (default)</option>
            <option value="color">Full colour</option>
          </select>
        </Field>
      </Row>

      <Field label="Client Logos">
        <div className="lb-items">
          {items.map((item: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Client {i + 1}</span>
                <button
                  className="lb-item__remove"
                  onClick={() => { const a = [...items]; a.splice(i, 1); setItems(a) }}
                >
                  ✕
                </button>
              </div>
              <MediaField
                label="Logo image"
                value={item?.clientLogo?.url ?? ''}
                onChange={(ref) => {
                  const a = [...items]
                  a[i] = { ...a[i], clientLogo: ref }
                  setItems(a)
                }}
              />
              <Field label="Client name (alt text)">
                <input
                  className="lb-input"
                  value={item?.clientName ?? ''}
                  onChange={(e) => { const a = [...items]; a[i] = { ...a[i], clientName: e.target.value }; setItems(a) }}
                  placeholder="Quality HealthCare"
                />
              </Field>
              <Field label="Link URL (optional)">
                <input
                  className="lb-input"
                  value={item?.clientUrl ?? ''}
                  onChange={(e) => { const a = [...items]; a[i] = { ...a[i], clientUrl: e.target.value }; setItems(a) }}
                  placeholder="https://example.com"
                />
              </Field>
            </div>
          ))}
          <button
            className="lb-items__add"
            onClick={() => setItems([...items, { clientName: '', clientLogo: null, clientUrl: '' }])}
          >
            + Add Client Logo
          </button>
        </div>
      </Field>
    </>
  )
}
```

- [ ] **Step 2: Register `ClientsFields` in the switch block**

Find the line:
```tsx
{blockType === 'partnership'            && <PartnershipFields         ov={ov} set={set} />}
```

Insert immediately before it:
```tsx
{blockType === 'clients'               && <ClientsFields             ov={ov} set={set} />}
```

---

### Task 6: Register in `BlockPicker.tsx`

**Files:**
- Modify: `src/components/LayoutBuilder/BlockPicker.tsx`

- [ ] **Step 1: Add icon**

In the `BLOCK_ICONS` object, find `'partnership': '🤝',` and insert before it:
```ts
  'clients': '🏢',
```

- [ ] **Step 2: Add label**

In the `BLOCK_LABELS` object, find `'partnership': 'Partnership',` and insert before it:
```ts
  'clients': 'Clients',
```

---

### Task 7: Register in `previewResolver.tsx`

**Files:**
- Modify: `src/components/LayoutBuilder/utils/previewResolver.tsx`

- [ ] **Step 1: Import `ClientsSection`**

Find the import block that ends with:
```tsx
  SubscribeSection,
} from '@/components/block'
```

Change it to:
```tsx
  SubscribeSection,
  ClientsSection,
} from '@/components/block'
```

- [ ] **Step 2: Add the render case**

Find:
```tsx
    case 'subscribe':
      return withStyle(<SubscribeSection data={data as any} />, blockStyle)
```

Insert immediately after it:
```tsx
    case 'clients':
      return withStyle(<ClientsSection data={data as any} />, blockStyle)
```

---

### Task 8: Wire `ClientsSection` data mapping (prop alignment check)

`ClientsSection` receives `data` from `previewResolver` which passes `overrides.content` merged with template defaults. Verify the prop names match:

| `BlockOverrides.content` field | `ClientsData` prop |
|-------------------------------|-------------------|
| `clientsHeading`              | `heading`         |
| `clientsGrayscale`            | `grayscale`       |
| `clientsPageSize`             | `clientsPageSize` |
| `clientItems`                 | `clientItems`     |

**The prop names diverge.** `previewResolver` passes the raw `content` object as `data`. Fix by updating the destructure defaults inside `ClientsSection` to use the correct keys from `BlockOverrides`:

- [ ] **Step 1: Update destructuring in `ClientsSection.tsx`**

In `ClientsSection`, change:
```tsx
  const {
    heading        = 'Trusted by',
    clientItems    = [],
    clientsPageSize = 6,
    grayscale      = true,
  } = data
```

To:
```tsx
  const {
    clientsHeading:  heading        = 'Trusted by',
    clientItems                     = [],
    clientsPageSize                 = 6,
    clientsGrayscale: grayscale     = true,
  } = data as any
```

And update the `ClientsData` interface to match:
```tsx
interface ClientsData {
  clientsHeading?:   string
  clientItems?:      ClientItem[]
  clientsPageSize?:  number
  clientsGrayscale?: boolean
}
```

---

### Task 9: Verify build compiles cleanly

- [ ] **Step 1: Run TypeScript check**

```bash
cd /Users/tansams/Documents/GitHub/atech-website && npx tsc --noEmit 2>&1 | grep -E "error TS|ClientsSection|clients" | head -30
```

Expected: no errors related to `ClientsSection` or `clients` block type.

- [ ] **Step 2: Run dev server and open layout builder**

```bash
npm run dev
```

Open the layout builder, add a "Clients" block, verify:
- Block appears in the Advance section of BlockPicker with 🏢 icon
- Selecting it shows the ClientsFields panel (Heading, Logos per page, Grayscale, Client Logos repeater)
- Preview renders the section with the "Trusted by" heading and placeholder items
- Adding logo images via media picker shows them in the preview
- Switching "Logos per page" to 3 with 5+ logos shows prev/next arrows and dot indicators
- Grayscale toggle switches between desaturated and full-colour logos

---

### Task 10: Commit

- [ ] **Step 1: Stage and commit**

```bash
git add \
  src/components/block/Advance/ClientsSection.tsx \
  src/components/block/Advance/index.ts \
  src/components/LayoutBuilder/types.ts \
  src/components/LayoutBuilder/utils/defaultOverrides.ts \
  src/components/LayoutBuilder/fields/ContentFields.tsx \
  src/components/LayoutBuilder/BlockPicker.tsx \
  src/components/LayoutBuilder/utils/previewResolver.tsx

git commit -m "feat(layout-builder): add Clients / Trusted-By block with pagination and grayscale toggle"
```
