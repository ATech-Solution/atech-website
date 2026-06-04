// Jobs List Section — dark #171717 background, heading + searchable job openings list
// manual mode only; collection mode handled by JobsListServerSection.tsx (server-only)

import { JobsListClient, type JobItem } from './JobsListClient'

const FONT = 'var(--font-work-sans, "Work Sans", sans-serif)'

export interface JobsListData {
  jobSource?:   'manual' | 'collection'
  jobCategory?: string
  jobLimit?:    number
  heading?:     string
  subheading?:  string
  jobItems?:    JobItem[]
}

// ── Shared shell (server) ─────────────────────────────────────────────────────

export function JobsListShell({ data, items }: { data: JobsListData; items: JobItem[] }) {
  const { heading, subheading } = data
  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#171717' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2
                className="mb-4"
                style={{ fontFamily: FONT, fontSize: 'clamp(1.75rem, 3vw, 3rem)', fontWeight: 400, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1 }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="max-w-2xl mx-auto" style={{ fontFamily: FONT, fontSize: '1.25rem', color: '#d4d4d4', lineHeight: '1.625' }}>
                {subheading}
              </p>
            )}
          </div>
        )}
        <JobsListClient items={items} />
      </div>
    </section>
  )
}

// ── Default export (manual mode) ──────────────────────────────────────────────

export default function JobsListSection({ data }: { data: JobsListData }) {
  return <JobsListShell data={data} items={data.jobItems ?? []} />
}
