// FAQ Section — Layout Builder (Advance)
// White bg, centered heading + accordion-style FAQ items

interface FAQItem {
  faqQuestion?: string
  faqAnswer?: string
}

interface FAQSectionProps {
  data: {
    faqHeading?: string
    faqSubheading?: string
    faqItems?: FAQItem[]
  }
}

export default function FAQSection({ data }: FAQSectionProps) {
  const { faqHeading, faqSubheading, faqItems = [] } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto flex flex-col gap-12" style={{ maxWidth: '896px' }}>
        {(faqHeading || faqSubheading) && (
          <div className="text-center flex flex-col gap-4">
            {faqHeading && (
              <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400, color: '#000000', letterSpacing: '-0.5px' }}>
                {faqHeading}
              </h2>
            )}
            {faqSubheading && (
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '28px' }}>
                {faqSubheading}
              </p>
            )}
          </div>
        )}

        {faqItems.length > 0 && (
          <div className="flex flex-col" style={{ borderTop: '1px solid #e5e5e5' }}>
            {faqItems.map((item, i) => (
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
        )}
      </div>
    </section>
  )
}
