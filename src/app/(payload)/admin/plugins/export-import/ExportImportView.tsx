'use client'

import React, { useCallback, useRef, useState } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────────

const COLLECTIONS = [
  { slug: 'posts', label: 'Posts' },
  { slug: 'pages', label: 'Pages' },
  { slug: 'portfolio', label: 'Portfolio' },
  { slug: 'job-vacancies', label: 'Job Vacancies' },
  { slug: 'categories', label: 'Categories' },
  { slug: 'faq-categories', label: 'FAQ Categories' },
  { slug: 'faqs', label: 'FAQs' },
  { slug: 'testimonials', label: 'Testimonials' },
  { slug: 'portfolio-categories', label: 'Portfolio Categories' },
  { slug: 'media', label: 'Media' },
]

const GLOBALS = [
  { slug: 'navigation', label: 'Navigation' },
  { slug: 'settings', label: 'Settings' },
  { slug: 'theme', label: 'Theme' },
]

// ── Styles ────────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: 'var(--theme-elevation-50, #1a1a1a)',
  border: '1px solid var(--theme-elevation-200, #2a2a2a)',
  borderRadius: '8px',
  padding: '20px 24px',
  marginBottom: '20px',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--theme-text, #e0e0e0)',
  marginBottom: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const checkLabel: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  color: 'var(--theme-elevation-700, #aaa)',
  cursor: 'pointer',
  padding: '3px 0',
  userSelect: 'none',
}

const filterRow: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginTop: '6px',
  marginLeft: '24px',
}

const selectStyle: React.CSSProperties = {
  background: 'var(--theme-elevation-100, #111)',
  border: '1px solid var(--theme-elevation-250, #333)',
  borderRadius: '4px',
  color: 'var(--theme-elevation-700, #aaa)',
  fontSize: '11px',
  padding: '3px 7px',
}

const inputStyle: React.CSSProperties = {
  background: 'var(--theme-elevation-100, #111)',
  border: '1px solid var(--theme-elevation-250, #333)',
  borderRadius: '4px',
  color: 'var(--theme-elevation-700, #aaa)',
  fontSize: '11px',
  padding: '3px 7px',
}

const btnPrimary: React.CSSProperties = {
  background: 'rgba(99,102,241,0.2)',
  color: '#a5b4fc',
  border: '1px solid rgba(99,102,241,0.35)',
  borderRadius: '5px',
  padding: '8px 20px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}

const btnDisabled: React.CSSProperties = {
  ...btnPrimary,
  opacity: 0.4,
  cursor: 'not-allowed',
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ── Filter state for a single collection ─────────────────────────────────────

interface CollectionFilter {
  status: string
  dateFrom: string
  dateTo: string
  open: boolean
}

const defaultFilter = (): CollectionFilter => ({
  status: '',
  dateFrom: '',
  dateTo: '',
  open: false,
})

// ── Main component ────────────────────────────────────────────────────────────

export function ExportImportView() {
  // ── Export state ──────────────────────────────────────────────────────────
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set())
  const [selectedGlobals, setSelectedGlobals] = useState<Set<string>>(new Set())
  const [collectionFilters, setCollectionFilters] = useState<Record<string, CollectionFilter>>({})
  const [includeMedia, setIncludeMedia] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportResult, setExportResult] = useState<{ size: number; name: string } | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  // ── Import state ──────────────────────────────────────────────────────────
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importManifest, setImportManifest] = useState<any | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    imported: Record<string, number>
    errors: string[]
  } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Export helpers ────────────────────────────────────────────────────────

  const toggleCollection = (slug: string) => {
    setSelectedCollections((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
    if (!collectionFilters[slug]) {
      setCollectionFilters((prev) => ({ ...prev, [slug]: defaultFilter() }))
    }
  }

  const toggleAllCollections = () => {
    if (selectedCollections.size === COLLECTIONS.length) {
      setSelectedCollections(new Set())
    } else {
      setSelectedCollections(new Set(COLLECTIONS.map((c) => c.slug)))
      const filters: Record<string, CollectionFilter> = {}
      for (const c of COLLECTIONS) filters[c.slug] = collectionFilters[c.slug] ?? defaultFilter()
      setCollectionFilters(filters)
    }
  }

  const toggleGlobal = (slug: string) => {
    setSelectedGlobals((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  const updateFilter = (slug: string, key: keyof CollectionFilter, value: string | boolean) => {
    setCollectionFilters((prev) => ({
      ...prev,
      [slug]: { ...(prev[slug] ?? defaultFilter()), [key]: value },
    }))
  }

  const handleExport = useCallback(async () => {
    setExporting(true)
    setExportError(null)
    setExportResult(null)

    const filters: Record<string, any> = {}
    for (const slug of selectedCollections) {
      const f = collectionFilters[slug]
      if (f) {
        const entry: any = {}
        if (f.status) entry.status = f.status
        if (f.dateFrom) entry.dateFrom = f.dateFrom
        if (f.dateTo) entry.dateTo = f.dateTo
        if (Object.keys(entry).length > 0) filters[slug] = entry
      }
    }

    try {
      const res = await fetch('/api/plugins/export-import/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collections: Array.from(selectedCollections),
          globals: Array.from(selectedGlobals),
          filters,
          includeMedia,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setExportError(err.error ?? 'Export failed')
        return
      }

      const blob = await res.blob()
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const nameMatch = disposition.match(/filename="([^"]+)"/)
      const filename = nameMatch?.[1] ?? 'export.zip'

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      setExportResult({ size: blob.size, name: filename })
    } catch {
      setExportError('Export failed — please try again')
    } finally {
      setExporting(false)
    }
  }, [selectedCollections, selectedGlobals, collectionFilters, includeMedia])

  // ── Import helpers ────────────────────────────────────────────────────────

  const handleFileSelect = async (file: File) => {
    setImportFile(file)
    setImportResult(null)
    setImportError(null)
    setImportManifest(null)

    // Quick-peek the manifest by asking the server to parse the ZIP header
    // We send just the file and read manifest.json from the response if available
    try {
      const previewForm = new FormData()
      previewForm.append('file', file)
      const res = await fetch('/api/plugins/export-import/preview', {
        method: 'POST',
        body: previewForm,
      })
      if (res.ok) {
        const data = await res.json()
        if (data.manifest) setImportManifest(data.manifest)
      }
    } catch {
      // Preview is optional — proceed without it
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.zip')) handleFileSelect(file)
  }

  const handleImport = useCallback(async () => {
    if (!importFile) return
    setImporting(true)
    setImportError(null)
    setImportResult(null)

    const form = new FormData()
    form.append('file', importFile)

    try {
      const res = await fetch('/api/plugins/export-import/import', {
        method: 'POST',
        body: form,
      })

      const data = await res.json()

      if (!res.ok) {
        setImportError(data.error ?? 'Import failed')
        return
      }
      setImportResult(data)
    } catch {
      setImportError('Import failed — please try again')
    } finally {
      setImporting(false)
    }
  }, [importFile])

  const canExport = (selectedCollections.size > 0 || selectedGlobals.size > 0) && !exporting
  const canImport = !!importFile && !importing

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '32px 24px',
        fontFamily: 'var(--font-body, system-ui, sans-serif)',
        color: 'var(--theme-text, #e0e0e0)',
      }}
    >
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
        Export &amp; Import
      </h1>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--theme-elevation-500, #888)',
          marginBottom: '28px',
        }}
      >
        Export collections to a ZIP file (JSON + CSV + media) and import them back into any
        environment.
      </p>

      {/* ── EXPORT ─────────────────────────────────────────────────────── */}
      <div style={card}>
        <div style={sectionTitle}>
          <span>⬇</span> Export
        </div>

        {/* Select all */}
        <label style={{ ...checkLabel, marginBottom: '8px', fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={selectedCollections.size === COLLECTIONS.length}
            onChange={toggleAllCollections}
          />
          Select all collections
        </label>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '2px 0',
            marginBottom: '16px',
          }}
        >
          {COLLECTIONS.map((c) => (
            <div key={c.slug}>
              <label style={checkLabel}>
                <input
                  type="checkbox"
                  checked={selectedCollections.has(c.slug)}
                  onChange={() => toggleCollection(c.slug)}
                />
                {c.label}
                {selectedCollections.has(c.slug) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      updateFilter(c.slug, 'open', !(collectionFilters[c.slug]?.open ?? false))
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--theme-elevation-500, #777)',
                      fontSize: '10px',
                      cursor: 'pointer',
                      padding: '0 2px',
                    }}
                  >
                    {collectionFilters[c.slug]?.open ? '▴ filter' : '▾ filter'}
                  </button>
                )}
              </label>

              {selectedCollections.has(c.slug) && collectionFilters[c.slug]?.open && (
                <div style={filterRow}>
                  <select
                    style={selectStyle}
                    value={collectionFilters[c.slug]?.status ?? ''}
                    onChange={(e) => updateFilter(c.slug, 'status', e.target.value)}
                  >
                    <option value="">Any status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <input
                    type="date"
                    placeholder="From date"
                    style={inputStyle}
                    value={collectionFilters[c.slug]?.dateFrom ?? ''}
                    onChange={(e) => updateFilter(c.slug, 'dateFrom', e.target.value)}
                  />
                  <input
                    type="date"
                    placeholder="To date"
                    style={inputStyle}
                    value={collectionFilters[c.slug]?.dateTo ?? ''}
                    onChange={(e) => updateFilter(c.slug, 'dateTo', e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Globals */}
        <div
          style={{
            borderTop: '1px solid var(--theme-elevation-150, #252525)',
            paddingTop: '14px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--theme-elevation-500, #777)',
              marginBottom: '8px',
              fontWeight: 500,
            }}
          >
            Globals
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {GLOBALS.map((g) => (
              <label key={g.slug} style={checkLabel}>
                <input
                  type="checkbox"
                  checked={selectedGlobals.has(g.slug)}
                  onChange={() => toggleGlobal(g.slug)}
                />
                {g.label}
              </label>
            ))}
          </div>
        </div>

        {/* Options */}
        <label style={{ ...checkLabel, marginBottom: '16px' }}>
          <input
            type="checkbox"
            checked={includeMedia}
            onChange={(e) => setIncludeMedia(e.target.checked)}
          />
          Include media files in ZIP
        </label>

        {/* Export button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={canExport ? handleExport : undefined}
            style={canExport ? btnPrimary : btnDisabled}
          >
            {exporting ? '⏳ Exporting…' : '⬇ Export ZIP'}
          </button>

          {exportResult && (
            <span style={{ fontSize: '12px', color: 'var(--theme-elevation-500, #888)' }}>
              ✓ Downloaded {exportResult.name} ({formatBytes(exportResult.size)})
            </span>
          )}
        </div>

        {exportError && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#f87171',
            }}
          >
            {exportError}
          </div>
        )}
      </div>

      {/* ── IMPORT ─────────────────────────────────────────────────────── */}
      <div style={card}>
        <div style={sectionTitle}>
          <span>⬆</span> Import
        </div>

        <div
          style={{
            background: 'rgba(250,200,50,0.06)',
            border: '1px solid rgba(250,200,50,0.2)',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#d4a700',
            marginBottom: '14px',
          }}
        >
          ⚠ This will <strong>overwrite</strong> existing documents with matching IDs.
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'rgba(99,102,241,0.6)' : 'var(--theme-elevation-250, #333)'}`,
            borderRadius: '6px',
            padding: '28px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'rgba(99,102,241,0.04)' : 'transparent',
            transition: 'all 0.15s ease',
            marginBottom: '12px',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFileSelect(f)
            }}
          />
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>📦</div>
          {importFile ? (
            <div>
              <div style={{ fontSize: '13px', color: 'var(--theme-text, #e0e0e0)', fontWeight: 500 }}>
                {importFile.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--theme-elevation-500, #888)', marginTop: '2px' }}>
                {formatBytes(importFile.size)} · Click to change
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '13px', color: 'var(--theme-elevation-600, #999)' }}>
                Drop a ZIP file here, or click to browse
              </div>
              <div style={{ fontSize: '11px', color: 'var(--theme-elevation-400, #666)', marginTop: '4px' }}>
                Accepts files exported from this plugin
              </div>
            </div>
          )}
        </div>

        {/* Manifest preview */}
        {importManifest && (
          <div
            style={{
              background: 'var(--theme-elevation-100, #111)',
              border: '1px solid var(--theme-elevation-200, #2a2a2a)',
              borderRadius: '4px',
              padding: '10px 14px',
              fontSize: '12px',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--theme-elevation-700, #bbb)' }}>
              ZIP contents
            </div>
            <div style={{ color: 'var(--theme-elevation-500, #888)', lineHeight: '1.8' }}>
              {importManifest.collections?.map((c: any) => (
                <span key={c.slug} style={{ marginRight: '10px' }}>
                  {c.slug} ({c.count})
                </span>
              ))}
              {importManifest.globals?.length > 0 && (
                <span style={{ color: 'var(--theme-elevation-400, #666)' }}>
                  · Globals: {importManifest.globals.join(', ')}
                </span>
              )}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--theme-elevation-400, #666)', marginTop: '4px' }}>
              Exported {new Date(importManifest.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        {/* Import button */}
        <button
          type="button"
          onClick={canImport ? handleImport : undefined}
          style={canImport ? { ...btnPrimary, background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.3)', color: '#86efac' } : btnDisabled}
        >
          {importing ? '⏳ Importing…' : '⬆ Import'}
        </button>

        {/* Import result */}
        {importResult && (
          <div
            style={{
              marginTop: '12px',
              background: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '4px',
              padding: '10px 14px',
              fontSize: '12px',
            }}
          >
            <div style={{ fontWeight: 600, color: '#86efac', marginBottom: '6px' }}>
              ✓ Import complete
            </div>
            <div style={{ color: 'var(--theme-elevation-600, #999)', lineHeight: '1.8' }}>
              {Object.entries(importResult.imported).map(([slug, count]) => (
                <span key={slug} style={{ marginRight: '12px' }}>
                  {slug}: <strong style={{ color: 'var(--theme-text, #e0e0e0)' }}>{count}</strong>
                </span>
              ))}
            </div>
            {importResult.errors.length > 0 && (
              <div style={{ marginTop: '8px', color: '#f87171', fontSize: '11px' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Errors:</div>
                {importResult.errors.map((e, i) => (
                  <div key={i}>{e}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {importError && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#f87171',
            }}
          >
            {importError}
          </div>
        )}
      </div>
    </div>
  )
}
