'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useConfig } from '@payloadcms/ui'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Plugin {
  id: string
  name: string
  slug: string
  description?: string
  pluginType: string
  category?: string
  status: 'active' | 'inactive'
  version?: string
  author?: string
  autoActivate?: boolean
  icon?: { url: string } | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  'built-in':          'Built-in',
  'frontend-script':   'Frontend Script',
  'block-extension':   'Block Extension',
  'third-party-embed': 'Third-party Embed',
  'integration':       'Integration',
  'utility':           'Utility',
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'built-in':          { bg: '#e0f2fe', text: '#0369a1' },
  'frontend-script':   { bg: '#fef9c3', text: '#854d0e' },
  'block-extension':   { bg: '#ede9fe', text: '#6d28d9' },
  'third-party-embed': { bg: '#fce7f3', text: '#9d174d' },
  'integration':       { bg: '#dcfce7', text: '#166534' },
  'utility':           { bg: '#f3f4f6', text: '#374151' },
}

function isLocked(plugin: Plugin) {
  return plugin.pluginType === 'built-in' || plugin.autoActivate === true
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f3f4f6' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ width: '60%', height: '14px', borderRadius: '4px', background: '#f3f4f6' }} />
          <div style={{ width: '35%', height: '12px', borderRadius: '4px', background: '#f3f4f6' }} />
        </div>
        <div style={{ width: '40px', height: '22px', borderRadius: '999px', background: '#f3f4f6' }} />
      </div>
      <div style={{ width: '100%', height: '12px', borderRadius: '4px', background: '#f3f4f6' }} />
      <div style={{ width: '75%', height: '12px', borderRadius: '4px', background: '#f3f4f6' }} />
    </div>
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ active, locked, loading, onChange }: {
  active: boolean
  locked: boolean
  loading: boolean
  onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      disabled={locked || loading}
      title={locked ? 'This plugin cannot be deactivated' : active ? 'Deactivate' : 'Activate'}
      style={{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '999px',
        border: 'none',
        background: active ? '#171717' : '#d1d5db',
        cursor: locked ? 'not-allowed' : loading ? 'wait' : 'pointer',
        transition: 'background 0.2s ease',
        flexShrink: 0,
        opacity: loading ? 0.6 : 1,
      }}
      aria-checked={active}
      role="switch"
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: active ? '23px' : '3px',
        width: '18px',
        height: '18px',
        borderRadius: '999px',
        background: '#ffffff',
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

// ─── Plugin card ──────────────────────────────────────────────────────────────

function PluginCard({ plugin, onToggle, toggling }: {
  plugin: Plugin
  onToggle: (id: string, current: 'active' | 'inactive') => void
  toggling: boolean
}) {
  const locked = isLocked(plugin)
  const isActive = plugin.status === 'active'
  const typeStyle = TYPE_COLORS[plugin.pluginType] ?? TYPE_COLORS['utility']

  return (
    <div style={{
      background: '#ffffff',
      border: `1px solid ${isActive ? '#d4d4d4' : '#e5e7eb'}`,
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
      boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
      position: 'relative',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Icon */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          {plugin.icon?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={plugin.icon.url} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#9ca3af" />
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#9ca3af" />
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#9ca3af" />
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#9ca3af" />
            </svg>
          )}
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-sans, system-ui)',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111827',
              lineHeight: '20px',
            }}>
              {plugin.name}
            </span>
            {plugin.version && (
              <span style={{
                fontSize: '11px',
                color: '#9ca3af',
                fontFamily: 'var(--font-sans, system-ui)',
              }}>
                v{plugin.version}
              </span>
            )}
          </div>
          {plugin.author && (
            <span style={{
              fontSize: '12px',
              color: '#9ca3af',
              fontFamily: 'var(--font-sans, system-ui)',
              lineHeight: '16px',
            }}>
              by {plugin.author}
            </span>
          )}
        </div>

        {/* Toggle */}
        <Toggle
          active={isActive}
          locked={locked}
          loading={toggling}
          onChange={() => onToggle(plugin.id, plugin.status)}
        />
      </div>

      {/* Description */}
      {plugin.description && (
        <p style={{
          fontFamily: 'var(--font-sans, system-ui)',
          fontSize: '13px',
          color: '#6b7280',
          lineHeight: '20px',
          margin: 0,
        }}>
          {plugin.description}
        </p>
      )}

      {/* Footer: type badge + lock indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 500,
          fontFamily: 'var(--font-sans, system-ui)',
          background: typeStyle.bg,
          color: typeStyle.text,
          letterSpacing: '0.3px',
        }}>
          {TYPE_LABELS[plugin.pluginType] ?? plugin.pluginType}
        </span>

        {locked && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: '#9ca3af',
            fontFamily: 'var(--font-sans, system-ui)',
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1.5" y="4.5" width="7" height="5" rx="1" stroke="#9ca3af" strokeWidth="1" />
              <path d="M3 4.5V3a2 2 0 0 1 4 0v1.5" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
            </svg>
            {plugin.autoActivate ? 'Auto-activated' : 'System plugin'}
          </span>
        )}

        {isActive && !locked && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: '#16a34a',
            fontFamily: 'var(--font-sans, system-ui)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '999px', background: '#16a34a', display: 'inline-block' }} />
            Active
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PluginsActivationPage() {
  const { config } = useConfig()
  const serverURL = config.serverURL

  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toggling, setToggling] = useState<Record<string, boolean>>({})

  const fetchPlugins = useCallback(async () => {
    try {
      const res = await fetch(`${serverURL}/api/plugins?limit=100&sort=name`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch plugins')
      const data = await res.json()
      setPlugins(data.docs ?? [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [serverURL])

  useEffect(() => { fetchPlugins() }, [fetchPlugins])

  const handleToggle = useCallback(async (id: string, current: 'active' | 'inactive') => {
    const next = current === 'active' ? 'inactive' : 'active'
    setToggling((t) => ({ ...t, [id]: true }))
    try {
      const res = await fetch(`${serverURL}/api/plugins/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error('Toggle failed')
      setPlugins((prev) =>
        prev.map((p) => p.id === id ? { ...p, status: next } : p)
      )
    } catch {
      // revert on failure — refetch
      fetchPlugins()
    } finally {
      setToggling((t) => ({ ...t, [id]: false }))
    }
  }, [serverURL, fetchPlugins])

  const active = plugins.filter((p) => p.status === 'active')
  const inactive = plugins.filter((p) => p.status === 'inactive')

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      padding: '40px 48px',
      fontFamily: 'var(--font-sans, system-ui)',
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>

      {/* Page header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#111827',
          margin: '0 0 6px',
          lineHeight: '32px',
        }}>
          Plugin Manager
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '20px' }}>
          Activate or deactivate plugins. Frontend-script and third-party embed plugins inject code into every page.
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#b91c1c',
          fontSize: '14px',
          marginBottom: '24px',
        }}>
          {error}
        </div>
      )}

      {/* Stats bar */}
      {!loading && (
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Total', value: plugins.length, color: '#111827' },
            { label: 'Active', value: active.length, color: '#16a34a' },
            { label: 'Inactive', value: inactive.length, color: '#9ca3af' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              minWidth: '80px',
            }}>
              <span style={{ fontSize: '22px', fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Active plugins */}
      {!loading && active.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 16px' }}>
            Active — {active.length}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {active.map((p) => (
              <PluginCard
                key={p.id}
                plugin={p}
                onToggle={handleToggle}
                toggling={toggling[p.id] ?? false}
              />
            ))}
          </div>
        </section>
      )}

      {/* Inactive plugins */}
      {!loading && inactive.length > 0 && (
        <section>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 16px' }}>
            Inactive — {inactive.length}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {inactive.map((p) => (
              <PluginCard
                key={p.id}
                plugin={p}
                onToggle={handleToggle}
                toggling={toggling[p.id] ?? false}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && plugins.length === 0 && !error && (
        <div style={{
          textAlign: 'center',
          padding: '64px 24px',
          color: '#9ca3af',
          fontSize: '14px',
        }}>
          No plugins found. Add plugins via the Plugins collection.
        </div>
      )}
    </div>
  )
}
