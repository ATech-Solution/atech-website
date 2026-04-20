// FAQ Accordion — Figma node 1:30131
// White background, left sidebar with categories, right = accordion items

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const EXPAND_ICON   = 'https://www.figma.com/api/mcp/asset/ecd97d5c-adb4-45d0-9885-4d25dc23a51f'
const COLLAPSE_ICON = 'https://www.figma.com/api/mcp/asset/50ac79da-32fc-477f-9b1b-c35d671df5d2'

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQItem {
  question: string
  answer:   string
}

interface FAQAccordionData {
  heading:    string
  subheading: string
  items:      FAQItem[]
}

// ─── Single FAQ item ──────────────────────────────────────────────────────────
function FAQItem({ question, answer }: FAQItem) {
  return (
    <details
      className="group"
      style={{
        background:   '#ffffff',
        border:       '1px solid #e5e5e5',
        borderRadius: 0,
      }}
    >
      <summary
        className="flex items-start justify-between gap-8 p-8 cursor-pointer list-none"
        style={{ padding: '33px' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '1.125rem',
            fontWeight: 400,
            color:      '#000000',
            lineHeight: '28px',
          }}
        >
          {question}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={EXPAND_ICON}
          alt=""
          className="flex-shrink-0 object-contain group-open:hidden"
          style={{ width: '17.5px', height: '20px', marginTop: '4px' }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={COLLAPSE_ICON}
          alt=""
          className="flex-shrink-0 object-contain hidden group-open:block"
          style={{ width: '17.5px', height: '20px', marginTop: '4px' }}
        />
      </summary>
      <div style={{ padding: '0 33px 33px' }}>
        <p
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '1rem',
            color:      '#525252',
            lineHeight: '26px',
          }}
        >
          {answer}
        </p>
      </div>
    </details>
  )
}

// ─── FAQAccordionBlock ────────────────────────────────────────────────────────
export default function FAQAccordionBlock({ data }: { data: FAQAccordionData }) {
  const { heading, subheading, items } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="flex flex-col items-center mb-16">
          <h2
            className="mb-4 text-center"
            style={{
              fontFamily:    'var(--font-work-sans, sans-serif)',
              fontSize:      'clamp(2rem, 4vw, 3rem)',
              fontWeight:    400,
              color:         '#000000',
              letterSpacing: '-0.5px',
              lineHeight:    1.1,
            }}
          >
            {heading}
          </h2>
          {subheading && (
            <p
              className="text-center max-w-xl"
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '1.125rem',
                color:      '#525252',
                lineHeight: '1.625',
              }}
            >
              {subheading}
            </p>
          )}
        </div>

        <div className="flex flex-col max-w-4xl mx-auto" style={{ gap: '16px' }}>
          {items.map((item, idx) => (
            <FAQItem key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
