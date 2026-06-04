'use client'

import React, { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FAQAboutItem {
  faqQuestion?: string
  faqAnswer?: string
}

export interface FAQAboutSectionData {
  badge?: string
  badgeIcon?: { url: string; alt?: string } | null
  badgeIconUrl?: string
  faqHeading?: string
  faqSubheading?: string
  faqContentSource?: 'collection' | 'manual'
  faqCategorySlug?: string
  faqLimit?: number
  faqItems?: FAQAboutItem[]
  faqSeeMoreLabel?: string
  faqSeeMoreUrl?: string
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function QuestionIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="6.5" stroke="#000000" strokeWidth="1" />
      <path
        d="M5.75 5.5C5.75 4.81 6.31 4.25 7 4.25C7.69 4.25 8.25 4.81 8.25 5.5C8.25 5.99 7.97 6.41 7.56 6.63C7.22 6.81 7 7.16 7 7.54V8"
        stroke="#000000"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="7" cy="9.75" r="0.5" fill="#000000" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3V15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 9H15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9H15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Resolved item (passed to client after fetch or manual mapping) ───────────

export interface FAQAboutResolvedItem {
  question: string
  answer?: string
}

// ─── Client component (holds accordion state) ─────────────────────────────────

export interface FAQAboutClientProps {
  badge?: string
  badgeIconUrl?: string
  heading?: string
  subheading?: string
  items: FAQAboutResolvedItem[]
  seeMoreLabel?: string
  seeMoreUrl?: string
}

export function FAQAboutClient({ badge = 'FAQ', badgeIconUrl, heading, subheading, items, seeMoreLabel, seeMoreUrl }: FAQAboutClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section style={{ background: 'var(--section-bg, #ffffff)', padding: '112px 32px' }}>
      <div
        style={{
          maxWidth: '1033px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '64px',
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '23px',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f5f5f5',
              padding: '8px 16px',
            }}
          >
            {badgeIconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={badgeIconUrl} alt="" style={{ width: '14px', height: '14px', objectFit: 'contain', flexShrink: 0 }} />
            ) : (
              <QuestionIcon />
            )}
            <span
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '14px',
                fontWeight: 400,
                color: '#000000',
                letterSpacing: '0.35px',
                lineHeight: '20px',
              }}
            >
              {badge}
            </span>
          </div>

          {heading && (
            <h2
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400,
                color: '#000000',
                lineHeight: '1',
                margin: 0,
              }}
            >
              {heading}
            </h2>
          )}

          {subheading && (
            <p
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '18px',
                fontWeight: 400,
                color: '#525252',
                lineHeight: '29.25px',
                margin: 0,
              }}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* ── Accordion ──────────────────────────────────────────────────── */}
        {items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <div key={i} style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    style={{
                      width: '100%',
                      padding: '33px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '32px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                        fontSize: '18px',
                        fontWeight: 400,
                        color: '#000000',
                        lineHeight: '28px',
                      }}
                    >
                      {item.question}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '4px',
                        width: '18px',
                        height: '20px',
                      }}
                    >
                      {isOpen ? <MinusIcon /> : <PlusIcon />}
                    </span>
                  </button>

                  {isOpen && item.answer && (
                    <div style={{ padding: '0 33px 33px' }}>
                      <p
                        style={{
                          fontFamily: 'var(--font-work-sans, sans-serif)',
                          fontSize: '16px',
                          fontWeight: 400,
                          color: '#525252',
                          lineHeight: '26px',
                          margin: 0,
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── See more link ───────────────────────────────────────────────── */}
        {seeMoreUrl && (
          <div style={{ textAlign: 'center' }}>
            <a
              href={seeMoreUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '16px',
                fontWeight: 400,
                color: '#171717',
                textDecoration: 'none',
                borderBottom: '1px solid #171717',
                paddingBottom: '2px',
                lineHeight: '24px',
              }}
            >
              {seeMoreLabel ?? 'See more'}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Sync default export — admin preview / manual mode ────────────────────────

export default function FAQAboutSection({ data }: { data: FAQAboutSectionData }) {
  const items: FAQAboutResolvedItem[] = (data.faqItems ?? []).map((it) => ({
    question: it.faqQuestion ?? '',
    answer:   it.faqAnswer,
  }))

  return (
    <FAQAboutClient
      badge={data.badge}
      badgeIconUrl={data.badgeIconUrl ?? (data.badgeIcon as any)?.url}
      heading={data.faqHeading}
      subheading={data.faqSubheading}
      items={items}
      seeMoreLabel={data.faqSeeMoreLabel}
      seeMoreUrl={data.faqSeeMoreUrl}
    />
  )
}
