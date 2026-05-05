'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'

// ── Slug helpers ─────────────────────────────────────────────────────────────

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special chars
    .replace(/[\s_]+/g, '-')    // spaces / underscores → hyphens
    .replace(/-{2,}/g, '-')     // collapse multiple hyphens
    .replace(/^-+|-+$/g, '')    // trim leading/trailing hyphens
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SlugFieldAdminConfig {
  description?: string
  placeholder?: string
  custom?: {
    /** Which field value to generate the slug from. Default: 'title' */
    watchField?: string
    /** URL prefix shown in the preview bar. Default: '/' */
    urlPrefix?: string
  }
}

interface SlugFieldProps {
  field: {
    name: string
    label?: string
    required?: boolean
    admin?: SlugFieldAdminConfig
  }
  [key: string]: unknown
}

export function SlugField({ field }: SlugFieldProps) {
  const watchField  = field.admin?.custom?.watchField  ?? 'title'
  const urlPrefix   = field.admin?.custom?.urlPrefix   ?? '/'
  const placeholder = field.admin?.placeholder ?? 'auto-generated-from-title'
  const inputId     = useId()

  // Current document — if it has an `id`, we're editing an existing doc
  const { id: docId } = useDocumentInfo()

  // Slug field value + setter
  const { value: slug, setValue: setSlug } = useField<string>({ path: field.name })

  // Source field value (title / name / whatever watchField points to)
  const sourceValue = useFormFields(
    ([fields]) => (fields[watchField] as any)?.value as string ?? '',
  )

  // Auto mode: true = generate from source, false = user is in control
  // New doc with no slug → auto; existing doc → locked
  const [isAuto, setIsAuto] = useState<boolean>(!docId && !slug)
  const prevSourceRef = useRef<string>(sourceValue)

  // Re-evaluate auto mode when docId becomes available (first render)
  useEffect(() => {
    if (!docId && !slug) setIsAuto(true)
  }, [docId, slug])

  // When source changes in auto mode, regenerate
  useEffect(() => {
    if (!isAuto) return
    const generated = toSlug(sourceValue)
    if (generated !== slug) setSlug(generated)
    prevSourceRef.current = sourceValue
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceValue, isAuto])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSlug(e.target.value)
      setIsAuto(false) // any manual edit disables auto
    },
    [setSlug],
  )

  const handleGenerate = useCallback(() => {
    const generated = toSlug(sourceValue)
    if (generated) {
      setSlug(generated)
      setIsAuto(true)
    }
  }, [sourceValue, setSlug])

  const toggleAuto = useCallback(() => {
    setIsAuto((prev) => {
      if (!prev) {
        // Switching back to auto → regenerate now
        const generated = toSlug(sourceValue)
        if (generated) setSlug(generated)
      }
      return !prev
    })
  }, [sourceValue, setSlug])

  const currentSlug = (slug as string) ?? ''
  const previewUrl  = `${urlPrefix}${currentSlug}`

  return (
    <div className="slug-field-wrapper" style={{ marginBottom: 24 }}>
      {/* ── Label row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label
          htmlFor={inputId}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--theme-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {field.label ?? 'Slug'}
          {field.required && (
            <span style={{ color: 'var(--theme-error, #ef4444)', fontSize: 11 }}>*</span>
          )}
        </label>

        {/* Auto/Manual toggle */}
        <button
          type="button"
          onClick={toggleAuto}
          title={isAuto ? 'Auto-generating from title — click to edit manually' : 'Manual mode — click to re-enable auto-generation'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 9px',
            borderRadius: 20,
            border: '1px solid',
            borderColor: isAuto ? 'rgba(34,197,94,0.45)' : 'var(--theme-border-color, #383838)',
            background: isAuto ? 'rgba(34,197,94,0.12)' : 'transparent',
            color: isAuto ? '#4ade80' : 'var(--theme-text-secondary, #9ca3af)',
            fontSize: 10,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'all 0.15s',
          }}
        >
          {isAuto ? (
            <>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
                <path d="M4.5 0C2.015 0 0 2.015 0 4.5S2.015 9 4.5 9 9 6.985 9 4.5 6.985 0 4.5 0zm.5 6.5h-1V4h1v2.5zm0-3.5h-1V2h1v1z"/>
              </svg>
              Auto
            </>
          ) : (
            <>
              <svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor">
                <path d="M7 4H6V2.5C6 1.12 4.88 0 3.5 0S1 1.12 1 2.5V4H0v6h9V4H7zm-4 0V2.5c0-.83.67-1.5 1.5-1.5S6 1.67 6 2.5V4H3z"/>
              </svg>
              Manual
            </>
          )}
        </button>
      </div>

      {/* ── Input row ── */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          {/* Prefix hint inside input */}
          {urlPrefix && urlPrefix !== '/' && (
            <span
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 12,
                color: 'var(--theme-text-secondary, #9ca3af)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {urlPrefix}
            </span>
          )}
          <input
            id={inputId}
            type="text"
            value={currentSlug}
            onChange={handleChange}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: urlPrefix && urlPrefix !== '/' ? `8px 10px 8px ${urlPrefix.length * 7.5 + 12}px` : '8px 10px',
              borderRadius: 6,
              border: `1px solid ${isAuto ? 'rgba(34,197,94,0.3)' : 'var(--theme-border-color, #383838)'}`,
              background: 'var(--theme-input-bg, #1e293b)',
              color: 'var(--theme-text, #f1f5f9)',
              fontSize: 13,
              fontFamily: 'ui-monospace, monospace',
              outline: 'none',
              transition: 'border-color 0.15s',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!sourceValue}
          title={`Generate slug from "${watchField}" field`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '0 12px',
            height: 36,
            borderRadius: 6,
            border: '1px solid var(--theme-border-color, #383838)',
            background: 'var(--theme-elevation-100, #1e293b)',
            color: 'var(--theme-text, #f1f5f9)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s, border-color 0.15s',
            opacity: sourceValue ? 1 : 0.45,
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 6A4.5 4.5 0 1 1 6 1.5" />
            <path d="M10.5 1.5v3h-3" />
          </svg>
          Generate
        </button>
      </div>

      {/* ── URL preview bar ── */}
      {currentSlug && (
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            borderRadius: 6,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8M8 1h3v3M5 7l6-6" />
          </svg>
          <span
            style={{
              fontSize: 11,
              color: '#a5b4fc',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.01em',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {previewUrl}
          </span>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(previewUrl)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6366f1',
              padding: '0 2px',
              fontSize: 10,
              opacity: 0.7,
            }}
            title="Copy URL"
          >
            Copy
          </button>
        </div>
      )}

      {/* Description */}
      {field.admin?.description && (
        <p style={{ marginTop: 6, fontSize: 11, color: 'var(--theme-text-secondary, #64748b)', margin: '6px 0 0' }}>
          {field.admin.description}
        </p>
      )}
    </div>
  )
}

export default SlugField
