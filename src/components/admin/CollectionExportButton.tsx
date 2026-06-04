'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'

export function CollectionExportButton() {
  const { user } = useAuth()

  if ((user as any)?.email !== 'tan@atech.software') return null

  const getCollectionSlug = (): string | null => {
    if (typeof window === 'undefined') return null
    // URL pattern: /admin/collections/{slug}
    const match = window.location.pathname.match(/\/admin\/collections\/([^/]+)/)
    return match?.[1] ?? null
  }

  const handleClick = () => {
    const slug = getCollectionSlug()
    if (!slug) return
    window.location.href = `/admin/plugins/export-import?collection=${encodeURIComponent(slug)}`
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Export this collection"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        background: 'var(--theme-elevation-150, #222)',
        color: 'var(--theme-elevation-700, #aaa)',
        border: '1px solid var(--theme-elevation-200, #333)',
        borderRadius: '4px',
        padding: '5px 10px',
        fontSize: '12px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#ffffff'
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--theme-elevation-700, #aaa)'
        e.currentTarget.style.borderColor = 'var(--theme-elevation-200, #333)'
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M6.5 1v7M4 5.5l2.5 2.5 2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 10h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      Export
    </button>
  )
}
