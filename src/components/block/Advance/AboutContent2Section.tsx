'use client'

import { useEffect } from 'react'

interface MediaRef { url: string; alt?: string }

interface ValueItem {
  valueIcon?:  MediaRef | null
  valueTitle?: string
  valueDesc?:  string
}

export interface AboutContent2SectionData {
  ac2Heading?:       string
  ac2MissionIcon?:   MediaRef | null
  ac2MissionTitle?:  string
  ac2MissionBody?:   string
  ac2VisionIcon?:    MediaRef | null
  ac2VisionTitle?:   string
  ac2VisionBody?:    string
  ac2ValuesHeading?: string
  ac2Values?:        ValueItem[]
}

const CSS = `
  .ac2s {
    box-sizing: border-box;
    background: #ffffff;
    padding: 96px;
    display: flex;
    flex-direction: column;
    gap: 64px;
    width: 100%;
  }

  .ac2s__section-heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 500;
    font-size: 30px;
    line-height: 36px;
    color: #111827;
    text-align: center;
    margin: 0;
  }

  .ac2s__cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
    width: 100%;
  }

  .ac2s__card {
    box-sizing: border-box;
    background: #f9fafb;
    border-radius: 16px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ac2s__card-icon-box {
    width: 48px;
    height: 48px;
    min-width: 48px;
    background: #363636;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .ac2s__card-icon-box img {
    width: auto;
    height: auto;
    max-width: 24px;
    max-height: 24px;
    object-fit: contain;
    display: block;
  }

  .ac2s__card-title-wrap {
    padding-top: 8px;
  }

  .ac2s__card-title {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #111827;
    margin: 0;
  }

  .ac2s__card-body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 14px;
    line-height: 22.75px;
    color: #6b7280;
    margin: 0;
  }

  .ac2s__values-strip {
    box-sizing: border-box;
    background: #ffd25e;
    border-radius: 16px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
  }

  .ac2s__values-heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #111827;
    text-align: center;
    margin: 0;
  }

  .ac2s__values-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 32px;
    width: 100%;
  }

  .ac2s__value-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .ac2s__value-icon {
    width: auto;
    height: 24px;
    object-fit: contain;
    display: block;
  }

  .ac2s__value-title {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #111827;
    margin: 0;
    text-align: center;
  }

  .ac2s__value-desc {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #1f2937;
    margin: 0;
    padding-top: 4px;
    text-align: center;
  }

  .ac2s__value-icon-placeholder {
    width: 24px;
    height: 24px;
    background: rgba(0,0,0,0.15);
    border-radius: 4px;
    display: block;
  }

  @media (max-width: 767px) {
    .ac2s__cards { grid-template-columns: 1fr; }
    .ac2s__values-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 479px) {
    .ac2s { padding: 64px 24px; }
    .ac2s__values-grid { grid-template-columns: 1fr; }
  }
`

let injected = false

export default function AboutContent2Section({ data }: { data: AboutContent2SectionData }) {
  const heading       = data.ac2Heading       ?? ''
  const missionIcon   = data.ac2MissionIcon   ?? null
  const missionTitle  = data.ac2MissionTitle  ?? ''
  const missionBody   = data.ac2MissionBody   ?? ''
  const visionIcon    = data.ac2VisionIcon    ?? null
  const visionTitle   = data.ac2VisionTitle   ?? ''
  const visionBody    = data.ac2VisionBody    ?? ''
  const valuesHeading = data.ac2ValuesHeading ?? ''
  const values        = data.ac2Values        ?? []

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <section className="ac2s">
      {heading && <h2 className="ac2s__section-heading">{heading}</h2>}

      <div className="ac2s__cards">
        <div className="ac2s__card">
          <div className="ac2s__card-icon-box">
            {missionIcon?.url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={missionIcon.url} alt={missionIcon.alt ?? 'Mission icon'} />
              : <span style={{ width: 16, height: 16, background: 'rgba(255,255,255,0.3)', borderRadius: 2, display: 'block' }} />
            }
          </div>
          <div className="ac2s__card-title-wrap">
            {missionTitle && <h3 className="ac2s__card-title">{missionTitle}</h3>}
          </div>
          {missionBody && <p className="ac2s__card-body">{missionBody}</p>}
        </div>

        <div className="ac2s__card">
          <div className="ac2s__card-icon-box">
            {visionIcon?.url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={visionIcon.url} alt={visionIcon.alt ?? 'Vision icon'} />
              : <span style={{ width: 16, height: 16, background: 'rgba(255,255,255,0.3)', borderRadius: 2, display: 'block' }} />
            }
          </div>
          <div className="ac2s__card-title-wrap">
            {visionTitle && <h3 className="ac2s__card-title">{visionTitle}</h3>}
          </div>
          {visionBody && <p className="ac2s__card-body">{visionBody}</p>}
        </div>
      </div>

      <div className="ac2s__values-strip">
        {valuesHeading && <h3 className="ac2s__values-heading">{valuesHeading}</h3>}
        {values.length > 0 && (
          <div className="ac2s__values-grid">
            {values.map((v, i) => (
              <div key={i} className="ac2s__value-item">
                {v.valueIcon?.url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={v.valueIcon.url} alt={v.valueIcon.alt ?? v.valueTitle ?? ''} className="ac2s__value-icon" />
                  : <span className="ac2s__value-icon-placeholder" />
                }
                {v.valueTitle && <p className="ac2s__value-title">{v.valueTitle}</p>}
                {v.valueDesc  && <p className="ac2s__value-desc">{v.valueDesc}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
