// Service Hero Section — Layout Builder variant
// Used by: web-dev-hero, it-consulting-hero, qa-testing-hero, hr-recruit-hero block types
// White background, breadcrumb, 2-col: badge+heading+body+CTAs | bordered image

import Link from 'next/link'

// ─── Inline SVGs ──────────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden>
      <path d="M1.5 1 7 6l-5.5 5" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  breadcrumbLabel: string
  breadcrumbUrl?:  string
}

export interface WebDevHeroSectionData {
  badge?:              string
  badgeIconSrc?:       string
  breadcrumbItems?:    BreadcrumbItem[]
  heading?:            string
  body?:               string
  ctaPrimaryLabel?:    string
  ctaPrimaryUrl?:      string
  ctaSecondaryLabel?:  string
  ctaSecondaryUrl?:    string
  heroImage?:          { url: string; alt?: string }
}

// ─── WebDevHeroSection ────────────────────────────────────────────────────────

export default function WebDevHeroSection({ data }: { data: WebDevHeroSectionData }) {
  const breadcrumb = data.breadcrumbItems ?? []

  return (
    <>
      {/* ── Breadcrumb bar ──────────────────────────────────────────────────── */}
      {breadcrumb.length > 0 && (
        <div className="px-6 md:px-10 py-6" style={{ background: '#ffffff' }}>
          <div className="mx-auto" style={{ maxWidth: '1280px' }}>
            <nav className="flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
              {breadcrumb.map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  {idx > 0 && <ChevronRight />}
                  {item.breadcrumbUrl ? (
                    <Link
                      href={item.breadcrumbUrl}
                      className="text-sm font-normal transition-colors duration-150 hover:text-[#171717]"
                      style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                    >
                      {item.breadcrumbLabel}
                    </Link>
                  ) : (
                    <span
                      className="text-sm font-normal"
                      style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                    >
                      {item.breadcrumbLabel}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ── Hero section ────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-24 pt-10" style={{ background: '#ffffff' }}>
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          style={{ maxWidth: '1280px' }}
        >
          {/* ── Left column ────────────────────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Badge */}
            {data.badge && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 self-start"
                style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}
              >
                {data.badgeIconSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.badgeIconSrc} alt="" className="w-3 h-3 object-contain flex-shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#525252' }} />
                )}
                <span
                  className="text-xs font-normal tracking-[0.6px] uppercase"
                  style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {data.badge}
                </span>
              </div>
            )}

            {/* Heading */}
            {data.heading && (
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
                {data.heading.split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
            )}

            {/* Body */}
            {data.body && (
              <p
                className="mb-10 max-w-xl"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '1.125rem',
                  color:      '#525252',
                  lineHeight: '1.625',
                }}
              >
                {data.body}
              </p>
            )}

            {/* CTAs */}
            {(data.ctaPrimaryLabel || data.ctaSecondaryLabel) && (
              <div className="flex flex-wrap items-center gap-4">
                {data.ctaPrimaryLabel && data.ctaPrimaryUrl && (
                  <Link
                    href={data.ctaPrimaryUrl}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-80"
                    style={{ background: '#171717', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                  >
                    {data.ctaPrimaryLabel}
                    <ArrowRight />
                  </Link>
                )}
                {data.ctaSecondaryLabel && data.ctaSecondaryUrl && (
                  <Link
                    href={data.ctaSecondaryUrl}
                    className="inline-flex items-center px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-70"
                    style={{ background: '#ffffff', border: '1px solid #d4d4d4', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                  >
                    {data.ctaSecondaryLabel}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* ── Right column — bordered image ───────────────────────────────── */}
          {data.heroImage?.url && (
            <div
              className="relative hidden lg:block w-full overflow-hidden"
              style={{ border: '1px solid #e5e5e5', height: '540px' }}
            >
              <div className="absolute inset-0" style={{ background: '#f5f5f5' }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.heroImage.url}
                alt={data.heroImage.alt ?? ''}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
