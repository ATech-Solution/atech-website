// Server component — no 'use client'. Resolves items from collection or manual,
// then hands off to the client accordion component.

import { FAQAboutClient, type FAQAboutResolvedItem, type FAQAboutSectionData } from './FAQAboutSection'

async function fetchFAQItems(
  limit: number,
  categorySlug?: string,
): Promise<FAQAboutResolvedItem[]> {
  const base =
    process.env.PAYLOAD_PUBLIC_SERVER_URL ??
    process.env.NEXT_PUBLIC_DOMAIN ??
    'http://localhost:3000'

  try {
    const url = new URL('/api/faqs', base)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('sort', 'order')
    url.searchParams.set('depth', '1')
    if (categorySlug) {
      url.searchParams.set('where[category.slug][equals]', categorySlug)
    }

    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) return []

    const json = await res.json()
    return (json.docs ?? []).map((f: any) => ({
      question: typeof f.question === 'string' ? f.question : (f.question?.en ?? ''),
      answer:   typeof f.answer   === 'string' ? f.answer   : (f.answer?.en   ?? ''),
    }))
  } catch {
    return []
  }
}

export async function FAQAboutServerSection({ data }: { data: FAQAboutSectionData }) {
  const isCollection = (data.faqContentSource ?? 'manual') === 'collection'

  let items: FAQAboutResolvedItem[]

  if (isCollection) {
    items = await fetchFAQItems(data.faqLimit ?? 20, data.faqCategorySlug)
  } else {
    items = (data.faqItems ?? []).map((it) => ({
      question: it.faqQuestion ?? '',
      answer:   it.faqAnswer,
    }))
  }

  return (
    <FAQAboutClient
      badge={data.badge}
      badgeIconUrl={data.badgeIconUrl ?? (data.badgeIcon as any)?.url}
      heading={data.faqHeading}
      subheading={data.faqSubheading}
      items={items}
      seeMoreLabel={data.faqSeeMoreLabel}
      seeMoreUrl={data.faqSeeMoreUrl}
    />
  )
}
