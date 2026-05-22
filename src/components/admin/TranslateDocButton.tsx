'use client'

import React, { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

const LOCALE_OPTIONS = [
  { code: 'zh-hk', label: '繁體中文 (zh-hk)' },
  { code: 'zh-cn', label: '简体中文 (zh-cn)' },
  { code: 'id',    label: 'Indonesian (id)' },
]

type Status = 'idle' | 'translating' | 'done' | 'error'

export function TranslateDocButton() {
  const { id, collectionSlug, globalSlug } = useDocumentInfo() as any
  const [selected, setSelected] = useState<string[]>(LOCALE_OPTIONS.map((l) => l.code))
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<string>('')

  // Don't render if no doc ID (new unsaved doc) and not a global
  if (!id && !globalSlug) return null

  const toggle = (code: string) =>
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )

  const handleTranslate = async () => {
    if (selected.length === 0 || status === 'translating') return
    setStatus('translating')
    setResult('')

    try {
      const body: Record<string, unknown> = { targetLocales: selected }
      if (globalSlug) {
        body.globalSlug = globalSlug
      } else {
        body.collection = collectionSlug
        body.id = id
      }

      const res = await fetch('/api/plugins/multilanguage/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setResult(data.error ?? 'Translation failed')
        return
      }

      const drafted = Object.entries(data.translated ?? {})
        .filter(([, v]) => v === 'draft')
        .map(([loc]) => loc)
      const errors = Object.keys(data.errors ?? {})

      if (drafted.length > 0 && errors.length === 0) {
        setResult(`✓ ${drafted.join(', ')} saved as draft`)
        setStatus('done')
      } else if (drafted.length > 0) {
        setResult(`Partial: ${drafted.join(', ')} ok · errors: ${errors.join(', ')}`)
        setStatus('done')
      } else {
        setResult(errors.join(', ') || 'No changes saved')
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
      setResult(err instanceof Error ? err.message : 'Network error')
    }
  }

  const panelStyle: React.CSSProperties = {
    marginTop: 16,
    padding: '14px 16px',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#fafafa',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#6b7280',
    marginBottom: 10,
    display: 'block',
  }

  const checkboxRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 12,
  }

  const btnStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '7px 12px',
    borderRadius: 6,
    border: 'none',
    background: selected.length === 0 || status === 'translating' ? '#d1d5db' : '#2563eb',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    cursor: selected.length === 0 || status === 'translating' ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s',
  }

  return (
    <div style={panelStyle}>
      <span style={labelStyle}>🌐 AI Translate</span>

      <div style={checkboxRowStyle}>
        {LOCALE_OPTIONS.map((opt) => (
          <label
            key={opt.code}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151' }}
          >
            <input
              type="checkbox"
              checked={selected.includes(opt.code)}
              onChange={() => toggle(opt.code)}
              style={{ margin: 0 }}
            />
            {opt.label}
          </label>
        ))}
      </div>

      <button
        type="button"
        style={btnStyle}
        disabled={selected.length === 0 || status === 'translating'}
        onClick={handleTranslate}
      >
        {status === 'translating' ? 'Translating…' : 'Translate Now'}
      </button>

      {result && (
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: status === 'error' ? '#dc2626' : '#16a34a',
            lineHeight: 1.4,
          }}
        >
          {result}
        </p>
      )}

      {status === 'done' && (
        <p style={{ marginTop: 4, fontSize: 11, color: '#9ca3af' }}>
          Review & publish each locale in the locale switcher above.
        </p>
      )}
    </div>
  )
}
