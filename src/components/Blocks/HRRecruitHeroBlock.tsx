// HR Recruitment Hero — Figma node 1:28203
// White background, breadcrumb nav, 2-col: bordered image LEFT | badge+heading+body+CTA RIGHT

import Link from 'next/link'

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const BREADCRUMB_CHEVRON = 'https://www.figma.com/api/mcp/asset/7e157234-10ca-4ab9-9400-eaa01344a3ef'
const CTA_ARROW          = 'https://www.figma.com/api/mcp/asset/4bb2ae5b-279f-4593-9f57-b17772617cd0'

// ─── Types ────────────────────────────────────────────────────────────────────
interface BreadcrumbItem { label: string; href: string | null }

interface HRRecruitHeroData {
  badge:        string
  badgeIconSrc: string
  breadcrumb:   BreadcrumbItem[]
  heading:      string
  body:         string
  cta:          { label: string; url: string }
  image:        { src: string; alt: string }
}

// ─── HRRecruitHeroBlock ───────────────────────────────────────────────────────
export default function HRRecruitHeroBlock({ data }: { data: HRRecruitHeroData }) {
  const { badge, badgeIconSrc, breadcrumb, heading, body, cta, image } = data

  return (
    <>
      {/* ── Breadcrumb bar ──────────────────────────────────────────────────── */}
      <div className="px-6 md:px-10 py-6" style={{ background: '#ffffff' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <nav className="flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
            {breadcrumb.map((item, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {idx > 0 && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={BREADCRUMB_CHEVRON}
                    alt=""
                    className="object-contain"
                    style={{ width: '7.5px', height: '12px' }}
                  />
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-sm font-normal transition-colors duration-150 hover:text-[#171717]"
                    style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-sm font-normal"
                    style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                  >
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Hero section ────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-24 pt-10" style={{ background: '#ffffff' }}>
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          style={{ maxWidth: '1280px' }}
        >
          {/* ── Left column — bordered image ────────────────────────────────── */}
          <div
            className="relative hidden lg:block w-full overflow-hidden order-last lg:order-first"
            style={{ border: '1px solid #e5e5e5', height: '540px' }}
          >
            <div className="absolute inset-0" style={{ background: '#f5f5f5' }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* ── Right column — content ──────────────────────────────────────── */}
          <div className="flex flex-col">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 self-start"
              style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={badgeIconSrc} alt="" className="object-contain flex-shrink-0" style={{ width: '9px', height: '12px' }} />
              <span
                className="text-xs font-normal tracking-[0.6px] uppercase"
                style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
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
            <p
              className="mb-10 max-w-xl"
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '1.125rem',
                color:      '#525252',
                lineHeight: '1.625',
              }}
            >
              {body}
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={cta.url}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-80"
                style={{
                  background: '#171717',
                  color:      '#ffffff',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                }}
              >
                {cta.label}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CTA_ARROW} alt="" className="object-contain" style={{ width: '12px', height: '14px' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
