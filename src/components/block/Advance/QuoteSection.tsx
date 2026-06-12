// Quote Section — Layout Builder (Advance)
// Centered pull-quote: large quote text + smaller body text. Figma node 1400:11620.

const CSS = `
  .quotesection {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 96px;
  }

  @media (max-width: 767px) {
    .quotesection { padding: 40px 24px; }
  }
`

export interface QuoteSectionData {
  quoteText?: string
  quoteBody?: string
}

export default function QuoteSection({ data }: { data: QuoteSectionData }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="quotesection">
        {data.quoteText && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '24px',
              fontWeight: 500,
              color: '#111827',
              textAlign: 'center',
              maxWidth: '896px',
              lineHeight: '40px',
              margin: 0,
            }}
          >
            &ldquo;{data.quoteText}&rdquo;
          </p>
        )}

        {data.quoteBody && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '16px',
              fontWeight: 400,
              color: '#4b5563',
              textAlign: 'center',
              maxWidth: '768px',
              lineHeight: '24px',
              margin: 0,
            }}
          >
            {data.quoteBody}
          </p>
        )}
      </section>
    </>
  )
}
