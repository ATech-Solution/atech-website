'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { usePluginActive } from '@/hooks/usePluginActive'

export function BlocksNavLink() {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const isPluginActive = usePluginActive('layout-builder')

  useEffect(() => {
    setIsActive(window.location.pathname.startsWith('/admin/collections/blocks'))
  }, [])

  if ((user as any)?.email !== 'tan@atech.software') return null
  if (isPluginActive === null || !isPluginActive) return null

  return (
    <div style={{ padding: '0 8px', marginTop: '2px' }}>
      <a
        href="/admin/collections/blocks"
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
        {/* Layout blocks icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9" y="1.5" width="5.5" height="2.25" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9" y="5.25" width="5.5" height="1.75" rx="0.75" stroke="currentColor" strokeWidth="1.4" />
          <rect x="1.5" y="9" width="13" height="2.25" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <rect x="1.5" y="12.75" width="6" height="1.75" rx="0.75" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9.5" y="12.75" width="5" height="1.75" rx="0.75" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        Blocks
      </a>
    </div>
  )
}
