'use client'

import React, { useCallback, useState } from 'react'
import { useField, useDocumentInfo, useLocale } from '@payloadcms/ui'

interface Props {
  path: string
}

export function SeoGenerateButton({ path }: Props) {
  const { setValue } = useField<string>({ path })
  const { id, collectionSlug } = useDocumentInfo()
  const { code: locale } = useLocale()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Map Payload field path to API field type
  const fieldKey = path.replace(/^.*?(meta\.(title|description|ogTitle|ogDescription)|seo\.llmsEntry)$/, '$1') as
    | 'meta.title'
    | 'meta.description'
    | 'meta.ogTitle'
    | 'meta.ogDescription'
    | 'seo.llmsEntry'

  const handleGenerate = useCallback(async () => {
    if (!id || !collectionSlug) {
      setError('Save the document first to enable generation.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionSlug, docId: id, field: fieldKey, locale }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      setValue(data.value)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [id, collectionSlug, fieldKey, locale, setValue])

  return (
    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          fontSize: '12px',
          fontFamily: 'var(--font-sans, system-ui)',
          fontWeight: 500,
          borderRadius: '5px',
          border: '1px solid rgba(255,255,255,0.15)',
          background: loading ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.15)',
          color: loading ? 'rgba(255,255,255,0.35)' : '#a5b4fc',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = 'rgba(99,102,241,0.28)'
            e.currentTarget.style.color = '#c7d2fe'
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
            e.currentTarget.style.color = '#a5b4fc'
          }
        }}
      >
        {loading ? (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="14 7" />
            </svg>
            Generating…
          </>
        ) : (
          <>✨ Generate</>
        )}
      </button>
      {error && (
        <span style={{ fontSize: '11px', color: '#f87171' }}>{error}</span>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
