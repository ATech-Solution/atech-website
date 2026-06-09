// Services (Mascot) Section — Layout Builder variant (Advance)
// Used by: services-mascot block type
// Figma: ATech_Design (node 1412-10639) — 2×2 service-card grid with the TAC
// mascot + speech bubble on the right and a decorative gold sunburst.

import Link from 'next/link'

interface MascotServiceItem {
  serviceIcon?:  { url: string; alt?: string }
  serviceTitle?: string
  serviceDesc?:  string
  serviceHref?:  string
}

interface ServicesMascotSectionData {
  heading?:          string
  subheading?:       string
  serviceItems?:     MascotServiceItem[]
  mascotImage?:      { url: string; alt?: string } | null
  mascotBubbleText?: string
  backgroundImage?:  { url: string; alt?: string } | null
}

const MASCOT_FALLBACK = '/assets/blocks/tac-mascot.png'
const GOLD_LINES      = '/assets/blocks/services-gold-lines.svg'

function Arrow() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden className="flex-shrink-0">
      <path d="M1 6h11M7.5 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Default glyphs roughly matching the Figma cards (code / bulb / users / rocket).
function DefaultIcon({ index }: { index: number }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true as const, stroke: '#111827', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (index % 4) {
    case 0: return (<svg {...common}><polyline points="8 9 5 12 8 15" /><polyline points="16 9 19 12 16 15" /><line x1="13" y1="7" x2="11" y2="17" /></svg>)
    case 1: return (<svg {...common}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3Z" /></svg>)
    case 2: return (<svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0-2-5.2M21 20a6 6 0 0 0-5-5.9" /></svg>)
    default: return (<svg {...common}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 12l3-3M14.5 4.5C19 6 18 13 14 17l-4 1-3-3 1-4c4-4 11-5 12.5-3Z" /><circle cx="14.5" cy="9.5" r="1.5" /></svg>)
  }
}

function ServiceCard({ item, index }: { item: MascotServiceItem; index: number }) {
  const inner = (
    <div
      className="group flex h-full flex-col items-start gap-4 rounded-[12px] bg-white p-8 transition-shadow duration-200 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)]"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[6px] bg-[#f5f5f5]">
        {item.serviceIcon?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.serviceIcon.url} alt={item.serviceIcon.alt ?? ''} className="object-contain" style={{ maxWidth: 22, maxHeight: 22 }} />
        ) : (
          <DefaultIcon index={index} />
        )}
      </div>

      {item.serviceTitle && (
        <h3 className="pt-1 leading-[28px]" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 20, fontWeight: 600, color: '#111827' }}>
          {item.serviceTitle}
        </h3>
      )}

      {item.serviceDesc && (
        <div
          className="leading-[20px]"
          style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 14, fontWeight: 400, color: '#4b5563' }}
          dangerouslySetInnerHTML={{ __html: item.serviceDesc }}
        />
      )}

      {item.serviceHref && (
        <span
          className="mt-auto inline-flex items-center gap-2 pt-2 transition-all duration-200 group-hover:gap-3"
          style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 14, fontWeight: 700, color: '#1f2937' }}
        >
          Learn More <Arrow />
        </span>
      )}
    </div>
  )

  if (item.serviceHref) {
    return (
      <Link href={item.serviceHref} className="block h-full" style={{ textDecoration: 'none' }}>
        {inner}
      </Link>
    )
  }
  return inner
}

export default function ServicesMascotSection({ data }: { data: ServicesMascotSectionData }) {
  const items       = data.serviceItems ?? []
  const bubbleText  = data.mascotBubbleText ?? "Hi I'm TAC, the Ambassador of ATech!"
  const mascotUrl   = data.mascotImage?.url || MASCOT_FALLBACK
  const bgImage     = data.backgroundImage?.url
  const sectionBg   = bgImage
    ? `linear-gradient(rgba(43,43,43,0.78), rgba(43,43,43,0.78)), url("${bgImage}") center / cover no-repeat`
    : 'var(--color-bg, #2b2b2b)'

  return (
    <section
      className="relative overflow-hidden py-24"
      style={{
        // background: sectionBg,
        // backgroundSize: 'contain',
        // backgroundPosition: 'right',
        borderTop: '1px solid var(--color-border, #1f2937)',
        paddingTop: 'var(--section-padding-y, 96px)',
        paddingBottom: 'var(--section-padding-y, 96px)',
      }}
    >
      <div 
        style={{
          background: sectionBg,
          backgroundSize: 'contain',
          backgroundPosition: 'right',
          // transform: 'rotate(180deg)',      
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
      }}>
      </div>
      {/* Decorative gold sunburst (top-right) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 hidden h-[560px] w-[560px] opacity-30 lg:block"
        // style={{ background: `url("${GOLD_LINES}") center / contain no-repeat` }}
      />

      <div className="relative mx-auto px-6 md:px-10" style={{ maxWidth: 'var(--content-max-width, 1280px)' }}>
        {/* Heading */}
        {(data.heading || data.subheading) && (
          <div className="mb-16 flex flex-col items-center gap-4 text-center">
            {data.heading && (
              <h2
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 36, fontWeight: 500, color: 'var(--color-accent, #ffd25e)', lineHeight: '40px' }}
                dangerouslySetInnerHTML={{ __html: data.heading }}
              />
            )}
            {data.subheading && (
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 16, color: '#d1d5db', lineHeight: '24px', maxWidth: 640 }}>
                {data.subheading}
              </p>
            )}
          </div>
        )}

        {/* Cards + mascot */}
        <div className="mx-auto flex max-w-[1152px] flex-col items-stretch gap-8 lg:flex-row">
          {items.length > 0 && (
            <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
              {items.map((item, i) => (
                <ServiceCard key={i} item={item} index={i} />
              ))}
            </div>
          )}

          {/* Mascot column */}
          <div className="flex w-full flex-col items-center justify-end lg:w-[300px]">
            <div className="relative w-full max-w-[260px]">
              <div className="rounded-[24px] bg-white p-6 text-center shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)]">
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 14, fontWeight: 500, color: '#1f2937', lineHeight: '20px' }}>
                  {bubbleText}
                </p>
              </div>
              {/* Bubble tail */}
              <div className="absolute left-[62%] -bottom-2 h-4 w-4 rotate-45 bg-white" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mascotUrl}
              alt={data.mascotImage?.alt ?? 'TAC mascot'}
              className="mt-4 h-auto w-[180px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
