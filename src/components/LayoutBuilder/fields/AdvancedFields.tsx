'use client'

import React from 'react'
import type { BlockOverrides } from '../types'

interface AdvancedFieldsProps {
  overrides: BlockOverrides['advanced']
  onChange: (overrides: BlockOverrides['advanced']) => void
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

export function AdvancedFields({ overrides = {}, onChange }: AdvancedFieldsProps) {
  const set = (key: string, value: unknown) =>
    onChange({ ...overrides, [key]: value } as BlockOverrides['advanced'])

  const v = overrides as Record<string, any>

  return (
    <div className="lb-fields">
      {/* Padding */}
      <div className="lb-collapsible">
        <p className="lb-collapsible__title">Padding</p>
        <Row>
          <Field label="Top"><input className="lb-input" value={v.paddingTop ?? ''} onChange={(e) => set('paddingTop', e.target.value)} placeholder="0px" /></Field>
          <Field label="Right"><input className="lb-input" value={v.paddingRight ?? ''} onChange={(e) => set('paddingRight', e.target.value)} placeholder="0px" /></Field>
          <Field label="Bottom"><input className="lb-input" value={v.paddingBottom ?? ''} onChange={(e) => set('paddingBottom', e.target.value)} placeholder="0px" /></Field>
          <Field label="Left"><input className="lb-input" value={v.paddingLeft ?? ''} onChange={(e) => set('paddingLeft', e.target.value)} placeholder="0px" /></Field>
        </Row>
      </div>

      {/* Margin */}
      <div className="lb-collapsible">
        <p className="lb-collapsible__title">Margin</p>
        <Row>
          <Field label="Top"><input className="lb-input" value={v.marginTop ?? ''} onChange={(e) => set('marginTop', e.target.value)} placeholder="0px" /></Field>
          <Field label="Right"><input className="lb-input" value={v.marginRight ?? ''} onChange={(e) => set('marginRight', e.target.value)} placeholder="0px" /></Field>
          <Field label="Bottom"><input className="lb-input" value={v.marginBottom ?? ''} onChange={(e) => set('marginBottom', e.target.value)} placeholder="0px" /></Field>
          <Field label="Left"><input className="lb-input" value={v.marginLeft ?? ''} onChange={(e) => set('marginLeft', e.target.value)} placeholder="0px" /></Field>
        </Row>
      </div>

      {/* Layout */}
      <Row>
        <Field label="Width">
          <input className="lb-input" value={v.width ?? ''} onChange={(e) => set('width', e.target.value)} placeholder="100%" />
        </Field>
        <Field label="Position">
          <select className="lb-input lb-input--select" value={v.position ?? 'relative'} onChange={(e) => set('position', e.target.value)}>
            {['static','relative','absolute','fixed','sticky'].map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </Field>
        <Field label="Z-Index">
          <input className="lb-input" type="number" value={v.zIndex ?? ''} onChange={(e) => set('zIndex', parseInt(e.target.value, 10))} placeholder="0" />
        </Field>
      </Row>

      {/* Identity */}
      <Row>
        <Field label="CSS Class">
          <input className="lb-input" value={v.cssClassName ?? ''} onChange={(e) => set('cssClassName', e.target.value)} placeholder="my-block" />
        </Field>
        <Field label="HTML ID">
          <input className="lb-input" value={v.htmlId ?? ''} onChange={(e) => set('htmlId', e.target.value)} placeholder="section-id" />
        </Field>
      </Row>

      {/* Responsive */}
      <div className="lb-collapsible">
        <p className="lb-collapsible__title">Responsive Visibility</p>
        <div className="lb-checkbox-row">
          {[
            { key: 'hideOnMobile',  label: 'Hide on Mobile' },
            { key: 'hideOnTablet',  label: 'Hide on Tablet' },
            { key: 'hideOnDesktop', label: 'Hide on Desktop' },
          ].map(({ key, label }) => (
            <label key={key} className="lb-checkbox">
              <input
                type="checkbox"
                checked={v[key] ?? false}
                onChange={(e) => set(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
