'use client'

import React from 'react'
import type { BlockType, BlockOverrides } from '../types'
import { MediaField } from './ContentFields'

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="lb-collapsible">
      <p className="lb-collapsible__title">{title}</p>
      {children}
    </div>
  )
}

// ── Color input with reset button ─────────────────────────────────────────────

function ColorInput({
  value,
  onChange,
  onReset,
}: {
  value: string
  onChange: (v: string) => void
  onReset: () => void
}) {
  return (
    <div className="lb-color-wrap">
      <input
        type="color"
        className="lb-input lb-input--color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="lb-color-reset"
        title="Reset to default"
        onClick={onReset}
      >
        ↺
      </button>
    </div>
  )
}

// ── Hero Block Styles ─────────────────────────────────────────────────────────

function HeroStyleFields({ style, onChange }: { style: any; onChange: (s: any) => void }) {
  const set   = (key: string, value: unknown) => onChange({ ...style, [key]: value })
  const reset = (key: string) => { const next = { ...style }; delete next[key]; onChange(next) }

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <ColorInput value={style.heroBgColor ?? '#292929'} onChange={(v) => set('heroBgColor', v)} onReset={() => reset('heroBgColor')} />
        </Field>
        <Row>
          <Field label="Gradient Start">
            <ColorInput value={style.gradientFrom ?? '#292929'} onChange={(v) => set('gradientFrom', v)} onReset={() => reset('gradientFrom')} />
          </Field>
          <Field label="Gradient End">
            <ColorInput value={style.gradientTo ?? '#1a1a1a'} onChange={(v) => set('gradientTo', v)} onReset={() => reset('gradientTo')} />
          </Field>
        </Row>
        <MediaField label="Background Image" value={style.heroBgImage ?? ''} onChange={(ref) => set('heroBgImage', ref?.url ?? '')} />
        <Field label="Overlay Opacity (0-1)">
          <input type="number" className="lb-input" min="0" max="1" step="0.1" value={style.overlayOpacity ?? 0.6} onChange={(e) => set('overlayOpacity', parseFloat(e.target.value))} />
        </Field>
      </Section>

      <Section title="Typography">
        <Row>
          <Field label="Heading Color">
            <ColorInput value={style.headingColor ?? '#fafafa'} onChange={(v) => set('headingColor', v)} onReset={() => reset('headingColor')} />
          </Field>
          <Field label="Heading Font Size">
            <input className="lb-input" value={style.headingFontSize ?? ''} onChange={(e) => set('headingFontSize', e.target.value)} placeholder="3.5rem" />
          </Field>
        </Row>
        <Row>
          <Field label="Heading Font Weight">
            <input className="lb-input" value={style.headingFontWeight ?? '800'} onChange={(e) => set('headingFontWeight', e.target.value)} />
          </Field>
          <Field label="Heading Line Height">
            <input className="lb-input" value={style.headingLineHeight ?? '1.1'} onChange={(e) => set('headingLineHeight', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Body Color">
            <ColorInput value={style.bodyColor ?? '#c4c4c4'} onChange={(v) => set('bodyColor', v)} onReset={() => reset('bodyColor')} />
          </Field>
          <Field label="Body Font Size">
            <input className="lb-input" value={style.bodyFontSize ?? ''} onChange={(e) => set('bodyFontSize', e.target.value)} placeholder="18px" />
          </Field>
        </Row>
        <Field label="Text Shadow">
          <input className="lb-input" value={style.headingTextShadow ?? ''} onChange={(e) => set('headingTextShadow', e.target.value)} placeholder="0 4px 24px rgba(0,0,0,0.5)" />
        </Field>
      </Section>

      <Section title="Badge">
        <Row>
          <Field label="Badge Background">
            <ColorInput value={style.badgeBg ?? '#ffd369'} onChange={(v) => set('badgeBg', v)} onReset={() => reset('badgeBg')} />
          </Field>
          <Field label="Badge Text Color">
            <ColorInput value={style.badgeTextColor ?? '#ffd369'} onChange={(v) => set('badgeTextColor', v)} onReset={() => reset('badgeTextColor')} />
          </Field>
        </Row>
        <Field label="Badge Border Radius">
          <input className="lb-input" value={style.badgeBorderRadius ?? '100px'} onChange={(e) => set('badgeBorderRadius', e.target.value)} />
        </Field>
      </Section>

      <Section title="CTAs (Buttons)">
        <Row>
          <Field label="Primary Bg Color">
            <ColorInput value={style.ctaPrimaryBg ?? '#ffd369'} onChange={(v) => set('ctaPrimaryBg', v)} onReset={() => reset('ctaPrimaryBg')} />
          </Field>
          <Field label="Primary Text Color">
            <ColorInput value={style.ctaPrimaryText ?? '#171717'} onChange={(v) => set('ctaPrimaryText', v)} onReset={() => reset('ctaPrimaryText')} />
          </Field>
        </Row>
        <Row>
          <Field label="Secondary Bg">
            <ColorInput value={style.ctaSecondaryBg ?? '#292929'} onChange={(v) => set('ctaSecondaryBg', v)} onReset={() => reset('ctaSecondaryBg')} />
          </Field>
          <Field label="Secondary Text">
            <ColorInput value={style.ctaSecondaryText ?? '#fafafa'} onChange={(v) => set('ctaSecondaryText', v)} onReset={() => reset('ctaSecondaryText')} />
          </Field>
        </Row>
        <Field label="Secondary Border">
          <input className="lb-input" value={style.ctaSecondaryBorder ?? '1px solid rgba(250,250,250,0.25)'} onChange={(e) => set('ctaSecondaryBorder', e.target.value)} />
        </Field>
      </Section>

      <Section title="Stats Cards">
        <Row>
          <Field label="Stats Background">
            <ColorInput value={style.statsBg ?? '#1e1e1e'} onChange={(v) => set('statsBg', v)} onReset={() => reset('statsBg')} />
          </Field>
          <Field label="Stats Border">
            <input className="lb-input" value={style.statsBorder ?? '1px solid rgba(255,255,255,0.1)'} onChange={(e) => set('statsBorder', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Stat Value Color">
            <ColorInput value={style.statValueColor ?? '#ffd369'} onChange={(v) => set('statValueColor', v)} onReset={() => reset('statValueColor')} />
          </Field>
          <Field label="Stat Label Color">
            <ColorInput value={style.statLabelColor ?? '#c4c4c4'} onChange={(v) => set('statLabelColor', v)} onReset={() => reset('statLabelColor')} />
          </Field>
        </Row>
      </Section>

      <Section title="Layout">
        <Field label="Section Min Height">
          <input className="lb-input" value={style.sectionMinHeight ?? '100vh'} onChange={(e) => set('sectionMinHeight', e.target.value)} />
        </Field>
        <Field label="Content Max Width">
          <input className="lb-input" value={style.contentMaxWidth ?? '1280px'} onChange={(e) => set('contentMaxWidth', e.target.value)} />
        </Field>
        <Row>
          <Field label="Content Padding X">
            <input className="lb-input" value={style.paddingX ?? '24px'} onChange={(e) => set('paddingX', e.target.value)} />
          </Field>
          <Field label="Section Padding Y">
            <input className="lb-input" value={style.sectionPaddingY ?? '80px'} onChange={(e) => set('sectionPaddingY', e.target.value)} />
          </Field>
        </Row>
      </Section>
    </>
  )
}

// ── About/Services Style Fields ───────────────────────────────────────────────

function SectionStyleFields({ style, onChange }: { style: any; onChange: (s: any) => void }) {
  const set   = (key: string, value: unknown) => onChange({ ...style, [key]: value })
  const reset = (key: string) => { const next = { ...style }; delete next[key]; onChange(next) }

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <ColorInput value={style.sectionBg ?? '#292929'} onChange={(v) => set('sectionBg', v)} onReset={() => reset('sectionBg')} />
        </Field>
        <MediaField label="Background Image" value={style.sectionBgImage ?? ''} onChange={(ref) => set('sectionBgImage', ref?.url ?? '')} />
        <Row>
          <Field label="Gradient From">
            <ColorInput value={style.gradientFrom ?? '#292929'} onChange={(v) => set('gradientFrom', v)} onReset={() => reset('gradientFrom')} />
          </Field>
          <Field label="Gradient To">
            <ColorInput value={style.gradientTo ?? '#1a1a1a'} onChange={(v) => set('gradientTo', v)} onReset={() => reset('gradientTo')} />
          </Field>
        </Row>
      </Section>

      <Section title="Typography">
        <Row>
          <Field label="Section Label Color">
            <ColorInput value={style.labelColor ?? '#ffd369'} onChange={(v) => set('labelColor', v)} onReset={() => reset('labelColor')} />
          </Field>
          <Field label="Label Font Size">
            <input className="lb-input" value={style.labelFontSize ?? ''} onChange={(e) => set('labelFontSize', e.target.value)} placeholder="14px" />
          </Field>
        </Row>
        <Field label="Heading Color">
          <ColorInput value={style.headingColor ?? '#fafafa'} onChange={(v) => set('headingColor', v)} onReset={() => reset('headingColor')} />
        </Field>
        <Row>
          <Field label="Heading Font Size">
            <input className="lb-input" value={style.headingFontSize ?? ''} onChange={(e) => set('headingFontSize', e.target.value)} placeholder="2.5rem" />
          </Field>
          <Field label="Heading Line Height">
            <input className="lb-input" value={style.headingLineHeight ?? ''} onChange={(e) => set('headingLineHeight', e.target.value)} />
          </Field>
        </Row>
        <Field label="Body Color">
          <ColorInput value={style.bodyColor ?? '#c4c4c4'} onChange={(v) => set('bodyColor', v)} onReset={() => reset('bodyColor')} />
        </Field>
        <Field label="Body Font Size">
          <input className="lb-input" value={style.bodyFontSize ?? ''} onChange={(e) => set('bodyFontSize', e.target.value)} placeholder="16px" />
        </Field>
      </Section>

      <Section title="Cards / Items">
        <Row>
          <Field label="Card Background">
            <ColorInput value={style.cardBg ?? '#1e1e1e'} onChange={(v) => set('cardBg', v)} onReset={() => reset('cardBg')} />
          </Field>
          <Field label="Card Border">
            <input className="lb-input" value={style.cardBorder ?? '1px solid #383838'} onChange={(e) => set('cardBorder', e.target.value)} />
          </Field>
        </Row>
        <Field label="Card Border Radius">
          <input className="lb-input" value={style.cardBorderRadius ?? '12px'} onChange={(e) => set('cardBorderRadius', e.target.value)} />
        </Field>
        <Field label="Card Hover Background">
          <ColorInput value={style.cardHoverBg ?? '#252525'} onChange={(v) => set('cardHoverBg', v)} onReset={() => reset('cardHoverBg')} />
        </Field>
        <Row>
          <Field label="Card Icon Background">
            <ColorInput value={style.iconBg ?? '#2a2a2a'} onChange={(v) => set('iconBg', v)} onReset={() => reset('iconBg')} />
          </Field>
          <Field label="Card Icon Color">
            <ColorInput value={style.iconColor ?? '#ffd369'} onChange={(v) => set('iconColor', v)} onReset={() => reset('iconColor')} />
          </Field>
        </Row>
        <Field label="Card Icon Border Radius">
          <input className="lb-input" value={style.iconBorderRadius ?? '12px'} onChange={(e) => set('iconBorderRadius', e.target.value)} />
        </Field>
      </Section>

      <Section title="Grid Layout">
        <Field label="Columns">
          <select className="lb-input lb-input--select" value={style.columns ?? 3} onChange={(e) => set('columns', parseInt(e.target.value))}>
            <option value={2}>2 columns</option>
            <option value={3}>3 columns</option>
            <option value={4}>4 columns</option>
          </select>
        </Field>
        <Field label="Grid Gap">
          <input className="lb-input" value={style.gridGap ?? '24px'} onChange={(e) => set('gridGap', e.target.value)} />
        </Field>
      </Section>

      <Section title="Spacing">
        <Row>
          <Field label="Section Padding Y">
            <input className="lb-input" value={style.sectionPaddingY ?? '80px'} onChange={(e) => set('sectionPaddingY', e.target.value)} />
          </Field>
          <Field label="Content Padding X">
            <input className="lb-input" value={style.paddingX ?? '24px'} onChange={(e) => set('paddingX', e.target.value)} />
          </Field>
        </Row>
        <Field label="Content Max Width">
          <input className="lb-input" value={style.contentMaxWidth ?? '1280px'} onChange={(e) => set('contentMaxWidth', e.target.value)} />
        </Field>
      </Section>
    </>
  )
}

// ── Testimonials Style Fields ─────────────────────────────────────────────────

function TestimonialsStyleFields({ style, onChange }: { style: any; onChange: (s: any) => void }) {
  const set   = (key: string, value: unknown) => onChange({ ...style, [key]: value })
  const reset = (key: string) => { const next = { ...style }; delete next[key]; onChange(next) }

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <ColorInput value={style.sectionBg ?? '#1e1e1e'} onChange={(v) => set('sectionBg', v)} onReset={() => reset('sectionBg')} />
        </Field>
        <Field label="Use Gradient">
          <select className="lb-input lb-input--select" value={style.useGradient ? 'true' : 'false'} onChange={(e) => set('useGradient', e.target.value === 'true')}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </Field>
        {style.useGradient && (
          <Row>
            <Field label="Gradient From">
              <ColorInput value={style.gradientFrom ?? '#1e1e1e'} onChange={(v) => set('gradientFrom', v)} onReset={() => reset('gradientFrom')} />
            </Field>
            <Field label="Gradient To">
              <ColorInput value={style.gradientTo ?? '#292929'} onChange={(v) => set('gradientTo', v)} onReset={() => reset('gradientTo')} />
            </Field>
          </Row>
        )}
      </Section>

      <Section title="Typography">
        <Field label="Section Label Color">
          <ColorInput value={style.labelColor ?? '#ffd369'} onChange={(v) => set('labelColor', v)} onReset={() => reset('labelColor')} />
        </Field>
        <Row>
          <Field label="Heading Color">
            <ColorInput value={style.headingColor ?? '#fafafa'} onChange={(v) => set('headingColor', v)} onReset={() => reset('headingColor')} />
          </Field>
          <Field label="Heading Font Size">
            <input className="lb-input" value={style.headingFontSize ?? ''} onChange={(e) => set('headingFontSize', e.target.value)} placeholder="2.5rem" />
          </Field>
        </Row>
      </Section>

      <Section title="Quote Card">
        <Field label="Card Background">
          <ColorInput value={style.cardBg ?? '#292929'} onChange={(v) => set('cardBg', v)} onReset={() => reset('cardBg')} />
        </Field>
        <Field label="Card Border">
          <input className="lb-input" value={style.cardBorder ?? '1px solid #383838'} onChange={(e) => set('cardBorder', e.target.value)} />
        </Field>
        <Field label="Card Border Radius">
          <input className="lb-input" value={style.cardBorderRadius ?? '16px'} onChange={(e) => set('cardBorderRadius', e.target.value)} />
        </Field>
        <Field label="Quote Text Color">
          <ColorInput value={style.quoteColor ?? '#fafafa'} onChange={(v) => set('quoteColor', v)} onReset={() => reset('quoteColor')} />
        </Field>
        <Field label="Quote Font Size">
          <input className="lb-input" value={style.quoteFontSize ?? ''} onChange={(e) => set('quoteFontSize', e.target.value)} placeholder="16px" />
        </Field>
        <Field label="Quote Line Height">
          <input className="lb-input" value={style.quoteLineHeight ?? ''} onChange={(e) => set('quoteLineHeight', e.target.value)} />
        </Field>
        <Field label="Quote Icon Color">
          <ColorInput value={style.quoteIconColor ?? '#ffd369'} onChange={(v) => set('quoteIconColor', v)} onReset={() => reset('quoteIconColor')} />
        </Field>
      </Section>

      <Section title="Author">
        <Row>
          <Field label="Author Name Color">
            <ColorInput value={style.authorColor ?? '#fafafa'} onChange={(v) => set('authorColor', v)} onReset={() => reset('authorColor')} />
          </Field>
          <Field label="Author Role Color">
            <ColorInput value={style.authorRoleColor ?? '#9ca3af'} onChange={(v) => set('authorRoleColor', v)} onReset={() => reset('authorRoleColor')} />
          </Field>
        </Row>
        <Field label="Avatar Border Radius">
          <input className="lb-input" value={style.avatarBorderRadius ?? '50%'} onChange={(e) => set('avatarBorderRadius', e.target.value)} />
        </Field>
      </Section>

      <Section title="Layout">
        <Field label="Layout Style">
          <select className="lb-input lb-input--select" value={style.layoutStyle ?? 'grid'} onChange={(e) => set('layoutStyle', e.target.value)}>
            <option value="grid">Grid</option>
            <option value="carousel">Carousel</option>
            <option value="slider">Slider</option>
          </select>
        </Field>
        <Row>
          <Field label="Columns">
            <input type="number" className="lb-input" min="1" max="4" value={style.columns ?? 3} onChange={(e) => set('columns', parseInt(e.target.value))} />
          </Field>
          <Field label="Gap">
            <input className="lb-input" value={style.gap ?? '24px'} onChange={(e) => set('gap', e.target.value)} />
          </Field>
        </Row>
      </Section>

      <Section title="Spacing">
        <Row>
          <Field label="Section Padding Y">
            <input className="lb-input" value={style.sectionPaddingY ?? '80px'} onChange={(e) => set('sectionPaddingY', e.target.value)} />
          </Field>
          <Field label="Content Padding X">
            <input className="lb-input" value={style.paddingX ?? '24px'} onChange={(e) => set('paddingX', e.target.value)} />
          </Field>
        </Row>
        <Field label="Content Max Width">
          <input className="lb-input" value={style.contentMaxWidth ?? '1280px'} onChange={(e) => set('contentMaxWidth', e.target.value)} />
        </Field>
      </Section>
    </>
  )
}

// ── Contact Style Fields ──────────────────────────────────────────────────────

function ContactStyleFields({ style, onChange }: { style: any; onChange: (s: any) => void }) {
  const set   = (key: string, value: unknown) => onChange({ ...style, [key]: value })
  const reset = (key: string) => { const next = { ...style }; delete next[key]; onChange(next) }

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <ColorInput value={style.sectionBg ?? '#ffd369'} onChange={(v) => set('sectionBg', v)} onReset={() => reset('sectionBg')} />
        </Field>
        <Field label="Text Color (Primary)">
          <ColorInput value={style.primaryTextColor ?? '#171717'} onChange={(v) => set('primaryTextColor', v)} onReset={() => reset('primaryTextColor')} />
        </Field>
      </Section>

      <Section title="Typography">
        <Row>
          <Field label="Heading Color">
            <ColorInput value={style.headingColor ?? '#171717'} onChange={(v) => set('headingColor', v)} onReset={() => reset('headingColor')} />
          </Field>
          <Field label="Heading Font Size">
            <input className="lb-input" value={style.headingFontSize ?? ''} onChange={(e) => set('headingFontSize', e.target.value)} placeholder="2.5rem" />
          </Field>
        </Row>
        <Field label="Body Color">
          <ColorInput value={style.bodyColor ?? '#525252'} onChange={(v) => set('bodyColor', v)} onReset={() => reset('bodyColor')} />
        </Field>
      </Section>

      <Section title="CTA Button">
        <Row>
          <Field label="Button Background">
            <ColorInput value={style.buttonBg ?? '#171717'} onChange={(v) => set('buttonBg', v)} onReset={() => reset('buttonBg')} />
          </Field>
          <Field label="Button Text">
            <ColorInput value={style.buttonText ?? '#fafafa'} onChange={(v) => set('buttonText', v)} onReset={() => reset('buttonText')} />
          </Field>
        </Row>
        <Field label="Button Border Radius">
          <input className="lb-input" value={style.buttonBorderRadius ?? '8px'} onChange={(e) => set('buttonBorderRadius', e.target.value)} />
        </Field>
        <Field label="Button Hover Background">
          <ColorInput value={style.buttonHoverBg ?? '#292929'} onChange={(v) => set('buttonHoverBg', v)} onReset={() => reset('buttonHoverBg')} />
        </Field>
      </Section>

      <Section title="Spacing">
        <Row>
          <Field label="Section Padding Y">
            <input className="lb-input" value={style.sectionPaddingY ?? '80px'} onChange={(e) => set('sectionPaddingY', e.target.value)} />
          </Field>
          <Field label="Content Padding X">
            <input className="lb-input" value={style.paddingX ?? '24px'} onChange={(e) => set('paddingX', e.target.value)} />
          </Field>
        </Row>
        <Field label="Content Max Width">
          <input className="lb-input" value={style.contentMaxWidth ?? '1280px'} onChange={(e) => set('contentMaxWidth', e.target.value)} />
        </Field>
      </Section>
    </>
  )
}

// ── Generic Section Style Fields ──────────────────────────────────────────────

function GenericSectionStyleFields({ style, onChange }: { style: any; onChange: (s: any) => void }) {
  const set   = (key: string, value: unknown) => onChange({ ...style, [key]: value })
  const reset = (key: string) => { const next = { ...style }; delete next[key]; onChange(next) }

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <ColorInput value={style.sectionBg ?? '#292929'} onChange={(v) => set('sectionBg', v)} onReset={() => reset('sectionBg')} />
        </Field>
        <MediaField label="Background Image" value={style.sectionBgImage ?? ''} onChange={(ref) => set('sectionBgImage', ref?.url ?? '')} />
        <Row>
          <Field label="Gradient From">
            <ColorInput value={style.gradientFrom ?? '#292929'} onChange={(v) => set('gradientFrom', v)} onReset={() => reset('gradientFrom')} />
          </Field>
          <Field label="Gradient To">
            <ColorInput value={style.gradientTo ?? '#1a1a1a'} onChange={(v) => set('gradientTo', v)} onReset={() => reset('gradientTo')} />
          </Field>
        </Row>
      </Section>

      <Section title="Typography">
        <Field label="Section Label Color">
          <ColorInput value={style.labelColor ?? '#ffd369'} onChange={(v) => set('labelColor', v)} onReset={() => reset('labelColor')} />
        </Field>
        <Row>
          <Field label="Heading Color">
            <ColorInput value={style.headingColor ?? '#fafafa'} onChange={(v) => set('headingColor', v)} onReset={() => reset('headingColor')} />
          </Field>
          <Field label="Heading Font Size">
            <input className="lb-input" value={style.headingFontSize ?? ''} onChange={(e) => set('headingFontSize', e.target.value)} placeholder="2.5rem" />
          </Field>
        </Row>
        <Row>
          <Field label="Heading Font Weight">
            <input className="lb-input" value={style.headingFontWeight ?? '700'} onChange={(e) => set('headingFontWeight', e.target.value)} />
          </Field>
          <Field label="Heading Line Height">
            <input className="lb-input" value={style.headingLineHeight ?? ''} onChange={(e) => set('headingLineHeight', e.target.value)} />
          </Field>
        </Row>
        <Field label="Body Color">
          <ColorInput value={style.bodyColor ?? '#c4c4c4'} onChange={(v) => set('bodyColor', v)} onReset={() => reset('bodyColor')} />
        </Field>
        <Field label="Body Font Size">
          <input className="lb-input" value={style.bodyFontSize ?? ''} onChange={(e) => set('bodyFontSize', e.target.value)} placeholder="16px" />
        </Field>
      </Section>

      <Section title="Layout">
        <Field label="Content Max Width">
          <input className="lb-input" value={style.contentMaxWidth ?? '1280px'} onChange={(e) => set('contentMaxWidth', e.target.value)} />
        </Field>
        <Field label="Text Alignment">
          <select className="lb-input lb-input--select" value={style.textAlign ?? 'left'} onChange={(e) => set('textAlign', e.target.value)}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
        <Row>
          <Field label="Columns">
            <input type="number" className="lb-input" min="1" max="6" value={style.columns ?? 3} onChange={(e) => set('columns', parseInt(e.target.value))} />
          </Field>
          <Field label="Grid Gap">
            <input className="lb-input" value={style.gridGap ?? '24px'} onChange={(e) => set('gridGap', e.target.value)} />
          </Field>
        </Row>
      </Section>

      <Section title="Cards / Items">
        <Row>
          <Field label="Card Background">
            <ColorInput value={style.cardBg ?? '#1e1e1e'} onChange={(v) => set('cardBg', v)} onReset={() => reset('cardBg')} />
          </Field>
          <Field label="Card Border">
            <input className="lb-input" value={style.cardBorder ?? '1px solid #383838'} onChange={(e) => set('cardBorder', e.target.value)} />
          </Field>
        </Row>
        <Field label="Card Border Radius">
          <input className="lb-input" value={style.cardBorderRadius ?? '12px'} onChange={(e) => set('cardBorderRadius', e.target.value)} />
        </Field>
        <Row>
          <Field label="Icon Background">
            <ColorInput value={style.iconBg ?? '#2a2a2a'} onChange={(v) => set('iconBg', v)} onReset={() => reset('iconBg')} />
          </Field>
          <Field label="Icon Color">
            <ColorInput value={style.iconColor ?? '#ffd369'} onChange={(v) => set('iconColor', v)} onReset={() => reset('iconColor')} />
          </Field>
        </Row>
      </Section>

      <Section title="Spacing">
        <Row>
          <Field label="Section Padding Y">
            <input className="lb-input" value={style.sectionPaddingY ?? '80px'} onChange={(e) => set('sectionPaddingY', e.target.value)} />
          </Field>
          <Field label="Content Padding X">
            <input className="lb-input" value={style.paddingX ?? '24px'} onChange={(e) => set('paddingX', e.target.value)} />
          </Field>
        </Row>
      </Section>
    </>
  )
}

// ── Main export: get style fields by block type ───────────────────────────────

export function getBlockStyleFields(
  blockType: BlockType,
  style: any,
  onChange: (s: any) => void,
): React.ReactNode {
  if (['hero', 'hero-split', 'hero-centered', 'page-hero', 'contact-hero', 'involved-hero'].includes(blockType)) {
    return <HeroStyleFields style={style} onChange={onChange} />
  }
  if (['about', 'features', 'team-section', 'mission-vision'].includes(blockType)) {
    return <SectionStyleFields style={style} onChange={onChange} />
  }
  if (['services', 'services-mascot', 'expertise-tiles', 'process-steps', 'card-grid'].includes(blockType)) {
    return <SectionStyleFields style={style} onChange={onChange} />
  }
  if (['testimonials', 'testimonial'].includes(blockType)) {
    return <TestimonialsStyleFields style={style} onChange={onChange} />
  }
  if (['contact', 'cta-banner', 'contact-stats'].includes(blockType)) {
    return <ContactStyleFields style={style} onChange={onChange} />
  }
  return <GenericSectionStyleFields style={style} onChange={onChange} />
}

// Re-export for backward compatibility
export { HeroStyleFields, SectionStyleFields, TestimonialsStyleFields, ContactStyleFields, GenericSectionStyleFields }
