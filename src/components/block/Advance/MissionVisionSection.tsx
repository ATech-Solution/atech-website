// Mission Vision Section — Layout Builder (Advance)
// White bg: 2-col mission/vision cards + yellow values bar

interface ValueItem {
  valueIcon?: { url: string; alt?: string } | null
  valueTitle?: string
  valueDesc?: string
}

interface MissionVisionSectionProps {
  data: {
    missionIcon?: { url: string; alt?: string } | null
    missionHeading?: string
    missionBody?: string
    visionIcon?: { url: string; alt?: string } | null
    visionHeading?: string
    visionBody?: string
    valuesHeading?: string
    values?: ValueItem[]
  }
}

export default function MissionVisionSection({ data }: MissionVisionSectionProps) {
  const {
    missionIcon, missionHeading, missionBody,
    visionIcon, visionHeading, visionBody,
    valuesHeading, values = [],
  } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto flex flex-col gap-12" style={{ maxWidth: '1280px' }}>
        <h2 className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400, color: '#171717', letterSpacing: '-0.5px' }}>
          Our Mission &amp; Vision
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-4 p-8 rounded-xl" style={{ background: '#fafafa' }}>
            {missionIcon?.url && (
              <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: '#000000', width: '64px', height: '64px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={missionIcon.url} alt={missionIcon.alt ?? ''} className="object-contain" style={{ maxWidth: '24px', maxHeight: '24px' }} />
              </div>
            )}
            {missionHeading && (
              <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#000000', lineHeight: '32px' }}>
                {missionHeading}
              </h3>
            )}
            {missionBody && (
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '28px' }}>
                {missionBody}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 p-8 rounded-xl" style={{ background: '#fafafa' }}>
            {visionIcon?.url && (
              <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: '#000000', width: '64px', height: '64px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={visionIcon.url} alt={visionIcon.alt ?? ''} className="object-contain" style={{ maxWidth: '27px', maxHeight: '24px' }} />
              </div>
            )}
            {visionHeading && (
              <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#000000', lineHeight: '32px' }}>
                {visionHeading}
              </h3>
            )}
            {visionBody && (
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '28px' }}>
                {visionBody}
              </p>
            )}
          </div>
        </div>

        {(valuesHeading || values.length > 0) && (
          <div className="p-8 rounded-xl" style={{ background: '#ffd369' }}>
            {valuesHeading && (
              <h3 className="text-center mb-8" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#000000', lineHeight: '32px' }}>
                {valuesHeading}
              </h3>
            )}
            {values.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {values.map((val, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    {val.valueIcon?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={val.valueIcon.url} alt={val.valueIcon.alt ?? ''} className="object-contain" style={{ width: '30px', height: '30px' }} />
                    )}
                    {val.valueTitle && (
                      <h4 className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', fontWeight: 400, color: '#000000', lineHeight: '28px' }}>
                        {val.valueTitle}
                      </h4>
                    )}
                    {val.valueDesc && (
                      <p className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#000000', lineHeight: '20px' }}>
                        {val.valueDesc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
