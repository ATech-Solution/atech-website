// FAQ Section — Layout Builder (Advance)
// White bg, centered heading + accordion-style FAQ items

interface FAQItem {
  faqQuestion?: string
  faqAnswer?: string
}

interface FAQSectionData {
  faqHeading?: string
  faqSubheading?: string
  faqContentSource?: 'collection' | 'manual'
  faqCategorySlug?: string
  faqLimit?: number
  faqItems?: FAQItem[]
}

function FAQAccordion({ items }: { items: FAQItem[] }) {
  return (
    <div className="flex flex-col" style={{ borderTop: '1px solid #e5e5e5' }}>
      {items.map((item, i) => (
        <details key={i} className="group" style={{ borderBottom: '1px solid #e5e5e5' }}>
          <summary className="flex items-center justify-between cursor-pointer py-5 gap-4" style={{ listStyle: 'none' }}>
            <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', fontWeight: 400, color: '#000000', lineHeight: '28px' }}>
              {item.faqQuestion}
            </span>
            <span className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: '28px', height: '28px', background: '#f5f5f5', color: '#171717', fontSize: '16px', fontWeight: 300 }}>
              +
            </span>
          </summary>
          {item.faqAnswer && (
            <div style={{ paddingBottom: '20px' }}>
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252', lineHeight: '24px' }}>
                {item.faqAnswer}
              </p>
            </div>
          )}
        </details>
      ))}
    </div>
  )
}

function FAQShell({ data, items }: { data: FAQSectionData; items: FAQItem[] }) {
  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto flex flex-col gap-12" style={{ maxWidth: '896px' }}>
        {(data.faqHeading || data.faqSubheading) && (
          <div className="text-center flex flex-col gap-4">
            {data.faqHeading && (
              <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400, color: '#000000', letterSpacing: '-0.5px' }}>
                {data.faqHeading}
              </h2>
            )}
            {data.faqSubheading && (
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '28px' }}>
                {data.faqSubheading}
              </p>
            )}
          </div>
        )}
        {items.length > 0 && <FAQAccordion items={items} />}
      </div>
    </section>
  )
}

// ─── Sync default export (admin preview / manual mode) ────────────────────────

export default function FAQSection({ data }: { data: FAQSectionData }) {
  const items = (data.faqItems ?? []).map((it) => ({
    faqQuestion: it.faqQuestion,
    faqAnswer: it.faqAnswer,
  }))
  return <FAQShell data={data} items={items} />
}

// ─── Async server export (collection mode) ────────────────────────────────────

export async function FAQSectionServerSection({ data }: { data: FAQSectionData }) {
  const isCollection = (data.faqContentSource ?? 'manual') === 'collection'

  if (!isCollection) {
    const items = (data.faqItems ?? []).map((it) => ({ faqQuestion: it.faqQuestion, faqAnswer: it.faqAnswer }))
    return <FAQShell data={data} items={items} />
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'
    const params = new URLSearchParams({
      limit: String(data.faqLimit ?? 20),
      sort: 'order',
      depth: '1',
    })
    if (data.faqCategorySlug) {
      params.set('where[category.slug][equals]', data.faqCategorySlug)
    }

    const res = await fetch(`${baseUrl}/api/faqs?${params.toString()}`, { next: { revalidate: 60 } })
    const json = await res.json()

    const items: FAQItem[] = (json.docs ?? []).map((f: any) => ({
      faqQuestion: f.question ?? '',
      faqAnswer: f.answer ?? '',
    }))

    return <FAQShell data={data} items={items} />
  } catch {
    return <FAQShell data={data} items={[]} />
  }
}
