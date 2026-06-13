'use client'

import { useEffect } from 'react'

interface MediaRef { url: string; alt?: string }

export interface AboutGallerySectionData {
  agHeroImage?:     MediaRef | null
  agHeading?:       string
  agBody1?:         string
  agBody2?:         string
  agBody3?:         string
  agBody4?:         string
  agGalleryImages?: (MediaRef | null)[]
}

const CSS = `
  .agallery {
    box-sizing: border-box;
    background: #4a4a4a;
    padding: 96px;
    display: flex;
    flex-direction: column;
    gap: 48px;
    width: 100%;
  }

  /* ── Zone 1: Hero split ──────────────────────────────────────────────── */
  .agallery__hero {
    display: flex;
    flex-direction: row;
    gap: 64px;
    align-items: flex-start;
    width: 100%;
  }

  .agallery__hero-image-col {
    flex: 1;
    min-width: 0;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }

  .agallery__hero-image-col img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .agallery__hero-image-placeholder {
    width: 100%;
    height: 100%;
    background: #5a5a5a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 14px;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
  }

  .agallery__hero-text-col {
    flex: 1;
    min-width: 0;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .agallery__heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 500;
    font-size: 30px;
    line-height: 36px;
    color: #ffd25e;
    margin: 0;
  }

  .agallery__body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 14px;
    line-height: 22.75px;
    color: #e5e7eb;
    margin: 0;
  }

  /* ── Zone 2: Masonry grid ─────────────────────────────────────────────── */
  .agallery__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    width: 100%;
  }

  .agallery__cell {
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    background: #5a5a5a;
  }

  .agallery__cell img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .agallery__cell--1  { grid-column: 1;          grid-row: 1; height: 160px; }
  .agallery__cell--2  { grid-column: 2;          grid-row: 1; height: 160px; }
  .agallery__cell--3  { grid-column: 3 / span 2; grid-row: 1; height: 160px; }
  .agallery__cell--4  { grid-column: 1 / span 2; grid-row: 2; height: 192px; }
  .agallery__cell--5  { grid-column: 3;          grid-row: 2; height: 192px; }
  .agallery__cell--6  { grid-column: 4;          grid-row: 2; height: 192px; }
  .agallery__cell--7  { grid-column: 1;          grid-row: 3; height: 160px; }
  .agallery__cell--8  { grid-column: 2;          grid-row: 3; height: 160px; }
  .agallery__cell--9  { grid-column: 3 / span 2; grid-row: 3 / span 2; height: 336px; }
  .agallery__cell--10 { grid-column: 1 / span 2; grid-row: 4; height: 160px; }

  /* ── Responsive ──────────────────────────────────────────────────────── */
  @media (max-width: 1023px) {
    .agallery__hero { flex-direction: column; }
    .agallery__hero-image-col { width: 100%; height: 300px; }
    .agallery__hero-text-col  { height: auto; gap: 16px; }
  }

  @media (max-width: 767px) {
    .agallery__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .agallery__cell--1  { grid-column: 1;          grid-row: 1; height: 140px; }
    .agallery__cell--2  { grid-column: 2;          grid-row: 1; height: 140px; }
    .agallery__cell--3  { grid-column: 1 / span 2; grid-row: 2; height: 140px; }
    .agallery__cell--4  { grid-column: 1 / span 2; grid-row: 3; height: 160px; }
    .agallery__cell--5  { grid-column: 1;          grid-row: 4; height: 160px; }
    .agallery__cell--6  { grid-column: 2;          grid-row: 4; height: 160px; }
    .agallery__cell--7  { grid-column: 1;          grid-row: 5; height: 140px; }
    .agallery__cell--8  { grid-column: 2;          grid-row: 5; height: 140px; }
    .agallery__cell--9  { grid-column: 1 / span 2; grid-row: 6; height: 200px; }
    .agallery__cell--10 { grid-column: 1 / span 2; grid-row: 7; height: 140px; }
  }

  @media (max-width: 479px) {
    .agallery { padding: 64px 24px; }
    .agallery__grid { grid-template-columns: 1fr; }
    .agallery__cell--1,
    .agallery__cell--2,
    .agallery__cell--3,
    .agallery__cell--4,
    .agallery__cell--5,
    .agallery__cell--6,
    .agallery__cell--7,
    .agallery__cell--8,
    .agallery__cell--9,
    .agallery__cell--10 {
      grid-column: 1;
      grid-row: auto;
      height: 200px;
    }
  }
`

let injected = false

const SLOT_COUNT = 10

export default function AboutGallerySection({ data }: { data: AboutGallerySectionData }) {
  const heroImage   = data.agHeroImage      ?? null
  const heading     = data.agHeading        ?? ''
  const body1       = data.agBody1          ?? ''
  const body2       = data.agBody2          ?? ''
  const body3       = data.agBody3          ?? ''
  const body4       = data.agBody4          ?? ''
  const galleryImgs = data.agGalleryImages  ?? []

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <section className="agallery">
      {/* Zone 1: Hero split */}
      <div className="agallery__hero">
        <div className="agallery__hero-image-col">
          {heroImage?.url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={heroImage.url} alt={heroImage.alt ?? heading} />
            : <div className="agallery__hero-image-placeholder">No image selected</div>
          }
        </div>
        <div className="agallery__hero-text-col">
          {heading && <h2 className="agallery__heading">{heading}</h2>}
          {body1   && <p  className="agallery__body">{body1}</p>}
          {body2   && <p  className="agallery__body">{body2}</p>}
          {body3   && <p  className="agallery__body">{body3}</p>}
          {body4   && <p  className="agallery__body">{body4}</p>}
        </div>
      </div>

      {/* Zone 2: Masonry grid */}
      <div className="agallery__grid">
        {Array.from({ length: SLOT_COUNT }).map((_, i) => {
          const img = galleryImgs[i] ?? null
          return (
            <div key={i} className={`agallery__cell agallery__cell--${i + 1}`}>
              {img?.url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={img.url} alt={img.alt ?? `Gallery photo ${i + 1}`} />
                : null
              }
            </div>
          )
        })}
      </div>
    </section>
  )
}
