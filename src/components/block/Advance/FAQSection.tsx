// FAQ Section — Layout Builder (Advance)
// Style 1: white bg, centered heading + divider-line accordion
// Style 2: white bg, badge pill + centered heading + bordered-card accordion (Figma 1418:11304)

interface FAQItem {
  faqQuestion?: string
  faqAnswer?: string
}

interface FAQSectionData {
  faqStyle?: 'style1' | 'style2'
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

// ─── Style 2 — bordered-card accordion (Figma 1418:11304) ─────────────────────

const FAQ2_CSS = `
  .faq2{box-sizing:border-box;background:#ffffff;padding:96px;display:flex;flex-direction:column;gap:48px;align-items:center;width:100%}
  .faq2__header{display:flex;flex-direction:column;gap:16px;align-items:center;width:100%}
  .faq2__badge{display:inline-flex;align-items:center;gap:8px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:9999px;padding:7px 13px}
  .faq2__badge-icon{font-size:11px;color:#4b5563;font-style:normal;line-height:1;font-family:var(--font-work-sans,'Work Sans',sans-serif);font-weight:600}
  .faq2__badge-text{font-family:var(--font-work-sans,'Work Sans',sans-serif);font-weight:600;font-size:12px;line-height:16px;color:#4b5563;letter-spacing:0.6px;text-transform:uppercase}
  .faq2__heading-wrap{padding-top:8px;width:100%;text-align:center}
  .faq2__heading{font-family:var(--font-work-sans,'Work Sans',sans-serif);font-weight:500;font-size:30px;line-height:36px;color:#111827;text-align:center;margin:0}
  .faq2__subheading{font-family:var(--font-work-sans,'Work Sans',sans-serif);font-weight:400;font-size:14px;line-height:20px;color:#6b7280;text-align:center;margin:0}
  .faq2__list{display:flex;flex-direction:column;gap:16px;width:100%;max-width:768px}
  .faq2__item{border:1px solid #e5e7eb;border-radius:8px;overflow:hidden}
  .faq2__question-row{display:flex;align-items:center;justify-content:space-between;padding:24px;background:#ffffff;cursor:pointer;list-style:none;width:100%;gap:16px}
  .faq2__question-row::-webkit-details-marker{display:none}
  .faq2__item[open] .faq2__question-row{background:#f9fafb}
  .faq2__question{font-family:var(--font-work-sans,'Work Sans',sans-serif);font-weight:500;font-size:14px;line-height:20px;color:#111827;margin:0}
  .faq2__icon-wrap{flex-shrink:0;display:flex;align-items:center;justify-content:center;width:20px;height:20px}
  .faq2__icon-plus{display:block}.faq2__icon-minus{display:none}
  .faq2__item[open] .faq2__icon-plus{display:none}
  .faq2__item[open] .faq2__icon-minus{display:block}
  .faq2__answer{background:#f9fafb;padding:0 24px 24px}
  .faq2__answer-text{font-family:var(--font-work-sans,'Work Sans',sans-serif);font-weight:400;font-size:12px;line-height:19.5px;color:#4b5563;margin:0}
  @media(max-width:767px){.faq2{padding:64px 24px}}
`

function FAQShellStyle2({ data, items }: { data: FAQSectionData; items: FAQItem[] }) {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: FAQ2_CSS }} />
      <section className="faq2">
        <div className="faq2__header">
          <div className="faq2__badge">
            <span className="faq2__badge-icon">?</span>
            <span className="faq2__badge-text">FAQ</span>
          </div>
          {data.faqHeading && (
            <div className="faq2__heading-wrap">
              <h2 className="faq2__heading">{data.faqHeading}</h2>
            </div>
          )}
          {data.faqSubheading && (
            <p className="faq2__subheading">{data.faqSubheading}</p>
          )}
        </div>
        {items.length > 0 && (
          <div className="faq2__list">
            {items.map((item, i) => (
              <details key={i} className="faq2__item">
                <summary className="faq2__question-row">
                  <span className="faq2__question">{item.faqQuestion}</span>
                  <span className="faq2__icon-wrap">
                    <svg className="faq2__icon-plus" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 1.5v11M1.5 7h11" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <svg className="faq2__icon-minus" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 7h11" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                </summary>
                {item.faqAnswer && (
                  <div className="faq2__answer">
                    <p className="faq2__answer-text">{item.faqAnswer}</p>
                  </div>
                )}
              </details>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

// ─── Sync default export (admin preview / manual mode) ────────────────────────

export default function FAQSection({ data }: { data: FAQSectionData }) {
  const items = (data.faqItems ?? []).map((it) => ({
    faqQuestion: it.faqQuestion,
    faqAnswer: it.faqAnswer,
  }))
  if ((data.faqStyle ?? 'style1') === 'style2') return <FAQShellStyle2 data={data} items={items} />
  return <FAQShell data={data} items={items} />
}

// ─── Async server export (collection mode) ────────────────────────────────────

export async function FAQSectionServerSection({ data }: { data: FAQSectionData }) {
  const isCollection = (data.faqContentSource ?? 'manual') === 'collection'
  const style = data.faqStyle ?? 'style1'

  if (!isCollection) {
    const items = (data.faqItems ?? []).map((it) => ({ faqQuestion: it.faqQuestion, faqAnswer: it.faqAnswer }))
    if (style === 'style2') return <FAQShellStyle2 data={data} items={items} />
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

    if (style === 'style2') return <FAQShellStyle2 data={data} items={items} />
    return <FAQShell data={data} items={items} />
  } catch {
    if (style === 'style2') return <FAQShellStyle2 data={data} items={[]} />
    return <FAQShell data={data} items={[]} />
  }
}
