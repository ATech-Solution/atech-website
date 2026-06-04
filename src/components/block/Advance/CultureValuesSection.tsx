// Culture Values Section — dark #232323 card in #fafafa background, 2-col: image placeholder | heading + values list

interface CultureValue {
  valueTitle?: string
  valueDesc?:  string
  valueIcon?:  string
}

interface CultureValuesData {
  heading?:       string
  description?:   string
  cultureValues?: CultureValue[]
  cultureImage?:  { url: string; alt?: string } | null
}

export default function CultureValuesSection({ data }: { data: CultureValuesData }) {
  const { heading, description, cultureValues = [], cultureImage } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#fafafa' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="p-12" style={{ background: '#232323', border: '1px solid #e5e5e5' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Team Culture Photo */}
            <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
              {cultureImage?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cultureImage.url}
                  alt={cultureImage.alt ?? heading ?? 'Team Culture Photo'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full" style={{ background: '#e5e5e5' }}>
                  <span style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem' }}>
                    Team Culture Photo
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6">
              {heading && (
                <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.875rem', fontWeight: 400, color: '#ffffff', lineHeight: '36px' }}>
                  {heading}
                </h2>
              )}
              {description && (
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#e5e5e5', lineHeight: '1.625' }}>
                  {description}
                </p>
              )}

              {cultureValues.length > 0 && (
                <div className="flex flex-col gap-4">
                  {cultureValues.map((v, i) => (
                    <div key={i} className="flex items-start gap-4">
                      {v.valueIcon && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={v.valueIcon} alt="" className="object-contain flex-shrink-0 mt-1" style={{ width: '24px', height: '24px' }} />
                      )}
                      <div className="flex flex-col gap-1">
                        {v.valueTitle && (
                          <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#ffffff', lineHeight: '28px' }}>
                            {v.valueTitle}
                          </span>
                        )}
                        {v.valueDesc && (
                          <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#e5e5e5', lineHeight: '24px' }}>
                            {v.valueDesc}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
