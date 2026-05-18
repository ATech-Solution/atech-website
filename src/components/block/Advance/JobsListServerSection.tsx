// Server-only: fetches job vacancies from the Payload local API (no HTTP round-trip)
import { getPayloadClient } from '@/lib/payload'
import { JobsListShell, type JobsListData } from './JobsListSection'
import JobsListSection from './JobsListSection'
import { type JobItem } from './JobsListClient'

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

export async function JobsListServerSection({ data }: { data: JobsListData }) {
  const isCollection = (data.jobSource ?? 'manual') === 'collection'

  if (!isCollection) {
    return <JobsListSection data={data} />
  }

  try {
    const payload = await getPayloadClient()

    const where: Record<string, any> = { status: { equals: 'active' } }
    if (data.jobCategory) {
      where['category'] = { equals: data.jobCategory }
    }

    const result = await payload.find({
      collection: 'job-vacancies',
      where,
      limit: data.jobLimit ?? 20,
      sort: 'order',
      depth: 0,
      overrideAccess: true,
    })

    const items: JobItem[] = (result.docs ?? []).map((j: any) => ({
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
    return <JobsListSection data={data} />
  }
}
