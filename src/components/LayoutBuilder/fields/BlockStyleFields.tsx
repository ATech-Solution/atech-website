'use client'

import React from 'react'
import type { BlockType, BlockOverrides } from '../types'

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

// ── Hero Block Styles (matches src/components/block/Advance/HeroSection.tsx) ─────────

function HeroStyleFields({ style, onChange }: { style: any; onChange: (s: any) => void }) {
  const set = (key: string, value: unknown) => onChange({ ...style, [key]: value })

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <input
            type="color"
            className="lb-input"
            value={style.heroBgColor ?? '#292929'}
            onChange={(e) => set('heroBgColor', e.target.value)}
          />
        </Field>
        <Row>
          <Field label="Gradient Start">
            <input type="color" className="lb-input" value={style.gradientFrom ?? '#292929'} onChange={(e) => set('gradientFrom', e.target.value)} />
          </Field>
          <Field label="Gradient End">
            <input type="color" className="lb-input" value={style.gradientTo ?? '#1a1a1a'} onChange={(e) => set('gradientTo', e.target.value)} />
          </Field>
        </Row>
        <Field label="Background Image URL">
          <input className="lb-input" value={style.heroBgImage ?? ''} onChange={(e) => set('heroBgImage', e.target.value)} placeholder="/images/hero-bg.jpg" />
        </Field>
        <Field label="Overlay Opacity (0-1)">
          <input type="number" className="lb-input" min="0" max="1" step="0.1" value={style.overlayOpacity ?? 0.6} onChange={(e) => set('overlayOpacity', parseFloat(e.target.value))} />
        </Field>
      </Section>

      <Section title="Typography">
        <Row>
          <Field label="Heading Color">
            <input type="color" className="lb-input" value={style.headingColor ?? '#fafafa'} onChange={(e) => set('headingColor', e.target.value)} />
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
            <input type="color" className="lb-input" value={style.bodyColor ?? '#c4c4c4'} onChange={(e) => set('bodyColor', e.target.value)} />
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
            <input type="color" className="lb-input" value={style.badgeBg ?? 'rgba(255,211,105,0.12)'} onChange={(e) => set('badgeBg', e.target.value)} />
          </Field>
          <Field label="Badge Text Color">
            <input type="color" className="lb-input" value={style.badgeTextColor ?? '#ffd369'} onChange={(e) => set('badgeTextColor', e.target.value)} />
          </Field>
        </Row>
        <Field label="Badge Border Radius">
          <input className="lb-input" value={style.badgeBorderRadius ?? '100px'} onChange={(e) => set('badgeBorderRadius', e.target.value)} />
        </Field>
      </Section>

      <Section title="CTAs (Buttons)">
        <Row>
          <Field label="Primary Bg Color">
            <input type="color" className="lb-input" value={style.ctaPrimaryBg ?? '#ffd369'} onChange={(e) => set('ctaPrimaryBg', e.target.value)} />
          </Field>
          <Field label="Primary Text Color">
            <input type="color" className="lb-input" value={style.ctaPrimaryText ?? '#171717'} onChange={(e) => set('ctaPrimaryText', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Secondary Bg">
            <input type="color" className="lb-input" value={style.ctaSecondaryBg ?? 'transparent'} onChange={(e) => set('ctaSecondaryBg', e.target.value)} />
          </Field>
          <Field label="Secondary Text">
            <input type="color" className="lb-input" value={style.ctaSecondaryText ?? '#fafafa'} onChange={(e) => set('ctaSecondaryText', e.target.value)} />
          </Field>
        </Row>
        <Field label="Secondary Border">
          <input className="lb-input" value={style.ctaSecondaryBorder ?? '1px solid rgba(250,250,250,0.25)'} onChange={(e) => set('ctaSecondaryBorder', e.target.value)} />
        </Field>
      </Section>

      <Section title="Stats Cards">
        <Row>
          <Field label="Stats Background">
            <input type="color" className="lb-input" value={style.statsBg ?? 'rgba(255,255,255,0.05)'} onChange={(e) => set('statsBg', e.target.value)} />
          </Field>
          <Field label="Stats Border">
            <input className="lb-input" value={style.statsBorder ?? '1px solid rgba(255,255,255,0.1)'} onChange={(e) => set('statsBorder', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Stat Value Color">
            <input type="color" className="lb-input" value={style.statValueColor ?? '#ffd369'} onChange={(e) => set('statValueColor', e.target.value)} />
          </Field>
          <Field label="Stat Label Color">
            <input type="color" className="lb-input" value={style.statLabelColor ?? '#c4c4c4'} onChange={(e) => set('statLabelColor', e.target.value)} />
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

// ── About/Services Style Fields ─────────────────────────────────────────────────────

function SectionStyleFields({ style, onChange }: { style: any; onChange: (s: any) => void }) {
  const set = (key: string, value: unknown) => onChange({ ...style, [key]: value })

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <input type="color" className="lb-input" value={style.sectionBg ?? '#292929'} onChange={(e) => set('sectionBg', e.target.value)} />
        </Field>
        <Field label="Background Image URL">
          <input className="lb-input" value={style.sectionBgImage ?? ''} onChange={(e) => set('sectionBgImage', e.target.value)} placeholder="/images/section-bg.jpg" />
        </Field>
        <Row>
          <Field label="Gradient From">
            <input type="color" className="lb-input" value={style.gradientFrom ?? ''} onChange={(e) => set('gradientFrom', e.target.value)} />
          </Field>
          <Field label="Gradient To">
            <input type="color" className="lb-input" value={style.gradientTo ?? ''} onChange={(e) => set('gradientTo', e.target.value)} />
          </Field>
        </Row>
      </Section>

      <Section title="Typography">
        <Row>
          <Field label="Section Label Color">
            <input type="color" className="lb-input" value={style.labelColor ?? '#ffd369'} onChange={(e) => set('labelColor', e.target.value)} />
          </Field>
          <Field label="Label Font Size">
            <input className="lb-input" value={style.labelFontSize ?? ''} onChange={(e) => set('labelFontSize', e.target.value)} placeholder="14px" />
          </Field>
        </Row>
        <Field label="Heading Color">
          <input type="color" className="lb-input" value={style.headingColor ?? '#fafafa'} onChange={(e) => set('headingColor', e.target.value)} />
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
          <input type="color" className="lb-input" value={style.bodyColor ?? '#c4c4c4'} onChange={(e) => set('bodyColor', e.target.value)} />
        </Field>
        <Field label="Body Font Size">
          <input className="lb-input" value={style.bodyFontSize ?? ''} onChange={(e) => set('bodyFontSize', e.target.value)} placeholder="16px" />
        </Field>
      </Section>

      <Section title="Cards / Items">
        <Row>
          <Field label="Card Background">
            <input type="color" className="lb-input" value={style.cardBg ?? '#1e1e1e'} onChange={(e) => set('cardBg', e.target.value)} />
          </Field>
          <Field label="Card Border">
            <input className="lb-input" value={style.cardBorder ?? '1px solid #383838'} onChange={(e) => set('cardBorder', e.target.value)} />
          </Field>
        </Row>
        <Field label="Card Border Radius">
          <input className="lb-input" value={style.cardBorderRadius ?? '12px'} onChange={(e) => set('cardBorderRadius', e.target.value)} />
        </Field>
        <Field label="Card Hover Background">
          <input type="color" className="lb-input" value={style.cardHoverBg ?? '#252525'} onChange={(e) => set('cardHoverBg', e.target.value)} />
        </Field>
        <Row>
          <Field label="Card Icon Background">
            <input type="color" className="lb-input" value={style.iconBg ?? 'rgba(255,211,105,0.10)'} onChange={(e) => set('iconBg', e.target.value)} />
          </Field>
          <Field label="Card Icon Color">
            <input type="color" className="lb-input" value={style.iconColor ?? '#ffd369'} onChange={(e) => set('iconColor', e.target.value)} />
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

// ── Testimonials Style Fields ─────────────────────────────────────────────────────

function TestimonialsStyleFields({ style, onChange }: { style: any; onChange: (s: any) => void }) {
  const set = (key: string, value: unknown) => onChange({ ...style, [key]: value })

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <input type="color" className="lb-input" value={style.sectionBg ?? '#1e1e1e'} onChange={(e) => set('sectionBg', e.target.value)} />
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
              <input type="color" className="lb-input" value={style.gradientFrom ?? '#1e1e1e'} onChange={(e) => set('gradientFrom', e.target.value)} />
            </Field>
            <Field label="Gradient To">
              <input type="color" className="lb-input" value={style.gradientTo ?? '#292929'} onChange={(e) => set('gradientTo', e.target.value)} />
            </Field>
          </Row>
        )}
      </Section>

      <Section title="Typography">
        <Field label="Section Label Color">
          <input type="color" className="lb-input" value={style.labelColor ?? '#ffd369'} onChange={(e) => set('labelColor', e.target.value)} />
        </Field>
        <Row>
          <Field label="Heading Color">
            <input type="color" className="lb-input" value={style.headingColor ?? '#fafafa'} onChange={(e) => set('headingColor', e.target.value)} />
          </Field>
          <Field label="Heading Font Size">
            <input className="lb-input" value={style.headingFontSize ?? ''} onChange={(e) => set('headingFontSize', e.target.value)} placeholder="2.5rem" />
          </Field>
        </Row>
      </Section>

      <Section title="Quote Card">
        <Field label="Card Background">
          <input type="color" className="lb-input" value={style.cardBg ?? '#292929'} onChange={(e) => set('cardBg', e.target.value)} />
        </Field>
        <Field label="Card Border">
          <input className="lb-input" value={style.cardBorder ?? '1px solid #383838'} onChange={(e) => set('cardBorder', e.target.value)} />
        </Field>
        <Field label="Card Border Radius">
          <input className="lb-input" value={style.cardBorderRadius ?? '16px'} onChange={(e) => set('cardBorderRadius', e.target.value)} />
        </Field>
        <Field label="Quote Text Color">
          <input type="color" className="lb-input" value={style.quoteColor ?? '#fafafa'} onChange={(e) => set('quoteColor', e.target.value)} />
        </Field>
        <Field label="Quote Font Size">
          <input className="lb-input" value={style.quoteFontSize ?? ''} onChange={(e) => set('quoteFontSize', e.target.value)} placeholder="16px" />
        </Field>
        <Field label="Quote Line Height">
          <input className="lb-input" value={style.quoteLineHeight ?? ''} onChange={(e) => set('quoteLineHeight', e.target.value)} />
        </Field>
        <Field label="Quote Icon Color">
          <input type="color" className="lb-input" value={style.quoteIconColor ?? '#ffd369'} onChange={(e) => set('quoteIconColor', e.target.value)} />
        </Field>
      </Section>

      <Section title="Author">
        <Row>
          <Field label="Author Name Color">
            <input type="color" className="lb-input" value={style.authorColor ?? '#fafafa'} onChange={(e) => set('authorColor', e.target.value)} />
          </Field>
          <Field label="Author Role Color">
            <input type="color" className="lb-input" value={style.authorRoleColor ?? '#9ca3af'} onChange={(e) => set('authorRoleColor', e.target.value)} />
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
  const set = (key: string, value: unknown) => onChange({ ...style, [key]: value })

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <input type="color" className="lb-input" value={style.sectionBg ?? '#ffd369'} onChange={(e) => set('sectionBg', e.target.value)} />
        </Field>
        <Field label="Text Color (Primary)">
          <input type="color" className="lb-input" value={style.primaryTextColor ?? '#171717'} onChange={(e) => set('primaryTextColor', e.target.value)} />
        </Field>
      </Section>

      <Section title="Typography">
        <Row>
          <Field label="Heading Color">
            <input type="color" className="lb-input" value={style.headingColor ?? '#171717'} onChange={(e) => set('headingColor', e.target.value)} />
          </Field>
          <Field label="Heading Font Size">
            <input className="lb-input" value={style.headingFontSize ?? ''} onChange={(e) => set('headingFontSize', e.target.value)} placeholder="2.5rem" />
          </Field>
        </Row>
        <Field label="Body Color">
          <input type="color" className="lb-input" value={style.bodyColor ?? '#525252'} onChange={(e) => set('bodyColor', e.target.value)} />
        </Field>
      </Section>

      <Section title="CTA Button">
        <Row>
          <Field label="Button Background">
            <input type="color" className="lb-input" value={style.buttonBg ?? '#171717'} onChange={(e) => set('buttonBg', e.target.value)} />
          </Field>
          <Field label="Button Text">
            <input type="color" className="lb-input" value={style.buttonText ?? '#fafafa'} onChange={(e) => set('buttonText', e.target.value)} />
          </Field>
        </Row>
        <Field label="Button Border Radius">
          <input className="lb-input" value={style.buttonBorderRadius ?? '8px'} onChange={(e) => set('buttonBorderRadius', e.target.value)} />
        </Field>
        <Field label="Button Hover Background">
          <input type="color" className="lb-input" value={style.buttonHoverBg ?? '#292929'} onChange={(e) => set('buttonHoverBg', e.target.value)} />
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

// ── Generic Section Style Fields (for all other block types) ─────────────────────────

function GenericSectionStyleFields({ style, onChange }: { style: any; onChange: (s: any) => void }) {
  const set = (key: string, value: unknown) => onChange({ ...style, [key]: value })

  return (
    <>
      <Section title="Background">
        <Field label="Background Color">
          <input type="color" className="lb-input" value={style.sectionBg ?? '#292929'} onChange={(e) => set('sectionBg', e.target.value)} />
        </Field>
        <Field label="Background Image URL">
          <input className="lb-input" value={style.sectionBgImage ?? ''} onChange={(e) => set('sectionBgImage', e.target.value)} placeholder="/images/section-bg.jpg" />
        </Field>
        <Row>
          <Field label="Gradient From">
            <input type="color" className="lb-input" value={style.gradientFrom ?? ''} onChange={(e) => set('gradientFrom', e.target.value)} />
          </Field>
          <Field label="Gradient To">
            <input type="color" className="lb-input" value={style.gradientTo ?? ''} onChange={(e) => set('gradientTo', e.target.value)} />
          </Field>
        </Row>
      </Section>

      <Section title="Typography">
        <Field label="Section Label Color">
          <input type="color" className="lb-input" value={style.labelColor ?? '#ffd369'} onChange={(e) => set('labelColor', e.target.value)} />
        </Field>
        <Row>
          <Field label="Heading Color">
            <input type="color" className="lb-input" value={style.headingColor ?? '#fafafa'} onChange={(e) => set('headingColor', e.target.value)} />
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
          <input type="color" className="lb-input" value={style.bodyColor ?? '#c4c4c4'} onChange={(e) => set('bodyColor', e.target.value)} />
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
            <input type="color" className="lb-input" value={style.cardBg ?? '#1e1e1e'} onChange={(e) => set('cardBg', e.target.value)} />
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
            <input type="color" className="lb-input" value={style.iconBg ?? 'rgba(255,211,105,0.10)'} onChange={(e) => set('iconBg', e.target.value)} />
          </Field>
          <Field label="Icon Color">
            <input type="color" className="lb-input" value={style.iconColor ?? '#ffd369'} onChange={(e) => set('iconColor', e.target.value)} />
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

// ── Main export: get style fields by block type ──────────────────────────────────────

export function getBlockStyleFields(
  blockType: BlockType,
  style: any,
  onChange: (s: any) => void,
): React.ReactNode {
  // Hero variants
  if (['hero', 'hero-split', 'hero-centered', 'page-hero', 'contact-hero', 'involved-hero'].includes(blockType)) {
    return <HeroStyleFields style={style} onChange={onChange} />
  }

  // About / Features
  if (['about', 'features', 'team-section', 'mission-vision'].includes(blockType)) {
    return <SectionStyleFields style={style} onChange={onChange} />
  }

  // Services / Expertise
  if (['services', 'expertise-tiles', 'process-steps', 'card-grid'].includes(blockType)) {
    return <SectionStyleFields style={style} onChange={onChange} />
  }

  // Testimonials / Reviews
  if (['testimonials', 'testimonial'].includes(blockType)) {
    return <TestimonialsStyleFields style={style} onChange={onChange} />
  }

  // Contact / CTA
  if (['contact', 'cta-banner', 'contact-stats'].includes(blockType)) {
    return <ContactStyleFields style={style} onChange={onChange} />
  }

  // Default: generic section styles
  return <GenericSectionStyleFields style={style} onChange={onChange} />
}

// Re-export for backward compatibility
export { HeroStyleFields, SectionStyleFields, TestimonialsStyleFields, ContactStyleFields, GenericSectionStyleFields }
