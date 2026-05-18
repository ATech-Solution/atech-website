'use client'

import React, { useEffect, useState } from 'react'

export function PluginNavLink() {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(window.location.pathname.startsWith('/admin/plugins-activation'))
  }, [])

  return (
    <div style={{ padding: '0 8px', marginTop: '2px' }}>
      <a
        href="/admin/plugins-activation"
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
          <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity="0.9" />
          <rect x="9.5" y="1" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity="0.9" />
          <rect x="1" y="9.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity="0.9" />
          <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity="0.9" />
        </svg>
        Plugins
      </a>
    </div>
  )
}
