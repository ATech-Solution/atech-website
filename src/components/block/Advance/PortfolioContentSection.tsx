'use client'

import { useEffect } from 'react'

interface MediaRef { url: string; alt?: string }

export interface PortfolioContentSectionData {
  pfTheme?:         'light' | 'dark'
  pfImagePosition?: 'left' | 'right'
  pfLogo?:          MediaRef | null
  pfHeading?:       string
  pfBody?:          string
  pfMockup?:        MediaRef | null
}

const CSS = `
  .pfcs {
    box-sizing: border-box;
    padding: 96px 120px;
  }
  .pfcs--light { background: #ffd15b; }
  .pfcs--dark  { background: #4a4a4a; }

  .pfcs__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    min-height: 458px;
  }

  .pfcs__inner--img-left  { flex-direction: row; }
  .pfcs__inner--img-right { flex-direction: row-reverse; }

  .pfcs__text-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: flex-start;
    min-width: 0;
  }

  .pfcs__image-col {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
  }
  .pfcs__inner--img-left .pfcs__image-col {
    justify-content: flex-start;
  }

  .pfcs__logo {
    max-width: 160px;
    max-height: 94px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  .pfcs__logo-placeholder {
    width: 160px;
    height: 56px;
    background: rgba(0,0,0,0.1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: rgba(0,0,0,0.4);
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
  }

  .pfcs__heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 700;
    font-size: 36px;
    line-height: 40px;
    margin: 0;
    word-break: break-word;
  }
  .pfcs--light .pfcs__heading { color: #111827; }
  .pfcs--dark  .pfcs__heading { color: #ffd15b; }

  .pfcs__body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
    max-width: 448px;
    margin: 0;
  }
  .pfcs--light .pfcs__body { color: #1f2937; }
  .pfcs--dark  .pfcs__body { color: #ffffff; }

  .pfcs__mockup {
    width: 100%;
    max-width: 600px;
    height: auto;
    object-fit: contain;
    display: block;
  }
  .pfcs__mockup-placeholder {
    width: 100%;
    max-width: 600px;
    height: 460px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.08);
    border-radius: 8px;
    font-size: 14px;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    color: rgba(0,0,0,0.35);
  }

  @media (max-width: 1023px) {
    .pfcs__inner,
    .pfcs__inner--img-left,
    .pfcs__inner--img-right {
      flex-direction: column !important;
      min-height: unset;
    }
    .pfcs__image-col { justify-content: center; }
    .pfcs__mockup { max-width: 100%; }
  }

  @media (max-width: 767px) {
    .pfcs { padding: 64px 24px; }
    .pfcs__inner { padding: 0; gap: 32px; }
  }
`

let injected = false

export default function PortfolioContentSection({ data }: { data: PortfolioContentSectionData }) {
  const theme         = data.pfTheme         ?? 'light'
  const imagePosition = data.pfImagePosition ?? 'right'
  const logo          = data.pfLogo          ?? null
  const heading       = data.pfHeading       ?? ''
  const body          = data.pfBody          ?? ''
  const mockup        = data.pfMockup        ?? null

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  const textCol = (
    <div className="pfcs__text-col">
      {logo?.url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={logo.url} alt={logo.alt ?? heading} className="pfcs__logo" />
        : <div className="pfcs__logo-placeholder">No logo</div>
      }
      {heading && <h2 className="pfcs__heading">{heading}</h2>}
      {body    && <p  className="pfcs__body">{body}</p>}
    </div>
  )

  const imageCol = (
    <div className="pfcs__image-col">
      {mockup?.url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={mockup.url} alt={mockup.alt ?? heading} className="pfcs__mockup" />
        : <div className="pfcs__mockup-placeholder">No mockup image</div>
      }
    </div>
  )

  return (
    <section className={`pfcs pfcs--${theme}`}>
      <div className={`pfcs__inner pfcs__inner--img-${imagePosition}`}>
        {imagePosition === 'left'  && imageCol}
        {textCol}
        {imagePosition === 'right' && imageCol}
      </div>
    </section>
  )
}
