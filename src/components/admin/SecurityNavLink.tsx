'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { usePluginActive } from '@/hooks/usePluginActive'

export function SecurityNavLink() {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const isPluginActive = usePluginActive('security')

  useEffect(() => {
    setIsActive(window.location.pathname.startsWith('/admin/security'))
  }, [])

  if ((user as any)?.email !== 'tan@atech.software') return null
  if (isPluginActive === null || !isPluginActive) return null

  return (
    <div style={{ padding: '0 8px', marginTop: '2px' }}>
      <a
        href="/admin/security"
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
          <path
            d="M8 1.5L2.5 4V8.5C2.5 11.5 5 13.8 8 14.5C11 13.8 13.5 11.5 13.5 8.5V4L8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Security
      </a>
    </div>
  )
}
