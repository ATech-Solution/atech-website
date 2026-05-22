'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

interface LocaleEntry {
  code: string
  label: string
}

export function AdminLocaleSwitcher() {
  const [locales, setLocales] = useState<LocaleEntry[]>([])
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = searchParams.get('locale') ?? 'en'

  useEffect(() => {
    fetch('/api/plugins/multilanguage/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((s) => {
        if (s.isActive && Array.isArray(s.activeLocales) && s.activeLocales.length > 0) {
          setLocales(s.activeLocales.filter((l: any) => l.enabled !== false))
        }
      })
      .catch(() => {})
  }, [])

  if (locales.length < 2) return null

  function switchLocale(code: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('locale', code)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div
      style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--theme-elevation-150)',
        marginTop: 4,
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          opacity: 0.5,
          color: 'var(--theme-text)',
          margin: '0 0 8px',
        }}
      >
        Active Locales
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {locales.map((l) => {
          const active = l.code === currentLocale
          return (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              title={l.label}
              style={{
                padding: '3px 10px',
                borderRadius: 5,
                border: '1px solid',
                borderColor: active ? 'var(--theme-text)' : 'var(--theme-elevation-150)',
                background: active ? 'var(--theme-text)' : 'transparent',
                color: active ? 'var(--theme-bg)' : 'var(--theme-text)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.15s',
              }}
            >
              {l.code.toUpperCase()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
