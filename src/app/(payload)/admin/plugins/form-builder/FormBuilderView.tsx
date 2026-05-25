'use client'

import React, { useEffect, useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatsData {
  totalForms:       number
  totalSubmissions: number
  byDate:  Array<{ date: string; count: number }>
  byForm:  Array<{ formId: string; title: string; count: number }>
  byStatus: Record<string, number>
  recent:  Array<{ id: string; createdAt: string; formTitle: string; score: number | null; status: string }>
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background:   'var(--theme-elevation-50, #1a1a1a)',
  border:       '1px solid var(--theme-elevation-200, #2a2a2a)',
  borderRadius: '8px',
  padding:      '20px 24px',
  marginBottom: '20px',
}

const sectionTitle: React.CSSProperties = {
  fontSize:    '14px',
  fontWeight:  600,
  color:       'var(--theme-elevation-700, #bbb)',
  marginBottom:'12px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const statBox: React.CSSProperties = {
  display:       'inline-flex',
  flexDirection: 'column',
  alignItems:    'flex-start',
  background:    'var(--theme-elevation-100, #111)',
  border:        '1px solid var(--theme-elevation-200, #2a2a2a)',
  borderRadius:  '6px',
  padding:       '14px 20px',
  minWidth:      '110px',
  marginRight:   '12px',
  marginBottom:  '12px',
}

const linkBtn: React.CSSProperties = {
  display:      'inline-flex',
  alignItems:   'center',
  gap:          '6px',
  padding:      '8px 18px',
  borderRadius: '5px',
  textDecoration: 'none',
  fontSize:     '13px',
  fontWeight:   500,
  background:   'rgba(99,102,241,0.15)',
  color:        '#a5b4fc',
  border:       '1px solid rgba(99,102,241,0.3)',
  marginRight:  '8px',
}

const STATUS_COLORS: Record<string, string> = {
  'new':        '#60a5fa',
  'in-review':  '#fbbf24',
  'contacted':  '#34d399',
  'closed':     '#9ca3af',
}

const STATUS_LABELS: Record<string, string> = {
  'new':        'New',
  'in-review':  'In Review',
  'contacted':  'Contacted',
  'closed':     'Closed',
}

// ── Score badge ───────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return <span style={{ fontSize: '11px', color: 'var(--theme-elevation-400, #666)' }}>—</span>
  }
  const color = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171'
  return (
    <span style={{
      display:      'inline-flex',
      alignItems:   'center',
      justifyContent: 'center',
      minWidth:     '36px',
      padding:      '2px 8px',
      borderRadius: '100px',
      fontSize:     '11px',
      fontWeight:   700,
      background:   `${color}22`,
      color,
      border:       `1px solid ${color}44`,
    }}>
      {score}
    </span>
  )
}

// ── Mini bar chart ────────────────────────────────────────────────────────────

function BarChart({ data }: { data: Array<{ date: string; count: number }> }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const last30 = data.slice(-30)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '60px', padding: '0 0 4px 0' }}>
      {last30.map((d) => {
        const pct = (d.count / max) * 100
        const isToday = d.date === new Date().toISOString().slice(0, 10)
        return (
          <div
            key={d.date}
            title={`${d.date}: ${d.count} submission${d.count !== 1 ? 's' : ''}`}
            style={{
              flex:         '1',
              height:       `${Math.max(pct, d.count > 0 ? 8 : 2)}%`,
              minHeight:    d.count > 0 ? '6px' : '2px',
              borderRadius: '2px 2px 0 0',
              background:   isToday ? '#a5b4fc' : d.count > 0 ? 'rgba(99,102,241,0.6)' : 'var(--theme-elevation-150, #222)',
              cursor:       'default',
              transition:   'opacity 0.15s',
            }}
          />
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function FormBuilderView() {
  const [stats, setStats]       = useState<StatsData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetch('/api/plugins/form-builder/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCSV = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/plugins/form-builder/stats?format=csv')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = res.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1] ?? 'submissions.csv'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={{
      maxWidth:   800,
      margin:     '0 auto',
      padding:    '32px 24px',
      fontFamily: 'var(--font-body, system-ui, sans-serif)',
      color:      'var(--theme-text, #e0e0e0)',
    }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Form Builder</h1>
      <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500, #888)', marginBottom: '28px' }}>
        Create forms, track submissions, score leads, and manage your pipeline.
      </p>

      {/* ── Top stats ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '4px' }}>
        {[
          { label: 'Forms',       value: loading ? '—' : String(stats?.totalForms       ?? 0) },
          { label: 'Submissions', value: loading ? '—' : String(stats?.totalSubmissions ?? 0) },
          { label: 'This Month',  value: loading ? '—' : String(stats?.byDate?.reduce((s, d) => s + d.count, 0) ?? 0) },
        ].map(({ label, value }) => (
          <div key={label} style={statBox}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--theme-text, #e0e0e0)' }}>{value}</span>
            <span style={{ fontSize: '11px', color: 'var(--theme-elevation-500, #888)', marginTop: '2px' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── 30-day chart ──────────────────────────────────────────── */}
      {stats && stats.byDate.length > 0 && (
        <div style={{ ...card, marginBottom: '20px' }}>
          <div style={sectionTitle}>Submissions — Last 30 Days</div>
          <BarChart data={stats.byDate} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--theme-elevation-400, #666)', marginTop: '4px' }}>
            <span>{stats.byDate[0]?.date}</span>
            <span>Today</span>
          </div>
        </div>
      )}

      {/* ── Pipeline status ───────────────────────────────────────── */}
      {stats && (
        <div style={{ ...card, marginBottom: '20px' }}>
          <div style={sectionTitle}>Pipeline</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = stats.byStatus[key] ?? 0
              const color = STATUS_COLORS[key]
              return (
                <div key={key} style={{
                  display:       'flex',
                  flexDirection: 'column',
                  alignItems:    'flex-start',
                  padding:       '10px 16px',
                  borderRadius:  '6px',
                  background:    `${color}11`,
                  border:        `1px solid ${color}33`,
                  minWidth:      '80px',
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color }}>{count}</span>
                  <span style={{ fontSize: '11px', color: `${color}cc`, marginTop: '2px' }}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Per-form breakdown ────────────────────────────────────── */}
      {stats && stats.byForm.length > 0 && (
        <div style={card}>
          <div style={sectionTitle}>By Form (Last 30 Days)</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              {stats.byForm.map((f) => (
                <tr key={f.formId} style={{ borderBottom: '1px solid var(--theme-elevation-150, #252525)' }}>
                  <td style={{ padding: '7px 0', color: 'var(--theme-text, #e0e0e0)' }}>
                    <a href={`/admin/collections/forms/${f.formId}`}
                       style={{ color: 'inherit', textDecoration: 'none' }}>
                      {f.title}
                    </a>
                  </td>
                  <td style={{ padding: '7px 0', textAlign: 'right', color: 'var(--theme-elevation-500, #888)', fontVariantNumeric: 'tabular-nums' }}>
                    {f.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Recent submissions ────────────────────────────────────── */}
      {stats && stats.recent.length > 0 && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={sectionTitle}>Recent Submissions</div>
            <button
              onClick={handleCSV}
              disabled={exporting}
              style={{
                fontSize:   '12px',
                padding:    '5px 12px',
                borderRadius: '4px',
                background: exporting ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.15)',
                color:      '#a5b4fc',
                border:     '1px solid rgba(99,102,241,0.3)',
                cursor:     exporting ? 'not-allowed' : 'pointer',
                opacity:    exporting ? 0.6 : 1,
              }}
            >
              {exporting ? 'Exporting…' : '⬇ Export CSV'}
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>
                {['Form', 'Score', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{
                    padding:   '5px 8px 8px 0',
                    textAlign: h === 'Score' || h === 'Date' ? 'right' : 'left',
                    color:     'var(--theme-elevation-500, #777)',
                    fontWeight: 500,
                    borderBottom: '1px solid var(--theme-elevation-150, #252525)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--theme-elevation-100, #1d1d1d)' }}>
                  <td style={{ padding: '7px 8px 7px 0', color: 'var(--theme-text, #e0e0e0)' }}>
                    <a href={`/admin/collections/form-submissions/${sub.id}`}
                       style={{ color: 'inherit', textDecoration: 'none' }}>
                      {sub.formTitle}
                    </a>
                  </td>
                  <td style={{ padding: '7px 8px 7px 0', textAlign: 'right' }}>
                    <ScoreBadge score={sub.score} />
                  </td>
                  <td style={{ padding: '7px 8px 7px 0' }}>
                    <span style={{
                      fontSize:     '11px',
                      padding:      '2px 8px',
                      borderRadius: '100px',
                      background:   `${STATUS_COLORS[sub.status] ?? '#888'}22`,
                      color:         STATUS_COLORS[sub.status] ?? '#888',
                      border:       `1px solid ${STATUS_COLORS[sub.status] ?? '#888'}44`,
                    }}>
                      {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </td>
                  <td style={{ padding: '7px 0', textAlign: 'right', color: 'var(--theme-elevation-500, #777)', fontVariantNumeric: 'tabular-nums' }}>
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Quick links ───────────────────────────────────────────── */}
      <div style={card}>
        <div style={sectionTitle}>Collections</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <a href="/admin/collections/forms"             style={linkBtn}>Browse Forms</a>
          <a href="/admin/collections/forms/create"      style={{ ...linkBtn, background: 'rgba(34,197,94,0.12)', color: '#86efac', border: '1px solid rgba(34,197,94,0.25)' }}>+ New Form</a>
          <a href="/admin/collections/form-submissions"  style={linkBtn}>Browse Submissions</a>
        </div>
      </div>
    </div>
  )
}
