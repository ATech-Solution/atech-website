'use client'

import React from 'react'
import type { BlockOverrides } from '../types'

interface StyleFieldsProps {
  overrides: BlockOverrides['style']
  onChange: (overrides: BlockOverrides['style']) => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="lb-field">
      <label className="lb-field__label">{label}</label>
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="lb-field-row">{children}</div>
}

export function StyleFields({ overrides = {}, onChange }: StyleFieldsProps) {
  const set = (key: string, value: unknown) =>
    onChange({ ...overrides, [key]: value } as BlockOverrides['style'])

  const v = overrides as Record<string, string | undefined>

  return (
    <div className="lb-fields">
      {/* Text alignment */}
      <Field label="Text Alignment">
        <select className="lb-input lb-input--select" value={v.textAlign ?? 'left'} onChange={(e) => set('textAlign', e.target.value)}>
          {['left','center','right','justify'].map((a) => (
            <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
          ))}
        </select>
      </Field>

      {/* Typography */}
      <div className="lb-collapsible">
        <p className="lb-collapsible__title">Typography</p>
        <Row>
          <Field label="Font Family">
            <input className="lb-input" value={v.fontFamily ?? ''} onChange={(e) => set('fontFamily', e.target.value)} placeholder="Inter, sans-serif" />
          </Field>
          <Field label="Font Size">
            <input className="lb-input" value={v.fontSize ?? ''} onChange={(e) => set('fontSize', e.target.value)} placeholder="16px" />
          </Field>
        </Row>
        <Row>
          <Field label="Font Weight">
            <input className="lb-input" value={v.fontWeight ?? ''} onChange={(e) => set('fontWeight', e.target.value)} placeholder="400" />
          </Field>
          <Field label="Line Height">
            <input className="lb-input" value={v.lineHeight ?? ''} onChange={(e) => set('lineHeight', e.target.value)} placeholder="1.5" />
          </Field>
        </Row>
        <Row>
          <Field label="Letter Spacing">
            <input className="lb-input" value={v.letterSpacing ?? ''} onChange={(e) => set('letterSpacing', e.target.value)} placeholder="0em" />
          </Field>
          <Field label="Paragraph Spacing">
            <input className="lb-input" value={v.paragraphSpacing ?? ''} onChange={(e) => set('paragraphSpacing', e.target.value)} placeholder="16px" />
          </Field>
        </Row>
      </div>

      {/* Text shadow */}
      <div className="lb-collapsible">
        <p className="lb-collapsible__title">Text Shadow</p>
        <Row>
          <Field label="X"><input className="lb-input" value={v.textShadowX ?? ''} onChange={(e) => set('textShadowX', e.target.value)} placeholder="0px" /></Field>
          <Field label="Y"><input className="lb-input" value={v.textShadowY ?? ''} onChange={(e) => set('textShadowY', e.target.value)} placeholder="0px" /></Field>
          <Field label="Blur"><input className="lb-input" value={v.textShadowBlur ?? ''} onChange={(e) => set('textShadowBlur', e.target.value)} placeholder="0px" /></Field>
        </Row>
        <Field label="Shadow Color">
          <input className="lb-input" value={v.textShadowColor ?? ''} onChange={(e) => set('textShadowColor', e.target.value)} placeholder="#000000" />
        </Field>
      </div>

      {/* Colors */}
      <div className="lb-collapsible">
        <p className="lb-collapsible__title">Colors</p>
        <Row>
          <Field label="Text Color">
            <input className="lb-input" value={v.textColorNormal ?? ''} onChange={(e) => set('textColorNormal', e.target.value)} placeholder="#000000" />
          </Field>
          <Field label="Text Hover">
            <input className="lb-input" value={v.textColorHover ?? ''} onChange={(e) => set('textColorHover', e.target.value)} placeholder="#000000" />
          </Field>
        </Row>
        <Row>
          <Field label="Link Color">
            <input className="lb-input" value={v.linkColorNormal ?? ''} onChange={(e) => set('linkColorNormal', e.target.value)} placeholder="#0000EE" />
          </Field>
          <Field label="Link Hover">
            <input className="lb-input" value={v.linkColorHover ?? ''} onChange={(e) => set('linkColorHover', e.target.value)} placeholder="#0000EE" />
          </Field>
        </Row>
        <Row>
          <Field label="Background">
            <input className="lb-input" value={v.backgroundColor ?? ''} onChange={(e) => set('backgroundColor', e.target.value)} placeholder="transparent" />
          </Field>
          <Field label="Border Radius">
            <input className="lb-input" value={v.borderRadius ?? ''} onChange={(e) => set('borderRadius', e.target.value)} placeholder="0px" />
          </Field>
        </Row>
      </div>

      {/* Custom CSS */}
      <Field label="Custom CSS">
        <textarea
          className="lb-input lb-input--textarea lb-input--code"
          value={v.customCSS ?? ''}
          onChange={(e) => set('customCSS', e.target.value)}
          rows={4}
          placeholder=".my-block { color: red; }"
        />
      </Field>
    </div>
  )
}
