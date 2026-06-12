// Quote-Intro Section — Layout Builder (Advance)
// Two modes via quoteStyle:
//   'quote' (default): 24px/500 centered text with curly quotes — Figma 1400:11620
//   'intro':           30px/700 bold heading, no quotes        — Figma 1400:11625

const CSS = `
  .quoteintrosection {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 96px;
  }

  @media (max-width: 767px) {
    .quoteintrosection { padding: 40px 24px; }
  }
`

export interface QuoteIntroSectionData {
  quoteStyle?: 'quote' | 'intro'
  quoteText?:  string
  quoteBody?:  string
}

export default function QuoteIntroSection({ data }: { data: QuoteIntroSectionData }) {
  const isIntro = data.quoteStyle === 'intro'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="quoteintrosection">
        {data.quoteText && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   isIntro ? '30px' : '24px',
              fontWeight: isIntro ? 700    : 500,
              color:      '#111827',
              textAlign:  'center',
              maxWidth:   '896px',
              lineHeight: isIntro ? '36px' : '40px',
              margin:     0,
            }}
          >
            {isIntro ? data.quoteText : <>&ldquo;{data.quoteText}&rdquo;</>}
          </p>
        )}

        {data.quoteBody && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '16px',
              fontWeight: 400,
              color:      '#4b5563',
              textAlign:  'center',
              maxWidth:   '768px',
              lineHeight: '24px',
              margin:     0,
            }}
          >
            {data.quoteBody}
          </p>
        )}
      </section>
    </>
  )
}
