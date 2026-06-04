'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { usePluginActive } from '@/hooks/usePluginActive'

export function RedirectsNavLink() {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const isPluginActive = usePluginActive('redirects')

  useEffect(() => {
    setIsActive(window.location.pathname.startsWith('/admin/collections/redirects'))
  }, [])

  if ((user as any)?.email !== 'tan@atech.software') return null
  if (isPluginActive === null || !isPluginActive) return null

  return (
    <div style={{ padding: '0 8px', marginTop: '2px' }}>
      <a
        href="/admin/collections/redirects"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 12px',
          borderRadius: '6px',
          textDecoration: 'none',
          background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
          fontSize: '13.5px',
          fontWeight: isActive ? 600 : 400,
          fontFamily: 'var(--font-sans, system-ui)',
          transition: 'background 0.15s ease, color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = '#ffffff'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
          }
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2.5 8H10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M7.5 5L10.5 8L7.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.5 3V13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        Redirects
      </a>
    </div>
  )
}
