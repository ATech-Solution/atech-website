// Features Section — Layout Builder variant (Advance)
// Used by: home-about block type — renders a heading + 3-pillar icon-card grid

interface Pillar {
  pillarIcon?:  { url: string; alt?: string }
  pillarTitle?: string
  pillarDesc?:  string
}

interface FeaturesSectionData {
  heading?:         string
  description?:     string
  pillars?:         Pillar[]
  featuresTheme?:   'dark' | 'light'
  featuresColumns?: number
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <div
      className="flex flex-col items-center text-center p-8 rounded-2xl h-full"
      style={{ border: '1px solid var(--color-border, #383838)', background: 'var(--color-surface, #2f2f2f)' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mb-5"
        style={{ background: 'rgba(255,211,105,0.10)', border: '1px solid rgba(255,211,105,0.20)', color: 'var(--color-accent, #ffd369)' }}
      >
        {pillar.pillarIcon?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pillar.pillarIcon.url} alt={pillar.pillarIcon.alt ?? ''} className="w-6 h-6 object-contain" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {pillar.pillarTitle && (
        <h3
          className="text-base font-semibold leading-snug mb-2"
          style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          {pillar.pillarTitle}
        </h3>
      )}

      {pillar.pillarDesc && (
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--color-muted, #525252)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          {pillar.pillarDesc}
        </p>
      )}
    </div>
  )
}

function PillarCardLight({ pillar }: { pillar: Pillar }) {
  return (
    <div className="flex gap-5 p-8 rounded-2xl" style={{ background: '#f5f5f5' }}>
      <div
        className="flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ background: '#ffffff', border: '1px solid #e5e5e5', width: '48px', height: '48px' }}
      >
        {pillar.pillarIcon?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pillar.pillarIcon.url} alt={pillar.pillarIcon.alt ?? ''} className="object-contain" style={{ maxWidth: '24px', maxHeight: '24px' }} />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="#525252" strokeWidth="1.5" />
            <path d="M8 12l3 3 5-5" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex flex-col">
        {pillar.pillarTitle && (
          <h3 className="mb-2" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', fontWeight: 400, color: '#171717', lineHeight: '28px' }}>
            {pillar.pillarTitle}
          </h3>
        )}
        {pillar.pillarDesc && (
          <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.625' }}>
            {pillar.pillarDesc}
          </p>
        )}
      </div>
    </div>
  )
}

export default function FeaturesSection({ data }: { data: FeaturesSectionData }) {
  const pillars  = data.pillars ?? []
  const isLight  = data.featuresTheme === 'light'
  const cols     = data.featuresColumns ?? 3

  const sectionStyle = isLight
    ? { background: 'var(--color-bg, #ffffff)' }
    : { background: 'var(--color-bg, #292929)', borderTop: '1px solid var(--color-border, #383838)' }

  const headingColor = isLight ? 'var(--color-text, #171717)' : 'var(--color-text, #fafafa)'
  const descColor    = isLight ? 'var(--color-muted, #525252)' : 'var(--color-muted, #525252)'
  const gridCols     = `grid-cols-1 ${cols === 2 ? 'md:grid-cols-2' : cols >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`

  return (
    <section className="py-24" style={{ ...sectionStyle, paddingTop: 'var(--section-padding-y, 96px)', paddingBottom: 'var(--section-padding-y, 96px)' }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: 'var(--content-max-width, 1280px)' }}>
        {(data.heading || data.description) && (
          <div className="flex flex-col gap-6 items-center w-full mb-16">
            {data.heading && (
              <h2
                className="text-center w-full leading-tight tracking-tight"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: isLight ? 400 : 700, color: headingColor, letterSpacing: '-0.01em' }}
              >
                {data.heading}
              </h2>
            )}
            {data.description && (
              <p
                className="text-center w-full leading-relaxed"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: descColor, maxWidth: '44rem', marginLeft: 'auto', marginRight: 'auto' }}
              >
                {data.description}
              </p>
            )}
          </div>
        )}

        {pillars.length > 0 && (
          <div className={`grid ${gridCols} gap-6`}>
            {pillars.map((pillar, i) => (
              isLight
                ? <PillarCardLight key={i} pillar={pillar} />
                : <PillarCard key={i} pillar={pillar} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
