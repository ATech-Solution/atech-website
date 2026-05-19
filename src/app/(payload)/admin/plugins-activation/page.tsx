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
  scriptCode?: string
  settings?: Record<string, unknown> | null
  features?: Array<{ featureName: string; featureDescription?: string; featureType?: string; id?: string }>
  icon?: { url: string } | null
}

type FormData = Omit<Plugin, 'id' | 'icon'>

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

const PLUGIN_TYPES = [
  { label: 'Built-in',           value: 'built-in' },
  { label: 'Frontend Script',    value: 'frontend-script' },
  { label: 'Block Extension',    value: 'block-extension' },
  { label: 'Third-party Embed',  value: 'third-party-embed' },
  { label: 'Integration',        value: 'integration' },
  { label: 'Utility',            value: 'utility' },
]

const CATEGORIES = [
  { label: 'Layout',    value: 'layout' },
  { label: 'Content',   value: 'content' },
  { label: 'Media',     value: 'media' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'SEO',       value: 'seo' },
  { label: 'Ecommerce', value: 'ecommerce' },
  { label: 'Utility',   value: 'utility' },
]

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function isSystemPlugin(plugin: Plugin) {
  return plugin.pluginType === 'built-in'
}

const EMPTY_FORM: FormData = {
  name: '',
  slug: '',
  description: '',
  pluginType: 'utility',
  category: 'utility',
  status: 'inactive',
  version: '',
  author: '',
  autoActivate: false,
  scriptCode: '',
  settings: null,
  features: [],
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

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

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ active, locked, loading, onChange }: {
  active: boolean; locked: boolean; loading: boolean; onChange: () => void
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

function PluginCard({ plugin, onToggle, toggling, onEdit, onDelete }: {
  plugin: Plugin
  onToggle: (id: string, current: 'active' | 'inactive') => void
  toggling: boolean
  onEdit: (plugin: Plugin) => void
  onDelete: (plugin: Plugin) => void
}) {
  const isSystem = isSystemPlugin(plugin)
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
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

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-sans, system-ui)', fontSize: '14px', fontWeight: 600, color: '#111827', lineHeight: '20px' }}>
              {plugin.name}
            </span>
            {plugin.version && (
              <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--font-sans, system-ui)' }}>
                v{plugin.version}
              </span>
            )}
          </div>
          {plugin.author && (
            <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'var(--font-sans, system-ui)', lineHeight: '16px' }}>
              by {plugin.author}
            </span>
          )}
        </div>

        <Toggle
          active={isActive}
          locked={false}
          loading={toggling}
          onChange={() => onToggle(plugin.id, plugin.status)}
        />
      </div>

      {/* Description */}
      {plugin.description && (
        <p style={{ fontFamily: 'var(--font-sans, system-ui)', fontSize: '13px', color: '#6b7280', lineHeight: '20px', margin: 0 }}>
          {plugin.description}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
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

          {isSystem && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--font-sans, system-ui)' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1.5" y="4.5" width="7" height="5" rx="1" stroke="#9ca3af" strokeWidth="1" />
                <path d="M3 4.5V3a2 2 0 0 1 4 0v1.5" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
              </svg>
              System plugin
            </span>
          )}

          {!isSystem && plugin.autoActivate && (
            <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--font-sans, system-ui)' }}>
              Auto-activated
            </span>
          )}

          {isActive && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16a34a', fontFamily: 'var(--font-sans, system-ui)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '999px', background: '#16a34a', display: 'inline-block' }} />
              Active
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <IconButton
            title="Edit plugin"
            onClick={() => onEdit(plugin)}
            hoverStyle={{ background: '#f3f4f6', color: '#111827', borderColor: '#d1d5db' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M9.5 1.5L11.5 3.5M1.5 11.5L2.5 8.5L8.5 2.5L10.5 4.5L4.5 10.5L1.5 11.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>

          {!isSystem && (
            <IconButton
              title="Delete plugin"
              onClick={() => onDelete(plugin)}
              hoverStyle={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3.5H11M4.5 3.5V2.5C4.5 2 4.8 1.5 5.5 1.5H7.5C8.2 1.5 8.5 2 8.5 2.5V3.5M5 6V9.5M8 6V9.5M3 3.5L3.5 10.5C3.5 11 4 11.5 4.5 11.5H8.5C9 11.5 9.5 11 9.5 10.5L10 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconButton>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Icon button helper ───────────────────────────────────────────────────────

function IconButton({ title, onClick, hoverStyle, children }: {
  title: string
  onClick: () => void
  hoverStyle: { background: string; color: string; borderColor: string }
  children: React.ReactNode
}) {
  const base: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    background: 'transparent',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'background 0.1s ease, color 0.1s ease, border-color 0.1s ease',
  }
  return (
    <button
      title={title}
      onClick={onClick}
      style={base}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyle)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#6b7280'
        e.currentTarget.style.borderColor = '#e5e7eb'
      }}
    >
      {children}
    </button>
  )
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  fontSize: '13px',
  fontFamily: 'var(--font-sans, system-ui)',
  color: '#111827',
  background: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '30px',
}

function FormField({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', fontFamily: 'var(--font-sans, system-ui)' }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--font-sans, system-ui)' }}>{hint}</span>}
    </div>
  )
}

// ─── Edit / Create Drawer ─────────────────────────────────────────────────────

function EditDrawer({ open, mode, plugin, onClose, onSave, saving }: {
  open: boolean
  mode: 'create' | 'edit'
  plugin: Plugin | null
  onClose: () => void
  onSave: (data: FormData) => Promise<void>
  saving: boolean
}) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [settingsRaw, setSettingsRaw] = useState('')
  const [settingsError, setSettingsError] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && plugin) {
      setForm({
        name: plugin.name,
        slug: plugin.slug,
        description: plugin.description ?? '',
        pluginType: plugin.pluginType,
        category: plugin.category ?? 'utility',
        status: plugin.status,
        version: plugin.version ?? '',
        author: plugin.author ?? '',
        autoActivate: plugin.autoActivate ?? false,
        scriptCode: plugin.scriptCode ?? '',
        settings: plugin.settings ?? null,
        features: plugin.features ?? [],
      })
      setSettingsRaw(plugin.settings ? JSON.stringify(plugin.settings, null, 2) : '')
      setSlugTouched(true)
    } else {
      setForm(EMPTY_FORM)
      setSettingsRaw('')
      setSlugTouched(false)
    }
    setSettingsError('')
  }, [open, mode, plugin])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleNameChange = (value: string) => {
    set('name', value)
    if (!slugTouched) set('slug', slugify(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let parsedSettings = form.settings
    if (settingsRaw.trim()) {
      try {
        parsedSettings = JSON.parse(settingsRaw)
        setSettingsError('')
      } catch {
        setSettingsError('Invalid JSON — please fix before saving')
        return
      }
    } else {
      parsedSettings = null
    }
    await onSave({ ...form, settings: parsedSettings })
  }

  const showScriptCode = form.pluginType === 'frontend-script' || form.pluginType === 'third-party-embed'
  const isBuiltIn = form.pluginType === 'built-in'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(2px)',
          zIndex: 999,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '480px',
        maxWidth: '100vw',
        height: '100vh',
        background: '#ffffff',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        zIndex: 1000,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0, fontFamily: 'var(--font-sans, system-ui)' }}>
            {mode === 'create' ? 'Add Plugin' : 'Edit Plugin'}
          </h2>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '6px',
              border: '1px solid #e5e7eb', background: 'transparent', cursor: 'pointer', color: '#6b7280',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable form body */}
        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {mode === 'edit' && isBuiltIn && (
            <div style={{
              background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '8px',
              padding: '12px 14px', fontSize: '12px', color: '#92400e',
              fontFamily: 'var(--font-sans, system-ui)', lineHeight: '18px',
            }}>
              This is a system plugin. Slug is read-only.
            </div>
          )}

          <FormField label="Plugin Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="My Plugin"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#111827')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
          </FormField>

          <FormField label="Slug" required hint="Unique identifier, auto-generated from name.">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); set('slug', e.target.value) }}
              required
              placeholder="my-plugin"
              style={{ ...inputStyle, fontFamily: 'monospace' }}
              onFocus={(e) => (e.target.style.borderColor = '#111827')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="What does this plugin do?"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '20px' }}
              onFocus={(e) => (e.target.style.borderColor = '#111827')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField label="Plugin Type">
              <select
                value={form.pluginType}
                onChange={(e) => set('pluginType', e.target.value)}
                style={selectStyle}
              >
                {PLUGIN_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Category">
              <select
                value={form.category ?? 'utility'}
                onChange={(e) => set('category', e.target.value)}
                style={selectStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as 'active' | 'inactive')}
                style={selectStyle}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormField>

            <FormField label="Version">
              <input
                type="text"
                value={form.version ?? ''}
                onChange={(e) => set('version', e.target.value)}
                placeholder="1.0.0"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#111827')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
              />
            </FormField>

            <FormField label="Author">
              <input
                type="text"
                value={form.author ?? ''}
                onChange={(e) => set('author', e.target.value)}
                placeholder="Author"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#111827')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="autoActivate"
              checked={form.autoActivate ?? false}
              onChange={(e) => set('autoActivate', e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#111827' }}
            />
            <label htmlFor="autoActivate" style={{ fontSize: '13px', color: '#374151', fontFamily: 'var(--font-sans, system-ui)', cursor: 'pointer' }}>
              Auto-activate on install
            </label>
          </div>

          {showScriptCode && (
            <FormField label="Script / Embed Code" hint="Inline HTML/JS injected into every frontend page.">
              <textarea
                value={form.scriptCode ?? ''}
                onChange={(e) => set('scriptCode', e.target.value)}
                placeholder={'<script>/* your code */</script>'}
                rows={6}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '20px', fontFamily: 'monospace', fontSize: '12px' }}
                onFocus={(e) => (e.target.style.borderColor = '#111827')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
              />
            </FormField>
          )}

          <FormField label="Settings (JSON)" hint="Optional plugin configuration as key-value pairs.">
            <textarea
              value={settingsRaw}
              onChange={(e) => { setSettingsRaw(e.target.value); setSettingsError('') }}
              placeholder={'{\n  "key": "value"\n}'}
              rows={5}
              style={{
                ...inputStyle,
                resize: 'vertical',
                lineHeight: '20px',
                fontFamily: 'monospace',
                fontSize: '12px',
                borderColor: settingsError ? '#ef4444' : '#e5e7eb',
              }}
              onFocus={(e) => (e.target.style.borderColor = settingsError ? '#ef4444' : '#111827')}
              onBlur={(e) => (e.target.style.borderColor = settingsError ? '#ef4444' : '#e5e7eb')}
            />
            {settingsError && (
              <span style={{ fontSize: '11px', color: '#ef4444', fontFamily: 'var(--font-sans, system-ui)' }}>{settingsError}</span>
            )}
          </FormField>
        </form>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px',
          padding: '16px 24px', borderTop: '1px solid #e5e7eb', flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb',
              background: 'transparent', fontSize: '13px', fontFamily: 'var(--font-sans, system-ui)',
              fontWeight: 500, color: '#374151', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saving}
            style={{
              padding: '8px 20px', borderRadius: '6px', border: 'none',
              background: saving ? '#9ca3af' : '#111827',
              fontSize: '13px', fontFamily: 'var(--font-sans, system-ui)', fontWeight: 500,
              color: '#ffffff', cursor: saving ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {saving && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {mode === 'create' ? 'Add Plugin' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Delete dialog ────────────────────────────────────────────────────────────

function DeleteDialog({ plugin, onClose, onConfirm, deleting }: {
  plugin: Plugin | null; onClose: () => void; onConfirm: () => void; deleting: boolean
}) {
  if (!plugin) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(2px)', zIndex: 1100,
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#ffffff', borderRadius: '12px', padding: '28px',
        width: '400px', maxWidth: 'calc(100vw - 48px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 1101,
        fontFamily: 'var(--font-sans, system-ui)',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px', background: '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L18.5 17H1.5L10 2Z" stroke="#dc2626" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10 8V11" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="14" r="0.75" fill="#dc2626" stroke="#dc2626" />
          </svg>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>
          Delete plugin?
        </h3>
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '20px', margin: '0 0 24px' }}>
          <strong style={{ color: '#374151' }}>{plugin.name}</strong> will be permanently removed from the system. This cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={deleting}
            style={{
              padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb',
              background: 'transparent', fontSize: '13px', fontWeight: 500, color: '#374151', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{
              padding: '8px 20px', borderRadius: '6px', border: 'none',
              background: deleting ? '#9ca3af' : '#dc2626',
              fontSize: '13px', fontWeight: 500, color: '#ffffff',
              cursor: deleting ? 'wait' : 'pointer',
            }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onDismiss }: { message: string; type: 'success' | 'error'; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      padding: '12px 16px',
      background: type === 'success' ? '#111827' : '#dc2626',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '13px',
      fontFamily: 'var(--font-sans, system-ui)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      maxWidth: '360px',
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onDismiss}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0, fontSize: '16px', lineHeight: 1 }}
      >
        ×
      </button>
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

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create')
  const [drawerPlugin, setDrawerPlugin] = useState<Plugin | null>(null)
  const [saving, setSaving] = useState(false)

  const [deletePlugin, setDeletePlugin] = useState<Plugin | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    setToast({ message, type })

  const fetchPlugins = useCallback(async () => {
    try {
      const res = await fetch(`${serverURL}/api/plugins?limit=100&sort=name`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch plugins')
      const data = await res.json()
      setPlugins(data.docs ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
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
      setPlugins((prev) => prev.map((p) => p.id === id ? { ...p, status: next } : p))
      showToast(`Plugin ${next === 'active' ? 'activated' : 'deactivated'}`)
    } catch {
      showToast('Failed to toggle plugin status', 'error')
      fetchPlugins()
    } finally {
      setToggling((t) => ({ ...t, [id]: false }))
    }
  }, [serverURL, fetchPlugins])

  const handleEdit = (plugin: Plugin) => {
    setDrawerPlugin(plugin)
    setDrawerMode('edit')
    setDrawerOpen(true)
  }

  const handleCreate = () => {
    setDrawerPlugin(null)
    setDrawerMode('create')
    setDrawerOpen(true)
  }

  const handleSave = async (data: FormData) => {
    setSaving(true)
    try {
      if (drawerMode === 'create') {
        const res = await fetch(`${serverURL}/api/plugins`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.errors?.[0]?.message ?? 'Create failed')
        }
        showToast('Plugin created')
      } else {
        const res = await fetch(`${serverURL}/api/plugins/${drawerPlugin!.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.errors?.[0]?.message ?? 'Update failed')
        }
        showToast('Plugin updated')
      }
      setDrawerOpen(false)
      await fetchPlugins()
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletePlugin) return
    setDeleting(true)
    try {
      const res = await fetch(`${serverURL}/api/plugins/${deletePlugin.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Delete failed')
      setPlugins((prev) => prev.filter((p) => p.id !== deletePlugin.id))
      setDeletePlugin(null)
      showToast(`"${deletePlugin.name}" deleted`)
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const active = plugins.filter((p) => p.status === 'active')
  const inactive = plugins.filter((p) => p.status === 'inactive')

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      padding: '40px 48px',
      fontFamily: 'var(--font-sans, system-ui)',
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '36px', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 6px', lineHeight: '32px' }}>
            Plugin Manager
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '20px' }}>
            Activate, deactivate, edit, or remove plugins from this panel.
          </p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '8px', border: 'none',
            background: '#111827', color: '#ffffff',
            fontSize: '13px', fontFamily: 'var(--font-sans, system-ui)', fontWeight: 500,
            cursor: 'pointer', flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#1f2937')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#111827')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5V12.5M1.5 7H12.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          Add Plugin
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
          padding: '12px 16px', color: '#b91c1c', fontSize: '14px', marginBottom: '24px',
        }}>
          {error}
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total',    value: plugins.length, color: '#111827' },
            { label: 'Active',   value: active.length,  color: '#16a34a' },
            { label: 'Inactive', value: inactive.length, color: '#9ca3af' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px',
              padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '80px',
            }}>
              <span style={{ fontSize: '22px', fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Active section */}
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
                onEdit={handleEdit}
                onDelete={setDeletePlugin}
              />
            ))}
          </div>
        </section>
      )}

      {/* Inactive section */}
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
                onEdit={handleEdit}
                onDelete={setDeletePlugin}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && plugins.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9ca3af', fontSize: '14px' }}>
          No plugins found.{' '}
          <button
            onClick={handleCreate}
            style={{ color: '#111827', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
          >
            Add your first plugin
          </button>
        </div>
      )}

      <EditDrawer
        open={drawerOpen}
        mode={drawerMode}
        plugin={drawerPlugin}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        saving={saving}
      />

      <DeleteDialog
        plugin={deletePlugin}
        onClose={() => setDeletePlugin(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}
