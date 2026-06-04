'use client'

import React, { useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type TestStatus = 'pass' | 'fail' | 'warn' | 'pending' | 'running'
type Target = 'local' | 'uat'

interface TestResult {
  id: string
  tier: string
  label: string
  status: TestStatus
  httpStatus: number | null
  message: string
  durationMs: number
}

interface RunSummary {
  total: number
  pass: number
  fail: number
  warn: number
}

interface RunReport {
  target: Target
  base: string
  runAt: string
  summary: RunSummary
  results: TestResult[]
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
.st-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 4px;
}
.st-row:hover { background: #f9fafb !important; }
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusDot(s: TestStatus) {
  const map: Record<TestStatus, { bg: string; label: string; emoji: string }> = {
    pass:    { bg: '#16a34a', label: 'PASS',    emoji: '✅' },
    fail:    { bg: '#dc2626', label: 'FAIL',    emoji: '❌' },
    warn:    { bg: '#d97706', label: 'WARN',    emoji: '⚠️' },
    pending: { bg: '#9ca3af', label: 'PENDING', emoji: '⏳' },
    running: { bg: '#3b82f6', label: '...',     emoji: '🔄' },
  }
  const { bg, label, emoji } = map[s]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: bg, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: bg, letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ fontSize: '0.8rem' }}>{emoji}</span>
    </span>
  )
}

function tierColor(tier: string) {
  const map: Record<string, string> = {
    Pages:  '#dbeafe',
    Admin:  '#fce7f3',
    API:    '#dcfce7',
    Assets: '#fef9c3',
  }
  return map[tier] ?? '#f3f4f6'
}

function tierText(tier: string) {
  const map: Record<string, string> = {
    Pages:  '#1d4ed8',
    Admin:  '#9d174d',
    API:    '#166534',
    Assets: '#a16207',
  }
  return map[tier] ?? '#374151'
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SiteTestingView() {
  const [target, setTarget] = useState<Target>('local')
  const [running, setRunning] = useState(false)
  const [report, setReport] = useState<RunReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 5000)
  }

  const handleRun = useCallback(async () => {
    setRunning(true)
    setError(null)
    setReport(null)

    try {
      const res = await fetch('/api/plugins/site-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Test run failed')
      setReport(data as RunReport)

      const { pass, fail, warn } = data.summary
      if (fail > 0) {
        showToast('error', `${fail} test(s) failed — check results below`)
      } else if (warn > 0) {
        showToast('success', `All tests passed with ${warn} warning(s)`)
      } else {
        showToast('success', `All ${pass} tests passed ✅`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      showToast('error', 'Failed to run tests')
    } finally {
      setRunning(false)
    }
  }, [target])

  // Group results by tier
  const grouped = report
    ? report.results.reduce<Record<string, TestResult[]>>((acc, r) => {
        if (!acc[r.tier]) acc[r.tier] = []
        acc[r.tier].push(r)
        return acc
      }, {})
    : null

  return (
    <>
      <style>{CSS}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 10000,
          padding: '0.875rem 1.25rem', borderRadius: '10px',
          background: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: toast.type === 'success' ? '#15803d' : '#dc2626',
          border: `1px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`,
          fontSize: '0.875rem', fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)', maxWidth: '380px',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.type === 'success' ? '✅ ' : '❌ '}{toast.text}
        </div>
      )}

      <div style={{ padding: '2rem', maxWidth: '960px', fontFamily: 'inherit' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>🧪 Site Testing</h1>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.3rem 0.75rem', borderRadius: '9999px',
              background: '#dcfce7', fontSize: '0.8rem', fontWeight: 600, color: '#16a34a',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
              Plugin Active
            </span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Smoke-test all pages, API endpoints, and assets before deploying. Use Playwright commands for deep browser testing.
          </p>
        </div>

        {/* Control Card */}
        <Card>
          <h2 style={sectionTitle}>Run Smoke Tests</h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <p style={fieldLabel}>Target environment</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {(['local', 'uat'] as Target[]).map((t) => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="radio" name="target" value={t}
                    checked={target === t}
                    onChange={() => setTarget(t)}
                    style={{ accentColor: '#034F98', width: 15, height: 15 }}
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>
                    {t === 'local' ? '💻 Local (localhost:3000)' : '🌐 UAT (uat.atech.software)'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleRun}
              disabled={running}
              style={{
                padding: '0.625rem 1.375rem',
                background: running ? '#9ca3af' : '#034F98',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontWeight: 600, fontSize: '0.875rem',
                cursor: running ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}
            >
              {running && (
                <span style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              )}
              {running ? 'Running tests…' : '▶ Run Tests Now'}
            </button>

            {report && !running && (
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `site-test-${report.target}-${new Date().toISOString().slice(0,10)}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                style={{
                  padding: '0.625rem 1.125rem',
                  background: '#fff', color: '#374151',
                  border: '1px solid #d1d5db', borderRadius: '8px',
                  fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500,
                }}
              >
                ⬇ Export JSON Report
              </button>
            )}
          </div>

          {running && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ height: 6, borderRadius: 9999, background: '#e5e7eb', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', width: '40%',
                  borderRadius: 9999,
                  background: 'linear-gradient(90deg, transparent, #034F98, transparent)',
                  backgroundSize: '600px 100%',
                  animation: 'shimmer 1.4s infinite linear',
                }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Checking all pages, APIs, and assets…
              </p>
            </div>
          )}
        </Card>

        {/* Error state */}
        {error && (
          <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
            ❌ {error}
          </div>
        )}

        {/* Summary Card */}
        {report && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ ...sectionTitle, margin: 0 }}>
                Results — <span style={{ fontWeight: 400, color: '#6b7280' }}>{report.target === 'uat' ? 'uat.atech.software' : 'localhost:3000'}</span>
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                {new Date(report.runAt).toLocaleString()}
              </span>
            </div>

            {/* Summary pills */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <SummaryPill label="Total" value={report.summary.total} bg="#f3f4f6" color="#374151" />
              <SummaryPill label="Pass" value={report.summary.pass} bg="#dcfce7" color="#16a34a" />
              {report.summary.fail > 0 && <SummaryPill label="Fail" value={report.summary.fail} bg="#fee2e2" color="#dc2626" />}
              {report.summary.warn > 0 && <SummaryPill label="Warn" value={report.summary.warn} bg="#fef9c3" color="#a16207" />}
              <SummaryPill label="Score" value={`${Math.round((report.summary.pass / report.summary.total) * 100)}%`} bg={report.summary.fail === 0 ? '#dcfce7' : '#fee2e2'} color={report.summary.fail === 0 ? '#16a34a' : '#dc2626'} />
            </div>

            {/* Results by tier */}
            {grouped && Object.entries(grouped).map(([tier, rows]) => (
              <div key={tier} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 10px', borderRadius: '9999px',
                    background: tierColor(tier), color: tierText(tier),
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
                  }}>
                    {tier}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                    {rows.filter(r => r.status === 'pass').length}/{rows.length} passed
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      {['Status', 'Test', 'HTTP', 'Message', 'Time'].map((h) => (
                        <th key={h} style={{ padding: '0.4rem 0.625rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.75rem' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="st-row" style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.5rem 0.625rem', whiteSpace: 'nowrap' }}>{statusDot(r.status)}</td>
                        <td style={{ padding: '0.5rem 0.625rem', color: '#111827', fontWeight: 500 }}>{r.label}</td>
                        <td style={{ padding: '0.5rem 0.625rem', color: r.httpStatus && r.httpStatus < 400 ? '#16a34a' : '#dc2626', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                          {r.httpStatus ?? '—'}
                        </td>
                        <td style={{ padding: '0.5rem 0.625rem', color: '#6b7280', fontSize: '0.78rem' }}>{r.message}</td>
                        <td style={{ padding: '0.5rem 0.625rem', color: '#9ca3af', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{r.durationMs}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </Card>
        )}

        {/* Playwright Instructions Card */}
        <Card>
          <h2 style={sectionTitle}>🎭 Playwright E2E Tests</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Run full browser-based tests for navigation, forms, mobile layout, and layout builder blocks.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[
              { label: 'Local e2e tests', cmd: 'npm run test:e2e', desc: 'Runs all specs against localhost:3000' },
              { label: 'UAT e2e tests', cmd: 'npm run test:e2e:uat', desc: 'Runs all specs against uat.atech.software' },
              { label: 'Quick smoke (no browser)', cmd: 'npm run test:smoke', desc: 'Fast curl-based checks (~30s)' },
              { label: 'View HTML report', cmd: 'npx playwright show-report', desc: 'Open interactive test report with screenshots' },
            ].map((item) => (
              <div key={item.cmd} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{item.label}</span>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: '#6b7280' }}>{item.desc}</span>
                </div>
                <code style={{ fontFamily: 'monospace', fontSize: '0.82rem', background: '#111827', color: '#34d399', padding: '0.3rem 0.75rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                  {item.cmd}
                </code>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick checklist */}
        <Card>
          <h2 style={sectionTitle}>📋 Pre-Deploy Checklist</h2>
          <DeployChecklist />
        </Card>

      </div>
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', background: '#fff' }}>
      {children}
    </div>
  )
}

function SummaryPill({ label, value, bg, color }: { label: string; value: number | string; bg: string; color: string }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '10px', background: bg, minWidth: 56 }}>
      <span style={{ fontSize: '1.25rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '0.7rem', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{label}</span>
    </div>
  )
}

function DeployChecklist() {
  const items = [
    { tier: 'Build',  checks: ['npm run build passes with no errors', 'npx tsc --noEmit — zero TypeScript errors', 'npm run lint — zero lint errors'] },
    { tier: 'Pages',  checks: ['All locale homepages return 200 (EN, ZH-HK, ZH-CN, ID)', 'Key pages: About, Contact, FAQ, Portfolio, Insights', 'Service pages: QA Testing, Web Dev, App Dev'] },
    { tier: 'API',    checks: ['/api/maintenance-status returns 200 JSON', '/api/theme returns 200 JSON', 'Multilanguage settings endpoint healthy'] },
    { tier: 'UI',     checks: ['Desktop mega menu opens on hover', 'Mobile burger drawer opens, split label/arrow works', 'Language switcher changes locale', 'Hero-split: image below content on mobile'] },
    { tier: 'Forms',  checks: ['Contact form renders, fields accept input', 'Quote form renders', 'Article submit form renders'] },
    { tier: 'Admin',  checks: ['/admin returns 200', 'All plugins show in Plugins collection'] },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {items.map(({ tier, checks }) => (
        <div key={tier}>
          <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: '9999px',
            background: tierColor(tier), color: tierText(tier),
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.5rem',
          }}>
            {tier}
          </span>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {checks.map((c) => (
              <li key={c} style={{ fontSize: '0.85rem', color: '#374151' }}>{c}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const sectionTitle: React.CSSProperties = {
  fontWeight: 600, fontSize: '1rem', marginTop: 0, marginBottom: '1.25rem', color: '#111827',
}

const fieldLabel: React.CSSProperties = {
  fontSize: '0.8rem', fontWeight: 600, color: '#374151',
  margin: '0 0 0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em',
}

export default SiteTestingView
