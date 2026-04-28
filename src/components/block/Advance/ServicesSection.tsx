// Services Section — Layout Builder variant (Advance)
// Used by: home-services block type

import Link from 'next/link'

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
  customSolutionCtaIcon?:    { url: string } | null
  customSolutionCtaIconPos?: 'left' | 'right'
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
      className="group flex flex-col items-start p-8 rounded-2xl h-full transition-all duration-200"
      style={{ border: '1px solid var(--color-border, #383838)', background: 'var(--color-surface, #2f2f2f)' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mb-5"
        style={{ background: 'rgba(255,211,105,0.10)', border: '1px solid rgba(255,211,105,0.20)', color: 'var(--color-accent, #ffd369)' }}
      >
        {item.serviceIcon?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.serviceIcon.url} alt={item.serviceIcon.alt ?? ''} className="w-6 h-6 object-contain" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M5.5 9l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {item.serviceTitle && (
        <h3
          className="text-base font-semibold leading-snug mb-2"
          style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          {item.serviceTitle}
        </h3>
      )}

      {item.serviceDesc && (
        <p
          className="text-sm leading-relaxed flex-1 mb-6"
          style={{ color: 'var(--color-muted, #525252)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          {item.serviceDesc}
        </p>
      )}

      {item.serviceHref && (
        <span
          className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-200"
          style={{ color: 'var(--color-accent, #ffd369)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
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
                className="text-center w-full leading-tight tracking-tight"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  fontWeight: 700,
                  color: 'var(--color-accent, #ffd369)',
                  letterSpacing: '-0.01em',
                }}
              >
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p
                className="text-center w-full leading-relaxed"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '1.125rem',
                  color: 'var(--color-muted, #525252)',
                  maxWidth: '44rem',
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {items.map((item, i) => (
              <ServiceCard key={i} item={item} />
            ))}
          </div>
        )}

        {data.customSolutionHeading && (
          <div
            className="rounded-2xl px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            style={{ background: 'var(--color-surface, #2f2f2f)', border: '1px solid var(--color-border, #383838)' }}
          >
            <div>
              <h3
                className="text-xl font-semibold mb-1"
                style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {data.customSolutionHeading}
              </h3>
              {data.customSolutionBody && (
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-muted, #525252)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {data.customSolutionBody}
                </p>
              )}
            </div>
            {data.customSolutionCtaLabel && data.customSolutionCtaUrl && (
              <Link
                href={data.customSolutionCtaUrl}
                className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-opacity duration-200 hover:opacity-90"
                style={{
                  background: 'var(--color-accent, #ffd369)',
                  color: '#171717',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  boxShadow: '0 4px 14px rgba(255,211,105,0.25)',
                }}
              >
                {hasCtaIcon && ctaIconPos === 'left' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.customSolutionCtaIcon!.url} alt="" width={14} height={14} style={{ objectFit: 'contain' }} />
                )}
                {data.customSolutionCtaLabel}
                {hasCtaIcon && ctaIconPos === 'right' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.customSolutionCtaIcon!.url} alt="" width={14} height={14} style={{ objectFit: 'contain' }} />
                ) : !hasCtaIcon ? (
                  <Arrow />
                ) : null}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
