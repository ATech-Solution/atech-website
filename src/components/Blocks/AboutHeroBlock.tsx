// About Us Hero — Figma node 1:29731
// White background, centered badge + large heading + subheading

// ─── Types ────────────────────────────────────────────────────────────────────
interface AboutHeroData {
  badge:        string
  badgeIconSrc: string
  heading:      string
  subheading:   string
}

// ─── AboutHeroBlock ───────────────────────────────────────────────────────────
export default function AboutHeroBlock({ data }: { data: AboutHeroData }) {
  const { badge, badgeIconSrc, heading, subheading } = data

  return (
    <section className="px-6 md:px-10 pt-24 pb-12" style={{ background: '#ffffff' }}>
      <div
        className="mx-auto flex flex-col items-center text-center gap-6"
        style={{ maxWidth: '896px' }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-center"
          style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={badgeIconSrc} alt="" className="object-contain flex-shrink-0" style={{ width: '9px', height: '12px' }} />
          <span
            className="text-xs font-normal tracking-[0.6px] uppercase"
            style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
          >
            {badge}
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily:    'var(--font-work-sans, sans-serif)',
            fontSize:      'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight:    400,
            color:         '#000000',
            letterSpacing: '-1.2px',
            lineHeight:    1,
          }}
        >
          {heading}
        </h1>

        {/* Subheading */}
        <p
          className="max-w-2xl"
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '1.25rem',
            color:      '#525252',
            lineHeight: '28px',
          }}
        >
          {subheading}
        </p>

        {/* Video placeholder */}
        <div
          className="w-full mt-4 flex items-center justify-center rounded-xl"
          style={{
            background: '#e5e5e5',
            height:     '264px',
          }}
        >
          <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem' }}>
            Company Overview Video
          </span>
        </div>
      </div>
    </section>
  )
}
