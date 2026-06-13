'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface MediaRef { url: string; alt?: string }

export interface ProductContentSectionData {
  pcTheme?:    'dark' | 'light'
  pcTitle?:    string
  pcImage?:    MediaRef | null
  pcBody?:     string
  pcCtaLabel?: string
  pcCtaUrl?:   string
}

const CSS = `
  .pcs {
    box-sizing: border-box;
    padding: 96px clamp(24px, calc((100% - 1024px) / 2), 208px);
  }
  .pcs--dark  { background: #2b2b2b; }
  .pcs--light { background: #ffffff; }

  .pcs__inner {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .pcs__heading {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 30px;
    line-height: 36px;
    margin: 0;
    word-break: break-word;
  }
  .pcs--dark  .pcs__heading { color: #ffd25e; }
  .pcs--light .pcs__heading { color: #111827; }

  .pcs__image-wrap {
    width: 100%;
    height: 422px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .pcs__image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .pcs__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3a3a3a;
    color: #6b7280;
    font-size: 14px;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
  }

  .pcs__body {
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 400;
    font-size: 14px;
    line-height: 22.75px;
    margin: 0;
  }
  .pcs--dark  .pcs__body { color: #d1d5db; }
  .pcs--light .pcs__body { color: #4b5563; }

  .pcs__cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 10px 24px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    font-family: var(--font-work-sans, 'Work Sans', sans-serif);
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    transition: opacity 0.15s ease;
    align-self: flex-start;
  }
  .pcs__cta:hover { opacity: 0.85; }
  .pcs--dark  .pcs__cta { background: #ffffff; color: #111827; }
  .pcs--light .pcs__cta { background: #2b2b2b; color: #ffffff; }

  .pcs__arrow {
    width: 10.5px;
    height: 12px;
    flex-shrink: 0;
    display: block;
  }

  @media (max-width: 767px) {
    .pcs { padding: 64px 24px; }
    .pcs__image-wrap { height: auto; aspect-ratio: 16/9; }
  }
`

let injected = false

export default function ProductContentSection({ data }: { data: ProductContentSectionData }) {
  const theme    = data.pcTheme    ?? 'dark'
  const title    = data.pcTitle    ?? ''
  const image    = data.pcImage    ?? null
  const body     = data.pcBody     ?? ''
  const ctaLabel = data.pcCtaLabel ?? 'Learn more'
  const ctaUrl   = data.pcCtaUrl   ?? '#'
  const isDark   = theme === 'dark'

  useEffect(() => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <section className={`pcs pcs--${theme}`}>
      <div className="pcs__inner">
        {title && <h2 className="pcs__heading">{title}</h2>}

        <div className="pcs__image-wrap">
          {image?.url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={image.url} alt={image.alt ?? title} />
            : <div className="pcs__image-placeholder">No image selected</div>
          }
        </div>

        {body && <p className="pcs__body">{body}</p>}

        {ctaLabel && (
          <Link href={ctaUrl} className="pcs__cta">
            <span>{ctaLabel}</span>
            <svg className="pcs__arrow" viewBox="0 0 10.5 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L9.5 6L1 11" stroke={isDark ? '#111827' : '#ffffff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
      </div>
    </section>
  )
}
