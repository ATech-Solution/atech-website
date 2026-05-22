// Services Section — Layout Builder variant (Advance)
// Used by: home-services block type

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

function CtaWrap({ href, className, style, children }: { href?: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  if (href) return <Link href={href} className={className} style={style}>{children}</Link>
  return <span className={className} style={style}>{children}</span>
}

interface ServiceItem {
  serviceIcon?:  { url: string; alt?: string }
  serviceTitle?: string
  serviceDesc?:  string
  serviceHref?:  string
}

interface ServicesSectionData {
  heading?:                  string
  subheading?:               string
  serviceItems?:             ServiceItem[]
  customSolutionHeading?:    string
  customSolutionBody?:       string
  customSolutionCtaLabel?:   string
  customSolutionCtaUrl?:     string
  customSolutionCtaIcon?:     { url: string } | null
  customSolutionCtaIconPos?:  'left' | 'right'
  customSolutionCtaIconFill?: boolean
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ServiceCard({ item }: { item: ServiceItem }) {
  const content = (
    <div
      className="group flex flex-col items-start rounded-[12px] h-full transition-all duration-200"
      style={{ border: '1px solid #e5e5e5', background: '#ffffff', padding: '33px 33px 37px' }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0 rounded-[8px] mb-3"
        style={{ background: '#f5f5f5', width: '48px', height: '48px' }}
      >
        {item.serviceIcon?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.serviceIcon.url} alt={item.serviceIcon.alt ?? ''} className="object-contain" style={{ maxWidth: '20px', maxHeight: '16px' }} />
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="9" cy="9" r="7.5" stroke="#525252" strokeWidth="1.25" />
            <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#525252" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {item.serviceTitle && (
        <h3
          className="leading-[28px] mb-3 pt-1"
          style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '20px', fontWeight: 400, color: '#171717' }}
        >
          {item.serviceTitle}
        </h3>
      )}

      {item.serviceDesc && (
        <p
          className="leading-[24px] flex-1 mb-3"
          style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', fontWeight: 400, color: '#525252' }}
        >
          {item.serviceDesc}
        </p>
      )}

      {item.serviceHref && (
        <span
          className="inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-200"
          style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', fontWeight: 400, color: '#171717' }}
        >
          Learn More <Arrow />
        </span>
      )}
    </div>
  )

  if (item.serviceHref) {
    return (
      <Link href={item.serviceHref} className="block h-full" style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    )
  }
  return content
}

export default function ServicesSection({ data }: { data: ServicesSectionData }) {
  const items      = data.serviceItems ?? []
  const ctaIconPos = data.customSolutionCtaIconPos ?? 'right'
  const hasCtaIcon = !!data.customSolutionCtaIcon?.url
  const ctaIconFit = data.customSolutionCtaIconFill ? 'fill' : 'contain'

  return (
    <section
      className="py-24"
      style={{
        background: 'var(--color-bg, #292929)',
        borderTop: '1px solid var(--color-border, #383838)',
        paddingTop: 'var(--section-padding-y, 96px)',
        paddingBottom: 'var(--section-padding-y, 96px)',
      }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: 'var(--content-max-width, 1280px)' }}>
        {(data.heading || data.subheading) && (
          <div className="flex flex-col gap-6 items-center w-full mb-16">
            {data.heading && (
              <h2
                className="text-center w-full"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '2.25rem',
                  fontWeight: 400,
                  color: 'var(--color-accent, #ffd369)',
                  lineHeight: '40px',
                }}
              >
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p
                className="text-center leading-[28px]"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '1.25rem',
                  color: '#ffffff',
                  maxWidth: '768px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {data.subheading}
              </p>
            )}
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {items.map((item, i) => (
              <ServiceCard key={i} item={item} />
            ))}
          </div>
        )}

        {data.customSolutionHeading && (
          <div
            className="rounded-[12px] px-8 pt-8 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}
          >
            <div>
              <h3
                className="leading-[28px] mb-2"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '20px', fontWeight: 400, color: '#000000' }}
              >
                {data.customSolutionHeading}
              </h3>
              {data.customSolutionBody && (
                <p
                  className="leading-[24px]"
                  style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', fontWeight: 400, color: '#000000' }}
                >
                  {data.customSolutionBody}
                </p>
              )}
            </div>
            {data.customSolutionCtaLabel && (
              <CtaWrap
                href={data.customSolutionCtaUrl}
                className="flex-shrink-0 inline-flex items-center gap-2.5 whitespace-nowrap transition-opacity duration-200 hover:opacity-80"
                style={{
                  background: '#292929',
                  color: '#ffffff',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '16px',
                  fontWeight: 400,
                  padding: '12px 24px',
                  borderRadius: '8px',
                }}
              >
                {hasCtaIcon && ctaIconPos === 'left' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.customSolutionCtaIcon!.url} alt="" width={14} height={14} style={{ objectFit: ctaIconFit }} />
                )}
                {data.customSolutionCtaLabel}
                {hasCtaIcon && ctaIconPos === 'right' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.customSolutionCtaIcon!.url} alt="" width={14} height={14} style={{ objectFit: ctaIconFit }} />
                )}
              </CtaWrap>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
