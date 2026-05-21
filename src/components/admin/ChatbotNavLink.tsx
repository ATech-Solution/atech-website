'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { usePluginActive } from '@/hooks/usePluginActive'

export function ChatbotNavLink() {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const isPluginActive = usePluginActive('chatbot')

  useEffect(() => {
    setIsActive(
      window.location.pathname.startsWith('/admin/globals/chatbot-settings') ||
      window.location.pathname.startsWith('/admin/collections/chatbot-leads') ||
      window.location.pathname.startsWith('/admin/collections/chatbot-events'),
    )
  }, [])

  if ((user as any)?.email !== 'tan@atech.software') return null
  if (isPluginActive === null || !isPluginActive) return null

  return (
    <div style={{ padding: '0 8px', marginTop: '2px' }}>
      <a
        href="/admin/globals/chatbot-settings"
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
        <svg width="16" height="16" viewBox="50 26 700 700" fill="none" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M400 26.2c-193.3 0-350 156.7-350 350 0 136.2 77.9 254.3 191.5 312.1 15.4 8.1 31.4 15.1 48.1 20.8l-16.5 63.5c-2 7.8 5.4 14.7 13 12.1l229.8-77.6c14.6-5.3 28.8-11.6 42.4-18.7C672 630.6 750 512.5 750 376.2c0-193.3-156.7-350-350-350zm211.1 510.7c-10.8 26.5-41.9 77.2-121.5 77.2-79.9 0-110.9-51-121.6-77.4-2.8-6.8 5-13.4 13.8-11.8 76.2 13.7 147.7 13 215.3.3 8.9-1.8 16.8 4.8 14 11.7z"
            fill="currentColor"
          />
        </svg>
        Chatbot
      </a>
    </div>
  )
}
