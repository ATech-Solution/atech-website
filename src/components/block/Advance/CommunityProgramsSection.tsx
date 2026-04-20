// Community Programs Section — dark #171717 background, 2-col program cards

import Link from 'next/link'

interface ProgramItem {
  programIcon?:  string
  programTitle?: string
  programDesc?:  string
  programCta?:   string
  programUrl?:   string
}

interface CommunityProgramsData {
  programItems?: ProgramItem[]
}

export default function CommunityProgramsSection({ data }: { data: CommunityProgramsData }) {
  const { programItems = [] } = data

  return (
    <section className="pb-24 px-6 md:px-10" style={{ background: '#171717' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programItems.map((p, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-8"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {p.programIcon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.programIcon} alt={p.programTitle ?? ''} className="object-contain" style={{ width: '36px', height: '36px' }} />
              )}
              {p.programTitle && (
                <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', lineHeight: '32px' }}>
                  {p.programTitle}
                </h3>
              )}
              {p.programDesc && (
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#d4d4d4', lineHeight: '1.625' }}>
                  {p.programDesc}
                </p>
              )}
              {p.programCta && p.programUrl && (
                <Link
                  href={p.programUrl}
                  className="mt-auto inline-flex items-center justify-center px-7 py-4 text-base font-normal transition-opacity duration-200 hover:opacity-80 self-start"
                  style={{ border: '2px solid #ffffff', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {p.programCta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
