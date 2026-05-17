// Server component — no 'use client'. Fetches FAQ categories + items from CMS.
import { FAQMainClient, type FAQCategory, type FAQEntry, type FAQMainData } from './FAQMainSection'

async function fetchFAQData(data: FAQMainData): Promise<{ categories: FAQCategory[]; faqs: FAQEntry[] }> {
  const base = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'

  try {
    const catsUrl = new URL('/api/faq-categories', base)
    catsUrl.searchParams.set('limit', '100')
    catsUrl.searchParams.set('sort', 'createdAt')
    catsUrl.searchParams.set('locale', 'en')

    const faqsUrl = new URL('/api/faqs', base)
    faqsUrl.searchParams.set('limit', String(data.faqLimit ?? 100))
    faqsUrl.searchParams.set('sort', 'order')
    faqsUrl.searchParams.set('depth', '1')
    faqsUrl.searchParams.set('locale', 'en')
    if (data.faqCategorySlug) {
      faqsUrl.searchParams.set('where[category.slug][equals]', data.faqCategorySlug)
    }

    const [catsRes, faqsRes] = await Promise.all([
      fetch(catsUrl.toString(), { next: { revalidate: 60 } }),
      fetch(faqsUrl.toString(), { next: { revalidate: 60 } }),
    ])

    if (!catsRes.ok || !faqsRes.ok) return { categories: [], faqs: [] }

    const [catsData, faqsData] = await Promise.all([catsRes.json(), faqsRes.json()])

    const categories: FAQCategory[] = (catsData.docs ?? []).map((c: any) => ({
      id: String(c.id),
      name: typeof c.name === 'string' ? c.name : (c.name?.en ?? ''),
      title: typeof c.title === 'string' ? c.title : (c.title?.en ?? c.name?.en ?? ''),
      slug: c.slug ?? '',
    }))

    const faqs: FAQEntry[] = (faqsData.docs ?? []).map((f: any) => ({
      id: String(f.id),
      categorySlug: typeof f.category === 'object' ? (f.category?.slug ?? '') : '',
      question: typeof f.question === 'string' ? f.question : (f.question?.en ?? ''),
      answer: typeof f.answer === 'string' ? f.answer : (f.answer?.en ?? ''),
    }))

    return { categories, faqs }
  } catch {
    return { categories: [], faqs: [] }
  }
}

export async function FAQMainServerSection({ data }: { data: FAQMainData }) {
  const isCollection = (data.faqContentSource ?? 'collection') === 'collection'

  let categories: FAQCategory[] = []
  let faqs: FAQEntry[] = []

  if (isCollection) {
    const result = await fetchFAQData(data)
    categories = result.categories
    faqs = result.faqs
  } else {
    faqs = (data.faqItems ?? []).map((it, i) => ({
      id: String(i),
      categorySlug: 'manual',
      question: it.question ?? '',
      answer: it.answer,
    }))
    if (faqs.length > 0) {
      categories = [{ id: 'manual', name: 'General', title: 'FAQs', slug: 'manual' }]
    }
  }

  return (
    <FAQMainClient
      categories={categories}
      faqs={faqs}
      backLabel={data.faqBackLabel}
      backUrl={data.faqBackUrl}
    />
  )
}
