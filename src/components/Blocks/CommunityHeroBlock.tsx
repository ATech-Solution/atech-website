// Community Hero — Figma node 1:30812
// Dark #171717 background, centered heading + subheading

// ─── Types ────────────────────────────────────────────────────────────────────
interface CommunityHeroData {
  heading:    string
  subheading: string
}

// ─── CommunityHeroBlock ───────────────────────────────────────────────────────
export default function CommunityHeroBlock({ data }: { data: CommunityHeroData }) {
  const { heading, subheading } = data

  return (
    <section className="px-6 md:px-10 py-24" style={{ background: '#171717' }}>
      <div className="mx-auto flex flex-col items-center text-center gap-6" style={{ maxWidth: '768px' }}>
        <h1
          style={{
            fontFamily:    'var(--font-work-sans, sans-serif)',
            fontSize:      'clamp(2.5rem, 5vw, 3rem)',
            fontWeight:    400,
            color:         '#ffffff',
            letterSpacing: '-1px',
            lineHeight:    1,
          }}
        >
          {heading}
        </h1>
        <p
          className="max-w-2xl"
          style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#d4d4d4', lineHeight: '1.625' }}
        >
          {subheading}
        </p>
      </div>
    </section>
  )
}
