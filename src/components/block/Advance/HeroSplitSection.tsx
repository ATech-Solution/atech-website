// Hero Split Section — Layout Builder (Advance)
// White bg, breadcrumb bar, 2-col: badge+heading+body+CTAs | bordered image
// heroImagePosition: 'left' | 'right' (default right)

import Link from 'next/link'

const BREADCRUMB_CHEVRON = 'https://www.figma.com/api/mcp/asset/8d36c818-a8c9-438a-a800-8f749c5368fd'
const CTA_ARROW          = 'https://www.figma.com/api/mcp/asset/c2581a0e-817f-4155-a70f-a7a969d6d77f'

interface BreadcrumbItem { bcLabel?: string; bcHref?: string | null }

export interface HeroSplitSectionData {
  badge?:              string
  badgeIconSrc?:       string
  breadcrumbs?:        BreadcrumbItem[]
  heading?:            string
  body?:               string
  ctaPrimaryLabel?:    string
  ctaPrimaryUrl?:      string
  ctaSecondaryLabel?:  string
  ctaSecondaryUrl?:    string
  heroImage?:          { url: string; alt?: string } | null
  heroImagePosition?:  'left' | 'right'
  heroStatValue?:      string
  heroStatLabel?:      string
}

export default function HeroSplitSection({ data }: { data: HeroSplitSectionData }) {
  const breadcrumbs = data.breadcrumbs ?? []
  const imageOnLeft = data.heroImagePosition === 'left'

  return (
    <>
      {breadcrumbs.length > 0 && (
        <div
          className="px-6 md:px-10 py-8"
          style={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}
        >
          <div className="mx-auto" style={{ maxWidth: '1280px' }}>
            <nav className="flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
              {breadcrumbs.map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  {idx > 0 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={BREADCRUMB_CHEVRON} alt="" className="object-contain" style={{ width: '7.5px', height: '12px' }} />
                  )}
                  {item.bcHref ? (
                    <Link href={item.bcHref} className="text-sm font-normal transition-colors duration-150 hover:text-[#171717]" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                      {item.bcLabel}
                    </Link>
                  ) : (
                    <span className="text-sm font-normal" style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                      {item.bcLabel}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}

      <section className="px-6 md:px-10 py-16 md:py-20" style={{ background: '#ffffff' }}>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" style={{ maxWidth: '1280px' }}>
          {imageOnLeft && (
            <div className="relative hidden lg:block w-full overflow-hidden" style={{ border: '1px solid #e5e5e5', height: '540px' }}>
              <div className="absolute inset-0" style={{ background: '#f5f5f5' }} />
              {data.heroImage?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.heroImage.url} alt={data.heroImage.alt ?? ''} className="absolute inset-0 w-full h-full object-cover" />
              )}
            </div>
          )}

          <div className="flex flex-col">
            {data.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 self-start" style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}>
                {data.badgeIconSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.badgeIconSrc} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                )}
                <span className="text-xs font-normal tracking-[0.6px] uppercase" style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                  {data.badge}
                </span>
              </div>
            )}

            {data.heading && (
              <h1 className="mb-6" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: '#171717', letterSpacing: '-1.2px', lineHeight: 1 }}>
                {data.heading.split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
            )}

            {data.body && (
              <p className="mb-10 max-w-xl" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.625' }}>
                {data.body}
              </p>
            )}

            {(data.heroStatValue || data.heroStatLabel) && (
              <div className="flex items-center gap-4 mb-10 pt-8" style={{ borderTop: '1px solid #e5e5e5' }}>
                {data.heroStatValue && (
                  <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '2rem', fontWeight: 400, color: '#171717' }}>
                    {data.heroStatValue}
                  </span>
                )}
                {data.heroStatLabel && (
                  <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.4' }}>
                    {data.heroStatLabel}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {data.ctaPrimaryLabel && data.ctaPrimaryUrl && (
                <Link href={data.ctaPrimaryUrl} className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-base font-normal transition-opacity duration-200 hover:opacity-80" style={{ background: '#171717', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                  {data.ctaPrimaryLabel}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={CTA_ARROW} alt="" className="object-contain" style={{ width: '14px', height: '16px' }} />
                </Link>
              )}
              {data.ctaSecondaryLabel && data.ctaSecondaryUrl && (
                <Link href={data.ctaSecondaryUrl} className="inline-flex items-center px-8 py-4 text-base font-normal transition-opacity duration-200 hover:opacity-70" style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '9999px', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                  {data.ctaSecondaryLabel}
                </Link>
              )}
            </div>
          </div>

          {!imageOnLeft && (
            <div className="relative hidden lg:block w-full overflow-hidden" style={{ border: '1px solid #e5e5e5', height: '540px' }}>
              <div className="absolute inset-0" style={{ background: '#f5f5f5' }} />
              {data.heroImage?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.heroImage.url} alt={data.heroImage.alt ?? ''} className="absolute inset-0 w-full h-full object-cover" />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
