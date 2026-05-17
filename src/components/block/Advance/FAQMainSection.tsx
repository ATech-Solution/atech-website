'use client'

import React, { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FAQCategory {
  id: string
  name: string
  title: string
  slug: string
}

export interface FAQEntry {
  id?: string
  categorySlug: string
  question: string
  answer?: string
}

export interface FAQMainData {
  faqContentSource?: 'collection' | 'manual'
  faqCategorySlug?: string
  faqLimit?: number
  faqBackLabel?: string
  faqBackUrl?: string
  faqItems?: Array<{ question?: string; answer?: string }>
}

// ─── Client component (handles search + category switching) ───────────────────

interface FAQMainClientProps {
  categories: FAQCategory[]
  faqs: FAQEntry[]
  backLabel?: string
  backUrl?: string
}

export function FAQMainClient({ categories, faqs, backLabel, backUrl }: FAQMainClientProps) {
  const firstSlug = categories[0]?.slug ?? ''
  const [activeSlug, setActiveSlug] = useState(firstSlug)
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const currentCat = categories.find((c) => c.slug === activeSlug)

  const filtered = useMemo(() => {
    let items = faqs
    if (activeSlug) items = items.filter((f) => f.categorySlug === activeSlug)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter((f) => f.question.toLowerCase().includes(q))
    }
    return items
  }, [faqs, activeSlug, search])

  const hasSidebar = categories.length > 0

  return (
    <section style={{ background: '#ffffff', padding: '78px 52px' }}>
      <div style={{ display: 'flex', gap: 0, position: 'relative', maxWidth: '1440px', margin: '0 auto' }}>

        {/* ── Left sidebar ─────────────────────────────────────── */}
        {hasSidebar && (
          <>
            <div style={{ width: '291px', flexShrink: 0, paddingRight: '48px', paddingTop: '0' }}>
              {/* Search box */}
              <div style={{
                border: '1px solid #d9d9d9',
                borderRadius: '9999px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
              }}>
                <input
                  type="text"
                  placeholder="Search any questions here"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    flex: 1,
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: '16px',
                    color: search ? '#171717' : '#b3b3b3',
                    background: 'transparent',
                  }}
                />
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="4.5" stroke="#b3b3b3" strokeWidth="1.5" />
                  <path d="M10.5 10.5L13 13" stroke="#b3b3b3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Category nav */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', paddingRight: '16px' }}>
                {categories.map((cat) => {
                  const isActive = cat.slug === activeSlug
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => { setActiveSlug(cat.slug); setOpenIndex(null) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderTop: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
                        borderLeft: isActive ? '2px solid #000000' : '2px solid transparent',
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: isActive ? '#000000' : '#4b5563',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Vertical divider */}
            <div style={{ width: '1px', background: '#e5e5e5', flexShrink: 0 }} />
          </>
        )}

        {/* ── Right content ─────────────────────────────────────── */}
        <div style={{ flex: 1, paddingLeft: hasSidebar ? '48px' : '0' }}>
          {/* Back link */}
          {backUrl && (
            <a
              href={backUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#525252',
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                lineHeight: '20px',
                marginBottom: '40px',
              }}
            >
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path d="M8 2L4 7L8 12" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {backLabel ?? 'Back'}
            </a>
          )}

          {/* Category heading */}
          {hasSidebar && currentCat && (
            <h2 style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '48px',
              fontWeight: 400,
              color: '#000000',
              lineHeight: '48px',
              marginBottom: '24px',
              marginTop: backUrl ? '0' : '0',
            }}>
              {currentCat.title}
            </h2>
          )}

          {/* Accordion items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map((item, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid #e5e5e5',
                  background: '#ffffff',
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
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
                  <span style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#000000',
                    lineHeight: '28px',
                  }}>
                    {item.question}
                  </span>
                  <span style={{
                    flexShrink: 0,
                    fontSize: '20px',
                    fontWeight: 300,
                    color: '#000000',
                    lineHeight: '20px',
                    marginTop: '4px',
                    width: '17.5px',
                    textAlign: 'center',
                  }}>
                    {openIndex === i ? '−' : '+'}
                  </span>
                </button>

                {openIndex === i && item.answer && (
                  <div style={{ padding: '0 33px 33px' }}>
                    <p style={{
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                      fontSize: '16px',
                      color: '#525252',
                      lineHeight: '26px',
                      margin: 0,
                    }}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <p style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '16px',
                color: '#525252',
                padding: '33px 0',
              }}>
                No questions found.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Sync default export (admin preview / fallback) ───────────────────────────

export default function FAQMainSection({ data }: { data: FAQMainData }) {
  const items: FAQEntry[] = (data.faqItems ?? []).map((it, i) => ({
    id: String(i),
    categorySlug: 'manual',
    question: it.question ?? '',
    answer: it.answer,
  }))

  const cats: FAQCategory[] = items.length > 0
    ? [{ id: 'manual', name: 'General', title: 'FAQs', slug: 'manual' }]
    : []

  return (
    <FAQMainClient
      categories={cats}
      faqs={items}
      backLabel={data.faqBackLabel}
      backUrl={data.faqBackUrl}
    />
  )
}

