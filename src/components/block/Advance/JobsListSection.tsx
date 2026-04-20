// Jobs List Section — dark #171717 background, heading + job openings list

import Link from 'next/link'

interface JobItem {
  jobTitle?: string
  jobType?:  string
  jobDesc?:  string
  jobCta?:   string
  jobUrl?:   string
}

interface JobsListData {
  heading?:  string
  subheading?: string
  jobItems?: JobItem[]
}

export default function JobsListSection({ data }: { data: JobsListData }) {
  const { heading, subheading, jobItems = [] } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#171717' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2
                className="mb-4"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 3rem)', fontWeight: 400, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1 }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#d4d4d4', lineHeight: '1.625' }}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Search bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search positions..."
            className="w-full px-6 py-4 text-base outline-none"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          {jobItems.map((job, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {job.jobTitle && (
                    <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', lineHeight: '32px' }}>
                      {job.jobTitle}
                    </span>
                  )}
                  {job.jobType && (
                    <span className="px-3 py-1 text-xs" style={{ background: '#ffffff', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                      {job.jobType}
                    </span>
                  )}
                </div>
                {job.jobDesc && (
                  <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#d4d4d4', lineHeight: '1.625' }}>
                    {job.jobDesc}
                  </p>
                )}
              </div>
              {job.jobCta && job.jobUrl && (
                <Link
                  href={job.jobUrl}
                  className="inline-flex items-center justify-center px-8 py-3 text-sm font-normal transition-opacity duration-200 hover:opacity-80 shrink-0"
                  style={{ background: '#ffffff', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {job.jobCta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
