// Get Involved Jobs — Figma node 1:30513
// Dark #171717 background, heading + search + job cards list

import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface JobOpening {
  title:       string
  type:        string
  description: string
  ctaLabel:    string
  ctaUrl:      string
}

interface GetInvolvedJobsData {
  heading:    string
  subheading: string
  openings:   JobOpening[]
}

// ─── GetInvolvedJobsBlock ─────────────────────────────────────────────────────
export default function GetInvolvedJobsBlock({ data }: { data: GetInvolvedJobsData }) {
  const { heading, subheading, openings } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#171717' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="mb-4"
            style={{
              fontFamily:    'var(--font-work-sans, sans-serif)',
              fontSize:      'clamp(1.75rem, 3vw, 3rem)',
              fontWeight:    400,
              color:         '#ffffff',
              letterSpacing: '-0.5px',
              lineHeight:    1,
            }}
          >
            {heading}
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#d4d4d4', lineHeight: '1.625' }}
          >
            {subheading}
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search positions..."
            className="w-full px-6 py-4 text-base outline-none"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border:     '1px solid rgba(255,255,255,0.2)',
              color:      '#ffffff',
              fontFamily: 'var(--font-work-sans, sans-serif)',
            }}
          />
        </div>

        {/* Job listings */}
        <div className="flex flex-col gap-4">
          {openings.map((job) => (
            <div
              key={job.title}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    style={{
                      fontFamily:    'var(--font-work-sans, sans-serif)',
                      fontSize:      '1.5rem',
                      fontWeight:    400,
                      color:         '#ffffff',
                      lineHeight:    '32px',
                    }}
                  >
                    {job.title}
                  </span>
                  <span
                    className="px-3 py-1 text-xs"
                    style={{ background: '#ffffff', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                  >
                    {job.type}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#d4d4d4', lineHeight: '1.625' }}>
                  {job.description}
                </p>
              </div>
              <Link
                href={job.ctaUrl}
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-normal transition-opacity duration-200 hover:opacity-80 shrink-0"
                style={{ background: '#ffffff', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {job.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
