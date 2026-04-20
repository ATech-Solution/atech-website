// Who We Serve Hero — Figma node 1:28634
// White background, breadcrumb, 2-col: left = badge+heading+body+CTAs+stat | right = image

import Link from 'next/link'

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const BREADCRUMB_CHEVRON = 'https://www.figma.com/api/mcp/asset/4e5bfa94-d6ab-4fb5-aad8-71de6ac1e5ce'
const CTA_ARROW          = 'https://www.figma.com/api/mcp/asset/4bb2ae5b-279f-4593-9f57-b17772617cd0'

// ─── Types ────────────────────────────────────────────────────────────────────
interface BreadcrumbItem { label: string; href: string | null }

interface WhoWeServeHeroData {
  badge:        string
  badgeIconSrc: string
  breadcrumb:   BreadcrumbItem[]
  heading:      string
  body:         string
  cta:          { primary: { label: string; url: string }; secondary: { label: string; url: string } }
  stat:         { value: string; label: string }
}

// ─── WhoWeServeHeroBlock ──────────────────────────────────────────────────────
export default function WhoWeServeHeroBlock({ data }: { data: WhoWeServeHeroData }) {
  const { badge, badgeIconSrc, breadcrumb, heading, body, cta, stat } = data

  return (
    <>
      {/* ── Breadcrumb bar ──────────────────────────────────────────────────── */}
      <div className="px-6 md:px-10 py-6" style={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <nav className="flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
            {breadcrumb.map((item, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {idx > 0 && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={BREADCRUMB_CHEVRON} alt="" className="object-contain" style={{ width: '7.5px', height: '12px' }} />
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-sm font-normal transition-colors duration-150 hover:text-[#171717]"
                    style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-sm font-normal" style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24" style={{ background: '#ffffff' }}>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" style={{ maxWidth: '1280px' }}>
          {/* Left column */}
          <div className="flex flex-col">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 self-start"
              style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={badgeIconSrc} alt="" className="object-contain flex-shrink-0" style={{ width: '9px', height: '12px' }} />
              <span className="text-xs font-normal tracking-[0.6px] uppercase" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                {badge}
              </span>
            </div>

            {/* Heading */}
            <h1
              className="mb-6"
              style={{
                fontFamily:    'var(--font-work-sans, sans-serif)',
                fontSize:      'clamp(2rem, 4vw, 3rem)',
                fontWeight:    400,
                color:         '#171717',
                letterSpacing: '-1.2px',
                lineHeight:    1,
              }}
            >
              {heading.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>

            {/* Body */}
            <p className="mb-10 max-w-xl" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.625' }}>
              {body}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href={cta.primary.url}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-80"
                style={{ background: '#171717', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {cta.primary.label}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CTA_ARROW} alt="" className="object-contain" style={{ width: '12px', height: '14px' }} />
              </Link>
              <Link
                href={cta.secondary.url}
                className="inline-flex items-center px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-70"
                style={{ background: '#ffffff', border: '1px solid #d4d4d4', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {cta.secondary.label}
              </Link>
            </div>

            {/* Stat */}
            <div className="flex items-center gap-4 pt-8" style={{ borderTop: '1px solid #e5e5e5' }}>
              <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '2rem', fontWeight: 400, color: '#171717' }}>
                {stat.value}
              </span>
              <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.4' }}>
                {stat.label}
              </span>
            </div>
          </div>

          {/* Right column — placeholder image */}
          <div
            className="hidden lg:block relative w-full overflow-hidden"
            style={{ height: '480px', background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: '12px' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span style={{ color: '#a3a3a3', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem' }}>
                Startup Growth Illustration
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
