// Case Study Section — Layout Builder (Advance)
// Three variants: light (#fff), dark1 (#464646), dark2 (#2c2c2c)
// Figma nodes: 1400:11665 (dark1/right), 1400:11677 (light/left), 1400:11689 (dark2/right)

interface MediaRef { url: string; alt?: string }

export interface CaseStudySectionData {
  csVariant?:          'light' | 'dark1' | 'dark2'
  imagePosition?:      'left' | 'right'
  headingAccent?:      string
  headingAccentFirst?: boolean
  headingPrimary?:     string
  body?:               string
  clientLogo?:         MediaRef | null
  caseImage?:          MediaRef | null
}

const VARIANTS = {
  light: { bgColor: '#ffffff', accentColor: '#111827', primaryColor: '#111827', bodyColor: '#4b5563' },
  dark1: { bgColor: '#464646', accentColor: '#ffd15b', primaryColor: '#ffffff',  bodyColor: '#e5e7eb' },
  dark2: { bgColor: '#2c2c2c', accentColor: '#ffd15b', primaryColor: '#ffffff',  bodyColor: '#d1d5db' },
}

const CSS = `
  .casestudysection {
    padding: 80px 144px;
    box-sizing: border-box;
  }
  .casestudysection__inner {
    max-width: 1152px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
  }
  .casestudysection__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .casestudysection__imagecol {
    flex: 1;
    display: flex;
  }
  .casestudysection__card {
    width: 448px;
    height: 320px;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    overflow: hidden;
    background: #e5e7eb;
    flex-shrink: 0;
  }
  .casestudysection__card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  @media (max-width: 767px) {
    .casestudysection {
      padding: 40px 24px;
    }
    .casestudysection__inner {
      flex-direction: column;
    }
    .casestudysection__imagecol {
      width: 100%;
      justify-content: center !important;
    }
    .casestudysection__card {
      width: 100%;
      height: 220px;
    }
  }
`

export default function CaseStudySection({ data }: { data: CaseStudySectionData }) {
  const variant  = VARIANTS[data.csVariant ?? 'light']
  const imgLeft  = data.imagePosition === 'left'

  const contentCol = (
    <div className="casestudysection__content">
      {(data.headingAccent || data.headingPrimary) && (
        <h3 style={{
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize: '30px', fontWeight: 700, lineHeight: '36px',
          margin: 0, whiteSpace: 'pre-wrap',
        }}>
          {data.headingAccentFirst ? (
            <>
              {data.headingAccent  && <span style={{ color: variant.accentColor  }}>{data.headingAccent}</span>}
              {data.headingAccent  && data.headingPrimary && ' '}
              {data.headingPrimary && <span style={{ color: variant.primaryColor }}>{data.headingPrimary}</span>}
            </>
          ) : (
            <>
              {data.headingPrimary && <span style={{ color: variant.primaryColor }}>{data.headingPrimary}</span>}
              {data.headingPrimary && data.headingAccent && ' '}
              {data.headingAccent  && <span style={{ color: variant.accentColor  }}>{data.headingAccent}</span>}
            </>
          )}
        </h3>
      )}

      {data.body && (
        <p style={{
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize: '14px', fontWeight: 400, lineHeight: '22.75px',
          color: variant.bodyColor, margin: 0, paddingBottom: '8px',
        }}>
          {data.body}
        </p>
      )}

      {data.clientLogo?.url && (
        <img
          src={data.clientLogo.url}
          alt={data.clientLogo.alt ?? 'Client logo'}
          style={{ maxHeight: '64px', width: 'auto', objectFit: 'contain' }}
        />
      )}
    </div>
  )

  const imageCol = (
    <div
      className="casestudysection__imagecol"
      style={{ justifyContent: imgLeft ? 'flex-start' : 'flex-end' }}
    >
      <div className="casestudysection__card">
        {data.caseImage?.url && (
          <img src={data.caseImage.url} alt={data.caseImage.alt ?? 'Case study screenshot'} />
        )}
      </div>
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="casestudysection" style={{ background: variant.bgColor }}>
        <div className="casestudysection__inner">
          {imgLeft ? imageCol   : contentCol}
          {imgLeft ? contentCol : imageCol}
        </div>
      </section>
    </>
  )
}
