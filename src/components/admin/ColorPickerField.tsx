'use client'

import React, { useCallback, useId } from 'react'
import { useField } from '@payloadcms/ui'

export function ColorPickerField({ field }: { field: { name: string; label?: string; admin?: { description?: string } } }) {
  const { value, setValue } = useField<string>({ path: field.name })
  const id = useId()
  const hex = (value ?? '') as string

  const isValidHex = (v: string) => /^#[0-9a-fA-F]{3,8}$/.test(v)

  const handleSwatchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    [setValue],
  )

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      setValue(v)
    },
    [setValue],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
      {field.label && (
        <label
          htmlFor={id}
          style={{ fontSize: 12, fontWeight: 600, color: 'var(--theme-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
        >
          {field.label}
        </label>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Color swatch picker */}
        <div
          style={{
            position: 'relative',
            width: 40,
            height: 40,
            borderRadius: 8,
            overflow: 'hidden',
            border: '2px solid var(--theme-border-color, #383838)',
            flexShrink: 0,
            background: isValidHex(hex) ? hex : '#cccccc',
            cursor: 'pointer',
          }}
        >
          <input
            type="color"
            value={isValidHex(hex) ? hex : '#ffffff'}
            onChange={handleSwatchChange}
            style={{
              position: 'absolute',
              inset: 0,
              width: '200%',
              height: '200%',
              top: '-50%',
              left: '-50%',
              opacity: 0,
              cursor: 'pointer',
            }}
            aria-label={`Color swatch for ${field.label ?? field.name}`}
          />
        </div>

        {/* Hex text input */}
        <input
          id={id}
          type="text"
          value={hex}
          onChange={handleTextChange}
          placeholder="#000000"
          maxLength={9}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid var(--theme-border-color, #383838)',
            background: 'var(--theme-input-bg, #1e293b)',
            color: 'var(--theme-text, #f1f5f9)',
            fontFamily: 'monospace',
            fontSize: 14,
            outline: 'none',
          }}
          spellCheck={false}
          autoComplete="off"
        />

        {/* Live preview chip */}
        {isValidHex(hex) && (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: hex,
              border: '2px solid var(--theme-border-color, #383838)',
              flexShrink: 0,
            }}
            title={hex}
          />
        )}
      </div>

      {field.admin?.description && (
        <p style={{ fontSize: 11, color: 'var(--theme-text-secondary, #64748b)', margin: 0 }}>
          {field.admin.description}
        </p>
      )}
    </div>
  )
}

export default ColorPickerField
