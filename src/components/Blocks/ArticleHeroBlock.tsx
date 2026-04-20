// Article Hero — Figma node 1:31451
// White background, left-aligned heading + subheading

// ─── Types ────────────────────────────────────────────────────────────────────
interface ArticleHeroData {
  heading:    string
  subheading: string
}

// ─── ArticleHeroBlock ─────────────────────────────────────────────────────────
export default function ArticleHeroBlock({ data }: { data: ArticleHeroData }) {
  const { heading, subheading } = data

  return (
    <section className="px-6 md:px-10 py-24" style={{ background: '#ffffff' }}>
      <div className="mx-auto flex flex-col gap-6 max-w-3xl" style={{ maxWidth: '1280px' }}>
        <h1
          style={{
            fontFamily:    'var(--font-work-sans, sans-serif)',
            fontSize:      'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight:    400,
            color:         '#171717',
            letterSpacing: '-1.2px',
            lineHeight:    1,
          }}
        >
          {heading}
        </h1>
        <p
          className="max-w-2xl"
          style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#525252', lineHeight: '1.625' }}
        >
          {subheading}
        </p>
      </div>
    </section>
  )
}
