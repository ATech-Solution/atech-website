// Get Involved Culture — Figma node 1:30513
// Dark #232323 background, 2-col: left = image placeholder; right = Our Culture heading + values list

// ─── Types ────────────────────────────────────────────────────────────────────
interface CultureValue {
  title:       string
  description: string
  iconSrc:     string
}

interface GetInvolvedCultureData {
  heading:     string
  description: string
  values:      CultureValue[]
}

// ─── GetInvolvedCultureBlock ──────────────────────────────────────────────────
export default function GetInvolvedCultureBlock({ data }: { data: GetInvolvedCultureData }) {
  const { heading, description, values } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#fafafa' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div
          className="p-12"
          style={{ background: '#232323', border: '1px solid #e5e5e5' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image placeholder */}
            <div className="flex items-center justify-center" style={{ height: '400px', background: '#e5e5e5' }}>
              <span style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem' }}>
                Team Culture Photo
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6">
              <h2
                style={{
                  fontFamily:    'var(--font-work-sans, sans-serif)',
                  fontSize:      '1.875rem',
                  fontWeight:    400,
                  color:         '#ffffff',
                  lineHeight:    '36px',
                }}
              >
                {heading}
              </h2>
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#e5e5e5', lineHeight: '1.625' }}>
                {description}
              </p>

              {/* Values */}
              <div className="flex flex-col gap-4">
                {values.map((v) => (
                  <div key={v.title} className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.iconSrc} alt="" className="object-contain flex-shrink-0 mt-1" style={{ width: '24px', height: '24px' }} />
                    <div className="flex flex-col gap-1">
                      <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#ffffff', lineHeight: '28px' }}>
                        {v.title}
                      </span>
                      <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#e5e5e5', lineHeight: '24px' }}>
                        {v.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
