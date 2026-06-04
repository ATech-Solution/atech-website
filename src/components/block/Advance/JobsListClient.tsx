'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'

const FONT = 'var(--font-work-sans, "Work Sans", sans-serif)'

export interface JobItem {
  jobTitle?:    string
  jobType?:     string
  jobCategory?: string
  jobLocation?: string
  jobDesc?:     string
  jobCta?:      string
  jobUrl?:      string
}

interface Props {
  items: JobItem[]
}

export function JobsListClient({ items }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((j) =>
      [j.jobTitle, j.jobType, j.jobCategory, j.jobLocation, j.jobDesc]
        .some((f) => f?.toLowerCase().includes(q))
    )
  }, [items, query])

  return (
    <>
      {/* Search bar */}
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search positions..."
          className="w-full px-6 py-4 text-base outline-none"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
            fontFamily: FONT,
          }}
        />
      </div>

      {/* Scrollable list — shows ~3 cards, scrolls beyond */}
      <div
        className="flex flex-col gap-4"
        style={filtered.length > 3 ? {
          maxHeight: '576px',
          overflowY: 'auto',
          paddingRight: '8px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.2) transparent',
        } : undefined}
      >
        {filtered.map((job, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                {job.jobTitle && (
                  <span style={{ fontFamily: FONT, fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', lineHeight: '32px' }}>
                    {job.jobTitle}
                  </span>
                )}
                {job.jobType && (
                  <span className="px-3 py-1 text-xs" style={{ background: '#ffffff', color: '#171717', fontFamily: FONT }}>
                    {job.jobType}
                  </span>
                )}
                {job.jobCategory && (
                  <span className="px-3 py-1 text-xs" style={{ background: 'rgba(255,255,255,0.15)', color: '#d4d4d4', fontFamily: FONT, border: '1px solid rgba(255,255,255,0.2)' }}>
                    {job.jobCategory}
                  </span>
                )}
                {job.jobLocation && (
                  <span style={{ fontFamily: FONT, fontSize: '0.875rem', color: '#a3a3a3' }}>
                    📍 {job.jobLocation}
                  </span>
                )}
              </div>
              {job.jobDesc && (
                <p style={{ fontFamily: FONT, fontSize: '1rem', color: '#d4d4d4', lineHeight: '1.625' }}>
                  {job.jobDesc}
                </p>
              )}
            </div>
            {job.jobCta && job.jobUrl && (
              <Link
                href={job.jobUrl}
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-normal transition-opacity duration-200 hover:opacity-80 shrink-0"
                style={{ background: '#ffffff', color: '#171717', fontFamily: FONT }}
              >
                {job.jobCta}
              </Link>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p style={{ fontFamily: FONT, color: '#737373', textAlign: 'center', padding: '48px 0' }}>
            {query ? `No positions matching "${query}".` : 'No open positions at this time.'}
          </p>
        )}
      </div>
    </>
  )
}
