// Server component — no 'use client'. Fetches testimonials from CMS via REST.
import { TestimonialsShell, type TestimonialItem, type TestimonialsSectionData } from './TestimonialsSection'

export async function TestimonialsSectionServerSection({ data }: { data: TestimonialsSectionData }) {
  const isCollection = (data.testimonialsContentSource ?? 'manual') === 'collection'

  if (!isCollection) {
    const items: TestimonialItem[] = (data.testimonialItems ?? []).map((t) => ({
      clientName:    t.clientName,
      clientRole:    t.clientRole,
      clientCompany: t.clientCompany,
      quote:         t.quote,
      rating:        t.rating,
      avatar:        t.avatar,
    }))
    return <TestimonialsShell data={data} items={items} />
  }

  try {
    const base = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'
    const url = new URL('/api/testimonials', base)
    url.searchParams.set('limit', String(data.testimonialsLimit ?? 9))
    url.searchParams.set('sort', 'order')
    url.searchParams.set('depth', '1')
    url.searchParams.set('locale', 'en')

    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) return <TestimonialsShell data={data} items={[]} />

    const json = await res.json()
    const items: TestimonialItem[] = (json.docs ?? []).map((t: any) => ({
      clientName:    t.clientName    ?? '',
      clientRole:    t.clientRole    ?? '',
      clientCompany: t.clientCompany ?? '',
      quote:         t.quote         ?? '',
      rating:        t.rating        ?? 5,
      avatar:        t.avatar?.url
        ? { url: t.avatar.url, alt: t.avatar.alt ?? t.clientName ?? '' }
        : undefined,
    }))

    return <TestimonialsShell data={data} items={items} />
  } catch {
    return <TestimonialsShell data={data} items={[]} />
  }
}
