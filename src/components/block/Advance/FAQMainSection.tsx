'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// ─── Responsive CSS ───────────────────────────────────────────────────────────
const CSS = `
  .faqm { padding: 78px 52px; background: #ffffff; }
  .faqm__inner { display: flex; gap: 0; position: relative; max-width: 1440px; margin: 0 auto; }

  /* Sidebar */
  .faqm__sidebar { width: 291px; flex-shrink: 0; padding-right: 48px; }
  .faqm__divider { width: 1px; background: #e5e5e5; flex-shrink: 0; }
  .faqm__content { flex: 1; padding-left: 48px; }

  /* Search */
  .faqm__search { border: 1px solid #d9d9d9; border-radius: 9999px; padding: 12px 16px;
    display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
  .faqm__search input { border: none; outline: none; flex: 1; background: transparent;
    font-family: var(--font-work-sans, sans-serif); font-size: 16px; }

  /* Category nav — desktop: vertical left-border tabs */
  .faqm__cats { display: flex; flex-direction: column; gap: 8px; padding: 0 16px; }
  .faqm__cat {
    display: flex; align-items: center; padding: 8px 12px; width: 100%; text-align: left;
    border: none; border-left: 2px solid transparent; background: none; cursor: pointer;
    font-family: var(--font-work-sans, sans-serif); font-size: 16px; font-weight: 600;
    transition: color 0.15s ease;
  }
  .faqm__cat--active { border-left-color: #000000; color: #000000; }
  .faqm__cat--inactive { color: #4b5563; }

  /* Back link */
  .faqm__back {
    display: inline-flex; align-items: center; gap: 8px; margin-bottom: 40px;
    background: none; border: none; cursor: pointer; padding: 0;
    font-family: var(--font-work-sans, sans-serif); font-size: 14px; font-weight: 400;
    line-height: 20px; color: #525252; transition: color 0.15s ease;
  }
  .faqm__back:hover { color: #171717; }

  /* Heading */
  .faqm__heading {
    font-family: var(--font-work-sans, sans-serif); font-size: 48px; font-weight: 400;
    color: #000000; line-height: 48px; margin: 0 0 24px;
  }

  /* Accordion */
  .faqm__accordion { display: flex; flex-direction: column; gap: 16px; }
  .faqm__item { border: 1px solid #e5e5e5; background: #ffffff; overflow: hidden; }
  .faqm__q {
    width: 100%; padding: 33px; display: flex; align-items: flex-start;
    justify-content: space-between; gap: 32px;
    background: none; border: none; cursor: pointer; text-align: left;
  }
  .faqm__q-text {
    font-family: var(--font-work-sans, sans-serif); font-size: 18px; font-weight: 400;
    color: #000000; line-height: 28px;
  }
  .faqm__q-icon {
    flex-shrink: 0; font-size: 20px; font-weight: 300; color: #000000;
    line-height: 20px; margin-top: 4px; width: 17.5px; text-align: center;
  }
  .faqm__a { padding: 0 33px 33px; }
  .faqm__a p {
    font-family: var(--font-work-sans, sans-serif); font-size: 16px;
    color: #525252; line-height: 26px; margin: 0;
  }
  .faqm__empty {
    font-family: var(--font-work-sans, sans-serif); font-size: 16px;
    color: #525252; padding: 33px 0;
  }

  /* ── Mobile ≤ 767px ─────────────────────────────────────────────────────── */
  @media (max-width: 767px) {
    .faqm { padding: 40px 20px; }
    .faqm__inner { flex-direction: column; }

    /* Sidebar becomes full-width header strip */
    .faqm__sidebar { width: 100%; padding-right: 0; padding-bottom: 4px; }
    .faqm__divider { display: none; }
    .faqm__content { padding-left: 0; padding-top: 0; }

    /* Search — tighter margin */
    .faqm__search { margin-bottom: 12px; }
    .faqm__search input { font-size: 14px; }

    /* Categories — horizontal pill tabs */
    .faqm__cats {
      flex-direction: row;
      overflow-x: auto;
      padding: 0 0 8px;
      gap: 8px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .faqm__cats::-webkit-scrollbar { display: none; }
    .faqm__cat {
      width: auto; flex-shrink: 0; white-space: nowrap;
      border-left: none; border-radius: 9999px;
      padding: 8px 18px; font-size: 13px; font-weight: 500;
    }
    .faqm__cat--active { background: #171717; color: #ffffff; border-left: none; }
    .faqm__cat--inactive { background: #f5f5f5; color: #525252; border-left: none; }

    /* Back link */
    .faqm__back { margin-bottom: 28px; font-size: 13px; }

    /* Heading */
    .faqm__heading { font-size: 26px; line-height: 34px; margin-bottom: 20px; }

    /* Accordion — tighter padding */
    .faqm__accordion { gap: 12px; }
    .faqm__q { padding: 20px 18px; gap: 16px; }
    .faqm__q-text { font-size: 15px; line-height: 24px; }
    .faqm__q-icon { font-size: 18px; margin-top: 2px; }
    .faqm__a { padding: 0 18px 20px; }
    .faqm__a p { font-size: 14px; line-height: 24px; }
  }

  /* ── Tablet 768–1023px ──────────────────────────────────────────────────── */
  @media (min-width: 768px) and (max-width: 1023px) {
    .faqm { padding: 56px 32px; }
    .faqm__sidebar { width: 220px; padding-right: 32px; }
    .faqm__content { padding-left: 32px; }
    .faqm__heading { font-size: 36px; line-height: 40px; }
    .faqm__q { padding: 24px; }
    .faqm__a { padding: 0 24px 24px; }
  }
`

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
  faqItems?: Array<{ question?: string; answer?: string }>
}

// ─── Client component ─────────────────────────────────────────────────────────

interface FAQMainClientProps {
  categories: FAQCategory[]
  faqs: FAQEntry[]
  backLabel?: string
}

export function FAQMainClient({ categories, faqs, backLabel }: FAQMainClientProps) {
  const router = useRouter()
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
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <section className="faqm">
        <div className="faqm__inner">

          {/* ── Left sidebar ─────────────────────────────────────── */}
          {hasSidebar && (
            <>
              <div className="faqm__sidebar">
                {/* Search box */}
                <div className="faqm__search">
                  <input
                    type="text"
                    placeholder="Search any questions here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ color: search ? '#171717' : '#b3b3b3' }}
                  />
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <circle cx="6.5" cy="6.5" r="4.5" stroke="#b3b3b3" strokeWidth="1.5" />
                    <path d="M10.5 10.5L13 13" stroke="#b3b3b3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Category nav */}
                <div className="faqm__cats">
                  {categories.map((cat) => {
                    const isActive = cat.slug === activeSlug
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => { setActiveSlug(cat.slug); setOpenIndex(null) }}
                        className={`faqm__cat ${isActive ? 'faqm__cat--active' : 'faqm__cat--inactive'}`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="faqm__divider" />
            </>
          )}

          {/* ── Right content ─────────────────────────────────────── */}
          <div className="faqm__content">
            {/* Back link */}
            <button className="faqm__back" onClick={() => router.back()}>
              <svg width="13" height="14" viewBox="0 0 13 14" fill="none" aria-hidden>
                <path d="M0.256348 6.38213C-0.0854492 6.72393 -0.0854492 7.279 0.256348 7.6208L4.63135 11.9958C4.97314 12.3376 5.52822 12.3376 5.87002 11.9958C6.21182 11.654 6.21182 11.0989 5.87002 10.7571L2.98525 7.8751H11.3743C11.8583 7.8751 12.2493 7.48408 12.2493 7.0001C12.2493 6.51611 11.8583 6.1251 11.3743 6.1251H2.98799L5.86729 3.24307C6.20908 2.90127 6.20908 2.34619 5.86729 2.00439C5.52549 1.6626 4.97041 1.6626 4.62861 2.00439L0.253613 6.37939L0.256348 6.38213Z" fill="currentColor" />
              </svg>
              {backLabel ?? 'Back'}
            </button>

            {/* Category heading */}
            {hasSidebar && currentCat && (
              <h2 className="faqm__heading">{currentCat.title}</h2>
            )}

            {/* Accordion */}
            <div className="faqm__accordion">
              {filtered.map((item, i) => (
                <div key={i} className="faqm__item">
                  <button
                    className="faqm__q"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <span className="faqm__q-text">{item.question}</span>
                    <span className="faqm__q-icon">{openIndex === i ? '−' : '+'}</span>
                  </button>

                  {openIndex === i && item.answer && (
                    <div className="faqm__a">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}

              {filtered.length === 0 && (
                <p className="faqm__empty">No questions found.</p>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
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
    />
  )
}
