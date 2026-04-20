// IT Consulting Hero — Figma node 1:27376 + 1:27396
// White background, breadcrumb nav, 2-col: bordered image LEFT | badge+heading+body+CTAs RIGHT

import Link from 'next/link'

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const BREADCRUMB_CHEVRON = 'https://www.figma.com/api/mcp/asset/df68daae-1d95-4148-b6e0-4e205717bd66'
const CTA_ARROW          = 'https://www.figma.com/api/mcp/asset/e1eb4275-6adb-47a3-9ec8-2dacff4b8ae3'

// ─── Types ────────────────────────────────────────────────────────────────────
interface BreadcrumbItem { label: string; href: string | null }
interface CTA            { label: string; url: string }
interface HeroImage      { src: string; alt: string }

interface ITConsultingHeroData {
  badge:        string
  badgeIconSrc: string
  breadcrumb:   BreadcrumbItem[]
  heading:      string
  body:         string
  cta:          { primary: CTA; secondary: CTA }
  image:        HeroImage
}

// ─── ITConsultingHeroBlock ────────────────────────────────────────────────────
export default function ITConsultingHeroBlock({ data }: { data: ITConsultingHeroData }) {
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
                    style={{
                      color:      '#737373',
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-sm font-normal"
                    style={{
                      color:      '#171717',
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                    }}
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
            style={{
              border:  '1px solid #e5e5e5',
              height:  '540px',
            }}
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
              style={{
                background: '#f5f5f5',
                border:     '1px solid #e5e5e5',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={badgeIconSrc} alt="" className="object-contain flex-shrink-0" style={{ width: '9px', height: '12px' }} />
              <span
                className="text-xs font-normal tracking-[0.6px] uppercase"
                style={{
                  color:      '#525252',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                }}
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

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={cta.primary.url}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-80"
                style={{
                  background: '#171717',
                  color:      '#ffffff',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                }}
              >
                {cta.primary.label}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CTA_ARROW} alt="" className="object-contain" style={{ width: '12px', height: '14px' }} />
              </Link>
              <Link
                href={cta.secondary.url}
                className="inline-flex items-center px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-70"
                style={{
                  background: '#ffffff',
                  border:     '1px solid #d4d4d4',
                  color:      '#171717',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                }}
              >
                {cta.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
