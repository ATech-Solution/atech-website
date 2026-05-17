'use client'

import React, { useState } from 'react'

type RowData = { id?: string | number; slug?: string; title?: string }

// ── View + Duplicate cell — rendered in the Pages list table ─────────────────

export function PageRowActionsCell(props: any) {
  const [loading, setLoading] = useState(false)

  // Payload 3.x passes the full document via rowData
  const rowData: RowData = props.rowData ?? props.row?.original ?? {}
  const slug  = (rowData.slug  as string) ?? ''
  const id    = rowData.id
  const title = (rowData.title as string) ?? 'this page'

  const base    = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pageUrl = slug === 'home' ? base : `${base}/${slug}`

  const handleDuplicate = async () => {
    if (!id || loading) return
    if (!window.confirm(`Duplicate "${title}"?`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/pages/${id}/duplicate`, { method: 'POST' })
      if (res.ok) {
        window.location.reload()
      } else {
        const body = await res.json().catch(() => ({}))
        alert(body?.error ?? 'Duplicate failed. Please try again.')
      }
    } catch {
      alert('Duplicate failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'nowrap' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* View in new tab */}
      {slug && (
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open /${slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 9px',
            borderRadius: 4,
            border: '1px solid rgba(99,102,241,0.4)',
            background: 'rgba(99,102,241,0.08)',
            color: '#a5b4fc',
            fontSize: 11,
            fontWeight: 500,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            lineHeight: '18px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8M8 1h3v3M5 7l6-6" />
          </svg>
          View
        </a>
      )}

      {/* Duplicate */}
      <button
        type="button"
        disabled={!id || loading}
        title="Duplicate this page as a draft"
        onClick={(e) => { e.stopPropagation(); void handleDuplicate() }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 9px',
          borderRadius: 4,
          border: '1px solid rgba(234,179,8,0.4)',
          background: 'rgba(234,179,8,0.06)',
          color: '#fbbf24',
          fontSize: 11,
          fontWeight: 500,
          cursor: id && !loading ? 'pointer' : 'not-allowed',
          opacity: id && !loading ? 1 : 0.5,
          whiteSpace: 'nowrap',
          lineHeight: '18px',
          transition: 'opacity 0.15s',
        }}
      >
        {loading ? (
          '…'
        ) : (
          <>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="4" width="7" height="7" rx="1" />
              <path d="M2 8H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
            </svg>
            Duplicate
          </>
        )}
      </button>
    </div>
  )
}

// No-op — the UI field doesn't need a form field in the document editor
export function PageRowActionsField() {
  return null
}
