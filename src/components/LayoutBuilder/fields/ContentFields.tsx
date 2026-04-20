'use client'

import React, { useState } from 'react'
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
      <label className="lb-field__label">{label}</label>
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

  const openPicker = async () => {
    setOpen(true)
    if (!mediaLoaded) {
      try {
        const res  = await fetch('/api/media?limit=50&depth=0', { credentials: 'include' })
        const data = await res.json()
        setMediaItems(data?.docs ?? [])
        setMediaLoaded(true)
      } catch { setMediaLoaded(true) }
    }
  }

  const pick = (url: string) => { onChange({ url }); setOpen(false) }

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
            <div style={{ padding: 10, maxHeight: 210, overflowY: 'auto' }}>
              {!mediaLoaded ? (
                <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: '16px 0' }}>Loading…</p>
              ) : mediaItems.length === 0 ? (
                <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: '16px 0' }}>No media files found</p>
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

// ── Home Hero fields ──────────────────────────────────────────────────────────
function HomeHeroFields({ ov, set }: { ov: any; set: (k: string, v: unknown) => void }) {
  const stats: any[]         = ov.heroStats      ?? []
  const cards: any[]         = ov.floatingCards  ?? []

  return (
    <>
      <Field label="Badge Text">
        <input className="lb-input" value={ov.badge ?? ''} onChange={(e) => set('badge', e.target.value)} placeholder="Welcome to ATech" />
      </Field>
      <Field label="Heading">
        <input className="lb-input" value={ov.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Main headline…" />
      </Field>
      <Field label="Body Text">
        <textarea className="lb-input lb-input--textarea" rows={3} value={ov.body ?? ''} onChange={(e) => set('body', e.target.value)} placeholder="Supporting paragraph…" />
      </Field>

      <Row>
        <Field label="Primary CTA Label">
          <input className="lb-input" value={ov.ctaPrimaryLabel ?? ''} onChange={(e) => set('ctaPrimaryLabel', e.target.value)} placeholder="Explore Services" />
        </Field>
        <Field label="Primary CTA URL">
          <input className="lb-input" value={ov.ctaPrimaryUrl ?? ''} onChange={(e) => set('ctaPrimaryUrl', e.target.value)} placeholder="/services" />
        </Field>
      </Row>
      <Row>
        <Field label="Secondary CTA Label">
          <input className="lb-input" value={ov.ctaSecondaryLabel ?? ''} onChange={(e) => set('ctaSecondaryLabel', e.target.value)} placeholder="Learn More" />
        </Field>
        <Field label="Secondary CTA URL">
          <input className="lb-input" value={ov.ctaSecondaryUrl ?? ''} onChange={(e) => set('ctaSecondaryUrl', e.target.value)} placeholder="/about" />
        </Field>
      </Row>

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
              <input className="lb-input" placeholder="Link URL e.g. /services/web-dev" value={s.serviceHref ?? ''} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], serviceHref: e.target.value }; set('serviceItems', a) }} />
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
      <Row>
        <Field label="CTA Label">
          <input className="lb-input" value={ov.customSolutionCtaLabel ?? ''} onChange={(e) => set('customSolutionCtaLabel', e.target.value)} placeholder="Chat with us" />
        </Field>
        <Field label="CTA URL">
          <input className="lb-input" value={ov.customSolutionCtaUrl ?? ''} onChange={(e) => set('customSolutionCtaUrl', e.target.value)} placeholder="/contact" />
        </Field>
      </Row>
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
      <Field label="Badge Icon URL">
        <input className="lb-input" value={ov.badgeIconSrc ?? ''} onChange={(e) => set('badgeIconSrc', e.target.value)} placeholder="https://…/icon.svg" />
      </Field>

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
                <input className="lb-input" placeholder="URL (blank = current)" value={b.bcHref ?? ''} onChange={(e) => { const a = [...breadcrumbs]; a[i] = { ...a[i], bcHref: e.target.value || null }; set('breadcrumbs', a) }} />
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

      <Row>
        <Field label="Primary CTA Label">
          <input className="lb-input" value={ov.ctaPrimaryLabel ?? ''} onChange={(e) => set('ctaPrimaryLabel', e.target.value)} placeholder="Start Your Project" />
        </Field>
        <Field label="Primary CTA URL">
          <input className="lb-input" value={ov.ctaPrimaryUrl ?? ''} onChange={(e) => set('ctaPrimaryUrl', e.target.value)} placeholder="/contact" />
        </Field>
      </Row>
      <Row>
        <Field label="Secondary CTA Label">
          <input className="lb-input" value={ov.ctaSecondaryLabel ?? ''} onChange={(e) => set('ctaSecondaryLabel', e.target.value)} placeholder="View Case Studies" />
        </Field>
        <Field label="Secondary CTA URL">
          <input className="lb-input" value={ov.ctaSecondaryUrl ?? ''} onChange={(e) => set('ctaSecondaryUrl', e.target.value)} placeholder="/case-studies" />
        </Field>
      </Row>

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
              <Row>
                <input className="lb-input" placeholder="Icon URL" value={t.tileIconSrc ?? ''} onChange={(e) => { const a = [...tiles]; a[i] = { ...a[i], tileIconSrc: e.target.value }; set('expertiseTiles', a) }} />
                <input className="lb-input" placeholder="Label" value={t.tileLabel ?? ''} onChange={(e) => { const a = [...tiles]; a[i] = { ...a[i], tileLabel: e.target.value }; set('expertiseTiles', a) }} />
              </Row>
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
              <Field label="Icon URL">
                <input className="lb-input" placeholder="https://…/icon.svg" value={c.cardIconSrc ?? ''} onChange={(e) => { const a = [...cards]; a[i] = { ...a[i], cardIconSrc: e.target.value }; set('cardItems', a) }} />
              </Field>
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
      <Row>
        <Field label="Button Label">
          <input className="lb-input" value={ov.buttonLabel ?? ''} onChange={(e) => set('buttonLabel', e.target.value)} placeholder="Get Started" />
        </Field>
        <Field label="Button URL">
          <input className="lb-input" value={ov.buttonUrl ?? ''} onChange={(e) => set('buttonUrl', e.target.value)} placeholder="/contact" />
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
        {blockType === 'hero'           && <HomeHeroFields         ov={ov} set={set} />}
        {blockType === 'features'       && <HomeAboutFields        ov={ov} set={set} />}
        {blockType === 'services'       && <HomeServicesFields     ov={ov} set={set} />}
        {blockType === 'testimonials'   && <HomeTestimonialsFields ov={ov} set={set} />}
        {blockType === 'contact'        && <HomeContactFields      ov={ov} set={set} />}
        {blockType === 'card-grid'      && <ServiceCardsFields     ov={ov} set={set} />}
        {blockType === 'cta-banner'     && <CTABannerFields        ov={ov} set={set} />}
        {blockType === 'hero-split'     && <ServiceHeroFields      ov={ov} set={set} />}
        {blockType === 'process-steps'  && <ProcessStepsFields     ov={ov} set={set} />}
        {blockType === 'expertise-tiles'&& <ExpertiseTilesFields   ov={ov} set={set} />}
        {blockType === 'hero-centered'  && <AboutHeroFields        ov={ov} set={set} />}
        {blockType === 'company-stats'  && <AboutCompanyFields     ov={ov} set={set} />}
        {blockType === 'mission-vision' && <AboutMissionVisionFields ov={ov} set={set} />}
        {blockType === 'team-section'   && <AboutLeadershipFields  ov={ov} set={set} />}
        {blockType === 'faq-section'    && <AboutFAQFields         ov={ov} set={set} />}
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
          <Field label="Button URL">
            <input className="lb-input" value={ov.buttonUrl ?? ''} onChange={(e) => set('buttonUrl', e.target.value)} placeholder="/page-slug" />
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
        <Field label="Icon Name / SVG">
          <input className="lb-input" value={ov.iconName ?? ''} onChange={(e) => set('iconName', e.target.value)} placeholder="star / <svg>...</svg>" />
        </Field>
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
