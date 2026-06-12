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
  .cssection {
    background: #ffffff;
    padding: 80px 208px;
    box-sizing: border-box;
  }
  .cssection__row {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 64px;
    padding-bottom: 80px;
  }
  .cssection__row:last-child { padding-bottom: 0; }
  .cssection__imgcol {
    flex-shrink: 0;
    width: 478.97px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }
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
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .cssection__contentcol {
    flex: 1;
    padding-left: 32px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 15.4px;
  }
  .cssection__border {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
  }
  .cssection__borderfill {
    position: absolute;
    top: 0; left: 0; width: 100%;
    height: 0;
    background: #ffd25e;
    border-radius: 2px;
    transition: height 0.5s ease-out 0.2s;
  }
  .cssection__borderfill--visible { height: 100%; }
  .cssection__logo {
    height: 64px;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .cssection__logo img {
    max-height: 64px; width: auto; object-fit: contain;
  }
  .cssection__heading {
    font-family: var(--font-work-sans, sans-serif);
    font-size: 36px; font-weight: 700; line-height: 40px;
    color: #111827; margin: 0;
  }
  .cssection__body {
    font-family: var(--font-work-sans, sans-serif);
    font-size: 14px; font-weight: 400; line-height: 22.75px;
    color: #4b5563; margin: 0;
  }
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
  @media (max-width: 767px) {
    .cssection { padding: 40px 24px; }
    .cssection__row { flex-direction: column; gap: 24px; padding-bottom: 40px; }
    .cssection__imgcol { width: 100%; justify-content: center; }
    .cssection__card { width: 100%; height: 260px; }
    .cssection__imgcol--hidden { transform: translateY(30px); }
    .cssection__imgcol--visible { transform: translateY(0); }
  }
`

export default function CaseStudyScrollSection({ data }: { data: CaseStudyScrollSectionData }) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const items   = data.caseScrollItems ?? []

  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[]

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
            <div className="cssection__imgcol">
              <div className="cssection__card">
                {item.cssImage?.url && (
                  <img src={item.cssImage.url} alt={item.cssImage.alt ?? 'Case study'} />
                )}
              </div>
            </div>
            <div className="cssection__contentcol">
              <div className="cssection__border">
                <div className="cssection__borderfill" />
              </div>
              {item.cssClientLogo?.url && (
                <div className="cssection__logo">
                  <img src={item.cssClientLogo.url} alt={item.cssClientLogo.alt ?? 'Client logo'} />
                </div>
              )}
              {item.cssHeading && <h3 className="cssection__heading">{item.cssHeading}</h3>}
              {item.cssBody    && <p  className="cssection__body">{item.cssBody}</p>}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
