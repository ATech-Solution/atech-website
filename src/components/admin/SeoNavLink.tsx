'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { usePluginActive } from '@/hooks/usePluginActive'

export function SeoNavLink() {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const isPluginActive = usePluginActive('seo')

  useEffect(() => {
    setIsActive(window.location.pathname.startsWith('/admin/globals/settings'))
  }, [])

  if ((user as any)?.email !== 'tan@atech.software') return null
  if (isPluginActive === null || !isPluginActive) return null

  return (
    <div style={{ padding: '0 8px', marginTop: '2px' }}>
      <a
        href="/admin/globals/settings?tab=1"
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
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        SEO Settings
      </a>
    </div>
  )
}
