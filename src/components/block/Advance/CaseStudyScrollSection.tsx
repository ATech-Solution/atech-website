'use client'

import { useEffect, useRef } from 'react'

interface MediaRef { url: string; alt?: string }

export interface CaseStudyScrollItem {
  cssImage?:      MediaRef | null
  cssClientLogo?: MediaRef | null
  cssHeading?:    string
  cssBody?:       string
}

export interface CaseStudyScrollSectionData {
  caseScrollItems?: CaseStudyScrollItem[]
}

const CSS = `
  /* ── Outer section ── */
  .cssection {
    background: #ffffff;
    box-sizing: border-box;
  }

  /* ── Each item is its own full-padded row ── */
  .cssection__row {
    padding: 80px clamp(24px, calc((100% - 1024px) / 2), 208px);
    box-sizing: border-box;
    background: #ffffff;
  }

  /* ── Inner 1024px container ── */
  .cssection__inner {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 64px;
    width: 100%;
  }

  /* ── Left col: 478.97px, image pushed to right ── */
  .cssection__imgcol {
    flex-shrink: 0;
    width: 478.97px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }

  /* ── Image card: 400×400, rounded-16, shadow ── */
  .cssection__card {
    width: 400px;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1);
    background: #e5e7eb;
    flex-shrink: 0;
  }
  .cssection__card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* ── Right col: fixed 481.03px, relative for left border ── */
  .cssection__contentcol {
    flex-shrink: 0;
    width: 481.03px;
    padding-left: 32px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 15.4px;
  }

  /* ── 4px left border with animated yellow fill ── */
  .cssection__border {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0.9px;
    width: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
  }
  .cssection__borderfill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    background: #ffd25e;
    border-radius: 2px;
    transition: height 0.5s ease-out 0.2s;
  }
  .cssection__borderfill--visible {
    height: 100%;
  }

  /* ── Client logo area: 64px height, vertically centered ── */
  .cssection__logo {
    height: 64px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  .cssection__logo img {
    max-height: 64px;
    width: auto;
    object-fit: contain;
    display: block;
  }

  /* ── Heading wrapper with Figma's pt-8.6px ── */
  .cssection__headingwrap {
    padding-top: 8.6px;
    flex-shrink: 0;
    width: 100%;
  }
  .cssection__heading {
    font-family: var(--font-work-sans, sans-serif);
    font-size: 36px;
    font-weight: 700;
    line-height: 40px;
    color: #111827;
    margin: 0;
    word-break: break-word;
  }

  /* ── Body: max-width 448px per Figma ── */
  .cssection__bodywrap {
    max-width: 448px;
    width: 448px;
    flex-shrink: 0;
  }
  .cssection__body {
    font-family: var(--font-work-sans, sans-serif);
    font-size: 14px;
    font-weight: 400;
    line-height: 22.75px;
    color: #4b5563;
    margin: 0;
  }

  /* ── Animation: hidden states ── */
  .cssection__imgcol--hidden {
    opacity: 0;
    transform: translateY(-50px);
    transition: opacity 0.75s ease-out, transform 0.75s ease-out;
  }
  .cssection__contentcol--hidden {
    opacity: 0;
    transform: translateY(50px);
    transition: opacity 0.75s ease-out 0.12s, transform 0.75s ease-out 0.12s;
  }

  /* ── Animation: visible states ── */
  .cssection__imgcol--visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.75s ease-out, transform 0.75s ease-out;
  }
  .cssection__contentcol--visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.75s ease-out 0.12s, transform 0.75s ease-out 0.12s;
  }

  /* ── Mobile ≤767px: single column ── */
  @media (max-width: 767px) {
    .cssection__row {
      padding: 40px 24px;
    }
    .cssection__inner {
      flex-direction: column;
      gap: 24px;
    }
    .cssection__imgcol {
      width: 100%;
      justify-content: center;
      align-items: center;
    }
    .cssection__card {
      width: 100%;
      height: 260px;
    }
    .cssection__contentcol {
      width: 100%;
    }
    .cssection__bodywrap {
      width: 100%;
      max-width: 100%;
    }
    /* Mobile: both parts fade from bottom (no split direction) */
    .cssection__imgcol--hidden {
      transform: translateY(30px);
    }
    .cssection__imgcol--visible {
      transform: translateY(0);
    }
  }

  /* ── Tablet 768px–1100px: proportional columns ── */
  @media (min-width: 768px) and (max-width: 1100px) {
    .cssection__imgcol {
      width: 46%;
    }
    .cssection__card {
      width: 100%;
      max-width: 400px;
    }
    .cssection__contentcol {
      width: 46%;
    }
    .cssection__bodywrap {
      width: 100%;
      max-width: 100%;
    }
  }
`

export default function CaseStudyScrollSection({ data }: { data: CaseStudyScrollSectionData }) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const items   = data.caseScrollItems ?? []

  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[]

    // SSR-safe: add hidden classes on mount before observer attaches
    rows.forEach((row) => {
      const img     = row.querySelector('.cssection__imgcol')     as HTMLElement | null
      const content = row.querySelector('.cssection__contentcol') as HTMLElement | null
      if (img)     img.classList.add('cssection__imgcol--hidden')
      if (content) content.classList.add('cssection__contentcol--hidden')
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const row     = entry.target as HTMLDivElement
          const img     = row.querySelector('.cssection__imgcol')     as HTMLElement | null
          const content = row.querySelector('.cssection__contentcol') as HTMLElement | null
          const fill    = row.querySelector('.cssection__borderfill') as HTMLElement | null
          if (img) {
            img.classList.remove('cssection__imgcol--hidden')
            img.classList.add('cssection__imgcol--visible')
          }
          if (content) {
            content.classList.remove('cssection__contentcol--hidden')
            content.classList.add('cssection__contentcol--visible')
          }
          if (fill) fill.classList.add('cssection__borderfill--visible')
          observer.unobserve(row)
        })
      },
      { threshold: 0.2 }
    )

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [items.length])

  if (items.length === 0) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="cssection">
        {items.map((item, i) => (
          <div
            key={i}
            className="cssection__row"
            ref={(el) => { rowRefs.current[i] = el }}
          >
            <div className="cssection__inner">
              {/* Left: image card */}
              <div className="cssection__imgcol">
                <div className="cssection__card">
                  {item.cssImage?.url && (
                    <img src={item.cssImage.url} alt={item.cssImage.alt ?? 'Case study'} />
                  )}
                </div>
              </div>

              {/* Right: content with left-border */}
              <div className="cssection__contentcol">
                <div className="cssection__border">
                  <div className="cssection__borderfill" />
                </div>

                {item.cssClientLogo?.url && (
                  <div className="cssection__logo">
                    <img src={item.cssClientLogo.url} alt={item.cssClientLogo.alt ?? 'Client logo'} />
                  </div>
                )}

                {item.cssHeading && (
                  <div className="cssection__headingwrap">
                    <h3 className="cssection__heading">{item.cssHeading}</h3>
                  </div>
                )}

                {item.cssBody && (
                  <div className="cssection__bodywrap">
                    <p className="cssection__body">{item.cssBody}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
