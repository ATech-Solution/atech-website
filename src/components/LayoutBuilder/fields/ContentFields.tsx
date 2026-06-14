'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { BlockOverrides, BlockType, MediaRef } from '../types'
import { ADVANCE_BLOCK_TYPES } from '../types'

interface ContentFieldsProps {
  blockType: BlockType
  overrides: BlockOverrides['content']
  onChange: (overrides: BlockOverrides['content']) => void
}

const NO_TEXT_TYPES: BlockType[] = ['divider', 'spacer', 'image', 'video', 'google-map']
const ITEMS_TYPES: BlockType[] = [
  'tabs', 'accordion', 'icon-list', 'image-carousel',
  'basic-gallery', 'counter', 'progress-bar', 'testimonial', 'social-icons',
]

// Strip the origin from absolute URLs so only the pathname is stored — ensures
// media refs work on any server (local, UAT, prod) without URL rewriting.
function toRelativePath(url: string): string {
  try { return new URL(url).pathname } catch { return url }
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="lb-field">
      {label && <label className="lb-field__label">{label}</label>}
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>{children}</div>
}

// ── Media picker ──────────────────────────────────────────────────────────────
type MediaItem = { id: string; url: string; alt?: string; filename?: string }

export function MediaField({
  label = 'Image',
  value,
  onChange,
}: {
  label?: string
  value: string
  onChange: (ref: MediaRef | null) => void
}) {
  const [open, setOpen]               = useState(false)
  const [tab, setTab]                 = useState<'media' | 'url'>('media')
  const [mediaItems, setMediaItems]   = useState<MediaItem[]>([])
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef                  = useRef<HTMLInputElement>(null)

  const openPicker = async () => {
    setOpen(true)
    if (!mediaLoaded) {
      try {
        const res  = await fetch('/api/media?limit=100&depth=0', { credentials: 'include' })
        const data = await res.json()
        setMediaItems(data?.docs ?? [])
        setMediaLoaded(true)
      } catch { setMediaLoaded(true) }
    }
  }

  const pick = (url: string) => { onChange({ url: toRelativePath(url) }); setOpen(false) }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError('')
    const uploaded: MediaItem[] = []
    for (const file of Array.from(files)) {
      try {
        const form = new FormData()
        form.append('file', file)
        const res  = await fetch('/api/media', { method: 'POST', credentials: 'include', body: form })
        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        const doc  = data.doc ?? data
        if (doc?.url) uploaded.push({ id: doc.id, url: toRelativePath(doc.url), alt: doc.alt ?? '', filename: doc.filename })
      } catch {
        setUploadError(`Failed to upload ${file.name}`)
      }
    }
    if (uploaded.length > 0) {
      setMediaItems((prev) => [...uploaded, ...prev])
      // Auto-select the last uploaded item and close
      const last = uploaded[uploaded.length - 1]
      onChange({ url: toRelativePath(last.url), alt: last.alt })
      setOpen(false)
    }
    setUploading(false)
  }

  return (
    <div className="lb-field">
      <label className="lb-field__label">{label}</label>

      {value && (
        <div style={{ marginBottom: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            style={{ maxHeight: 72, maxWidth: '100%', borderRadius: 6, border: '1px solid #e5e5e5', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {!open ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            className="lb-input"
            style={{ flex: 1, minWidth: 0 }}
            value={value}
            onChange={(e) => onChange(e.target.value ? { url: e.target.value } : null)}
            placeholder="/media/image.jpg"
          />
          <button type="button" className="lb-btn lb-btn--secondary" onClick={openPicker}
            style={{ flexShrink: 0, padding: '0 10px', fontSize: 11, fontWeight: 500 }}>
            Browse
          </button>
          {value && (
            <button type="button" className="lb-btn lb-btn--secondary" onClick={() => onChange(null)}
              style={{ flexShrink: 0, padding: '0 8px', fontSize: 11, color: '#e55' }} title="Clear">
              ✕
            </button>
          )}
        </div>
      ) : (
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5' }}>
            {(['media', 'url'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)}
                style={{ flex: 1, padding: '8px 12px', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: tab === t ? '#f5f5f5' : '#fff',
                  borderBottom: tab === t ? '2px solid #292929' : '2px solid transparent',
                  color: tab === t ? '#292929' : '#6b7280', transition: 'color 0.1s' }}>
                {t === 'media' ? 'Media Library' : 'URL'}
              </button>
            ))}
            <button type="button" onClick={() => setOpen(false)}
              style={{ padding: '8px 12px', fontSize: 14, border: 'none', cursor: 'pointer', background: '#fff', color: '#9ca3af' }}>✕</button>
          </div>

          {tab === 'media' ? (
            <div>
              {/* Upload bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.svg,.pdf"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => handleUpload(e.target.files)}
                />
                <button
                  type="button"
                  className="lb-media-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="lb-media-upload-btn__spinner" />
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M6 1v7M3 4l3-3 3 3" />
                      <path d="M1 9.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1" />
                    </svg>
                  )}
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
                <span style={{ fontSize: 10, color: '#9ca3af' }}>or bulk select files</span>
                {uploadError && <span style={{ fontSize: 10, color: '#ef4444', marginLeft: 'auto' }}>{uploadError}</span>}
              </div>
              {/* Grid */}
              <div style={{ padding: 10, maxHeight: 190, overflowY: 'auto' }}>
                {!mediaLoaded ? (
                  <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: '16px 0' }}>Loading…</p>
                ) : mediaItems.length === 0 ? (
                  <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: '16px 0' }}>No media files — upload one above</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                    {mediaItems.map((item) => (
                      <button key={item.id} type="button" onClick={() => pick(item.url)}
                        title={item.alt ?? item.filename ?? item.url}
                        style={{ padding: 0, border: value === item.url ? '2px solid #292929' : '1px solid #e5e5e5',
                          borderRadius: 6, overflow: 'hidden', cursor: 'pointer', background: '#f5f5f5', aspectRatio: '1' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.url} alt={item.alt ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input className="lb-input" value={value} onChange={(e) => onChange(e.target.value ? { url: e.target.value } : null)}
                placeholder="https://example.com/image.jpg" autoFocus />
              <button type="button" className="lb-btn lb-btn--primary" onClick={() => setOpen(false)} style={{ width: '100%' }}>Apply</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Link picker (internal page or external URL) ───────────────────────────────
type PageItem = { id: string; slug: string; title?: string }

function LinkField({
  label,
  value,
  onChange,
  placeholder = '/page or https://…',
}: {
  label: string
  value: string
  onChange: (url: string) => void
  placeholder?: string
}) {
  const [open, setOpen]   = useState(false)
  const [tab, setTab]     = useState<'internal' | 'external'>('internal')
  const [pages, setPages] = useState<PageItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const openPicker = async () => {
    setOpen(true)
    if (!loaded) {
      try {
        const res  = await fetch('/api/pages?limit=100&depth=0', { credentials: 'include' })
        const data = await res.json()
        setPages(data?.docs ?? [])
        setLoaded(true)
      } catch { setLoaded(true) }
    }
  }

  const pickPage = (slug: string) => { onChange('/' + slug); setOpen(false) }

  return (
    <div className="lb-field">
      {label && <label className="lb-field__label">{label}</label>}
      {!open ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            className="lb-input"
            style={{ flex: 1, minWidth: 0 }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          <button type="button" className="lb-btn lb-btn--secondary" onClick={openPicker}
            style={{ flexShrink: 0, padding: '0 10px', fontSize: 11, fontWeight: 500 }}>
            Pick
          </button>
          {value && (
            <button type="button" className="lb-btn lb-btn--secondary" onClick={() => onChange('')}
              style={{ flexShrink: 0, padding: '0 8px', fontSize: 11, color: '#e55' }} title="Clear">
              ✕
            </button>
          )}
        </div>
      ) : (
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5' }}>
            {(['internal', 'external'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)}
                style={{ flex: 1, padding: '8px 12px', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: tab === t ? '#f5f5f5' : '#fff',
                  borderBottom: tab === t ? '2px solid #292929' : '2px solid transparent',
                  color: tab === t ? '#292929' : '#6b7280', transition: 'color 0.1s' }}>
                {t === 'internal' ? 'Internal Page' : 'External URL'}
              </button>
            ))}
            <button type="button" onClick={() => setOpen(false)}
              style={{ padding: '8px 12px', fontSize: 14, border: 'none', cursor: 'pointer', background: '#fff', color: '#9ca3af' }}>✕</button>
          </div>

          {tab === 'internal' ? (
            <div style={{ padding: 8, maxHeight: 200, overflowY: 'auto' }}>
              {!loaded ? (
                <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: '16px 0' }}>Loading…</p>
              ) : pages.length === 0 ? (
                <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: '16px 0' }}>No pages found</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {pages.map((page) => (
                    <button key={page.id} type="button" onClick={() => pickPage(page.slug)}
                      style={{ textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                        background: value === '/' + page.slug ? '#f0f0f0' : 'transparent', fontSize: 12, color: '#171717' }}>
                      <span style={{ fontWeight: 500 }}>{page.title || page.slug}</span>
                      <span style={{ color: '#9ca3af', marginLeft: 8 }}>/{page.slug}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input className="lb-input" value={value} onChange={(e) => onChange(e.target.value)}
                placeholder="https://example.com" autoFocus />
              <button type="button" className="lb-btn lb-btn--primary" onClick={() => setOpen(false)} style={{ width: '100%' }}>Apply</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Button icon row (icon media + position select + optional fill toggle) ──────
function BtnIconRow({
  iconValue,
  iconPos,
  iconFill,
  onIconChange,
  onIconPosChange,
  onIconFillChange,
}: {
  iconValue: string
  iconPos: string
  iconFill?: boolean
  onIconChange: (ref: MediaRef | null) => void
  onIconPosChange: (v: string) => void
  onIconFillChange?: (v: boolean) => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'end' }}>
      <div>
        <MediaField label="Button Icon (empty = none)" value={iconValue} onChange={onIconChange} />
        {iconValue && onIconFillChange && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6b7280', cursor: 'pointer', marginTop: 4 }}>
            <input type="checkbox" checked={iconFill ?? false} onChange={(e) => onIconFillChange(e.target.checked)} style={{ margin: 0 }} />
            Fill (stretch icon to fit)
          </label>
        )}
      </div>
      <div>
        <label className="lb-field__label" style={{ display: 'block', marginBottom: 4 }}>Position</label>
        <select className="lb-input lb-input--select" value={iconPos} onChange={(e) => onIconPosChange(e.target.value)}
          style={{ width: 80 }}>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  )
}

// ── CTA button group (label + URL + icon + pos + fill) ─────────────────────────
function CtaGroup({
  groupLabel,
  label, labelPlaceholder,
  url, urlPlaceholder,
  iconValue, iconPos, iconFill,
  onLabelChange, onUrlChange, onIconChange, onIconPosChange, onIconFillChange,
}: {
  groupLabel: string
  label: string; labelPlaceholder?: string
  url: string; urlPlaceholder?: string
  iconValue: string; iconPos: string; iconFill?: boolean
  onLabelChange: (v: string) => void
  onUrlChange: (v: string) => void
  onIconChange: (ref: MediaRef | null) => void
  onIconPosChange: (v: string) => void
  onIconFillChange?: (v: boolean) => void
}) {
  return (
    <div className="lb-cta-group">
      <div className="lb-field__label" style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{groupLabel}</div>
      <Row>
        <Field label="Label">
          <input className="lb-input" value={label} onChange={(e) => onLabelChange(e.target.value)} placeholder={labelPlaceholder ?? 'Button label'} />
        </Field>
        <LinkField label="URL" value={url} onChange={onUrlChange} placeholder={urlPlaceholder ?? '/page or https://…'} />
      </Row>
      <BtnIconRow iconValue={iconValue} iconPos={iconPos} iconFill={iconFill} onIconChange={onIconChange} onIconPosChange={onIconPosChange} onIconFillChange={onIconFillChange} />
    </div>
  )
}

// ── Home Hero fields ──────────────────────────────────────────────────────────
function HomeHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const stats: any[]         = ov.heroStats      ?? []
  const cards: any[]         = ov.floatingCards  ?? []

  return (
    <>
      <Field label="Badge Text">
        <input className="lb-input" value={ov.badge ?? ''} onChange={(e) => set('badge', e.target.value)} placeholder="Welcome to ATech" />
      </Field>
      <MediaField label="Badge Icon (optional)" value={ov.badgeIcon?.url ?? ''} onChange={(ref) => set('badgeIcon', ref)} />

      <Field label="Heading (Bold)">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="ATech Solution" />
      </Field>
      <Field label="Heading Sub (Regular)">
        <input className="lb-input" value={ov.headingSub ?? ''} onChange={(e) => set('headingSub', e.target.value)} placeholder="Your Technology Partner" />
      </Field>
      <Field label="Body Text">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.body ?? ''} onChange={(e) => set('body', e.target.value)} placeholder="Supporting paragraph…" />
      </Field>

      <CtaGroup
        groupLabel="Primary CTA"
        label={ov.ctaPrimaryLabel ?? ''} labelPlaceholder="Explore Services"
        url={ov.ctaPrimaryUrl ?? ''} urlPlaceholder="/services"
        iconValue={ov.ctaPrimaryIcon?.url ?? ''} iconPos={ov.ctaPrimaryIconPos ?? 'right'} iconFill={ov.ctaPrimaryIconFill ?? false}
        onLabelChange={(v) => set('ctaPrimaryLabel', v)}
        onUrlChange={(v) => set('ctaPrimaryUrl', v)}
        onIconChange={(ref) => set('ctaPrimaryIcon', ref)}
        onIconPosChange={(v) => set('ctaPrimaryIconPos', v)}
        onIconFillChange={(v) => set('ctaPrimaryIconFill', v)}
      />
      <CtaGroup
        groupLabel="Secondary CTA"
        label={ov.ctaSecondaryLabel ?? ''} labelPlaceholder="Learn More"
        url={ov.ctaSecondaryUrl ?? ''} urlPlaceholder="/about"
        iconValue={ov.ctaSecondaryIcon?.url ?? ''} iconPos={ov.ctaSecondaryIconPos ?? 'right'} iconFill={ov.ctaSecondaryIconFill ?? false}
        onLabelChange={(v) => set('ctaSecondaryLabel', v)}
        onUrlChange={(v) => set('ctaSecondaryUrl', v)}
        onIconChange={(ref) => set('ctaSecondaryIcon', ref)}
        onIconPosChange={(v) => set('ctaSecondaryIconPos', v)}
        onIconFillChange={(v) => set('ctaSecondaryIconFill', v)}
      />

      <MediaField label="Background Image" value={ov.backgroundImage?.url ?? ''} onChange={(ref) => set('backgroundImage', ref)} />
      <p style={{ fontSize: 12, color: '#9ca3af', margin: '-4px 0 12px' }}>Fills the whole section as a full-bleed background with a dark gradient overlay (Figma hero). Leave empty to use the section background colour.</p>

      <MediaField label="Hero Image" value={ov.heroImage?.url ?? ''} onChange={(ref) => set('heroImage', ref)} />
      <p style={{ fontSize: 12, color: '#9ca3af', margin: '-4px 0 12px' }}>Optional right-column image. When empty, the hero uses the full-bleed background layout.</p>

      <Field label="Image Padding">
        <select className="lb-input lb-input--select" value={ov.heroImagePadding ? 'padded' : 'none'} onChange={(e) => set('heroImagePadding', e.target.value === 'padded')}>
          <option value="none">No Padding — image fills column edge-to-edge</option>
          <option value="padded">Padded — image inset 40px (matches text content rhythm)</option>
        </select>
      </Field>

      {/* Stats array */}
      <Field label="Stats">
        <div className="lb-items">
          {stats.map((s: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Stat {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...stats]; a.splice(i, 1); set('heroStats', a) }}>✕</button>
              </div>
              <Row>
                <input className="lb-input" placeholder='Value e.g. "250+"' value={s.statValue ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], statValue: e.target.value }; set('heroStats', a) }} />
                <input className="lb-input" placeholder="Label" value={s.statLabel ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], statLabel: e.target.value }; set('heroStats', a) }} />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('heroStats', [...stats, { statValue: '', statLabel: '' }])}>+ Add Stat</button>
        </div>
      </Field>

      {/* Floating cards array */}
      <Field label="Floating Cards">
        <div className="lb-items">
          {cards.map((c: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Card {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...cards]; a.splice(i, 1); set('floatingCards', a) }}>✕</button>
              </div>
              <input className="lb-input" placeholder="Card text" value={c.cardText ?? ''} onChange={(e) => { const a = [...cards]; a[i] = { ...a[i], cardText: e.target.value }; set('floatingCards', a) }} />
              <select className="lb-input lb-input--select" value={c.cardPosition ?? 'top-right'}
                onChange={(e) => { const a = [...cards]; a[i] = { ...a[i], cardPosition: e.target.value }; set('floatingCards', a) }}>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-left">Top Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
              <MediaField label="Card Icon" value={c.cardIcon?.url ?? ''} onChange={(ref) => { const a = [...cards]; a[i] = { ...a[i], cardIcon: ref }; set('floatingCards', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('floatingCards', [...cards, { cardText: '', cardPosition: 'top-right' }])}>+ Add Card</button>
        </div>
      </Field>
    </>
  )
}

// ── Home About fields ─────────────────────────────────────────────────────────
function HomeAboutFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const pillars: any[] = ov.pillars ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="About ATech Solutions" />
      </Field>
      <Field label="Description">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Short description…" />
      </Field>

      <Row>
        <Field label="Theme">
          <select className="lb-input lb-input--select" value={ov.featuresTheme ?? 'dark'} onChange={(e) => set('featuresTheme', e.target.value)}>
            <option value="dark">Dark (default)</option>
            <option value="light">Light</option>
          </select>
        </Field>
        <Field label="Columns">
          <select className="lb-input lb-input--select" value={ov.featuresColumns ?? 3} onChange={(e) => set('featuresColumns', Number(e.target.value))}>
            <option value={2}>2</option>
            <option value={3}>3 (default)</option>
            <option value={4}>4</option>
          </select>
        </Field>
      </Row>

      <Field label="Pillars">
        <div className="lb-items">
          {pillars.map((p: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Pillar {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...pillars]; a.splice(i, 1); set('pillars', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={p.pillarIcon?.url ?? ''} onChange={(ref) => { const a = [...pillars]; a[i] = { ...a[i], pillarIcon: ref }; set('pillars', a) }} />
              <input className="lb-input" placeholder="Title" value={p.pillarTitle ?? ''} onChange={(e) => { const a = [...pillars]; a[i] = { ...a[i], pillarTitle: e.target.value }; set('pillars', a) }} />
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={p.pillarDesc ?? ''} onChange={(e) => { const a = [...pillars]; a[i] = { ...a[i], pillarDesc: e.target.value }; set('pillars', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('pillars', [...pillars, {}])}>+ Add Pillar</button>
        </div>
      </Field>
    </>
  )
}

// ── Home Services fields ──────────────────────────────────────────────────────
function HomeServicesFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.serviceItems ?? []
  return (
    <>
      <Field label="Badge Text">
        <input className="lb-input" value={ov.serviceBadgeText ?? ''} onChange={(e) => set('serviceBadgeText', e.target.value)} placeholder="E-Commerce (leave empty to hide)" />
      </Field>
      <MediaField label="Badge Icon" value={ov.serviceBadgeIcon?.url ?? ''} onChange={(ref) => set('serviceBadgeIcon', ref)} />
      <Field label="Heading (HTML supported)">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Services&#10;Use &lt;em&gt;, &lt;strong&gt;, &lt;br&gt;, &lt;span style=&quot;…&quot;&gt; etc." />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Short subheading…" />
      </Field>

      <Field label="Service Items">
        <div className="lb-items">
          {items.map((s: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Service {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('serviceItems', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={s.serviceIcon?.url ?? ''} onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], serviceIcon: ref }; set('serviceItems', a) }} />
              <input className="lb-input" placeholder="Title" value={s.serviceTitle ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], serviceTitle: e.target.value }; set('serviceItems', a) }} />
              <Field label="Description (HTML supported)">
                <textarea className="lb-input lb-input--textarea" rows={3} placeholder="Short description… (HTML tags like <strong>, <em> allowed)" value={s.serviceDesc ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], serviceDesc: e.target.value }; set('serviceItems', a) }} />
              </Field>
              <Field label="Features (one per line)">
                <textarea className="lb-input lb-input--textarea" rows={4} placeholder={"Selenium & Cypress frameworks\nAPI automation testing\nCI/CD pipeline integration"} value={s.serviceFeatures ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], serviceFeatures: e.target.value }; set('serviceItems', a) }} />
              </Field>
              <LinkField label="Link URL" value={s.serviceHref ?? ''} onChange={(v) => { const a = [...items]; a[i] = { ...a[i], serviceHref: v }; set('serviceItems', a) }} placeholder="/services/web-dev" />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('serviceItems', [...items, {}])}>+ Add Service</button>
        </div>
      </Field>

      <Field label="Custom Solution Heading">
        <input className="lb-input" value={ov.customSolutionHeading ?? ''} onChange={(e) => set('customSolutionHeading', e.target.value)} placeholder="Need Custom Solution?" />
      </Field>
      <Field label="Custom Solution Body">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.customSolutionBody ?? ''} onChange={(e) => set('customSolutionBody', e.target.value)} placeholder="Short description…" />
      </Field>

      <CtaGroup
        groupLabel="Custom Solution CTA"
        label={ov.customSolutionCtaLabel ?? ''} labelPlaceholder="Chat with us"
        url={ov.customSolutionCtaUrl ?? ''} urlPlaceholder="/static/contact"
        iconValue={ov.customSolutionCtaIcon?.url ?? ''} iconPos={ov.customSolutionCtaIconPos ?? 'right'} iconFill={ov.customSolutionCtaIconFill ?? false}
        onLabelChange={(v) => set('customSolutionCtaLabel', v)}
        onUrlChange={(v) => set('customSolutionCtaUrl', v)}
        onIconChange={(ref) => set('customSolutionCtaIcon', ref)}
        onIconPosChange={(v) => set('customSolutionCtaIconPos', v)}
        onIconFillChange={(v) => set('customSolutionCtaIconFill', v)}
      />
    </>
  )
}

// ── Services (Mascot) fields ──────────────────────────────────────────────────
function ServicesMascotFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.serviceItems ?? []
  return (
    <>
      <Field label="Heading (HTML supported)">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Services" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Comprehensive technology solutions tailored to your business needs." />
      </Field>

      <Field label="Service Items">
        <div className="lb-items">
          {items.map((s: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Service {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('serviceItems', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={s.serviceIcon?.url ?? ''} onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], serviceIcon: ref }; set('serviceItems', a) }} />
              <input className="lb-input" placeholder="Title" value={s.serviceTitle ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], serviceTitle: e.target.value }; set('serviceItems', a) }} />
              <Field label="Description (HTML supported)">
                <textarea className="lb-input lb-input--textarea" rows={3} placeholder="Short description…" value={s.serviceDesc ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], serviceDesc: e.target.value }; set('serviceItems', a) }} />
              </Field>
              <LinkField label="Link URL" value={s.serviceHref ?? ''} onChange={(v) => { const a = [...items]; a[i] = { ...a[i], serviceHref: v }; set('serviceItems', a) }} placeholder="/services/it-outsourcing" />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('serviceItems', [...items, {}])}>+ Add Service</button>
        </div>
      </Field>

      <MediaField label="Mascot Image" value={ov.mascotImage?.url ?? ''} onChange={(ref) => set('mascotImage', ref)} />
      <Field label="Mascot Speech Bubble Text">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.mascotBubbleText ?? ''} onChange={(e) => set('mascotBubbleText', e.target.value)} placeholder="Hi I'm TAC, the Ambassador of ATech!" />
      </Field>
    </>
  )
}

// ── Home Testimonials fields ──────────────────────────────────────────────────
function HomeTestimonialsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.testimonialItems ?? []
  const contentSource: string = ov.testimonialsContentSource ?? 'manual'
  const isCollection = contentSource === 'collection'

  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Client Testimonials" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="What our clients say…" />
      </Field>

      {/* Content Source */}
      <Field label="Content Source">
        <select
          className="lb-input"
          value={contentSource}
          onChange={(e) => set('testimonialsContentSource', e.target.value)}
        >
          <option value="manual">Manual Items</option>
          <option value="collection">Testimonials Collection (CMS)</option>
        </select>
      </Field>

      {/* Collection mode: limit */}
      {isCollection && (
        <Field label="Items Limit">
          <input
            className="lb-input"
            type="number"
            min={1}
            max={50}
            value={ov.testimonialsLimit ?? 9}
            onChange={(e) => set('testimonialsLimit', Number(e.target.value))}
          />
        </Field>
      )}

      {/* Carousel toggle */}
      <Field label="Enable Slide Carousel">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={ov.enableCarousel ?? false}
            onChange={(e) => set('enableCarousel', e.target.checked)}
          />
          <span style={{ fontSize: '13px' }}>Show as sliding carousel</span>
        </label>
      </Field>

      {/* Manual items — hidden in collection mode */}
      {!isCollection && (
        <Field label="Testimonials">
          <div className="lb-items">
            {items.map((t: any, i: number) => (
              <div key={i} className="lb-item">
                <div className="lb-item__header">
                  <span>Testimonial {i + 1}</span>
                  <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('testimonialItems', a) }}>✕</button>
                </div>
                <Row>
                  <input className="lb-input" placeholder="Name" value={t.clientName ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], clientName: e.target.value }; set('testimonialItems', a) }} />
                  <input className="lb-input" placeholder="Role" value={t.clientRole ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], clientRole: e.target.value }; set('testimonialItems', a) }} />
                </Row>
                <input className="lb-input" placeholder="Company" value={t.clientCompany ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], clientCompany: e.target.value }; set('testimonialItems', a) }} />
                <textarea className="lb-input lb-input--textarea" rows={3} placeholder="Quote" value={t.quote ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], quote: e.target.value }; set('testimonialItems', a) }} />
                <Row>
                  <Field label="Rating (1–5)">
                    <input className="lb-input" type="number" min={1} max={5} value={t.rating ?? 5} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], rating: Number(e.target.value) }; set('testimonialItems', a) }} />
                  </Field>
                  <MediaField label="Avatar" value={t.avatar?.url ?? ''} onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], avatar: ref }; set('testimonialItems', a) }} />
                </Row>
              </div>
            ))}
            <button className="lb-items__add" onClick={() => set('testimonialItems', [...items, { rating: 5 }])}>+ Add Testimonial</button>
          </div>
        </Field>
      )}

      {isCollection && (
        <p style={{ fontSize: '12px', color: '#737373', margin: 0, padding: '8px 0' }}>
          Testimonials will be pulled from the CMS Testimonials collection. Manage entries in the admin panel.
        </p>
      )}
    </>
  )
}

// ── Home Contact fields ───────────────────────────────────────────────────────
function HomeContactFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Get in Touch" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.contactSubheading ?? ''} onChange={(e) => set('contactSubheading', e.target.value)} placeholder="Ready to start your project?" />
      </Field>
      <Field label="Info Section Heading">
        <input className="lb-input" value={ov.infoHeading ?? ''} onChange={(e) => set('infoHeading', e.target.value)} placeholder="Contact Information" />
      </Field>
      <Field label="Email">
        <input className="lb-input" type="email" value={ov.contactEmail ?? ''} onChange={(e) => set('contactEmail', e.target.value)} placeholder="hello@example.com" />
      </Field>
      <MediaField label="Email Icon (empty = default)" value={ov.contactEmailIcon?.url ?? ''} onChange={(ref) => set('contactEmailIcon', ref)} />
      <Field label="Phone">
        <input className="lb-input" value={ov.contactPhone ?? ''} onChange={(e) => set('contactPhone', e.target.value)} placeholder="+1 234 567 8900" />
      </Field>
      <MediaField label="Phone Icon (empty = default)" value={ov.contactPhoneIcon?.url ?? ''} onChange={(ref) => set('contactPhoneIcon', ref)} />
      <Field label="Location">
        <input className="lb-input" value={ov.contactLocation ?? ''} onChange={(e) => set('contactLocation', e.target.value)} placeholder="Hong Kong" />
      </Field>
      <MediaField label="Location Icon (empty = default)" value={ov.contactLocationIcon?.url ?? ''} onChange={(ref) => set('contactLocationIcon', ref)} />
      <Field label="Form Heading">
        <input className="lb-input" value={ov.formHeading ?? ''} onChange={(e) => set('formHeading', e.target.value)} placeholder="Send us a Message" />
      </Field>
      <Field label="Submit Button Label">
        <input className="lb-input" value={ov.submitLabel ?? ''} onChange={(e) => set('submitLabel', e.target.value)} placeholder="Send Message" />
      </Field>
    </>
  )
}

// ── About Hero fields ─────────────────────────────────────────────────────────
function AboutHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const mediaType: 'video' | 'image' = ov.aboutHeroMediaType ?? 'video'
  return (
    <>
      <Field label="Badge Text">
        <input className="lb-input" value={ov.badge ?? ''} onChange={(e) => set('badge', e.target.value)} placeholder="About Us" />
      </Field>
      <MediaField label="Badge Icon" value={ov.badgeIcon?.url ?? ''} onChange={(ref) => set('badgeIcon', ref)} />
      <Field label="Heading">
        <input className="lb-input" value={ov.aboutHeroHeading ?? ''} onChange={(e) => set('aboutHeroHeading', e.target.value)} placeholder="Main heading…" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.aboutHeroSubheading ?? ''} onChange={(e) => set('aboutHeroSubheading', e.target.value)} placeholder="Supporting subheading…" />
      </Field>
      <Field label="Media Type">
        <div style={{ display: 'flex', gap: 8 }}>
          {(['video', 'image'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set('aboutHeroMediaType', t)}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 4,
                border: '1px solid',
                borderColor: mediaType === t ? '#171717' : '#d4d4d4',
                background: mediaType === t ? '#171717' : '#ffffff',
                color: mediaType === t ? '#ffffff' : '#525252',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
      {mediaType === 'video' ? (
        <Field label="Video URL">
          <input className="lb-input" value={ov.aboutHeroVideoUrl ?? ''} onChange={(e) => set('aboutHeroVideoUrl', e.target.value)} placeholder="https://youtube.com/…" />
        </Field>
      ) : (
        <MediaField label="Hero Image" value={ov.aboutHeroImage?.url ?? ''} onChange={(ref) => set('aboutHeroImage', ref)} />
      )}
    </>
  )
}

// ── About Company fields ──────────────────────────────────────────────────────
function AboutCompanyFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const stats: any[] = ov.companyStats ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.aboutCompanyHeading ?? ''} onChange={(e) => set('aboutCompanyHeading', e.target.value)} placeholder="Who We Are" />
      </Field>
      <Field label="Body Paragraph 1">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.body1 ?? ''} onChange={(e) => set('body1', e.target.value)} placeholder="First paragraph…" />
      </Field>
      <Field label="Body Paragraph 2">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.body2 ?? ''} onChange={(e) => set('body2', e.target.value)} placeholder="Second paragraph…" />
      </Field>

      <Field label="Stats">
        <div className="lb-items">
          {stats.map((s: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Stat {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...stats]; a.splice(i, 1); set('companyStats', a) }}>✕</button>
              </div>
              <Row>
                <input className="lb-input" placeholder='Value e.g. "250+"' value={s.statValue ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], statValue: e.target.value }; set('companyStats', a) }} />
                <input className="lb-input" placeholder="Label" value={s.statLabel ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], statLabel: e.target.value }; set('companyStats', a) }} />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('companyStats', [...stats, { statValue: '', statLabel: '' }])}>+ Add Stat</button>
        </div>
      </Field>

      <MediaField label="Company Image" value={ov.companyImage?.url ?? ''} onChange={(ref) => set('companyImage', ref)} />
    </>
  )
}

// ── About Mission & Vision fields ─────────────────────────────────────────────
function AboutMissionVisionFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const values: any[] = ov.values ?? []
  return (
    <>
      {/* Mission */}
      <MediaField label="Mission Icon" value={ov.missionIcon?.url ?? ''} onChange={(ref) => set('missionIcon', ref)} />
      <Field label="Mission Heading">
        <input className="lb-input" value={ov.missionHeading ?? ''} onChange={(e) => set('missionHeading', e.target.value)} placeholder="Our Mission" />
      </Field>
      <Field label="Mission Body">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.missionBody ?? ''} onChange={(e) => set('missionBody', e.target.value)} placeholder="Mission statement…" />
      </Field>

      {/* Vision */}
      <MediaField label="Vision Icon" value={ov.visionIcon?.url ?? ''} onChange={(ref) => set('visionIcon', ref)} />
      <Field label="Vision Heading">
        <input className="lb-input" value={ov.visionHeading ?? ''} onChange={(e) => set('visionHeading', e.target.value)} placeholder="Our Vision" />
      </Field>
      <Field label="Vision Body">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.visionBody ?? ''} onChange={(e) => set('visionBody', e.target.value)} placeholder="Vision statement…" />
      </Field>

      {/* Values */}
      <Field label="Values Heading">
        <input className="lb-input" value={ov.valuesHeading ?? ''} onChange={(e) => set('valuesHeading', e.target.value)} placeholder="Our Core Values" />
      </Field>
      <Field label="Values">
        <div className="lb-items">
          {values.map((v: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Value {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...values]; a.splice(i, 1); set('values', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={v.valueIcon?.url ?? ''} onChange={(ref) => { const a = [...values]; a[i] = { ...a[i], valueIcon: ref }; set('values', a) }} />
              <input className="lb-input" placeholder="Title" value={v.valueTitle ?? ''} onChange={(e) => { const a = [...values]; a[i] = { ...a[i], valueTitle: e.target.value }; set('values', a) }} />
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={v.valueDesc ?? ''} onChange={(e) => { const a = [...values]; a[i] = { ...a[i], valueDesc: e.target.value }; set('values', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('values', [...values, {}])}>+ Add Value</button>
        </div>
      </Field>
    </>
  )
}

// ── About Leadership fields ───────────────────────────────────────────────────
function AboutLeadershipFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const members: any[] = ov.teamMembers ?? []
  const cols: 2 | 3 = ov.teamColumns ?? 3
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.leadershipHeading ?? ''} onChange={(e) => set('leadershipHeading', e.target.value)} placeholder="Meet the Team" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.leadershipSubheading ?? ''} onChange={(e) => set('leadershipSubheading', e.target.value)} placeholder="The people behind ATech…" />
      </Field>
      <Field label="Columns">
        <div style={{ display: 'flex', gap: 8 }}>
          {([2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set('teamColumns', n)}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 4,
                border: '1px solid',
                borderColor: cols === n ? '#171717' : '#d4d4d4',
                background: cols === n ? '#171717' : '#ffffff',
                color: cols === n ? '#ffffff' : '#525252',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {n} Col{n === 2 ? ' (centered)' : 's'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Team Members">
        <div className="lb-items">
          {members.map((m: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Member {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...members]; a.splice(i, 1); set('teamMembers', a) }}>✕</button>
              </div>
              <MediaField label="Avatar" value={m.memberAvatar?.url ?? ''} onChange={(ref) => { const a = [...members]; a[i] = { ...a[i], memberAvatar: ref }; set('teamMembers', a) }} />
              <Row>
                <input className="lb-input" placeholder="Name" value={m.memberName ?? ''} onChange={(e) => { const a = [...members]; a[i] = { ...a[i], memberName: e.target.value }; set('teamMembers', a) }} />
                <input className="lb-input" placeholder="Role / Title" value={m.memberRole ?? ''} onChange={(e) => { const a = [...members]; a[i] = { ...a[i], memberRole: e.target.value }; set('teamMembers', a) }} />
              </Row>
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Short bio" value={m.memberBio ?? ''} onChange={(e) => { const a = [...members]; a[i] = { ...a[i], memberBio: e.target.value }; set('teamMembers', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('teamMembers', [...members, {}])}>+ Add Member</button>
        </div>
      </Field>
    </>
  )
}

// ── About FAQ fields ──────────────────────────────────────────────────────────
function AboutFAQFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.faqItems ?? []
  return (
    <>
      <Field label="Style">
        <select className="lb-input lb-input--select" value={ov.faqStyle ?? 'style1'} onChange={(e) => set('faqStyle', e.target.value)}>
          <option value="style1">Style 1 — Classic (divider lines)</option>
          <option value="style2">Style 2 — Cards (badge + bordered accordion)</option>
        </select>
      </Field>
      <Field label="Heading">
        <input className="lb-input" value={ov.faqHeading ?? ''} onChange={(e) => set('faqHeading', e.target.value)} placeholder="Frequently Asked Questions" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.faqSubheading ?? ''} onChange={(e) => set('faqSubheading', e.target.value)} placeholder="Find answers to common questions…" />
      </Field>

      <Field label="FAQ Items">
        <div className="lb-items">
          {items.map((f: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>FAQ {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('faqItems', a) }}>✕</button>
              </div>
              <input className="lb-input" placeholder="Question" value={f.faqQuestion ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], faqQuestion: e.target.value }; set('faqItems', a) }} />
              <textarea className="lb-input lb-input--textarea" rows={3} placeholder="Answer" value={f.faqAnswer ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], faqAnswer: e.target.value }; set('faqItems', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('faqItems', [...items, {}])}>+ Add FAQ</button>
        </div>
      </Field>
    </>
  )
}

// ── FAQ About fields (badge + source toggle + accordion, matches Figma FAQ-about design) ──
function FAQAboutFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const source = (ov.faqContentSource ?? 'manual') as 'collection' | 'manual'
  const items: any[] = ov.faqItems ?? []
  return (
    <>
      <Field label="Badge Text">
        <input className="lb-input" value={ov.badge ?? 'FAQ'} onChange={(e) => set('badge', e.target.value)} placeholder="FAQ" />
      </Field>
      <MediaField label="Badge Icon (optional)" value={ov.badgeIconUrl ?? ov.badgeIcon?.url ?? ''} onChange={(ref) => set('badgeIconUrl', ref?.url ?? '')} />
      <Field label="Heading">
        <input className="lb-input" value={ov.faqHeading ?? ''} onChange={(e) => set('faqHeading', e.target.value)} placeholder="Frequently Asked Questions" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.faqSubheading ?? ''} onChange={(e) => set('faqSubheading', e.target.value)} placeholder="Find answers to common questions…" />
      </Field>

      <Field label="Content Source">
        <select
          className="lb-input lb-select"
          value={source}
          onChange={(e) => set('faqContentSource', e.target.value)}
        >
          <option value="manual">Manual</option>
          <option value="collection">Collection (CMS)</option>
        </select>
      </Field>

      {source === 'collection' && (
        <>
          <Field label="Category Slug (optional)">
            <input
              className="lb-input"
              value={ov.faqCategorySlug ?? ''}
              onChange={(e) => set('faqCategorySlug', e.target.value || undefined)}
              placeholder="e.g. general — leave blank for all"
            />
          </Field>
          <Field label="Max Items">
            <input
              className="lb-input"
              type="number"
              min={1}
              max={100}
              value={ov.faqLimit ?? 20}
              onChange={(e) => set('faqLimit', Number(e.target.value))}
            />
          </Field>
        </>
      )}

      {source === 'manual' && (
        <Field label="FAQ Items">
          <div className="lb-items">
            {items.map((f: any, i: number) => (
              <div key={i} className="lb-item">
                <div className="lb-item__header">
                  <span>FAQ {i + 1}</span>
                  <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('faqItems', a) }}>✕</button>
                </div>
                <input className="lb-input" placeholder="Question" value={f.faqQuestion ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], faqQuestion: e.target.value }; set('faqItems', a) }} />
                <textarea className="lb-input lb-input--textarea" rows={3} placeholder="Answer" value={f.faqAnswer ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], faqAnswer: e.target.value }; set('faqItems', a) }} />
              </div>
            ))}
            <button className="lb-items__add" onClick={() => set('faqItems', [...items, {}])}>+ Add FAQ</button>
          </div>
        </Field>
      )}

      <Field label="See More Label">
        <input className="lb-input" value={ov.faqSeeMoreLabel ?? ''} onChange={(e) => set('faqSeeMoreLabel', e.target.value)} placeholder="See more" />
      </Field>
      <LinkField label="See More URL" value={ov.faqSeeMoreUrl ?? ''} onChange={(v) => set('faqSeeMoreUrl', v || undefined)} placeholder="/static/faq" />
    </>
  )
}

// ── Article Submit fields ─────────────────────────────────────────────────────
function ArticleSubmitFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.articleSubmitHeading ?? ''} onChange={(e) => set('articleSubmitHeading', e.target.value)} placeholder="Submit an Article" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.articleSubmitSubheading ?? ''} onChange={(e) => set('articleSubmitSubheading', e.target.value)} placeholder="Share your knowledge with our community." />
      </Field>
      <Field label="Button Label">
        <input className="lb-input" value={ov.articleSubmitCtaLabel ?? ''} onChange={(e) => set('articleSubmitCtaLabel', e.target.value)} placeholder="Submit Article" />
      </Field>
      <Field label="Success Message">
        <input className="lb-input" value={ov.articleSubmitSuccessMessage ?? ''} onChange={(e) => set('articleSubmitSuccessMessage', e.target.value)} placeholder="Thank you! Your article has been submitted for review." />
      </Field>
    </>
  )
}

// ── Serve Model fields ────────────────────────────────────────────────────────
function ServeModelFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.serveModelItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Flexible Engagement Models" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Choose the partnership model…" />
      </Field>

      <Field label="Model Cards">
        <div className="lb-items">
          {items.map((item: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Card {i + 1}{item.modelFeatured ? ' ★' : ''}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('serveModelItems', a) }}>✕</button>
              </div>
              <Field label="Title">
                <input className="lb-input" placeholder="Project-Based" value={item.modelTitle ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], modelTitle: e.target.value }; set('serveModelItems', a) }} />
              </Field>
              <MediaField label="Icon" value={item.modelIconSrc ?? ''} onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], modelIconSrc: ref?.url ?? '' }; set('serveModelItems', a) }} />
              <Field label="Description">
                <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Fixed scope and timeline…" value={item.modelDesc ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], modelDesc: e.target.value }; set('serveModelItems', a) }} />
              </Field>
              <Field label="Features (one per line)">
                <textarea className="lb-input lb-input--textarea" rows={4} placeholder={'Clear deliverables and milestones\nFixed budget and timeline\nIdeal for MVPs'} value={item.modelFeatures ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], modelFeatures: e.target.value }; set('serveModelItems', a) }} />
              </Field>
              <Row>
                <Field label="Featured card?">
                  <select className="lb-input lb-input--select" value={item.modelFeatured ? 'yes' : 'no'} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], modelFeatured: e.target.value === 'yes' }; set('serveModelItems', a) }}>
                    <option value="no">No</option>
                    <option value="yes">Yes — thick border + badge</option>
                  </select>
                </Field>
                <Field label="Badge Label">
                  <input className="lb-input" placeholder="Most Popular" value={item.modelBadgeLabel ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], modelBadgeLabel: e.target.value }; set('serveModelItems', a) }} />
                </Field>
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('serveModelItems', [...items, { modelTitle: '', modelDesc: '', modelFeatures: '', modelFeatured: false }])}>+ Add Card</button>
        </div>
      </Field>
    </>
  )
}

// ── Insights Advantages fields ────────────────────────────────────────────────
function InsightsAdvantagesFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.advantageItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="ATech Advantages" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Why leading companies choose ATech…" />
      </Field>
      <Field label="Background">
        <select className="lb-input lb-input--select" value={ov.advSectionBg ?? 'yellow'} onChange={(e) => set('advSectionBg', e.target.value)}>
          <option value="yellow">Yellow (default)</option>
          <option value="white">White</option>
          <option value="dark">Dark</option>
        </select>
      </Field>

      <Field label="Advantage Cards">
        <div className="lb-items">
          {items.map((item: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Card {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('advantageItems', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={item.advIcon?.url ?? ''} onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], advIcon: ref }; set('advantageItems', a) }} />
              <Field label="Title">
                <input className="lb-input" placeholder="Rapid Development" value={item.advTitle ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], advTitle: e.target.value }; set('advantageItems', a) }} />
              </Field>
              <Field label="Description">
                <textarea className="lb-input lb-input--textarea" rows={3} placeholder="Accelerated development cycles using modern frameworks…" value={item.advDesc ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], advDesc: e.target.value }; set('advantageItems', a) }} />
              </Field>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('advantageItems', [...items, { advIcon: null, advTitle: '', advDesc: '' }])}>+ Add Card</button>
        </div>
      </Field>
    </>
  )
}

// ── Article Main Grid fields ──────────────────────────────────────────────────
function ArticleMainGridFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const source   = (ov.mainGridContentSource ?? 'collection') as 'collection' | 'manual'
  const items: any[] = ov.mainGridItems ?? []
  return (
    <>
      <Field label="Section Label">
        <input className="lb-input" value={ov.mainGridSectionLabel ?? ''} onChange={(e) => set('mainGridSectionLabel', e.target.value)} placeholder="Latest Articles" />
      </Field>
      <Field label="Content Source">
        <select className="lb-input lb-input--select" value={source} onChange={(e) => set('mainGridContentSource', e.target.value)}>
          <option value="collection">Collection (auto-fetch posts)</option>
          <option value="manual">Manual items</option>
        </select>
      </Field>

      {source === 'collection' && (
        <>
          <Row>
            <Field label="Fetch Limit">
              <input className="lb-input" type="number" min={1} max={200} value={ov.mainGridLimit ?? 100} onChange={(e) => set('mainGridLimit', Number(e.target.value))} />
            </Field>
            <Field label="Items per Page">
              <input className="lb-input" type="number" min={3} max={30} value={ov.mainGridPageSize ?? 9} onChange={(e) => set('mainGridPageSize', Number(e.target.value))} />
            </Field>
          </Row>
          <Field label="Category Slug (optional)">
            <input className="lb-input" value={ov.mainGridCategory ?? ''} onChange={(e) => set('mainGridCategory', e.target.value)} placeholder="web-development" />
          </Field>
          <Field label="Order By">
            <select className="lb-input lb-input--select" value={ov.mainGridOrderBy ?? 'publishedAt_desc'} onChange={(e) => set('mainGridOrderBy', e.target.value)}>
              <option value="publishedAt_desc">Newest first</option>
              <option value="publishedAt_asc">Oldest first</option>
            </select>
          </Field>
        </>
      )}

      {source === 'manual' && (
        <>
          <Field label="Items per Page">
            <input className="lb-input" type="number" min={3} max={30} value={ov.mainGridPageSize ?? 9} onChange={(e) => set('mainGridPageSize', Number(e.target.value))} />
          </Field>
          <Field label="Article Cards">
            <div className="lb-items">
              {items.map((item: any, i: number) => (
                <div key={i} className="lb-item">
                  <div className="lb-item__header">
                    <span>Article {i + 1}</span>
                    <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('mainGridItems', a) }}>✕</button>
                  </div>
                  <MediaField label="Image" value={item.mgImage?.url ?? ''} onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], mgImage: ref }; set('mainGridItems', a) }} />
                  <Row>
                    <Field label="Category">
                      <input className="lb-input" placeholder="Web Development" value={item.mgCategory ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], mgCategory: e.target.value }; set('mainGridItems', a) }} />
                    </Field>
                    <Field label="Date">
                      <input className="lb-input" placeholder="March 12, 2025" value={item.mgDate ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], mgDate: e.target.value }; set('mainGridItems', a) }} />
                    </Field>
                  </Row>
                  <Field label="Title">
                    <input className="lb-input" placeholder="Article title" value={item.mgTitle ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], mgTitle: e.target.value }; set('mainGridItems', a) }} />
                  </Field>
                  <Field label="Excerpt">
                    <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Short description…" value={item.mgExcerpt ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], mgExcerpt: e.target.value }; set('mainGridItems', a) }} />
                  </Field>
                  <Row>
                    <Field label="CTA Label">
                      <input className="lb-input" placeholder="Read More" value={item.mgCtaLabel ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], mgCtaLabel: e.target.value }; set('mainGridItems', a) }} />
                    </Field>
                    <Field label="CTA URL">
                      <input className="lb-input" placeholder="/article/slug" value={item.mgCtaUrl ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], mgCtaUrl: e.target.value }; set('mainGridItems', a) }} />
                    </Field>
                  </Row>
                </div>
              ))}
              <button className="lb-items__add" onClick={() => set('mainGridItems', [...items, { mgImage: null, mgCategory: '', mgDate: '', mgTitle: '', mgExcerpt: '', mgCtaLabel: 'Read More', mgCtaUrl: '' }])}>+ Add Article</button>
            </div>
          </Field>
        </>
      )}

      {/* ── Bottom action button ────────────────────────────────────────── */}
      <Field label="Bottom Button">
        <select className="lb-input lb-input--select" value={ov.mainGridLoadMoreType ?? 'pagination'} onChange={(e) => set('mainGridLoadMoreType', e.target.value)}>
          <option value="pagination">Numbered pagination (default)</option>
          <option value="load-more">Load More Articles (append in place)</option>
          <option value="link">Link to another page</option>
        </select>
      </Field>

      {(ov.mainGridLoadMoreType === 'load-more' || ov.mainGridLoadMoreType === 'link') && (
        <Field label="Button Label">
          <input className="lb-input" value={ov.mainGridLoadMoreLabel ?? ''} onChange={(e) => set('mainGridLoadMoreLabel', e.target.value)} placeholder={ov.mainGridLoadMoreType === 'link' ? 'View All Articles' : 'Load More Articles'} />
        </Field>
      )}

      {ov.mainGridLoadMoreType === 'link' && (
        <Field label="Button URL">
          <input className="lb-input" value={ov.mainGridLoadMoreUrl ?? ''} onChange={(e) => set('mainGridLoadMoreUrl', e.target.value)} placeholder="/article" />
        </Field>
      )}
    </>
  )
}

// ── Subscribe fields ──────────────────────────────────────────────────────────
function SubscribeFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Row>
        <Field label="Badge Label">
          <input className="lb-input" value={ov.subBadgeLabel ?? ''} onChange={(e) => set('subBadgeLabel', e.target.value)} placeholder="Newsletter" />
        </Field>
        <div style={{ flex: 1 }}>
          <MediaField label="Badge Icon" value={ov.subBadgeIcon?.url ?? ''} onChange={(ref) => set('subBadgeIcon', ref)} />
        </div>
      </Row>
      <Field label="Heading">
        <input className="lb-input" value={ov.subHeading ?? ''} onChange={(e) => set('subHeading', e.target.value)} placeholder="Stay Updated with Tech Insights" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.subSubheading ?? ''} onChange={(e) => set('subSubheading', e.target.value)} placeholder="Subscribe to our newsletter and get the latest articles…" />
      </Field>
      <Row>
        <Field label="Input Placeholder">
          <input className="lb-input" value={ov.subInputPlaceholder ?? ''} onChange={(e) => set('subInputPlaceholder', e.target.value)} placeholder="Enter your email address" />
        </Field>
        <Field label="Button Label">
          <input className="lb-input" value={ov.subButtonLabel ?? ''} onChange={(e) => set('subButtonLabel', e.target.value)} placeholder="Subscribe Now" />
        </Field>
      </Row>
      <Field label="Note (below form)">
        <input className="lb-input" value={ov.subNote ?? ''} onChange={(e) => set('subNote', e.target.value)} placeholder="Join 15,000+ subscribers. Unsubscribe anytime." />
      </Field>
      <Field label="Success Message">
        <input className="lb-input" value={ov.subSuccessMessage ?? ''} onChange={(e) => set('subSuccessMessage', e.target.value)} placeholder="Thank you for subscribing!" />
      </Field>
      <Field label="API Endpoint (optional)">
        <input className="lb-input" value={ov.subApiEndpoint ?? ''} onChange={(e) => set('subApiEndpoint', e.target.value)} placeholder="/api/subscribe" />
      </Field>
    </>
  )
}

// ── Article Feature fields ────────────────────────────────────────────────────
// ── Article Filter fields ─────────────────────────────────────────────────────
function ArticleFilterFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="'All Articles' Button Label">
        <input className="lb-input" value={ov.artFilterAllLabel ?? ''} onChange={(e) => set('artFilterAllLabel', e.target.value)} placeholder="All Articles" />
      </Field>
      <p style={{ fontSize: '12px', color: '#737373', margin: 0 }}>
        Categories are fetched automatically from the CMS. Place this block above article-feature and article-main-grid blocks to enable cross-block filtering via the URL.
      </p>
    </>
  )
}

function ArticleFeatureFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const source = (ov.artFeatContentSource ?? 'manual') as 'collection' | 'manual'
  return (
    <>
      <Field label="Section Label">
        <input className="lb-input" value={ov.artFeatSectionLabel ?? ''} onChange={(e) => set('artFeatSectionLabel', e.target.value)} placeholder="Featured Article" />
      </Field>
      <Field label="Content Source">
        <select className="lb-input lb-input--select" value={source} onChange={(e) => set('artFeatContentSource', e.target.value)}>
          <option value="collection">Collection (auto-fetch from category filter)</option>
          <option value="manual">Manual</option>
        </select>
      </Field>

      {source === 'manual' && (
        <>
          <MediaField label="Article Image" value={ov.artFeatImage?.url ?? ''} onChange={(ref) => set('artFeatImage', ref)} />
          <Row>
            <Field label="Category">
              <input className="lb-input" value={ov.artFeatCategory ?? ''} onChange={(e) => set('artFeatCategory', e.target.value)} placeholder="AI & Machine Learning" />
            </Field>
            <Field label="Date">
              <input className="lb-input" value={ov.artFeatDate ?? ''} onChange={(e) => set('artFeatDate', e.target.value)} placeholder="March 15, 2025" />
            </Field>
          </Row>
          <Field label="Title">
            <input className="lb-input" value={ov.artFeatTitle ?? ''} onChange={(e) => set('artFeatTitle', e.target.value)} placeholder="The Future of AI in Enterprise Software Development" />
          </Field>
          <Field label="Description">
            <textarea className="lb-input lb-input--textarea" rows={3} value={ov.artFeatDesc ?? ''} onChange={(e) => set('artFeatDesc', e.target.value)} placeholder="Explore how artificial intelligence and machine learning are revolutionizing…" />
          </Field>
          <Row>
            <Field label="Read Time">
              <input className="lb-input" value={ov.artFeatReadTime ?? ''} onChange={(e) => set('artFeatReadTime', e.target.value)} placeholder="8 min read" />
            </Field>
            <Field label="Views">
              <input className="lb-input" value={ov.artFeatViews ?? ''} onChange={(e) => set('artFeatViews', e.target.value)} placeholder="2.4K views" />
            </Field>
          </Row>
          <Field label="CTA Label">
            <input className="lb-input" value={ov.artFeatCtaLabel ?? ''} onChange={(e) => set('artFeatCtaLabel', e.target.value)} placeholder="Read Full Article" />
          </Field>
          <Field label="CTA URL">
            <input className="lb-input" value={ov.artFeatCtaUrl ?? ''} onChange={(e) => set('artFeatCtaUrl', e.target.value)} placeholder="/article/article-slug" />
          </Field>
        </>
      )}

      {source === 'collection' && (
        <p style={{ fontSize: '12px', color: '#737373', margin: 0 }}>
          In collection mode this block shows the most recent article for the active category filter.
          Use together with the article-filter block.
        </p>
      )}
    </>
  )
}

// ── Article Hero fields ───────────────────────────────────────────────────────
function ArticleHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Articles" />
      </Field>
      <Field label="Body Text">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.body ?? ''} onChange={(e) => set('body', e.target.value)} placeholder="Stay ahead with expert perspectives on software development…" />
      </Field>
      <Field label="Background">
        <select className="lb-input lb-input--select" value={ov.heroBg ?? 'white'} onChange={(e) => set('heroBg', e.target.value)}>
          <option value="white">White (default)</option>
          <option value="dark">Dark</option>
        </select>
      </Field>
    </>
  )
}

// ── Insights Tech Guide fields ────────────────────────────────────────────────
function InsightsTechGuideFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.guideItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Tech Guide" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Comprehensive guides to help you navigate the technology landscape…" />
      </Field>

      <Field label="Guide Cards">
        <div className="lb-items">
          {items.map((item: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Guide {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('guideItems', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={item.guideIcon?.url ?? ''} onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], guideIcon: ref }; set('guideItems', a) }} />
              <Field label="Title">
                <input className="lb-input" placeholder="Technology Stack Guide 2025" value={item.guideTitle ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], guideTitle: e.target.value }; set('guideItems', a) }} />
              </Field>
              <Field label="Description">
                <textarea className="lb-input lb-input--textarea" rows={3} placeholder="Master the art of selecting the perfect tech stack…" value={item.guideDesc ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], guideDesc: e.target.value }; set('guideItems', a) }} />
              </Field>
              <Field label="Tags (comma-separated)">
                <input className="lb-input" placeholder="React, Node.js, Python, AWS" value={item.guideTags ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], guideTags: e.target.value }; set('guideItems', a) }} />
              </Field>
              <Field label="CTA Label">
                <input className="lb-input" placeholder="Download Full Guide" value={item.guideCtaLabel ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], guideCtaLabel: e.target.value }; set('guideItems', a) }} />
              </Field>
              <Field label="CTA URL">
                <input className="lb-input" placeholder="/guides/tech-stack" value={item.guideCtaUrl ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], guideCtaUrl: e.target.value }; set('guideItems', a) }} />
              </Field>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('guideItems', [...items, { guideIcon: null, guideTitle: '', guideDesc: '', guideTags: '', guideCtaLabel: 'Download Full Guide', guideCtaUrl: '' }])}>+ Add Guide</button>
        </div>
      </Field>
    </>
  )
}

// ── Serve Value fields ────────────────────────────────────────────────────────
function ServeValueFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.serveValueItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Why Startups Choose ATech" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="We understand the unique challenges…" />
      </Field>

      <Field label="Value Items">
        <div className="lb-items">
          {items.map((item: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Item {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('serveValueItems', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={item.valueIconSrc ?? ''} onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], valueIconSrc: ref?.url ?? '' }; set('serveValueItems', a) }} />
              <Field label="Title">
                <input className="lb-input" placeholder="Fast MVP Development" value={item.valueTitle ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], valueTitle: e.target.value }; set('serveValueItems', a) }} />
              </Field>
              <Field label="Description">
                <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Launch your product…" value={item.valueDesc ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], valueDesc: e.target.value }; set('serveValueItems', a) }} />
              </Field>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('serveValueItems', [...items, { valueIconSrc: '', valueTitle: '', valueDesc: '' }])}>+ Add Item</button>
        </div>
      </Field>
    </>
  )
}

// ── Serve Hero fields ─────────────────────────────────────────────────────────
function ServeHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Heading">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Technology Partner for Ambitious Startups" />
      </Field>
      <Field label="Body Text">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.body ?? ''} onChange={(e) => set('body', e.target.value)} placeholder="From MVP to scale…" />
      </Field>

      <CtaGroup
        groupLabel="Primary CTA"
        label={ov.ctaPrimaryLabel ?? ''} labelPlaceholder="Get Started"
        url={ov.ctaPrimaryUrl ?? ''} urlPlaceholder="/static/contact"
        iconValue={ov.ctaPrimaryIcon?.url ?? ''} iconPos={ov.ctaPrimaryIconPos ?? 'right'} iconFill={ov.ctaPrimaryIconFill ?? false}
        onLabelChange={(v) => set('ctaPrimaryLabel', v)}
        onUrlChange={(v) => set('ctaPrimaryUrl', v)}
        onIconChange={(ref) => set('ctaPrimaryIcon', ref)}
        onIconPosChange={(v) => set('ctaPrimaryIconPos', v)}
        onIconFillChange={(v) => set('ctaPrimaryIconFill', v)}
      />
      <CtaGroup
        groupLabel="Secondary CTA"
        label={ov.ctaSecondaryLabel ?? ''} labelPlaceholder="View Success Stories"
        url={ov.ctaSecondaryUrl ?? ''} urlPlaceholder="/portfolio"
        iconValue={ov.ctaSecondaryIcon?.url ?? ''} iconPos={ov.ctaSecondaryIconPos ?? 'right'} iconFill={ov.ctaSecondaryIconFill ?? false}
        onLabelChange={(v) => set('ctaSecondaryLabel', v)}
        onUrlChange={(v) => set('ctaSecondaryUrl', v)}
        onIconChange={(ref) => set('ctaSecondaryIcon', ref)}
        onIconPosChange={(v) => set('ctaSecondaryIconPos', v)}
        onIconFillChange={(v) => set('ctaSecondaryIconFill', v)}
      />

      <MediaField label="Hero Image" value={ov.heroImage?.url ?? ''} onChange={(ref) => set('heroImage', ref)} />

      <Field label="Stat Badge Value">
        <input className="lb-input" value={ov.serveHeroStatValue ?? ''} onChange={(e) => set('serveHeroStatValue', e.target.value)} placeholder="50+ Startups Launched" />
      </Field>
      <Field label="Stat Badge Label">
        <input className="lb-input" value={ov.serveHeroStatLabel ?? ''} onChange={(e) => set('serveHeroStatLabel', e.target.value)} placeholder="From Seed to Series B" />
      </Field>
      <MediaField label="Stat Badge Icon" value={ov.serveHeroStatIconSrc ?? ''} onChange={(ref) => set('serveHeroStatIconSrc', ref?.url ?? '')} />
      <Field label="Stat Badge Icon Background">
        <input className="lb-input" value={ov.serveHeroStatIconBg ?? '#ffd369'} onChange={(e) => set('serveHeroStatIconBg', e.target.value)} placeholder="#ffd369" />
      </Field>
    </>
  )
}

// ── Service Hero fields ───────────────────────────────────────────────────────
function ServiceHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const breadcrumbs: any[] = ov.breadcrumbs ?? []
  return (
    <>
      <Field label="Badge Text">
        <input className="lb-input" value={ov.badge ?? ''} onChange={(e) => set('badge', e.target.value)} placeholder="QA Testing Services" />
      </Field>
      <MediaField label="Badge Icon" value={ov.badgeIcon?.url ?? ov.badgeIconSrc ?? ''} onChange={(ref) => set('badgeIcon', ref)} />

      <Field label="Breadcrumbs">
        <div className="lb-items">
          {breadcrumbs.map((b: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Crumb {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...breadcrumbs]; a.splice(i, 1); set('breadcrumbs', a) }}>✕</button>
              </div>
              <Row>
                <input className="lb-input" placeholder="Label" value={b.bcLabel ?? ''} onChange={(e) => { const a = [...breadcrumbs]; a[i] = { ...a[i], bcLabel: e.target.value }; set('breadcrumbs', a) }} />
                <LinkField label="URL (blank = current)" value={b.bcHref ?? ''} onChange={(v) => { const a = [...breadcrumbs]; a[i] = { ...a[i], bcHref: v || null }; set('breadcrumbs', a) }} placeholder="/" />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('breadcrumbs', [...breadcrumbs, { bcLabel: '', bcHref: '/' }])}>+ Add Crumb</button>
        </div>
      </Field>

      <Field label="Heading (use \\n for line breaks)">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Comprehensive Quality\nAssurance Solutions" />
      </Field>
      <Field label="Body Text">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.body ?? ''} onChange={(e) => set('body', e.target.value)} placeholder="Supporting description…" />
      </Field>

      <CtaGroup
        groupLabel="Primary CTA"
        label={ov.ctaPrimaryLabel ?? ''} labelPlaceholder="Start Your Project"
        url={ov.ctaPrimaryUrl ?? ''} urlPlaceholder="/static/contact"
        iconValue={ov.ctaPrimaryIcon?.url ?? ''} iconPos={ov.ctaPrimaryIconPos ?? 'right'} iconFill={ov.ctaPrimaryIconFill ?? false}
        onLabelChange={(v) => set('ctaPrimaryLabel', v)}
        onUrlChange={(v) => set('ctaPrimaryUrl', v)}
        onIconChange={(ref) => set('ctaPrimaryIcon', ref)}
        onIconPosChange={(v) => set('ctaPrimaryIconPos', v)}
        onIconFillChange={(v) => set('ctaPrimaryIconFill', v)}
      />
      <CtaGroup
        groupLabel="Secondary CTA"
        label={ov.ctaSecondaryLabel ?? ''} labelPlaceholder="View Case Studies"
        url={ov.ctaSecondaryUrl ?? ''} urlPlaceholder="/case-studies"
        iconValue={ov.ctaSecondaryIcon?.url ?? ''} iconPos={ov.ctaSecondaryIconPos ?? 'right'} iconFill={ov.ctaSecondaryIconFill ?? false}
        onLabelChange={(v) => set('ctaSecondaryLabel', v)}
        onUrlChange={(v) => set('ctaSecondaryUrl', v)}
        onIconChange={(ref) => set('ctaSecondaryIcon', ref)}
        onIconPosChange={(v) => set('ctaSecondaryIconPos', v)}
        onIconFillChange={(v) => set('ctaSecondaryIconFill', v)}
      />

      <MediaField label="Hero Image" value={ov.heroImage?.url ?? ''} onChange={(ref) => set('heroImage', ref)} />

      <MediaField label="Background Image" value={ov.backgroundImage?.url ?? ''} onChange={(ref) => set('backgroundImage', ref)} />
      <p style={{ fontSize: 12, color: '#9ca3af', margin: '-4px 0 12px' }}>When set, switches to full-bleed background mode — hides the side image panel and flips text to white. Leave empty to use the 2-column layout.</p>

      <Field label="Image Position">
        <select className="lb-input lb-input--select" value={ov.heroImagePosition ?? 'right'} onChange={(e) => set('heroImagePosition', e.target.value)}>
          <option value="right">Right (default)</option>
          <option value="left">Left</option>
        </select>
      </Field>

      <Field label="Image Padding">
        <select className="lb-input lb-input--select" value={ov.heroImagePadding ? 'padded' : 'none'} onChange={(e) => set('heroImagePadding', e.target.value === 'padded')}>
          <option value="none">No Padding — image fills column edge-to-edge</option>
          <option value="padded">Padded — image inset 40px (matches text content rhythm)</option>
        </select>
      </Field>

      <Row>
        <Field label="Stat Value (optional)">
          <input className="lb-input" value={ov.heroStatValue ?? ''} onChange={(e) => set('heroStatValue', e.target.value)} placeholder='e.g. "500+"' />
        </Field>
        <Field label="Stat Label">
          <input className="lb-input" value={ov.heroStatLabel ?? ''} onChange={(e) => set('heroStatLabel', e.target.value)} placeholder="Projects Delivered" />
        </Field>
      </Row>
    </>
  )
}

// ── Expertise Tiles fields ────────────────────────────────────────────────────
function ExpertiseTilesFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const tiles: any[] = ov.expertiseTiles ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Technical Expertise We Place" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="We specialise in recruiting across…" />
      </Field>

      <Field label="Tiles">
        <div className="lb-items">
          {tiles.map((t: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Tile {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...tiles]; a.splice(i, 1); set('expertiseTiles', a) }}>✕</button>
              </div>
              <MediaField label="Tile Icon / Image" value={t.tileImage?.url ?? t.tileIconSrc ?? ''} onChange={(ref) => { const a = [...tiles]; a[i] = { ...a[i], tileImage: ref, tileIconSrc: ref?.url ?? '' }; set('expertiseTiles', a) }} />
              <input className="lb-input" placeholder="Label" value={t.tileLabel ?? ''} onChange={(e) => { const a = [...tiles]; a[i] = { ...a[i], tileLabel: e.target.value }; set('expertiseTiles', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('expertiseTiles', [...tiles, { tileIconSrc: '', tileLabel: '' }])}>+ Add Tile</button>
        </div>
      </Field>
    </>
  )
}

// ── Process Steps fields ──────────────────────────────────────────────────────
function ProcessStepsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const steps: any[] = ov.processSteps ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Testing Process" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="A systematic approach…" />
      </Field>

      <Field label="Steps">
        <div className="lb-items">
          {steps.map((s: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Step {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...steps]; a.splice(i, 1); set('processSteps', a) }}>✕</button>
              </div>
              <Row>
                <input className="lb-input" placeholder="Number (e.g. 1)" value={s.stepNumber ?? ''} onChange={(e) => { const a = [...steps]; a[i] = { ...a[i], stepNumber: e.target.value }; set('processSteps', a) }} />
                <input className="lb-input" placeholder="Step title" value={s.stepTitle ?? ''} onChange={(e) => { const a = [...steps]; a[i] = { ...a[i], stepTitle: e.target.value }; set('processSteps', a) }} />
              </Row>
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={s.stepDesc ?? ''} onChange={(e) => { const a = [...steps]; a[i] = { ...a[i], stepDesc: e.target.value }; set('processSteps', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('processSteps', [...steps, { stepNumber: String(steps.length + 1), stepTitle: '', stepDesc: '' }])}>+ Add Step</button>
        </div>
      </Field>
    </>
  )
}

// ── Service Cards fields ──────────────────────────────────────────────────────
function ServiceCardsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const cards: any[] = ov.cardItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Services" />
      </Field>
      <Field label="Subtitle">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} placeholder="Short subheading…" />
      </Field>

      <Field label="Theme">
        <select className="lb-input lb-input--select" value={ov.cardGridTheme ?? 'dark'} onChange={(e) => set('cardGridTheme', e.target.value)}>
          <option value="dark">Dark (default)</option>
          <option value="light">Light</option>
        </select>
      </Field>

      <Field label="Cards">
        <div className="lb-items">
          {cards.map((c: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Card {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...cards]; a.splice(i, 1); set('cardItems', a) }}>✕</button>
              </div>
              <MediaField label="Card Icon" value={c.cardIcon?.url ?? c.cardIconSrc ?? ''} onChange={(ref) => { const a = [...cards]; a[i] = { ...a[i], cardIcon: ref, cardIconSrc: ref?.url ?? '' }; set('cardItems', a) }} />
              <input className="lb-input" placeholder="Title" value={c.cardTitle ?? ''} onChange={(e) => { const a = [...cards]; a[i] = { ...a[i], cardTitle: e.target.value }; set('cardItems', a) }} />
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={c.cardDescription ?? ''} onChange={(e) => { const a = [...cards]; a[i] = { ...a[i], cardDescription: e.target.value }; set('cardItems', a) }} />
              <textarea className="lb-input lb-input--textarea" rows={3} placeholder={'Features (one per line)\nCustom Dashboards\nAPI Integration'} value={c.cardFeatures ?? ''} onChange={(e) => { const a = [...cards]; a[i] = { ...a[i], cardFeatures: e.target.value }; set('cardItems', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('cardItems', [...cards, {}])}>+ Add Card</button>
        </div>
      </Field>
    </>
  )
}

// ── CTA Banner fields ─────────────────────────────────────────────────────────
function CTABannerFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const stats: any[] = ov.heroStats ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Ready to get started?" />
      </Field>
      <Field label="Subtitle">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} placeholder="Supporting description…" />
      </Field>

      <CtaGroup
        groupLabel="Button"
        label={ov.buttonLabel ?? ''} labelPlaceholder="Get Started"
        url={ov.buttonUrl ?? ''} urlPlaceholder="/static/contact"
        iconValue={ov.buttonIcon?.url ?? ''} iconPos={ov.buttonIconPos ?? 'right'} iconFill={ov.buttonIconFill ?? false}
        onLabelChange={(v) => set('buttonLabel', v)}
        onUrlChange={(v) => set('buttonUrl', v)}
        onIconChange={(ref) => set('buttonIcon', ref)}
        onIconPosChange={(v) => set('buttonIconPos', v)}
        onIconFillChange={(v) => set('buttonIconFill', v)}
      />

      <Field label="Stats">
        <div className="lb-items">
          {stats.map((s: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Stat {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...stats]; a.splice(i, 1); set('heroStats', a) }}>✕</button>
              </div>
              <Row>
                <input className="lb-input" placeholder='Value e.g. "250+"' value={s.statValue ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], statValue: e.target.value }; set('heroStats', a) }} />
                <input className="lb-input" placeholder="Label" value={s.statLabel ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], statLabel: e.target.value }; set('heroStats', a) }} />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('heroStats', [...stats, { statValue: '', statLabel: '' }])}>+ Add Stat</button>
        </div>
      </Field>
    </>
  )
}

// ── Page Hero fields ──────────────────────────────────────────────────────────
function PageHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const stats: any[] = ov.heroStats ?? []
  return (
    <>
      <Field label="Badge Text">
        <input className="lb-input" value={ov.badge ?? ''} onChange={(e) => set('badge', e.target.value)} placeholder="Our Work" />
      </Field>
      <MediaField label="Badge Icon" value={ov.badgeIcon?.url ?? ov.badgeIconSrc ?? ''} onChange={(ref) => set('badgeIcon', ref)} />
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Page Title" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Supporting description…" />
      </Field>

      <CtaGroup
        groupLabel="Primary CTA"
        label={ov.ctaPrimaryLabel ?? ''} labelPlaceholder="View Projects"
        url={ov.ctaPrimaryUrl ?? ''} urlPlaceholder="#projects"
        iconValue={ov.ctaPrimaryIcon?.url ?? ''} iconPos={ov.ctaPrimaryIconPos ?? 'right'} iconFill={ov.ctaPrimaryIconFill ?? false}
        onLabelChange={(v) => set('ctaPrimaryLabel', v)}
        onUrlChange={(v) => set('ctaPrimaryUrl', v)}
        onIconChange={(ref) => set('ctaPrimaryIcon', ref)}
        onIconPosChange={(v) => set('ctaPrimaryIconPos', v)}
        onIconFillChange={(v) => set('ctaPrimaryIconFill', v)}
      />
      <CtaGroup
        groupLabel="Secondary CTA"
        label={ov.ctaSecondaryLabel ?? ''} labelPlaceholder="Contact Us"
        url={ov.ctaSecondaryUrl ?? ''} urlPlaceholder="/static/contact"
        iconValue={ov.ctaSecondaryIcon?.url ?? ''} iconPos={ov.ctaSecondaryIconPos ?? 'right'} iconFill={ov.ctaSecondaryIconFill ?? false}
        onLabelChange={(v) => set('ctaSecondaryLabel', v)}
        onUrlChange={(v) => set('ctaSecondaryUrl', v)}
        onIconChange={(ref) => set('ctaSecondaryIcon', ref)}
        onIconPosChange={(v) => set('ctaSecondaryIconPos', v)}
        onIconFillChange={(v) => set('ctaSecondaryIconFill', v)}
      />

      <Row>
        <Field label="Alignment">
          <select className="lb-input lb-input--select" value={ov.pageHeroAlign ?? 'center'} onChange={(e) => set('pageHeroAlign', e.target.value)}>
            <option value="center">Center</option>
            <option value="left">Left</option>
          </select>
        </Field>
        <Field label="Dark Background">
          <select className="lb-input lb-input--select" value={ov.pageHeroDark ? 'true' : 'false'} onChange={(e) => set('pageHeroDark', e.target.value === 'true')}>
            <option value="false">Light (default)</option>
            <option value="true">Dark</option>
          </select>
        </Field>
      </Row>
      <Field label="CTA Button Style">
        <select className="lb-input lb-input--select" value={ov.pageHeroCtaStyle ?? 'rounded'} onChange={(e) => set('pageHeroCtaStyle', e.target.value)}>
          <option value="rounded">Rounded corners (default)</option>
          <option value="square">Square (no border radius)</option>
        </select>
      </Field>
      <Row>
        <Field label="Stats Background">
          <select
            className="lb-input lb-input--select"
            value={ov.pageHeroStatsBg ? 'true' : 'false'}
            onChange={(e) => set('pageHeroStatsBg', e.target.value === 'true')}
          >
            <option value="false">None (inline with divider)</option>
            <option value="true">Grey band (#F5F5F5)</option>
          </select>
        </Field>
      </Row>
      <Field label="Stats">
        <div className="lb-items">
          {stats.map((s: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Stat {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...stats]; a.splice(i, 1); set('heroStats', a) }}>✕</button>
              </div>
              <Row>
                <input className="lb-input" placeholder='Value e.g. "150+"' value={s.statValue ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], statValue: e.target.value }; set('heroStats', a) }} />
                <input className="lb-input" placeholder="Label" value={s.statLabel ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], statLabel: e.target.value }; set('heroStats', a) }} />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('heroStats', [...stats, { statValue: '', statLabel: '' }])}>+ Add Stat</button>
        </div>
      </Field>
    </>
  )
}

// ── Project Grid fields ───────────────────────────────────────────────────────
function ProjectGridFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const source = (ov.projectContentSource ?? 'manual') as 'collection' | 'manual'
  const showFilter = (ov.showCategoryFilter ?? 'yes') as 'yes' | 'no'
  const items: any[] = ov.projectItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.projectHeading ?? ''} onChange={(e) => set('projectHeading', e.target.value)} placeholder="Featured Projects" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.projectSubheading ?? ''} onChange={(e) => set('projectSubheading', e.target.value)} placeholder="A curated selection…" />
      </Field>

      {/* ── Category filter toggle ────────────────────────────────────────── */}
      <Field label="Show Category Filter">
        <div style={{ display: 'flex', gap: 0, border: '1px solid #e5e5e5', borderRadius: 4, overflow: 'hidden' }}>
          {(['yes', 'no'] as const).map((v) => (
            <button
              key={v}
              onClick={() => set('showCategoryFilter', v)}
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: showFilter === v ? 600 : 400,
                background: showFilter === v ? '#171717' : '#fff',
                color: showFilter === v ? '#fff' : '#525252',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {v === 'yes' ? 'Show Tabs' : 'Hide Tabs'}
            </button>
          ))}
        </div>
      </Field>

      {/* ── Content source toggle ─────────────────────────────────────────── */}
      <Field label="Content Source">
        <div style={{ display: 'flex', gap: 0, border: '1px solid #e5e5e5', borderRadius: 4, overflow: 'hidden' }}>
          {(['collection', 'manual'] as const).map((s) => (
            <button
              key={s}
              onClick={() => set('projectContentSource', s)}
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: source === s ? 600 : 400,
                background: source === s ? '#171717' : '#fff',
                color: source === s ? '#fff' : '#525252',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {s === 'collection' ? 'From Portfolio' : 'Manual'}
            </button>
          ))}
        </div>
      </Field>

      {source === 'collection' ? (
        <>
          <Row>
            <Field label="Items per Page">
              <input
                className="lb-input"
                type="number"
                min={1}
                max={24}
                value={ov.projectLimit ?? 6}
                onChange={(e) => set('projectLimit', Number(e.target.value))}
                placeholder="6"
              />
            </Field>
            <Field label="Sort">
              <select
                className="lb-input"
                value={ov.projectOrderBy ?? 'publishedAt_desc'}
                onChange={(e) => set('projectOrderBy', e.target.value)}
              >
                <option value="publishedAt_desc">Newest First</option>
                <option value="publishedAt_asc">Oldest First</option>
              </select>
            </Field>
          </Row>
          <Field label="Category Slug (optional)">
            <input
              className="lb-input"
              value={ov.projectCategory ?? ''}
              onChange={(e) => set('projectCategory', e.target.value)}
              placeholder="Leave empty for all"
            />
          </Field>
        </>
      ) : (
        <Field label="Projects">
          <div className="lb-items">
            {items.map((p: any, i: number) => (
              <div key={i} className="lb-item">
                <div className="lb-item__header">
                  <span>Project {i + 1}</span>
                  <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('projectItems', a) }}>✕</button>
                </div>
                <MediaField label="Project Image" value={p.projectImage?.url ?? ''} onChange={(ref) => { const a = [...items]; a[i] = { ...a[i], projectImage: ref }; set('projectItems', a) }} />
                <Row>
                  <input className="lb-input" placeholder="Tag (e.g. FinTech)" value={p.projectTag ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], projectTag: e.target.value }; set('projectItems', a) }} />
                  <input className="lb-input" placeholder="Type (e.g. Mobile App)" value={p.projectType ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], projectType: e.target.value }; set('projectItems', a) }} />
                </Row>
                <input className="lb-input" placeholder="Title" value={p.projectTitle ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], projectTitle: e.target.value }; set('projectItems', a) }} />
                <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={p.projectDesc ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], projectDesc: e.target.value }; set('projectItems', a) }} />
                <Row>
                  <input className="lb-input" placeholder="CTA Label" value={p.projectCta ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], projectCta: e.target.value }; set('projectItems', a) }} />
                  <LinkField label="CTA URL" value={p.projectUrl ?? ''} onChange={(v) => { const a = [...items]; a[i] = { ...a[i], projectUrl: v }; set('projectItems', a) }} />
                </Row>
              </div>
            ))}
            <button className="lb-items__add" onClick={() => set('projectItems', [...items, {}])}>+ Add Project</button>
          </div>
        </Field>
      )}

      {/* ── Bottom Button ────────────────────────────────────────────────── */}
      <Field label="Bottom Button">
        <select
          className="lb-input lb-input--select"
          value={ov.projectLoadMoreType ?? 'pagination'}
          onChange={(e) => set('projectLoadMoreType', e.target.value)}
        >
          <option value="pagination">Pagination (numbered pages)</option>
          <option value="load-more">Load More (append cards)</option>
          <option value="link">Link to URL</option>
        </select>
      </Field>
      {(ov.projectLoadMoreType === 'load-more' || ov.projectLoadMoreType === 'link' || !ov.projectLoadMoreType) && (
        <Field label="Button Label">
          <input
            className="lb-input"
            value={ov.projectLoadMoreLabel ?? ''}
            onChange={(e) => set('projectLoadMoreLabel', e.target.value)}
            placeholder={ov.projectLoadMoreType === 'link' ? 'View All Projects' : 'Load More Projects'}
          />
        </Field>
      )}
      {ov.projectLoadMoreType === 'link' && (
        <LinkField
          label="Button URL"
          value={ov.projectLoadMoreUrl ?? ''}
          onChange={(v) => set('projectLoadMoreUrl', v)}
          placeholder="/portfolio"
        />
      )}
    </>
  )
}

// ── Article Grid fields ───────────────────────────────────────────────────────
function ArticleGridFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const source = (ov.articleContentSource ?? 'manual') as 'collection' | 'manual'
  const items: any[] = ov.articleItems ?? []
  return (
    <>
      <Field label="Section Label">
        <input className="lb-input" value={ov.sectionLabel ?? ''} onChange={(e) => set('sectionLabel', e.target.value)} placeholder="Latest Articles" />
      </Field>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Latest Articles" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Expert insights on…" />
      </Field>

      {/* ── Content source toggle ─────────────────────────────────────── */}
      <Field label="Content Source">
        <div style={{ display: 'flex', gap: 0, border: '1px solid #e5e5e5', borderRadius: 4, overflow: 'hidden' }}>
          {(['collection', 'manual'] as const).map((s) => (
            <button
              key={s}
              onClick={() => set('articleContentSource', s)}
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: source === s ? 600 : 400,
                background: source === s ? '#171717' : '#fff',
                color: source === s ? '#fff' : '#525252',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {s === 'collection' ? 'From Posts Collection' : 'Manual'}
            </button>
          ))}
        </div>
      </Field>

      {source === 'collection' ? (
        <>
          <Row>
            <Field label="Number of Posts">
              <input
                className="lb-input"
                type="number"
                min={1}
                max={24}
                value={ov.articlePostsLimit ?? 6}
                onChange={(e) => set('articlePostsLimit', Number(e.target.value))}
                placeholder="6"
              />
            </Field>
            <Field label="Order">
              <select
                className="lb-input"
                value={ov.articlePostsOrderBy ?? 'publishedAt_desc'}
                onChange={(e) => set('articlePostsOrderBy', e.target.value)}
              >
                <option value="publishedAt_desc">Newest First</option>
                <option value="publishedAt_asc">Oldest First</option>
              </select>
            </Field>
          </Row>
          <Field label="Category Filter (slug)">
            <input
              className="lb-input"
              value={ov.articlePostsCategory ?? ''}
              onChange={(e) => set('articlePostsCategory', e.target.value)}
              placeholder="Leave empty for all categories"
            />
          </Field>
        </>
      ) : (
        <Field label="Articles">
          <div className="lb-items">
            {items.map((a: any, i: number) => (
              <div key={i} className="lb-item">
                <div className="lb-item__header">
                  <span>Article {i + 1}</span>
                  <button className="lb-item__remove" onClick={() => { const arr = [...items]; arr.splice(i, 1); set('articleItems', arr) }}>✕</button>
                </div>
                <MediaField label="Cover Image" value={a.articleImage?.url ?? ''} onChange={(ref) => { const arr = [...items]; arr[i] = { ...arr[i], articleImage: ref }; set('articleItems', arr) }} />
                <Row>
                  <input className="lb-input" placeholder="Category" value={a.articleCategory ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleCategory: e.target.value }; set('articleItems', arr) }} />
                  <input className="lb-input" placeholder="Date (e.g. Jan 15, 2025)" value={a.articleDate ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleDate: e.target.value }; set('articleItems', arr) }} />
                </Row>
                <input className="lb-input" placeholder="Title" value={a.articleTitle ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleTitle: e.target.value }; set('articleItems', arr) }} />
                <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Short Description" value={a.articleDesc ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleDesc: e.target.value }; set('articleItems', arr) }} />
                <Row>
                  <input className="lb-input" placeholder="CTA Label" value={a.articleCta ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleCta: e.target.value }; set('articleItems', arr) }} />
                  <LinkField label="CTA URL" value={a.articleUrl ?? ''} onChange={(v) => { const arr = [...items]; arr[i] = { ...arr[i], articleUrl: v }; set('articleItems', arr) }} />
                </Row>
              </div>
            ))}
            <button className="lb-items__add" onClick={() => set('articleItems', [...items, {}])}>+ Add Article</button>
          </div>
        </Field>
      )}

      {/* ── Load More button ─────────────────────────────────────────── */}
      <Field label="Load More Button">
        <select
          className="lb-input lb-input--select"
          value={ov.articleLoadMoreType ?? 'none'}
          onChange={(e) => set('articleLoadMoreType', e.target.value)}
        >
          <option value="none">None</option>
          <option value="link">Link to URL</option>
        </select>
      </Field>
      {(ov.articleLoadMoreType === 'link') && (
        <>
          <Field label="Button Label">
            <input
              className="lb-input"
              value={ov.articleLoadMoreLabel ?? ''}
              onChange={(e) => set('articleLoadMoreLabel', e.target.value)}
              placeholder="Load More Articles"
            />
          </Field>
          <Field label="Button URL">
            <input
              className="lb-input"
              value={ov.articleLoadMoreUrl ?? ''}
              onChange={(e) => set('articleLoadMoreUrl', e.target.value)}
              placeholder="/articles"
            />
          </Field>
        </>
      )}
    </>
  )
}

// ── Article Featured fields ───────────────────────────────────────────────────
function ArticleFeaturedFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Section Label">
        <input className="lb-input" value={ov.sectionLabel ?? ''} onChange={(e) => set('sectionLabel', e.target.value)} placeholder="Featured Article" />
      </Field>
      <Row>
        <Field label="Category">
          <input className="lb-input" value={ov.featCategory ?? ''} onChange={(e) => set('featCategory', e.target.value)} placeholder="AI & Machine Learning" />
        </Field>
        <Field label="Date">
          <input className="lb-input" value={ov.featDate ?? ''} onChange={(e) => set('featDate', e.target.value)} placeholder="March 15, 2025" />
        </Field>
      </Row>
      <Row>
        <Field label="Read Time">
          <input className="lb-input" value={ov.featReadTime ?? ''} onChange={(e) => set('featReadTime', e.target.value)} placeholder="8 min read" />
        </Field>
        <Field label="Views">
          <input className="lb-input" value={ov.featViews ?? ''} onChange={(e) => set('featViews', e.target.value)} placeholder="2.4K views" />
        </Field>
      </Row>
      <Field label="Title">
        <input className="lb-input" value={ov.featTitle ?? ''} onChange={(e) => set('featTitle', e.target.value)} placeholder="Article title…" />
      </Field>
      <Field label="Description">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.featDesc ?? ''} onChange={(e) => set('featDesc', e.target.value)} placeholder="Article description…" />
      </Field>
      <Row>
        <Field label="CTA Label">
          <input className="lb-input" value={ov.featCtaLabel ?? ''} onChange={(e) => set('featCtaLabel', e.target.value)} placeholder="Read Full Article" />
        </Field>
        <LinkField label="CTA URL" value={ov.featCtaUrl ?? ''} onChange={(v) => set('featCtaUrl', v)} placeholder="/static/article-detail" />
      </Row>
    </>
  )
}

// ── Involved Hero fields ──────────────────────────────────────────────────────
function InvolvedHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Badge Text">
        <input className="lb-input" value={ov.badge ?? ''} onChange={(e) => set('badge', e.target.value)} placeholder="Join Our Mission" />
      </Field>
      <MediaField label="Badge Icon" value={ov.badgeIcon?.url ?? ov.badgeIconSrc ?? ''} onChange={(ref) => set('badgeIcon', ref)} />
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Get Involved With ATech" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Join our community…" />
      </Field>
      <CtaGroup
        groupLabel="Primary CTA"
        label={ov.ctaPrimaryLabel ?? ''} labelPlaceholder="Explore Partnerships"
        url={ov.ctaPrimaryUrl ?? ''} urlPlaceholder="#partnership"
        iconValue={ov.ctaPrimaryIcon?.url ?? ''} iconPos={ov.ctaPrimaryIconPos ?? 'right'} iconFill={ov.ctaPrimaryIconFill ?? false}
        onLabelChange={(v) => set('ctaPrimaryLabel', v)}
        onUrlChange={(v) => set('ctaPrimaryUrl', v)}
        onIconChange={(ref) => set('ctaPrimaryIcon', ref)}
        onIconPosChange={(v) => set('ctaPrimaryIconPos', v)}
        onIconFillChange={(v) => set('ctaPrimaryIconFill', v)}
      />
      <CtaGroup
        groupLabel="Secondary CTA"
        label={ov.ctaSecondaryLabel ?? ''} labelPlaceholder="Get a Quote"
        url={ov.ctaSecondaryUrl ?? ''} urlPlaceholder="#quote"
        iconValue={ov.ctaSecondaryIcon?.url ?? ''} iconPos={ov.ctaSecondaryIconPos ?? 'right'} iconFill={ov.ctaSecondaryIconFill ?? false}
        onLabelChange={(v) => set('ctaSecondaryLabel', v)}
        onUrlChange={(v) => set('ctaSecondaryUrl', v)}
        onIconChange={(ref) => set('ctaSecondaryIcon', ref)}
        onIconPosChange={(v) => set('ctaSecondaryIconPos', v)}
        onIconFillChange={(v) => set('ctaSecondaryIconFill', v)}
      />
      <MediaField label="Right-side Image (Community Illustration)" value={ov.involvedHeroImage?.url ?? ''} onChange={(ref) => set('involvedHeroImage', ref)} />
    </>
  )
}

// ── Quote Form fields ─────────────────────────────────────────────────────────
function QuoteFormFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Get a Custom Quote" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Tell us about your project…" />
      </Field>
      <Field label="Submit Button Label">
        <input className="lb-input" value={ov.submitLabel ?? ''} onChange={(e) => set('submitLabel', e.target.value)} placeholder="Request Your Quote" />
      </Field>
    </>
  )
}

// ── Culture Values fields ─────────────────────────────────────────────────────
function CultureValuesFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const values: any[] = ov.cultureValues ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Culture" />
      </Field>
      <Field label="Description">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="At ATech Solution, we foster…" />
      </Field>
      <MediaField label="Team Culture Photo (left column)" value={ov.cultureImage?.url ?? ''} onChange={(ref) => set('cultureImage', ref)} />
      <Field label="Values">
        <div className="lb-items">
          {values.map((v: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Value {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...values]; a.splice(i, 1); set('cultureValues', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={v.valueIcon?.url ?? (typeof v.valueIcon === 'string' ? v.valueIcon : '')} onChange={(ref) => { const a = [...values]; a[i] = { ...a[i], valueIcon: ref?.url ?? '' }; set('cultureValues', a) }} />
              <input className="lb-input" placeholder="Title" value={v.valueTitle ?? ''} onChange={(e) => { const a = [...values]; a[i] = { ...a[i], valueTitle: e.target.value }; set('cultureValues', a) }} />
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={v.valueDesc ?? ''} onChange={(e) => { const a = [...values]; a[i] = { ...a[i], valueDesc: e.target.value }; set('cultureValues', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('cultureValues', [...values, {}])}>+ Add Value</button>
        </div>
      </Field>
    </>
  )
}

// ── Community Hero fields ─────────────────────────────────────────────────────
function CommunityHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.communityHeroTitle ?? ''} onChange={(e) => set('communityHeroTitle', e.target.value)} placeholder="Get Involved in Our Community" />
      </Field>
      <Field label="Description">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.communityHeroDesc ?? ''} onChange={(e) => set('communityHeroDesc', e.target.value)} placeholder="Join thousands of developers, designers, and tech enthusiasts…" />
      </Field>
      <Row>
        <Field label="Back Button Label">
          <input className="lb-input" value={ov.communityHeroBackLabel ?? ''} onChange={(e) => set('communityHeroBackLabel', e.target.value)} placeholder="Back to Insights" />
        </Field>
        <Field label="Back Button URL">
          <input className="lb-input" value={ov.communityHeroBackUrl ?? ''} onChange={(e) => set('communityHeroBackUrl', e.target.value)} placeholder="/insights (leave empty for browser back)" />
        </Field>
      </Row>
    </>
  )
}

// ── Community Channels fields ─────────────────────────────────────────────────
function CommunityChannelsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const channels: any[] = ov.channelItems ?? []
  return (
    <>
      <Field label="Channels">
        <div className="lb-items">
          {channels.map((ch: any, i: number) => {
            const stats: any[] = ch.channelStats ?? []
            const updateCh = (patch: Record<string, unknown>) => {
              const a = [...channels]; a[i] = { ...a[i], ...patch }; set('channelItems', a)
            }
            return (
              <div key={i} className="lb-item">
                <div className="lb-item__header">
                  <span>Channel {i + 1}</span>
                  <button className="lb-item__remove" onClick={() => { const a = [...channels]; a.splice(i, 1); set('channelItems', a) }}>✕</button>
                </div>
                <MediaField label="Channel Icon" value={ch.channelIcon?.url ?? (typeof ch.channelIcon === 'string' ? ch.channelIcon : '')} onChange={(ref) => updateCh({ channelIcon: ref?.url ?? '' })} />
                <Field label="Title">
                  <input className="lb-input" placeholder="GitHub Community" value={ch.channelTitle ?? ''} onChange={(e) => updateCh({ channelTitle: e.target.value })} />
                </Field>
                <Field label="Description">
                  <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description…" value={ch.channelDesc ?? ''} onChange={(e) => updateCh({ channelDesc: e.target.value })} />
                </Field>

                {/* Stats sub-list */}
                <Field label="Stats">
                  <div className="lb-items" style={{ marginTop: 0 }}>
                    {stats.map((s: any, j: number) => (
                      <div key={j} className="lb-item" style={{ padding: '8px' }}>
                        <div className="lb-item__header" style={{ marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px' }}>Stat {j + 1}</span>
                          <button className="lb-item__remove" onClick={() => { const ns = [...stats]; ns.splice(j, 1); updateCh({ channelStats: ns }) }}>✕</button>
                        </div>
                        <Row>
                          <MediaField label="Icon" value={s.statIcon?.url ?? (typeof s.statIcon === 'string' ? s.statIcon : '')} onChange={(ref) => { const ns = [...stats]; ns[j] = { ...ns[j], statIcon: ref?.url ?? '' }; updateCh({ channelStats: ns }) }} />
                          <Field label="Label">
                            <input className="lb-input" placeholder="150+ repositories" value={s.statLabel ?? ''} onChange={(e) => { const ns = [...stats]; ns[j] = { ...ns[j], statLabel: e.target.value }; updateCh({ channelStats: ns }) }} />
                          </Field>
                        </Row>
                      </div>
                    ))}
                    <button className="lb-items__add" onClick={() => updateCh({ channelStats: [...stats, { statIcon: '', statLabel: '' }] })}>+ Add Stat</button>
                  </div>
                </Field>

                <Row>
                  <Field label="CTA Label">
                    <input className="lb-input" placeholder="Join Community" value={ch.channelCta ?? ''} onChange={(e) => updateCh({ channelCta: e.target.value })} />
                  </Field>
                  <LinkField label="CTA URL" value={ch.channelUrl ?? ''} onChange={(v) => updateCh({ channelUrl: v })} />
                </Row>
              </div>
            )
          })}
          <button className="lb-items__add" onClick={() => set('channelItems', [...channels, { channelStats: [] }])}>+ Add Channel</button>
        </div>
      </Field>
    </>
  )
}

// ── Community Ambassador fields ───────────────────────────────────────────────
function CommunityAmbassadorFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const benefits: any[] = ov.ambassadorBenefits ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Developer Ambassador Program" />
      </Field>
      <Field label="Description">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Become an official ambassador…" />
      </Field>
      <Field label="Benefits">
        <div className="lb-items">
          {benefits.map((b: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Benefit {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...benefits]; a.splice(i, 1); set('ambassadorBenefits', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={b.benefitIcon?.url ?? (typeof b.benefitIcon === 'string' ? b.benefitIcon : '')} onChange={(ref) => { const a = [...benefits]; a[i] = { ...a[i], benefitIcon: ref?.url ?? '' }; set('ambassadorBenefits', a) }} />
              <Row>
                <input className="lb-input" placeholder="Title" value={b.benefitTitle ?? ''} onChange={(e) => { const a = [...benefits]; a[i] = { ...a[i], benefitTitle: e.target.value }; set('ambassadorBenefits', a) }} />
                <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={b.benefitDesc ?? ''} onChange={(e) => { const a = [...benefits]; a[i] = { ...a[i], benefitDesc: e.target.value }; set('ambassadorBenefits', a) }} />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('ambassadorBenefits', [...benefits, {}])}>+ Add Benefit</button>
        </div>
      </Field>

      <MediaField label="Ambassador Image (right column)" value={ov.ambassadorImage?.url ?? ''} onChange={(ref) => set('ambassadorImage', ref)} />

      <CtaGroup
        groupLabel="Ambassador CTA"
        label={ov.ambassadorCta ?? ''} labelPlaceholder="Apply to Become an Ambassador"
        url={ov.ambassadorUrl ?? ''} urlPlaceholder="#"
        iconValue={ov.ambassadorCtaIcon?.url ?? ''} iconPos={ov.ambassadorCtaIconPos ?? 'right'} iconFill={ov.ambassadorCtaIconFill ?? false}
        onLabelChange={(v) => set('ambassadorCta', v)}
        onUrlChange={(v) => set('ambassadorUrl', v)}
        onIconChange={(ref) => set('ambassadorCtaIcon', ref)}
        onIconPosChange={(v) => set('ambassadorCtaIconPos', v)}
        onIconFillChange={(v) => set('ambassadorCtaIconFill', v)}
      />
    </>
  )
}

// ── Community Programs fields ─────────────────────────────────────────────────
function CommunityProgramsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const programs: any[] = ov.programItems ?? []
  return (
    <>
      <Field label="Programs">
        <div className="lb-items">
          {programs.map((p: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Program {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...programs]; a.splice(i, 1); set('programItems', a) }}>✕</button>
              </div>
              <MediaField label="Icon" value={p.programIcon?.url ?? (typeof p.programIcon === 'string' ? p.programIcon : '')} onChange={(ref) => { const a = [...programs]; a[i] = { ...a[i], programIcon: ref?.url ?? '' }; set('programItems', a) }} />
              <input className="lb-input" placeholder="Title" value={p.programTitle ?? ''} onChange={(e) => { const a = [...programs]; a[i] = { ...a[i], programTitle: e.target.value }; set('programItems', a) }} />
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={p.programDesc ?? ''} onChange={(e) => { const a = [...programs]; a[i] = { ...a[i], programDesc: e.target.value }; set('programItems', a) }} />
              <Row>
                <input className="lb-input" placeholder="CTA Label" value={p.programCta ?? ''} onChange={(e) => { const a = [...programs]; a[i] = { ...a[i], programCta: e.target.value }; set('programItems', a) }} />
                <LinkField label="CTA URL" value={p.programUrl ?? ''} onChange={(v) => { const a = [...programs]; a[i] = { ...a[i], programUrl: v }; set('programItems', a) }} />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('programItems', [...programs, {}])}>+ Add Program</button>
        </div>
      </Field>
    </>
  )
}

// ── Contact Hero fields ───────────────────────────────────────────────────────
function ContactHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const cards: any[] = ov.contactCards ?? []
  return (
    <>
      <Field label="Badge Text">
        <input className="lb-input" value={ov.badge ?? ''} onChange={(e) => set('badge', e.target.value)} placeholder="GET IN TOUCH" />
      </Field>
      <MediaField label="Badge Icon" value={ov.badgeIcon?.url ?? ''} onChange={(ref) => set('badgeIcon', ref)} />
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Let's Build Something Great" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Have a project in mind?" />
      </Field>
      <Field label="Contact Cards">
        <div className="lb-items">
          {cards.map((c: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Card {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...cards]; a.splice(i, 1); set('contactCards', a) }}>✕</button>
              </div>
              <MediaField label="Card Icon" value={c.cardIcon?.url ?? c.cardIconSrc ?? ''} onChange={(ref) => { const a = [...cards]; a[i] = { ...a[i], cardIcon: ref, cardIconSrc: ref?.url ?? '' }; set('contactCards', a) }} />
              <Row>
                <input className="lb-input" placeholder="Title" value={c.cardTitle ?? ''} onChange={(e) => { const a = [...cards]; a[i] = { ...a[i], cardTitle: e.target.value }; set('contactCards', a) }} />
                <input className="lb-input" placeholder="Value (e.g. email)" value={c.cardValue ?? ''} onChange={(e) => { const a = [...cards]; a[i] = { ...a[i], cardValue: e.target.value }; set('contactCards', a) }} />
              </Row>
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={c.cardDesc ?? ''} onChange={(e) => { const a = [...cards]; a[i] = { ...a[i], cardDesc: e.target.value }; set('contactCards', a) }} />
              {/* Social Icons */}
              <div className="lb-field__label" style={{ fontSize: 11, fontWeight: 600, marginTop: 8, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Social Icons</div>
              <div className="lb-items">
                {(c.cardSocialIcons ?? []).map((si: any, j: number) => (
                  <div key={j} className="lb-item">
                    <div className="lb-item__header">
                      <span>Icon {j + 1}</span>
                      <button className="lb-item__remove" onClick={() => { const a = [...cards]; const icons = [...(a[i].cardSocialIcons ?? [])]; icons.splice(j, 1); a[i] = { ...a[i], cardSocialIcons: icons }; set('contactCards', a) }}>✕</button>
                    </div>
                    <MediaField label="Icon Image" value={si.socialIcon?.url ?? si.socialIconSrc ?? ''} onChange={(ref) => { const a = [...cards]; const icons = [...(a[i].cardSocialIcons ?? [])]; icons[j] = { ...icons[j], socialIcon: ref, socialIconSrc: ref?.url ?? '' }; a[i] = { ...a[i], cardSocialIcons: icons }; set('contactCards', a) }} />
                    <LinkField label="Link URL" value={si.socialIconUrl ?? ''} onChange={(v) => { const a = [...cards]; const icons = [...(a[i].cardSocialIcons ?? [])]; icons[j] = { ...icons[j], socialIconUrl: v }; a[i] = { ...a[i], cardSocialIcons: icons }; set('contactCards', a) }} placeholder="https://linkedin.com/…" />
                  </div>
                ))}
                <button className="lb-items__add" onClick={() => { const a = [...cards]; a[i] = { ...a[i], cardSocialIcons: [...(a[i].cardSocialIcons ?? []), {}] }; set('contactCards', a) }}>+ Add Social Icon</button>
              </div>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('contactCards', [...cards, {}])}>+ Add Card</button>
        </div>
      </Field>
    </>
  )
}

// ── Jobs List fields ──────────────────────────────────────────────────────────
function JobsListFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.jobItems ?? []
  const source = ov.jobSource ?? 'manual'
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Join Our Team" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Build your career with us…" />
      </Field>
      <Field label="Job Source">
        <select className="lb-input lb-input--select" value={source} onChange={(e) => set('jobSource', e.target.value)}>
          <option value="manual">Manual (enter jobs below)</option>
          <option value="collection">From Collection (Job Vacancies)</option>
        </select>
      </Field>

      {source === 'collection' ? (
        <>
          <Field label="Category Filter">
            <input className="lb-input" value={ov.jobCategory ?? ''} onChange={(e) => set('jobCategory', e.target.value)} placeholder="e.g. Engineering (leave empty for all)" />
          </Field>
          <Field label="Limit">
            <input className="lb-input" type="number" min={1} max={100} value={ov.jobLimit ?? 20} onChange={(e) => set('jobLimit', Number(e.target.value))} />
          </Field>
        </>
      ) : (
        <Field label="Job Openings">
          <div className="lb-items">
            {items.map((j: any, i: number) => (
              <div key={i} className="lb-item">
                <div className="lb-item__header">
                  <span>Job {i + 1}</span>
                  <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('jobItems', a) }}>✕</button>
                </div>
                <Row>
                  <input className="lb-input" placeholder="Title" value={j.jobTitle ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], jobTitle: e.target.value }; set('jobItems', a) }} />
                  <input className="lb-input" placeholder="Type (Full-time)" value={j.jobType ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], jobType: e.target.value }; set('jobItems', a) }} />
                </Row>
                <Row>
                  <input className="lb-input" placeholder="Category" value={j.jobCategory ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], jobCategory: e.target.value }; set('jobItems', a) }} />
                  <input className="lb-input" placeholder="Location" value={j.jobLocation ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], jobLocation: e.target.value }; set('jobItems', a) }} />
                </Row>
                <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={j.jobDesc ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], jobDesc: e.target.value }; set('jobItems', a) }} />
                <Row>
                  <input className="lb-input" placeholder="CTA Label" value={j.jobCta ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], jobCta: e.target.value }; set('jobItems', a) }} />
                  <LinkField label="CTA URL" value={j.jobUrl ?? ''} onChange={(v) => { const a = [...items]; a[i] = { ...a[i], jobUrl: v }; set('jobItems', a) }} />
                </Row>
              </div>
            ))}
            <button className="lb-items__add" onClick={() => set('jobItems', [...items, {}])}>+ Add Job</button>
          </div>
        </Field>
      )}
    </>
  )
}

// ── Contact Stats fields ──────────────────────────────────────────────────────
function ContactStatsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const ctas: any[]  = ov.contactStatCtas ?? []
  const stats: any[] = ov.contactStatItems ?? []
  return (
    <>
      <Field label="Style">
        <select className="lb-input lb-input--select" value={ov.contactStatsStyle ?? 'light'} onChange={(e) => set('contactStatsStyle', e.target.value)}>
          <option value="light">Light (white background)</option>
          <option value="dark">Dark (black background)</option>
        </select>
      </Field>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Ready to Start Your Project?" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Let's discuss how we can help…" />
      </Field>
      <Field label="CTA Buttons">
        <div className="lb-items">
          {ctas.map((btn: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Button {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...ctas]; a.splice(i, 1); set('contactStatCtas', a) }}>✕</button>
              </div>
              <Row>
                <input className="lb-input" placeholder="Label" value={btn.contactCtaLabel ?? ''} onChange={(e) => { const a = [...ctas]; a[i] = { ...a[i], contactCtaLabel: e.target.value }; set('contactStatCtas', a) }} />
                <LinkField label="URL" value={btn.contactCtaUrl ?? ''} onChange={(v) => { const a = [...ctas]; a[i] = { ...a[i], contactCtaUrl: v }; set('contactStatCtas', a) }} />
              </Row>
              <select
                className="lb-input lb-input--select"
                value={btn.contactCtaStyle ?? (btn.contactCtaPrimary ? 'primary' : 'outline')}
                onChange={(e) => { const a = [...ctas]; a[i] = { ...a[i], contactCtaStyle: e.target.value, contactCtaPrimary: e.target.value === 'primary' }; set('contactStatCtas', a) }}
              >
                <option value="primary">Primary — filled (adapts to section bg)</option>
                <option value="outline">Secondary — outline border</option>
                <option value="whatsapp">WhatsApp — white bg + green icon + text</option>
                <option value="accent">Accent — yellow (#ffd369) fill</option>
                <option value="ghost">Ghost — text only, no border</option>
              </select>
              <BtnIconRow
                iconValue={btn.contactCtaIcon?.url ?? ''}
                iconPos={btn.contactCtaIconPos ?? 'right'}
                iconFill={btn.contactCtaIconFill ?? false}
                onIconChange={(ref) => { const a = [...ctas]; a[i] = { ...a[i], contactCtaIcon: ref }; set('contactStatCtas', a) }}
                onIconPosChange={(v) => { const a = [...ctas]; a[i] = { ...a[i], contactCtaIconPos: v }; set('contactStatCtas', a) }}
                onIconFillChange={(v) => { const a = [...ctas]; a[i] = { ...a[i], contactCtaIconFill: v }; set('contactStatCtas', a) }}
              />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('contactStatCtas', [...ctas, { contactCtaPrimary: true }])}>+ Add Button</button>
        </div>
      </Field>
      <Field label="Stats">
        <div className="lb-items">
          {stats.map((s: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Stat {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...stats]; a.splice(i, 1); set('contactStatItems', a) }}>✕</button>
              </div>
              <Row>
                <input className="lb-input" placeholder='Value e.g. "500+"' value={s.contactStatValue ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], contactStatValue: e.target.value }; set('contactStatItems', a) }} />
                <input className="lb-input" placeholder="Label" value={s.contactStatLabel ?? ''} onChange={(e) => { const a = [...stats]; a[i] = { ...a[i], contactStatLabel: e.target.value }; set('contactStatItems', a) }} />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('contactStatItems', [...stats, {}])}>+ Add Stat</button>
        </div>
      </Field>
    </>
  )
}

// ── Locations fields ──────────────────────────────────────────────────────────
function FeaturedCaseStudyFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const logos: any[] = ov.clientLogos ?? (ov.clientLogo?.url ? [ov.clientLogo] : [])
  return (
    <>
      <Field label="Section Label">
        <input className="lb-input" value={ov.sectionLabel ?? ''} onChange={(e) => set('sectionLabel', e.target.value)} placeholder="Featured Case Study" />
      </Field>
      <Field label="Section Background">
        <select className="lb-input lb-input--select" value={ov.sectionBg ?? ''} onChange={(e) => set('sectionBg', e.target.value)}>
          <option value="">White — default</option>
          <option value="#fafafa">Light grey (#FAFAFA)</option>
        </select>
      </Field>
      <Field label="Case Title">
        <input className="lb-input" value={ov.caseTitle ?? ''} onChange={(e) => set('caseTitle', e.target.value)} placeholder="Client — Project Name" />
      </Field>
      <Field label="Description">
        <textarea className="lb-input lb-input--textarea" rows={4} value={ov.caseDesc ?? ''} onChange={(e) => set('caseDesc', e.target.value)} placeholder="Project description…" />
      </Field>
      <Field label="Feature List (one per line, rendered with ✓)">
        <textarea className="lb-input lb-input--textarea" rows={4} value={ov.caseFeatures ?? ''} onChange={(e) => set('caseFeatures', e.target.value)} placeholder={'End-to-End Automation from purchase to delivery.\nActs as a bridge between store, supplier, and logistics.'} />
      </Field>
      <Row>
        <Field label="CTA Label">
          <input className="lb-input" value={ov.ctaPrimaryLabel ?? ''} onChange={(e) => set('ctaPrimaryLabel', e.target.value)} placeholder="View Case Study" />
        </Field>
        <LinkField label="CTA URL" value={ov.ctaPrimaryUrl ?? ''} onChange={(v) => set('ctaPrimaryUrl', v)} placeholder="/static/portfolio-detail" />
      </Row>

      <Field label="Client Logos">
        <div className="lb-items">
          {logos.map((logo: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Logo {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...logos]; a.splice(i, 1); set('clientLogos', a) }}>✕</button>
              </div>
              <MediaField label="Logo Image" value={logo?.url ?? ''} onChange={(ref) => { const a = [...logos]; if (ref) { a[i] = ref } else { a.splice(i, 1) }; set('clientLogos', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('clientLogos', [...logos, { url: '', alt: '' }])}>+ Add Logo</button>
        </div>
      </Field>

      <MediaField label="Case Study Image" value={ov.caseImage?.url ?? ''} onChange={(ref) => set('caseImage', ref)} />
      <Field label="Floating Badge — Value">
        <input className="lb-input" value={ov.floatingPlatform ?? ''} onChange={(e) => set('floatingPlatform', e.target.value)} placeholder="Automation" />
      </Field>
      <Field label="Floating Badge — Subtitle">
        <input className="lb-input" value={ov.floatingPlatformType ?? ''} onChange={(e) => set('floatingPlatformType', e.target.value)} placeholder="Streamlined Workflow" />
      </Field>
      <MediaField label="Floating Badge Icon (empty = default emoji)" value={ov.floatingIconSrc ?? ''} onChange={(ref) => set('floatingIconSrc', ref?.url ?? '')} />
      <Field label="Image Position">
        <select className="lb-input lb-input--select" value={ov.imagePosition ?? 'right'} onChange={(e) => set('imagePosition', e.target.value)}>
          <option value="right">Right (text left, image right)</option>
          <option value="left">Left (image left, text right)</option>
        </select>
      </Field>
    </>
  )
}

// ── Case Study fields ─────────────────────────────────────────────────────────
function CaseStudyFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Background Variant">
        <select
          className="lb-input lb-input--select"
          value={ov.csVariant ?? 'light'}
          onChange={(e) => set('csVariant', e.target.value)}
        >
          <option value="light">Light — white background</option>
          <option value="dark1">Dark 1 — charcoal #464646</option>
          <option value="dark2">Dark 2 — darker #2c2c2c</option>
        </select>
      </Field>

      <Field label="Image Position">
        <select
          className="lb-input lb-input--select"
          value={ov.imagePosition ?? 'right'}
          onChange={(e) => set('imagePosition', e.target.value)}
        >
          <option value="right">Right — content left, image right</option>
          <option value="left">Left — image left, content right</option>
        </select>
      </Field>

      <Field label="Accent Heading">
        <input
          className="lb-input"
          value={ov.headingAccent ?? ''}
          onChange={(e) => set('headingAccent', e.target.value)}
          placeholder="e.g. Quality HealthCare"
        />
      </Field>

      <Field label="Main Heading">
        <input
          className="lb-input"
          value={ov.headingPrimary ?? ''}
          onChange={(e) => set('headingPrimary', e.target.value)}
          placeholder="e.g. Scaling IT talent for"
        />
      </Field>

      <Field label="Accent Position">
        <select
          className="lb-input lb-input--select"
          value={ov.headingAccentFirst ? 'first' : 'last'}
          onChange={(e) => set('headingAccentFirst', e.target.value === 'first')}
        >
          <option value="last">After main heading</option>
          <option value="first">Before main heading</option>
        </select>
      </Field>

      <Field label="Body Text">
        <textarea
          className="lb-input lb-input--textarea"
          rows={4}
          value={ov.body ?? ''}
          onChange={(e) => set('body', e.target.value)}
          placeholder="Supporting description..."
        />
      </Field>

      <MediaField label="Client Logo" value={ov.clientLogo?.url ?? ''} onChange={(ref) => set('clientLogo', ref)} />
      <MediaField label="Case Image"  value={ov.caseImage?.url  ?? ''} onChange={(ref) => set('caseImage',  ref)} />
    </>
  )
}

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

// ── Image Info fields ─────────────────────────────────────────────────────────
function ImageInfoFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const pins: any[] = ov.iibPins ?? []
  function setPins(next: any[]) { set('iibPins', next) }
  const newPin = () => ({ label: 'New pin', icon: '', iconBg: '#4a4a4a', posX: 50, posY: 50, lineLength: 80 })
  return (
    <>
      <Field label="Section Title">
        <input className="lb-input" value={ov.iibTitle ?? ''} onChange={(e) => set('iibTitle', e.target.value)} placeholder="Hire Across Asia. Without Hiring Headache." />
      </Field>
      <Field label="Subtitle">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.iibSubtitle ?? ''} onChange={(e) => set('iibSubtitle', e.target.value)} placeholder="Section subtitle..." />
      </Field>
      <MediaField label="Background Image" value={ov.iibBgImage?.url ?? ''} onChange={(ref) => set('iibBgImage', ref)} />
      <Field label="Interaction Mode">
        <select className="lb-input lb-input--select" value={ov.iibMode ?? 'scroll'} onChange={(e) => set('iibMode', e.target.value)}>
          <option value="scroll">Scroll — reveal pins as you scroll</option>
          <option value="hover">Hover — mouseover dot to reveal pin</option>
        </select>
      </Field>
      <Field label="Tooltip Text">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.iibTooltipText ?? ''} onChange={(e) => set('iibTooltipText', e.target.value)} placeholder="Tooltip bubble message..." />
      </Field>
      <MediaField label="Tooltip Mascot Image" value={ov.iibTooltipMascot?.url ?? ''} onChange={(ref) => set('iibTooltipMascot', ref)} />
      <Field label="Info Pins">
        <div className="lb-items">
          {pins.map((pin: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Pin {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...pins]; a.splice(i, 1); setPins(a) }}>✕</button>
              </div>
              <Field label="Label">
                <input className="lb-input" value={pin.label ?? ''} onChange={(e) => { const a = [...pins]; a[i] = { ...a[i], label: e.target.value }; setPins(a) }} placeholder="Pin label text" />
              </Field>
              <Field label="Icon (emoji)">
                <input className="lb-input" value={pin.icon ?? ''} onChange={(e) => { const a = [...pins]; a[i] = { ...a[i], icon: e.target.value }; setPins(a) }} placeholder="🇨🇳" />
              </Field>
              <Field label="Icon Background Color">
                <input className="lb-input" value={pin.iconBg ?? '#4a4a4a'} onChange={(e) => { const a = [...pins]; a[i] = { ...a[i], iconBg: e.target.value }; setPins(a) }} placeholder="#dc2626" />
              </Field>
              <Field label="Position X (0–100%)">
                <input className="lb-input" type="number" min={0} max={100} value={pin.posX ?? 50} onChange={(e) => { const a = [...pins]; a[i] = { ...a[i], posX: Number(e.target.value) }; setPins(a) }} />
              </Field>
              <Field label="Position Y (0–100%)">
                <input className="lb-input" type="number" min={0} max={100} value={pin.posY ?? 50} onChange={(e) => { const a = [...pins]; a[i] = { ...a[i], posY: Number(e.target.value) }; setPins(a) }} />
              </Field>
              <Field label="Connector Line Length (px, 0 = none)">
                <input className="lb-input" type="number" min={0} value={pin.lineLength ?? 0} onChange={(e) => { const a = [...pins]; a[i] = { ...a[i], lineLength: Number(e.target.value) }; setPins(a) }} />
              </Field>
              <Field label="Show Dot Marker">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={pin.showDot ?? true} onChange={(e) => { const a = [...pins]; a[i] = { ...a[i], showDot: e.target.checked }; setPins(a) }} />
                  <span>Show dot at this position</span>
                </label>
              </Field>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => setPins([...pins, newPin()])}>+ Add Pin</button>
        </div>
      </Field>
    </>
  )
}

// ── Step Scroll fields ────────────────────────────────────────────────────────
function StepScrollFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const steps: any[] = ov.sbSteps ?? []
  function setSteps(next: any[]) { set('sbSteps', next) }
  const newStep = () => ({ stepTitle: 'New Step', stepBody: '', stepIcon: null, stepFeatured: false })
  return (
    <>
      <Field label="Section Title">
        <input className="lb-input" value={ov.sbTitle ?? ''} onChange={(e) => set('sbTitle', e.target.value)} placeholder="Section heading..." />
      </Field>
      <Field label="Subtitle">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.sbSubtitle ?? ''} onChange={(e) => set('sbSubtitle', e.target.value)} placeholder="Section subtitle..." />
      </Field>
      <Field label="Steps">
        <div className="lb-items">
          {steps.map((step: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Step {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...steps]; a.splice(i, 1); setSteps(a) }}>✕</button>
              </div>
              <Field label="Title">
                <input className="lb-input" value={step.stepTitle ?? ''} onChange={(e) => { const a = [...steps]; a[i] = { ...a[i], stepTitle: e.target.value }; setSteps(a) }} placeholder="Step title" />
              </Field>
              <Field label="Description">
                <textarea className="lb-input lb-input--textarea" rows={3} value={step.stepBody ?? ''} onChange={(e) => { const a = [...steps]; a[i] = { ...a[i], stepBody: e.target.value }; setSteps(a) }} placeholder="Step description..." />
              </Field>
              <MediaField label="Icon (PNG)" value={step.stepIcon?.url ?? ''} onChange={(ref) => { const a = [...steps]; a[i] = { ...a[i], stepIcon: ref }; setSteps(a) }} />
              <Field label="Featured Step (yellow title)">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={step.stepFeatured ?? false} onChange={(e) => { const a = [...steps]; a[i] = { ...a[i], stepFeatured: e.target.checked }; setSteps(a) }} />
                  <span>Highlight title in yellow</span>
                </label>
              </Field>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => setSteps([...steps, newStep()])}>+ Add Step</button>
        </div>
      </Field>
    </>
  )
}

// ── About Gallery fields ──────────────────────────────────────────────────────
function AboutGalleryFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const imgs: (MediaRef | null)[] = ov.agGalleryImages ?? Array.from({ length: 10 }, () => null)

  const setImg = (i: number, ref: MediaRef | null) => {
    const next = [...imgs]
    next[i] = ref
    set('agGalleryImages', next)
  }

  const WIDE_SLOTS  = new Set([3, 4, 9, 10])
  const TALL_SLOTS  = new Set([9])

  return (
    <>
      <MediaField label="Hero Image (left, 400px)" value={ov.agHeroImage?.url ?? ''} onChange={(ref) => set('agHeroImage', ref)} />
      <Field label="Heading">
        <input className="lb-input" value={ov.agHeading ?? ''} onChange={(e) => set('agHeading', e.target.value)} placeholder="People is our greatest asset." />
      </Field>
      <Field label="Body 1 (intro)">
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
      <Field label="— Gallery Photos (10 slots) —"><span /></Field>
      {Array.from({ length: 10 }).map((_, i) => {
        const slot = i + 1
        const suffix = TALL_SLOTS.has(slot) ? ' — wide+tall' : WIDE_SLOTS.has(slot) ? ' — wide' : ''
        return (
          <MediaField
            key={i}
            label={`Photo ${slot}${suffix}`}
            value={imgs[i]?.url ?? ''}
            onChange={(ref) => setImg(i, ref)}
          />
        )
      })}
    </>
  )
}

// ── About Content 2 fields ────────────────────────────────────────────────────
function AboutContent2Fields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const values: Array<{ valueIcon?: { url: string } | null; valueTitle?: string; valueDesc?: string }> = ov.ac2Values ?? []

  const setValueField = (i: number, key: string, val: unknown) => {
    const next = values.map((v, idx) => idx === i ? { ...v, [key]: val } : v)
    set('ac2Values', next)
  }

  const addValue    = () => set('ac2Values', [...values, { valueTitle: '', valueDesc: '' }])
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

// ── Clients fields ────────────────────────────────────────────────────────────
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

// ── Partnership fields ────────────────────────────────────────────────────────
function PartnershipFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Get Partnership Opportunities" />
      </Field>
      <Field label="Description">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Have ideas, questions, or want to collaborate?…" />
      </Field>
      <Field label="Note (small print)">
        <input className="lb-input" value={ov.partnershipNote ?? ''} onChange={(e) => set('partnershipNote', e.target.value)} placeholder="Join 15,000+ developers…" />
      </Field>
      <Field label="Submit Button Label">
        <input className="lb-input" value={ov.submitLabel ?? ''} onChange={(e) => set('submitLabel', e.target.value)} placeholder="Send Message" />
      </Field>
    </>
  )
}

function LocationsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const cards: any[] = ov.locationCards ?? []

  function setCards(next: any[]) { set('locationCards', next) }

  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Locations" />
      </Field>
      <Field label="Location Cards">
        <div className="lb-items">
          {cards.map((card: any, ci: number) => {
            const offices: any[] = card.cardOffices ?? []
            function setOffices(next: any[]) {
              const c = [...cards]; c[ci] = { ...c[ci], cardOffices: next }; setCards(c)
            }
            return (
              <div key={ci} className="lb-item">
                <div className="lb-item__header">
                  <span>Card {ci + 1}</span>
                  <button className="lb-item__remove" onClick={() => { const c = [...cards]; c.splice(ci, 1); setCards(c) }}>✕</button>
                </div>
                <div className="lb-items" style={{ marginTop: 6 }}>
                  {offices.map((o: any, oi: number) => (
                    <div key={oi} className="lb-item">
                      <div className="lb-item__header">
                        <span>Office {oi + 1}</span>
                        <button className="lb-item__remove" onClick={() => { const a = [...offices]; a.splice(oi, 1); setOffices(a) }}>✕</button>
                      </div>
                      <input className="lb-input" placeholder="Office name" value={o.officeName ?? ''} onChange={(e) => { const a = [...offices]; a[oi] = { ...a[oi], officeName: e.target.value }; setOffices(a) }} />
                      <textarea className="lb-input lb-input--textarea" rows={3} placeholder="Full address" value={o.officeAddress ?? ''} onChange={(e) => { const a = [...offices]; a[oi] = { ...a[oi], officeAddress: e.target.value }; setOffices(a) }} />
                    </div>
                  ))}
                  <button className="lb-items__add" onClick={() => setOffices([...offices, {}])}>+ Add Office</button>
                </div>
              </div>
            )
          })}
          <button className="lb-items__add" onClick={() => setCards([...cards, { cardOffices: [{}] }])}>+ Add Card</button>
        </div>
      </Field>
    </>
  )
}

function FAQMainFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const source  = ov.faqContentSource ?? 'collection'
  const items: any[] = ov.faqItems ?? []
  return (
    <>
      <Field label="Content Source">
        <select
          className="lb-input"
          value={source}
          onChange={(e) => set('faqContentSource', e.target.value)}
        >
          <option value="collection">CMS Collection</option>
          <option value="manual">Manual Items</option>
        </select>
      </Field>

      {source === 'collection' && (
        <Field label="Limit">
          <input
            className="lb-input"
            type="number"
            min={1}
            max={500}
            value={ov.faqLimit ?? 100}
            onChange={(e) => set('faqLimit', Number(e.target.value))}
          />
        </Field>
      )}

      {source === 'manual' && (
        <Field label="FAQ Items">
          <div className="lb-items">
            {items.map((f: any, i: number) => (
              <div key={i} className="lb-item">
                <div className="lb-item__header">
                  <span>FAQ {i + 1}</span>
                  <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('faqItems', a) }}>✕</button>
                </div>
                <input className="lb-input" placeholder="Question" value={f.question ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], question: e.target.value }; set('faqItems', a) }} />
                <textarea className="lb-input lb-input--textarea" rows={3} placeholder="Answer" value={f.answer ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], answer: e.target.value }; set('faqItems', a) }} />
              </div>
            ))}
            <button className="lb-items__add" onClick={() => set('faqItems', [...items, { question: '', answer: '' }])}>+ Add FAQ</button>
          </div>
        </Field>
      )}

      <Field label="Back Button Label">
        <input className="lb-input" value={ov.faqBackLabel ?? ''} onChange={(e) => set('faqBackLabel', e.target.value)} placeholder="Back" />
      </Field>
    </>
  )
}

function BreadcrumbFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const breadcrumbs: any[] = ov.breadcrumbs ?? []
  return (
    <Field label="Breadcrumbs">
      <div className="lb-items">
        {breadcrumbs.map((b: any, i: number) => (
          <div key={i} className="lb-item">
            <div className="lb-item__header">
              <span>Crumb {i + 1}</span>
              <button className="lb-item__remove" onClick={() => { const a = [...breadcrumbs]; a.splice(i, 1); set('breadcrumbs', a) }}>✕</button>
            </div>
            <Row>
              <input className="lb-input" placeholder="Label" value={b.bcLabel ?? ''} onChange={(e) => { const a = [...breadcrumbs]; a[i] = { ...a[i], bcLabel: e.target.value }; set('breadcrumbs', a) }} />
              <LinkField label="URL (blank = current page)" value={b.bcHref ?? ''} onChange={(v) => { const a = [...breadcrumbs]; a[i] = { ...a[i], bcHref: v || null }; set('breadcrumbs', a) }} placeholder="/" />
            </Row>
          </div>
        ))}
        <button className="lb-items__add" onClick={() => set('breadcrumbs', [...breadcrumbs, { bcLabel: '', bcHref: '/' }])}>+ Add Crumb</button>
      </div>
    </Field>
  )
}

// ── Form Block fields ─────────────────────────────────────────────────────────

function FormBlockFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const [forms,  setForms]  = useState<{ id: string; title?: string }[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/forms?limit=100&depth=0', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setForms(d?.docs ?? []); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  return (
    <>
      <Field label="Form">
        {!loaded ? (
          <p style={{ fontSize: 12, color: '#9ca3af', padding: '4px 0' }}>Loading forms…</p>
        ) : (
          <select
            className="lb-input lb-input--select"
            value={(ov?.formRef as string) ?? ''}
            onChange={(e) => set('formRef', e.target.value || null)}
          >
            <option value="">— Select a form —</option>
            {forms.map(f => (
              <option key={f.id} value={String(f.id)}>{f.title ?? `Form #${f.id}`}</option>
            ))}
          </select>
        )}
      </Field>

      <Field label="Heading (optional)">
        <input
          className="lb-input"
          value={ov?.title ?? ''}
          onChange={(e) => set('title', e.target.value)}
          placeholder="How are we doing?"
        />
      </Field>

      <Field label="Subtitle (optional)">
        <textarea
          className="lb-input lb-input--textarea"
          rows={3}
          value={ov?.subtitle ?? ''}
          onChange={(e) => set('subtitle', e.target.value)}
          placeholder="Short description shown above the form"
        />
      </Field>
    </>
  )
}

// ── Main ContentFields ────────────────────────────────────────────────────────
export function ContentFields({ blockType, overrides = {}, onChange }: ContentFieldsProps) {
  const ov  = overrides as any
  const set = (key: string, value: unknown) =>
    onChange({ ...overrides, [key]: value } as BlockOverrides['content'])

  const isAdvanceType = (ADVANCE_BLOCK_TYPES as readonly string[]).includes(blockType)

  // ── Form block: dedicated panel ───────────────────────────────────────────
  if (blockType === 'form') {
    return (
      <div className="lb-fields">
        <FormBlockFields ov={ov} set={set} />
      </div>
    )
  }

  // ── Advance blocks: dedicated content panels ──────────────────────────────
  if (isAdvanceType) {
    return (
      <div className="lb-fields">
        {blockType === 'hero'                  && <HomeHeroFields            ov={ov} set={set} />}
        {blockType === 'features'              && <HomeAboutFields           ov={ov} set={set} />}
        {blockType === 'services'              && <HomeServicesFields        ov={ov} set={set} />}
        {blockType === 'services-mascot'       && <ServicesMascotFields      ov={ov} set={set} />}
        {blockType === 'testimonials'          && <HomeTestimonialsFields    ov={ov} set={set} />}
        {blockType === 'contact'               && <HomeContactFields         ov={ov} set={set} />}
        {blockType === 'card-grid'             && <ServiceCardsFields        ov={ov} set={set} />}
        {blockType === 'cta-banner'            && <CTABannerFields           ov={ov} set={set} />}
        {blockType === 'hero-split'            && <ServiceHeroFields         ov={ov} set={set} />}
        {blockType === 'process-steps'         && <ProcessStepsFields        ov={ov} set={set} />}
        {blockType === 'expertise-tiles'       && <ExpertiseTilesFields      ov={ov} set={set} />}
        {blockType === 'hero-centered'         && <AboutHeroFields           ov={ov} set={set} />}
        {blockType === 'company-stats'         && <AboutCompanyFields        ov={ov} set={set} />}
        {blockType === 'mission-vision'        && <AboutMissionVisionFields  ov={ov} set={set} />}
        {blockType === 'team-section'          && <AboutLeadershipFields     ov={ov} set={set} />}
        {blockType === 'faq-section'           && <AboutFAQFields            ov={ov} set={set} />}
        {blockType === 'page-hero'             && <PageHeroFields            ov={ov} set={set} />}
        {blockType === 'project-grid'          && <ProjectGridFields         ov={ov} set={set} />}
        {blockType === 'article-grid'          && <ArticleGridFields         ov={ov} set={set} />}
        {blockType === 'article-featured'      && <ArticleFeaturedFields     ov={ov} set={set} />}
        {blockType === 'jobs-list'             && <JobsListFields            ov={ov} set={set} />}
        {blockType === 'involved-hero'         && <InvolvedHeroFields        ov={ov} set={set} />}
        {blockType === 'quote-form'            && <QuoteFormFields           ov={ov} set={set} />}
        {blockType === 'culture-values'        && <CultureValuesFields       ov={ov} set={set} />}
        {blockType === 'community-hero'         && <CommunityHeroFields       ov={ov} set={set} />}
        {blockType === 'community-channels'    && <CommunityChannelsFields   ov={ov} set={set} />}
        {blockType === 'community-ambassador'  && <CommunityAmbassadorFields ov={ov} set={set} />}
        {blockType === 'community-programs'    && <CommunityProgramsFields   ov={ov} set={set} />}
        {blockType === 'contact-hero'          && <ContactHeroFields         ov={ov} set={set} />}
        {blockType === 'contact-stats'         && <ContactStatsFields        ov={ov} set={set} />}
        {blockType === 'locations'             && <LocationsFields           ov={ov} set={set} />}
        {blockType === 'featured-case-study'   && <FeaturedCaseStudyFields   ov={ov} set={set} />}
        {blockType === 'clients'               && <ClientsFields             ov={ov} set={set} />}
        {blockType === 'quote-intro'           && <QuoteIntroFields          ov={ov} set={set} />}
        {blockType === 'case-study'            && <CaseStudyFields           ov={ov} set={set} />}
        {blockType === 'case-study-scroll'     && <CaseStudyScrollFields     ov={ov} set={set} />}
        {blockType === 'partnership'            && <PartnershipFields         ov={ov} set={set} />}
        {blockType === 'faq-main'              && <FAQMainFields             ov={ov} set={set} />}
        {blockType === 'breadcrumb'             && <BreadcrumbFields          ov={ov} set={set} />}
        {blockType === 'faq-about'             && <FAQAboutFields            ov={ov} set={set} />}
        {blockType === 'article-submit'        && <ArticleSubmitFields       ov={ov} set={set} />}
        {blockType === 'serve-hero'            && <ServeHeroFields           ov={ov} set={set} />}
        {blockType === 'serve-value'           && <ServeValueFields          ov={ov} set={set} />}
        {blockType === 'serve-model'           && <ServeModelFields          ov={ov} set={set} />}
        {blockType === 'insights-advantages'   && <InsightsAdvantagesFields  ov={ov} set={set} />}
        {blockType === 'insights-tech-guide'   && <InsightsTechGuideFields   ov={ov} set={set} />}
        {blockType === 'article-hero'           && <ArticleHeroFields         ov={ov} set={set} />}
        {blockType === 'article-filter'         && <ArticleFilterFields       ov={ov} set={set} />}
        {blockType === 'article-feature'        && <ArticleFeatureFields      ov={ov} set={set} />}
        {blockType === 'article-main-grid'      && <ArticleMainGridFields     ov={ov} set={set} />}
        {blockType === 'subscribe'              && <SubscribeFields           ov={ov} set={set} />}
        {blockType === 'image-info'             && <ImageInfoFields           ov={ov} set={set} />}
        {blockType === 'step-scroll'            && <StepScrollFields          ov={ov} set={set} />}
        {blockType === 'product-content'        && <ProductContentFields      ov={ov} set={set} />}
        {blockType === 'portfolio-content'      && <PortfolioContentFields    ov={ov} set={set} />}
        {blockType === 'about-content-1'        && <AboutContent1Fields       ov={ov} set={set} />}
        {blockType === 'about-content-2'        && <AboutContent2Fields       ov={ov} set={set} />}
        {blockType === 'about-gallery'           && <AboutGalleryFields        ov={ov} set={set} />}
      </div>
    )
  }

  // ── Generic block fields ──────────────────────────────────────────────────
  const showText  = !NO_TEXT_TYPES.includes(blockType)
  const showItems = ITEMS_TYPES.includes(blockType)

  return (
    <div className="lb-fields">
      {showText && (
        <>
          <Field label="Title">
            <input className="lb-input" value={ov.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Enter title..." />
          </Field>
          {!['button', 'icon', 'divider', 'spacer'].includes(blockType) && (
            <Field label="Subtitle">
              <textarea className="lb-input lb-input--textarea" value={ov.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} rows={3} placeholder="Enter subtitle..." />
            </Field>
          )}
        </>
      )}

      {['image', 'image-box', 'icon-box'].includes(blockType) && (
        <MediaField value={ov.image?.url ?? ov.image ?? ''} onChange={(ref) => set('image', ref)} />
      )}

      {blockType === 'video' && (
        <Field label="Video URL">
          <input className="lb-input" value={ov.videoUrl ?? ''} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://youtube.com/..." />
        </Field>
      )}

      {['button', 'heading', 'image-box', 'icon-box'].includes(blockType) && (
        <>
          <Field label="Button Label">
            <input className="lb-input" value={ov.buttonLabel ?? ''} onChange={(e) => set('buttonLabel', e.target.value)} placeholder="Click here" />
          </Field>
          <LinkField label="Button URL" value={ov.buttonUrl ?? ''} onChange={(v) => set('buttonUrl', v)} placeholder="/page-slug" />
          <MediaField label="Button Icon (empty = none)" value={ov.buttonIcon?.url ?? ''} onChange={(ref) => set('buttonIcon', ref)} />
          {ov.buttonIcon?.url && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6b7280', cursor: 'pointer', marginBottom: 4 }}>
              <input type="checkbox" checked={ov.buttonIconFill ?? false} onChange={(e) => set('buttonIconFill', e.target.checked)} style={{ margin: 0 }} />
              Fill (stretch icon to fit)
            </label>
          )}
          <Field label="Icon Position">
            <select className="lb-input lb-input--select" value={ov.buttonIconPos ?? 'right'} onChange={(e) => set('buttonIconPos', e.target.value)}>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </Field>
        </>
      )}

      {blockType === 'html' && (
        <Field label="HTML Content">
          <textarea className="lb-input lb-input--textarea lb-input--code" value={ov.htmlContent ?? ''} onChange={(e) => set('htmlContent', e.target.value)} rows={8} placeholder="<div>...</div>" />
        </Field>
      )}

      {blockType === 'google-map' && (
        <Field label="Google Maps Embed URL">
          <input className="lb-input" value={ov.mapEmbedUrl ?? ''} onChange={(e) => set('mapEmbedUrl', e.target.value)} placeholder="https://maps.google.com/maps?q=..." />
        </Field>
      )}

      {['icon', 'icon-box'].includes(blockType) && (
        <MediaField label="Icon" value={ov.iconName ?? ''} onChange={(ref) => set('iconName', ref?.url ?? '')} />
      )}

      {blockType === 'grid' && (
        <Field label="Columns">
          <select className="lb-input lb-input--select" value={ov.columns ?? '3'} onChange={(e) => set('columns', e.target.value)}>
            {['1','2','3','4','6'].map((n) => (
              <option key={n} value={n}>{n} Column{n !== '1' ? 's' : ''}</option>
            ))}
          </select>
        </Field>
      )}

      {blockType === 'alert' && (
        <Field label="Alert Type">
          <select className="lb-input lb-input--select" value={ov.alertType ?? 'info'} onChange={(e) => set('alertType', e.target.value as any)}>
            {['info','success','warning','error'].map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </Field>
      )}

      {showItems && (
        <Field label="Items">
          <div className="lb-items">
            {(ov.items ?? []).map((item: any, idx: number) => (
              <div key={idx} className="lb-item">
                <div className="lb-item__header">
                  <span>Item {idx + 1}</span>
                  <button className="lb-item__remove" onClick={() => { const items = [...(ov.items ?? [])]; items.splice(idx, 1); set('items', items) }}>✕</button>
                </div>
                <input className="lb-input" placeholder="Label" value={item.label ?? ''} onChange={(e) => { const items = [...(ov.items ?? [])]; items[idx] = { ...items[idx], label: e.target.value }; set('items', items) }} />
                <textarea className="lb-input lb-input--textarea" placeholder="Content" rows={2} value={item.content ?? ''} onChange={(e) => { const items = [...(ov.items ?? [])]; items[idx] = { ...items[idx], content: e.target.value }; set('items', items) }} />
              </div>
            ))}
            <button className="lb-items__add" onClick={() => set('items', [...(ov.items ?? []), { label: '', content: '' }])}>+ Add Item</button>
          </div>
        </Field>
      )}
    </div>
  )
}
