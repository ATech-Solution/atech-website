'use client'

import React, { useEffect, useState, useCallback } from 'react'

type LocaleStatus = { total: number; translated: number }
type TranslationResults = Record<string, Record<string, LocaleStatus>>

interface StatusData {
  locales: string[]
  results: TranslationResults
}

const COLLECTION_LABELS: Record<string, string> = {
  pages: 'Pages',
  posts: 'Blog Posts',
  portfolio: 'Portfolio',
  faqs: 'FAQs',
  testimonials: 'Testimonials',
  'job-vacancies': 'Job Vacancies',
  blocks: 'Blocks',
}

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  'zh-hk': '繁體中文',
  'zh-cn': '简体中文',
  id: 'Indonesian',
}

function StatusBadge({ status }: { status: LocaleStatus }) {
  if (status.total === 0) return <span style={{ color: '#9ca3af', fontSize: 13 }}>—</span>

  const pct = Math.round((status.translated / status.total) * 100)
  const color = pct === 100 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626'
  const icon = pct === 100 ? '✅' : pct >= 50 ? '⚠️' : '❌'

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span>{icon}</span>
      <span style={{ fontSize: 13, color }}>
        {status.translated}/{status.total} ({pct}%)
      </span>
    </span>
  )
}

export function TranslationManagerView() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [translating, setTranslating] = useState<Record<string, string>>({}) // collection → status
  const [targetLocales, setTargetLocales] = useState<string[]>([])
  const [allLocales, setAllLocales] = useState<string[]>([])

  const loadData = useCallback(async () => {
    try {
      const s = await fetch('/api/plugins/multilanguage/settings', { cache: 'no-store' }).then((r) => r.json())
      const codes = ((s.activeLocales ?? []) as any[])
        .filter((l) => l.enabled !== false)
        .map((l) => l.code as string)
      const activeCodes = codes.length > 0 ? codes : ['en']
      setAllLocales(activeCodes)
      const nonEn = activeCodes.filter((c) => c !== 'en')
      setTargetLocales(nonEn)

      const localeParam = activeCodes.join(',')
      const statusData = await fetch(
        `/api/plugins/multilanguage/translation-status?locales=${localeParam}`,
      ).then((r) => r.json())
      setData(statusData)
    } catch {
      setError('Failed to load translation status')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function translateCollection(collection: string) {
    if (targetLocales.length === 0) return
    setTranslating((prev) => ({ ...prev, [collection]: 'fetching' }))

    try {
      // Fetch all doc IDs in the collection via Payload REST API
      const docsRes = await fetch(
        `/api/${collection}?locale=en&limit=100&depth=0`,
      )
      const docsData = await docsRes.json()
      const docs: any[] = docsData.docs ?? []

      if (docs.length === 0) {
        setTranslating((prev) => ({ ...prev, [collection]: 'done (0 docs)' }))
        return
      }

      let completed = 0
      setTranslating((prev) => ({ ...prev, [collection]: `0/${docs.length}` }))

      for (const doc of docs) {
        try {
          await fetch('/api/plugins/multilanguage/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collection, id: doc.id, targetLocales }),
          })
        } catch {
          // Continue on individual doc failure
        }
        completed++
        setTranslating((prev) => ({ ...prev, [collection]: `${completed}/${docs.length}` }))
      }

      setTranslating((prev) => ({ ...prev, [collection]: '✓ Done — drafts saved' }))
      setTimeout(() => {
        setTranslating((prev) => {
          const next = { ...prev }
          delete next[collection]
          return next
        })
        loadData()
      }, 3000)
    } catch (err) {
      setTranslating((prev) => ({ ...prev, [collection]: '✗ Error' }))
    }
  }

  const containerStyle: React.CSSProperties = {
    padding: '32px 40px',
    maxWidth: 1000,
    fontFamily: 'system-ui, sans-serif',
  }

  const headingStyle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
    color: '#111',
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 24,
  }

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '10px 16px',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#6b7280',
  }

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
  }

  const btnStyle: React.CSSProperties = {
    padding: '5px 12px',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 6,
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
    color: '#374151',
    whiteSpace: 'nowrap',
  }

  const btnPrimaryStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#2563eb',
    color: '#fff',
    border: '1px solid #2563eb',
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={headingStyle}>Translation Manager</h1>
        <p style={{ color: '#6b7280', marginTop: 24 }}>Loading translation status…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={containerStyle}>
        <h1 style={headingStyle}>Translation Manager</h1>
        <p style={{ color: '#dc2626', marginTop: 24 }}>{error ?? 'No data available'}</p>
      </div>
    )
  }

  const nonEnLocales = allLocales.filter((l) => l !== 'en')

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Translation Manager</h1>
      <p style={{ color: '#6b7280', marginBottom: 0, fontSize: 14 }}>
        AI translation status per collection. Translated content is saved as{' '}
        <strong>Draft</strong> — review and publish in each collection.
      </p>

      {/* Target locale selector */}
      {nonEnLocales.length > 0 && (
        <div
          style={{
            marginTop: 20,
            padding: '12px 16px',
            background: '#f0f9ff',
            borderRadius: 8,
            border: '1px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0369a1' }}>
            Translate to:
          </span>
          {nonEnLocales.map((loc) => (
            <label key={loc} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={targetLocales.includes(loc)}
                onChange={(e) => {
                  setTargetLocales((prev) =>
                    e.target.checked ? [...prev, loc] : prev.filter((l) => l !== loc),
                  )
                }}
              />
              <span style={{ fontSize: 13, color: '#1e40af' }}>
                {LOCALE_LABELS[loc] ?? loc.toUpperCase()} ({loc})
              </span>
            </label>
          ))}
        </div>
      )}

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Collection</th>
            {data.locales.map((loc) => (
              <th key={loc} style={{ ...thStyle, textAlign: 'center' }}>
                {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
              </th>
            ))}
            <th style={thStyle}>AI Translate</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.results).map(([collection, localeMap]) => {
            const status = translating[collection]
            const isRunning = status != null && !status.startsWith('✓') && !status.startsWith('✗')
            return (
              <tr key={collection}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>
                  {COLLECTION_LABELS[collection] ?? collection}
                </td>
                {data.locales.map((loc) => (
                  <td key={loc} style={{ ...tdStyle, textAlign: 'center' }}>
                    <StatusBadge status={localeMap[loc] ?? { total: 0, translated: 0 }} />
                  </td>
                ))}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {status ? (
                      <span
                        style={{
                          fontSize: 13,
                          color: status.startsWith('✓')
                            ? '#16a34a'
                            : status.startsWith('✗')
                            ? '#dc2626'
                            : '#6b7280',
                        }}
                      >
                        {status}
                      </span>
                    ) : (
                      <button
                        style={targetLocales.length === 0 ? { ...btnStyle, opacity: 0.5, cursor: 'not-allowed' } : btnPrimaryStyle}
                        disabled={targetLocales.length === 0}
                        onClick={() => translateCollection(collection)}
                      >
                        🌐 Translate All
                      </button>
                    )}
                    <a
                      href={`/admin/collections/${collection}`}
                      style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none' }}
                    >
                      Edit →
                    </a>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ marginTop: 32, display: 'flex', gap: 24, fontSize: 13, color: '#9ca3af' }}>
        <span>✅ 100% translated</span>
        <span>⚠️ Partial translation</span>
        <span>❌ Not translated</span>
        <span style={{ marginLeft: 'auto', color: '#6b7280' }}>
          All AI translations saved as Draft
        </span>
      </div>
    </div>
  )
}
