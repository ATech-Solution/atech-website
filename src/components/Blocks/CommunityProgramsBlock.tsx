// Community Programs — Figma node 1:30812
// Dark #171717 background, 2-col cards: Community Blog + Mentorship Program

import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface CommunityProgram {
  iconSrc:     string
  title:       string
  description: string
  ctaLabel:    string
  ctaUrl:      string
}

interface CommunityProgramsData {
  programs: CommunityProgram[]
}

// ─── CommunityProgramsBlock ───────────────────────────────────────────────────
export default function CommunityProgramsBlock({ data }: { data: CommunityProgramsData }) {
  const { programs } = data

  return (
    <section className="pb-24 px-6 md:px-10" style={{ background: '#171717' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((p) => (
            <div
              key={p.title}
              className="flex flex-col gap-4 p-8"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {/* Icon */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.iconSrc} alt={p.title} className="object-contain" style={{ width: '36px', height: '36px' }} />

              {/* Title */}
              <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', lineHeight: '32px' }}>
                {p.title}
              </h3>

              {/* Description */}
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#d4d4d4', lineHeight: '1.625' }}>
                {p.description}
              </p>

              {/* CTA */}
              <Link
                href={p.ctaUrl}
                className="mt-auto inline-flex items-center justify-center px-7 py-4 text-base font-normal transition-opacity duration-200 hover:opacity-80 self-start"
                style={{ border: '2px solid #ffffff', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {p.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
