'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'

// Maps plugin slug → { label, href } for the sub-nav links
const PLUGIN_PATHS: Record<string, { label: string; href: string }> = {
  'layout-builder':  { label: 'Layout Builder',  href: '/admin/layout-builder' },
  'backup-restore':  { label: 'Backup & Restore', href: '/admin/plugins/backup' },
  'chatbot':         { label: 'Chatbot',           href: '/admin/globals/chatbot-settings' },
  'export-import':   { label: 'Export & Import',   href: '/admin/plugins/export-import' },
  'form-builder':    { label: 'Form Builder',       href: '/admin/plugins/form-builder' },
  'multilanguage':   { label: 'Multilanguage',     href: '/admin/plugins/multilanguage' },
  'performance':     { label: 'Performance',       href: '/admin/globals/performance-settings' },
  'seo':             { label: 'SEO',               href: '/admin/globals/settings?tab=1' },
  'forms':           { label: 'Forms',             href: '/admin/collections/forms' },
  'redirects':       { label: 'Redirects',         href: '/admin/collections/redirects' },
  'search':          { label: 'Search',            href: '/admin/collections/search' },
  'security':        { label: 'Security',          href: '/admin/security' },
}

interface PluginItem {
  slug: string
  name: string
  status: string
}

export function PluginNavLink() {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const [plugins, setPlugins] = useState<PluginItem[]>([])
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    const p = window.location.pathname
    setCurrentPath(p)
    setIsActive(p.startsWith('/admin/plugins-activation'))
  }, [])

  useEffect(() => {
    fetch('/api/plugins?limit=100&depth=0')
      .then((r) => r.json())
      .then((data) => {
        const docs: PluginItem[] = (data.docs ?? []).filter(
          (d: any) => d.status === 'active' && PLUGIN_PATHS[d.slug],
        )
        // Sort by the label defined in PLUGIN_PATHS
        docs.sort((a, b) =>
          (PLUGIN_PATHS[a.slug]?.label ?? '').localeCompare(PLUGIN_PATHS[b.slug]?.label ?? ''),
        )
        setPlugins(docs)
      })
      .catch(() => {})
  }, [])

  if ((user as any)?.email !== 'tan@atech.software') return null

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13.5px',
    fontFamily: 'var(--font-sans, system-ui)',
    transition: 'background 0.15s ease, color 0.15s ease',
  }

  return (
    <div style={{ padding: '0 8px', marginTop: '2px' }}>
      {/* ── Main Plugins link ── */}
      <a
        href="/admin/plugins-activation"
        style={{
          ...baseStyle,
          background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
          fontWeight: isActive ? 600 : 400,
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

      {/* ── Sub-links: one per installed active plugin ── */}
      {plugins.length > 0 && (
        <div style={{ marginTop: 2, paddingLeft: 16 }}>
          {plugins.map((plugin) => {
            const meta = PLUGIN_PATHS[plugin.slug]!
            const isCurrent = currentPath.startsWith(meta.href.split('?')[0])
            return (
              <a
                key={plugin.slug}
                href={meta.href}
                style={{
                  ...baseStyle,
                  padding: '5px 12px',
                  fontSize: '12.5px',
                  background: isCurrent ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: isCurrent ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  fontWeight: isCurrent ? 500 : 400,
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'currentColor',
                    flexShrink: 0,
                    opacity: 0.6,
                  }}
                />
                {meta.label}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
