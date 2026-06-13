'use client'

import { useEffect } from 'react'

interface MediaRef { url: string; alt?: string }

export interface AboutContent1SectionData {
  ac1Heading?: string
  ac1Body?:    string
  ac1Image?:   MediaRef | null
}

const CSS = `
  .ac1s {
    box-sizing: border-box;
    background: #363636;
    padding: 96px;
  }

  .ac1s__inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 64px;
    width: 100%;
  }

  .ac1s__text-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
    min-width: 0;
    padding-bottom: 24px;
  }

  .ac1s__heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 500;
    font-size: 36px;
    line-height: 40px;
    color: #ffd25e;
    margin: 0;
    word-break: break-word;
  }

  .ac1s__body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 14px;
    line-height: 22.75px;
    color: #d1d5db;
    margin: 0;
  }

  .ac1s__image-col {
    flex: 1;
    min-width: 0;
  }

  .ac1s__image-wrap {
    width: 100%;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }

  .ac1s__image-wrap img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .ac1s__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #4a4a4a;
    color: #6b7280;
    font-size: 14px;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
  }

  @media (max-width: 1023px) {
    .ac1s__inner { flex-direction: column; }
    .ac1s__text-col { padding-bottom: 0; }
  }

  @media (max-width: 767px) {
    .ac1s { padding: 64px 24px; }
    .ac1s__image-wrap { height: 280px; }
  }
`

let injected = false

export default function AboutContent1Section({ data }: { data: AboutContent1SectionData }) {
  const heading = data.ac1Heading ?? ''
  const body    = data.ac1Body    ?? ''
  const image   = data.ac1Image   ?? null

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <section className="ac1s">
      <div className="ac1s__inner">
        <div className="ac1s__text-col">
          {heading && <h2 className="ac1s__heading">{heading}</h2>}
          {body    && <p  className="ac1s__body">{body}</p>}
        </div>
        <div className="ac1s__image-col">
          <div className="ac1s__image-wrap">
            {image?.url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={image.url} alt={image.alt ?? heading} />
              : <div className="ac1s__image-placeholder">No image selected</div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}
