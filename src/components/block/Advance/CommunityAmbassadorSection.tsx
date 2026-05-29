// Community Ambassador Section — white card in dark section, 2-col: content | illustration

import Link from 'next/link'

interface AmbassadorBenefit {
  benefitIcon?:  string
  benefitTitle?: string
  benefitDesc?:  string
}

interface CommunityAmbassadorData {
  heading?:            string
  description?:        string
  ambassadorBenefits?: AmbassadorBenefit[]
  ambassadorCta?:      string
  ambassadorUrl?:      string
  ambassadorImage?:    { url: string; alt?: string } | null
}

export default function CommunityAmbassadorSection({ data }: { data: CommunityAmbassadorData }) {
  const { heading, description, ambassadorBenefits = [], ambassadorCta, ambassadorUrl, ambassadorImage } = data

  return (
    <section className="py-16 px-6 md:px-10" style={{ background: 'var(--section-bg, #171717)' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="p-12" style={{ background: '#ffffff' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="flex flex-col gap-5">
              {heading && (
                <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.875rem', fontWeight: 400, color: '#171717', lineHeight: '36px' }}>
                  {heading}
                </h2>
              )}
              {description && (
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.625' }}>
                  {description}
                </p>
              )}

              {ambassadorBenefits.length > 0 && (
                <div className="flex flex-col gap-4">
                  {ambassadorBenefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-4">
                      {b.benefitIcon && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.benefitIcon} alt="" className="object-contain flex-shrink-0 mt-0.5" style={{ width: '20px', height: '20px' }} />
                      )}
                      <div className="flex flex-col gap-1">
                        {b.benefitTitle && (
                          <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', fontWeight: 400, color: '#171717' }}>
                            {b.benefitTitle}
                          </span>
                        )}
                        {b.benefitDesc && (
                          <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252' }}>
                            {b.benefitDesc}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {ambassadorCta && ambassadorUrl && (
                <Link
                  href={ambassadorUrl}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-normal transition-opacity duration-200 hover:opacity-80 self-start mt-2"
                  style={{ background: '#171717', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {ambassadorCta}
                </Link>
              )}
            </div>

            {/* Right: image */}
            <div className="flex items-center justify-center" style={{ minHeight: '360px' }}>
              {ambassadorImage?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ambassadorImage.url}
                  alt={ambassadorImage.alt ?? heading ?? 'Ambassador Program'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '480px', display: 'block' }}
                />
              ) : (
                <div
                  className="flex items-center justify-center w-full"
                  style={{ height: '360px', background: '#f5f5f5' }}
                >
                  <span style={{ color: '#a3a3a3', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem' }}>
                    Add image →
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
