'use client'

import React, { useRef, useState } from 'react'
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

function MediaField({
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

  const pick = (url: string) => { onChange({ url }); setOpen(false) }

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
        if (doc?.url) uploaded.push({ id: doc.id, url: doc.url, alt: doc.alt ?? '', filename: doc.filename })
      } catch {
        setUploadError(`Failed to upload ${file.name}`)
      }
    }
    if (uploaded.length > 0) {
      setMediaItems((prev) => [...uploaded, ...prev])
      // Auto-select the last uploaded item and close
      const last = uploaded[uploaded.length - 1]
      onChange({ url: last.url, alt: last.alt })
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

// ── Button icon row (icon media + position select) ─────────────────────────────
function BtnIconRow({
  iconValue,
  iconPos,
  onIconChange,
  onIconPosChange,
}: {
  iconValue: string
  iconPos: string
  onIconChange: (ref: MediaRef | null) => void
  onIconPosChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'end' }}>
      <MediaField label="Button Icon (empty = none)" value={iconValue} onChange={onIconChange} />
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

// ── CTA button group (label + URL + icon + pos) ────────────────────────────────
function CtaGroup({
  groupLabel,
  label, labelPlaceholder,
  url, urlPlaceholder,
  iconValue, iconPos,
  onLabelChange, onUrlChange, onIconChange, onIconPosChange,
}: {
  groupLabel: string
  label: string; labelPlaceholder?: string
  url: string; urlPlaceholder?: string
  iconValue: string; iconPos: string
  onLabelChange: (v: string) => void
  onUrlChange: (v: string) => void
  onIconChange: (ref: MediaRef | null) => void
  onIconPosChange: (v: string) => void
}) {
  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 10, marginBottom: 8, background: '#fafafa' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{groupLabel}</div>
      <Row>
        <Field label="Label">
          <input className="lb-input" value={label} onChange={(e) => onLabelChange(e.target.value)} placeholder={labelPlaceholder ?? 'Button label'} />
        </Field>
        <LinkField label="URL" value={url} onChange={onUrlChange} placeholder={urlPlaceholder ?? '/page or https://…'} />
      </Row>
      <BtnIconRow iconValue={iconValue} iconPos={iconPos} onIconChange={onIconChange} onIconPosChange={onIconPosChange} />
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
        iconValue={ov.ctaPrimaryIcon?.url ?? ''} iconPos={ov.ctaPrimaryIconPos ?? 'right'}
        onLabelChange={(v) => set('ctaPrimaryLabel', v)}
        onUrlChange={(v) => set('ctaPrimaryUrl', v)}
        onIconChange={(ref) => set('ctaPrimaryIcon', ref)}
        onIconPosChange={(v) => set('ctaPrimaryIconPos', v)}
      />
      <CtaGroup
        groupLabel="Secondary CTA"
        label={ov.ctaSecondaryLabel ?? ''} labelPlaceholder="Learn More"
        url={ov.ctaSecondaryUrl ?? ''} urlPlaceholder="/about"
        iconValue={ov.ctaSecondaryIcon?.url ?? ''} iconPos={ov.ctaSecondaryIconPos ?? 'right'}
        onLabelChange={(v) => set('ctaSecondaryLabel', v)}
        onUrlChange={(v) => set('ctaSecondaryUrl', v)}
        onIconChange={(ref) => set('ctaSecondaryIcon', ref)}
        onIconPosChange={(v) => set('ctaSecondaryIconPos', v)}
      />

      <MediaField label="Hero Image" value={ov.heroImage?.url ?? ''} onChange={(ref) => set('heroImage', ref)} />

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
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Services" />
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
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={s.serviceDesc ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], serviceDesc: e.target.value }; set('serviceItems', a) }} />
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
        url={ov.customSolutionCtaUrl ?? ''} urlPlaceholder="/contact"
        iconValue={ov.customSolutionCtaIcon?.url ?? ''} iconPos={ov.customSolutionCtaIconPos ?? 'right'}
        onLabelChange={(v) => set('customSolutionCtaLabel', v)}
        onUrlChange={(v) => set('customSolutionCtaUrl', v)}
        onIconChange={(ref) => set('customSolutionCtaIcon', ref)}
        onIconPosChange={(v) => set('customSolutionCtaIconPos', v)}
      />
    </>
  )
}

// ── Home Testimonials fields ──────────────────────────────────────────────────
function HomeTestimonialsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.testimonialItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Client Testimonials" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="What our clients say…" />
      </Field>

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
      <Row>
        <Field label="Email">
          <input className="lb-input" type="email" value={ov.contactEmail ?? ''} onChange={(e) => set('contactEmail', e.target.value)} placeholder="hello@example.com" />
        </Field>
        <Field label="Phone">
          <input className="lb-input" value={ov.contactPhone ?? ''} onChange={(e) => set('contactPhone', e.target.value)} placeholder="+1 234 567 8900" />
        </Field>
      </Row>
      <Field label="Location">
        <input className="lb-input" value={ov.contactLocation ?? ''} onChange={(e) => set('contactLocation', e.target.value)} placeholder="Hong Kong" />
      </Field>
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
      <Field label="Video URL (optional)">
        <input className="lb-input" value={ov.aboutHeroVideoUrl ?? ''} onChange={(e) => set('aboutHeroVideoUrl', e.target.value)} placeholder="https://youtube.com/…" />
      </Field>
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
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.leadershipHeading ?? ''} onChange={(e) => set('leadershipHeading', e.target.value)} placeholder="Meet the Team" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.leadershipSubheading ?? ''} onChange={(e) => set('leadershipSubheading', e.target.value)} placeholder="The people behind ATech…" />
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
        url={ov.ctaPrimaryUrl ?? ''} urlPlaceholder="/contact"
        iconValue={ov.ctaPrimaryIcon?.url ?? ''} iconPos={ov.ctaPrimaryIconPos ?? 'right'}
        onLabelChange={(v) => set('ctaPrimaryLabel', v)}
        onUrlChange={(v) => set('ctaPrimaryUrl', v)}
        onIconChange={(ref) => set('ctaPrimaryIcon', ref)}
        onIconPosChange={(v) => set('ctaPrimaryIconPos', v)}
      />
      <CtaGroup
        groupLabel="Secondary CTA"
        label={ov.ctaSecondaryLabel ?? ''} labelPlaceholder="View Case Studies"
        url={ov.ctaSecondaryUrl ?? ''} urlPlaceholder="/case-studies"
        iconValue={ov.ctaSecondaryIcon?.url ?? ''} iconPos={ov.ctaSecondaryIconPos ?? 'right'}
        onLabelChange={(v) => set('ctaSecondaryLabel', v)}
        onUrlChange={(v) => set('ctaSecondaryUrl', v)}
        onIconChange={(ref) => set('ctaSecondaryIcon', ref)}
        onIconPosChange={(v) => set('ctaSecondaryIconPos', v)}
      />

      <MediaField label="Hero Image" value={ov.heroImage?.url ?? ''} onChange={(ref) => set('heroImage', ref)} />

      <Field label="Image Position">
        <select className="lb-input lb-input--select" value={ov.heroImagePosition ?? 'right'} onChange={(e) => set('heroImagePosition', e.target.value)}>
          <option value="right">Right (default)</option>
          <option value="left">Left</option>
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
        url={ov.buttonUrl ?? ''} urlPlaceholder="/contact"
        iconValue={ov.buttonIcon?.url ?? ''} iconPos={ov.buttonIconPos ?? 'right'}
        onLabelChange={(v) => set('buttonLabel', v)}
        onUrlChange={(v) => set('buttonUrl', v)}
        onIconChange={(ref) => set('buttonIcon', ref)}
        onIconPosChange={(v) => set('buttonIconPos', v)}
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
        iconValue={ov.ctaPrimaryIcon?.url ?? ''} iconPos={ov.ctaPrimaryIconPos ?? 'right'}
        onLabelChange={(v) => set('ctaPrimaryLabel', v)}
        onUrlChange={(v) => set('ctaPrimaryUrl', v)}
        onIconChange={(ref) => set('ctaPrimaryIcon', ref)}
        onIconPosChange={(v) => set('ctaPrimaryIconPos', v)}
      />
      <CtaGroup
        groupLabel="Secondary CTA"
        label={ov.ctaSecondaryLabel ?? ''} labelPlaceholder="Contact Us"
        url={ov.ctaSecondaryUrl ?? ''} urlPlaceholder="/contact"
        iconValue={ov.ctaSecondaryIcon?.url ?? ''} iconPos={ov.ctaSecondaryIconPos ?? 'right'}
        onLabelChange={(v) => set('ctaSecondaryLabel', v)}
        onUrlChange={(v) => set('ctaSecondaryUrl', v)}
        onIconChange={(ref) => set('ctaSecondaryIcon', ref)}
        onIconPosChange={(v) => set('ctaSecondaryIconPos', v)}
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
  const items: any[] = ov.projectItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Featured Projects" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="A curated selection…" />
      </Field>
      <Field label="Projects">
        <div className="lb-items">
          {items.map((p: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Project {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...items]; a.splice(i, 1); set('projectItems', a) }}>✕</button>
              </div>
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
    </>
  )
}

// ── Article Grid fields ───────────────────────────────────────────────────────
function ArticleGridFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
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
      <Field label="Articles">
        <div className="lb-items">
          {items.map((a: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Article {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const arr = [...items]; arr.splice(i, 1); set('articleItems', arr) }}>✕</button>
              </div>
              <Row>
                <input className="lb-input" placeholder="Category" value={a.articleCategory ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleCategory: e.target.value }; set('articleItems', arr) }} />
                <input className="lb-input" placeholder="Date" value={a.articleDate ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleDate: e.target.value }; set('articleItems', arr) }} />
              </Row>
              <input className="lb-input" placeholder="Title" value={a.articleTitle ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleTitle: e.target.value }; set('articleItems', arr) }} />
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={a.articleDesc ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleDesc: e.target.value }; set('articleItems', arr) }} />
              <Row>
                <input className="lb-input" placeholder="CTA Label" value={a.articleCta ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], articleCta: e.target.value }; set('articleItems', arr) }} />
                <LinkField label="CTA URL" value={a.articleUrl ?? ''} onChange={(v) => { const arr = [...items]; arr[i] = { ...arr[i], articleUrl: v }; set('articleItems', arr) }} />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('articleItems', [...items, {}])}>+ Add Article</button>
        </div>
      </Field>
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
        <LinkField label="CTA URL" value={ov.featCtaUrl ?? ''} onChange={(v) => set('featCtaUrl', v)} placeholder="/article-detail" />
      </Row>
    </>
  )
}

// ── Jobs List fields ──────────────────────────────────────────────────────────
function JobsListFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const items: any[] = ov.jobItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Join Our Team" />
      </Field>
      <Field label="Subheading">
        <textarea className="lb-input lb-input--textarea" rows={2} value={ov.subheading ?? ''} onChange={(e) => set('subheading', e.target.value)} placeholder="Build your career with us…" />
      </Field>
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
        iconValue={ov.ctaPrimaryIcon?.url ?? ''} iconPos={ov.ctaPrimaryIconPos ?? 'right'}
        onLabelChange={(v) => set('ctaPrimaryLabel', v)}
        onUrlChange={(v) => set('ctaPrimaryUrl', v)}
        onIconChange={(ref) => set('ctaPrimaryIcon', ref)}
        onIconPosChange={(v) => set('ctaPrimaryIconPos', v)}
      />
      <CtaGroup
        groupLabel="Secondary CTA"
        label={ov.ctaSecondaryLabel ?? ''} labelPlaceholder="Get a Quote"
        url={ov.ctaSecondaryUrl ?? ''} urlPlaceholder="#quote"
        iconValue={ov.ctaSecondaryIcon?.url ?? ''} iconPos={ov.ctaSecondaryIconPos ?? 'right'}
        onLabelChange={(v) => set('ctaSecondaryLabel', v)}
        onUrlChange={(v) => set('ctaSecondaryUrl', v)}
        onIconChange={(ref) => set('ctaSecondaryIcon', ref)}
        onIconPosChange={(v) => set('ctaSecondaryIconPos', v)}
      />
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

// ── Community Channels fields ─────────────────────────────────────────────────
function CommunityChannelsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const channels: any[] = ov.channelItems ?? []
  return (
    <>
      <Field label="Channels">
        <div className="lb-items">
          {channels.map((ch: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Channel {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...channels]; a.splice(i, 1); set('channelItems', a) }}>✕</button>
              </div>
              <MediaField label="Channel Icon" value={ch.channelIcon?.url ?? (typeof ch.channelIcon === 'string' ? ch.channelIcon : '')} onChange={(ref) => { const a = [...channels]; a[i] = { ...a[i], channelIcon: ref?.url ?? '' }; set('channelItems', a) }} />
              <input className="lb-input" placeholder="Title" value={ch.channelTitle ?? ''} onChange={(e) => { const a = [...channels]; a[i] = { ...a[i], channelTitle: e.target.value }; set('channelItems', a) }} />
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Description" value={ch.channelDesc ?? ''} onChange={(e) => { const a = [...channels]; a[i] = { ...a[i], channelDesc: e.target.value }; set('channelItems', a) }} />
              <Row>
                <input className="lb-input" placeholder="CTA Label" value={ch.channelCta ?? ''} onChange={(e) => { const a = [...channels]; a[i] = { ...a[i], channelCta: e.target.value }; set('channelItems', a) }} />
                <LinkField label="CTA URL" value={ch.channelUrl ?? ''} onChange={(v) => { const a = [...channels]; a[i] = { ...a[i], channelUrl: v }; set('channelItems', a) }} />
              </Row>
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('channelItems', [...channels, {}])}>+ Add Channel</button>
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

      <CtaGroup
        groupLabel="Ambassador CTA"
        label={ov.ambassadorCta ?? ''} labelPlaceholder="Apply to Become an Ambassador"
        url={ov.ambassadorUrl ?? ''} urlPlaceholder="#"
        iconValue={ov.ambassadorCtaIcon?.url ?? ''} iconPos={ov.ambassadorCtaIconPos ?? 'right'}
        onLabelChange={(v) => set('ambassadorCta', v)}
        onUrlChange={(v) => set('ambassadorUrl', v)}
        onIconChange={(ref) => set('ambassadorCtaIcon', ref)}
        onIconPosChange={(v) => set('ambassadorCtaIconPos', v)}
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
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('contactCards', [...cards, {}])}>+ Add Card</button>
        </div>
      </Field>
    </>
  )
}

// ── Contact Stats fields ──────────────────────────────────────────────────────
function ContactStatsFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const ctas: any[]  = ov.contactStatCtas ?? []
  const stats: any[] = ov.contactStatItems ?? []
  return (
    <>
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
              <select className="lb-input lb-input--select" value={btn.contactCtaPrimary ? 'true' : 'false'} onChange={(e) => { const a = [...ctas]; a[i] = { ...a[i], contactCtaPrimary: e.target.value === 'true' }; set('contactStatCtas', a) }}>
                <option value="true">Primary (dark)</option>
                <option value="false">Secondary (outline)</option>
              </select>
              <BtnIconRow
                iconValue={btn.contactCtaIcon?.url ?? ''}
                iconPos={btn.contactCtaIconPos ?? 'right'}
                onIconChange={(ref) => { const a = [...ctas]; a[i] = { ...a[i], contactCtaIcon: ref }; set('contactStatCtas', a) }}
                onIconPosChange={(v) => { const a = [...ctas]; a[i] = { ...a[i], contactCtaIconPos: v }; set('contactStatCtas', a) }}
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
  return (
    <>
      <Field label="Section Label">
        <input className="lb-input" value={ov.sectionLabel ?? ''} onChange={(e) => set('sectionLabel', e.target.value)} placeholder="Featured Case Study" />
      </Field>
      <Field label="Case Title">
        <input className="lb-input" value={ov.caseTitle ?? ''} onChange={(e) => set('caseTitle', e.target.value)} placeholder="Client — Project Name" />
      </Field>
      <Field label="Description">
        <textarea className="lb-input lb-input--textarea" rows={4} value={ov.caseDesc ?? ''} onChange={(e) => set('caseDesc', e.target.value)} placeholder="Project description…" />
      </Field>
      <Row>
        <Field label="CTA Label">
          <input className="lb-input" value={ov.ctaPrimaryLabel ?? ''} onChange={(e) => set('ctaPrimaryLabel', e.target.value)} placeholder="View Case Study" />
        </Field>
        <LinkField label="CTA URL" value={ov.ctaPrimaryUrl ?? ''} onChange={(v) => set('ctaPrimaryUrl', v)} placeholder="/portfolio-detail" />
      </Row>
      <MediaField label="Client Logo" value={ov.clientLogo?.url ?? ''} onChange={(ref) => set('clientLogo', ref)} />
      <MediaField label="Case Study Image" value={ov.caseImage?.url ?? ''} onChange={(ref) => set('caseImage', ref)} />
      <Field label="Platform (floating badge)">
        <input className="lb-input" value={ov.floatingPlatform ?? ''} onChange={(e) => set('floatingPlatform', e.target.value)} placeholder="Android & iOS" />
      </Field>
      <Field label="Platform Type">
        <input className="lb-input" value={ov.floatingPlatformType ?? ''} onChange={(e) => set('floatingPlatformType', e.target.value)} placeholder="Mobile apps development" />
      </Field>
      <Field label="Badge Icon URL (optional)">
        <input className="lb-input" value={ov.floatingIconSrc ?? ''} onChange={(e) => set('floatingIconSrc', e.target.value)} placeholder="https://…" />
      </Field>
      <Field label="Image Position">
        <select className="lb-input" value={ov.imagePosition ?? 'right'} onChange={(e) => set('imagePosition', e.target.value)}>
          <option value="right">Right (text left, image right)</option>
          <option value="left">Left (image left, text right)</option>
        </select>
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
  const offices: any[] = ov.officeItems ?? []
  return (
    <>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Locations" />
      </Field>
      <Field label="Offices">
        <div className="lb-items">
          {offices.map((o: any, i: number) => (
            <div key={i} className="lb-item">
              <div className="lb-item__header">
                <span>Office {i + 1}</span>
                <button className="lb-item__remove" onClick={() => { const a = [...offices]; a.splice(i, 1); set('officeItems', a) }}>✕</button>
              </div>
              <input className="lb-input" placeholder="Office name" value={o.officeName ?? ''} onChange={(e) => { const a = [...offices]; a[i] = { ...a[i], officeName: e.target.value }; set('officeItems', a) }} />
              <textarea className="lb-input lb-input--textarea" rows={2} placeholder="Full address" value={o.officeAddress ?? ''} onChange={(e) => { const a = [...offices]; a[i] = { ...a[i], officeAddress: e.target.value }; set('officeItems', a) }} />
            </div>
          ))}
          <button className="lb-items__add" onClick={() => set('officeItems', [...offices, {}])}>+ Add Office</button>
        </div>
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

  // ── Advance blocks: dedicated content panels ──────────────────────────────
  if (isAdvanceType) {
    return (
      <div className="lb-fields">
        {blockType === 'hero'                  && <HomeHeroFields            ov={ov} set={set} />}
        {blockType === 'features'              && <HomeAboutFields           ov={ov} set={set} />}
        {blockType === 'services'              && <HomeServicesFields        ov={ov} set={set} />}
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
        {blockType === 'community-channels'    && <CommunityChannelsFields   ov={ov} set={set} />}
        {blockType === 'community-ambassador'  && <CommunityAmbassadorFields ov={ov} set={set} />}
        {blockType === 'community-programs'    && <CommunityProgramsFields   ov={ov} set={set} />}
        {blockType === 'contact-hero'          && <ContactHeroFields         ov={ov} set={set} />}
        {blockType === 'contact-stats'         && <ContactStatsFields        ov={ov} set={set} />}
        {blockType === 'locations'             && <LocationsFields           ov={ov} set={set} />}
        {blockType === 'featured-case-study'   && <FeaturedCaseStudyFields   ov={ov} set={set} />}
        {blockType === 'partnership'            && <PartnershipFields         ov={ov} set={set} />}
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
