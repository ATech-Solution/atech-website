// Jobs List Section — dark #171717 background, heading + searchable job openings list
// Supports jobSource='manual' (inline items) and jobSource='collection' (fetched from job-vacancies)

import { JobsListClient, type JobItem } from './JobsListClient'

const FONT = 'var(--font-work-sans, "Work Sans", sans-serif)'

interface JobsListData {
  jobSource?:   'manual' | 'collection'
  jobCategory?: string
  jobLimit?:    number
  heading?:     string
  subheading?:  string
  jobItems?:    JobItem[]
}

// ── Shared shell (server) ─────────────────────────────────────────────────────

function JobsListShell({ data, items }: { data: JobsListData; items: JobItem[] }) {
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

// ── Async server export (collection mode) ─────────────────────────────────────

export async function JobsListServerSection({ data }: { data: JobsListData }) {
  const isCollection = (data.jobSource ?? 'manual') === 'collection'

  if (!isCollection) {
    return <JobsListShell data={data} items={data.jobItems ?? []} />
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const params = new URLSearchParams({
      'where[status][equals]': 'active',
      limit: String(data.jobLimit ?? 20),
      sort: 'order',
      depth: '0',
    })
    if (data.jobCategory) {
      params.set('where[category][equals]', data.jobCategory)
    }

    const res = await fetch(`${baseUrl}/api/job-vacancies?${params.toString()}`, { next: { revalidate: 60 } })
    const json = await res.json()

    const items: JobItem[] = (json.docs ?? []).map((j: any) => ({
      jobTitle:    j.title ?? '',
      jobType:     j.positionType ? formatPositionType(j.positionType) : undefined,
      jobCategory: j.category ?? undefined,
      jobLocation: j.location ?? undefined,
      jobDesc:     j.excerpt ?? '',
      jobCta:      j.applyLabel ?? 'Apply Now',
      jobUrl:      j.applyUrl ?? '#',
    }))

    return <JobsListShell data={data} items={items} />
  } catch {
    return <JobsListShell data={data} items={[]} />
  }
}

function formatPositionType(value: string): string {
  const map: Record<string, string> = {
    'full-time':  'Full-time',
    'part-time':  'Part-time',
    'contract':   'Contract',
    'remote':     'Remote',
    'internship': 'Internship',
    'freelance':  'Freelance',
  }
  return map[value] ?? value
}
