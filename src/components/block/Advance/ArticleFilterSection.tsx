'use client'

// Article Filter Section — Layout Builder variant (Advance)
// Dispatches a window CustomEvent ('article-category-change') when a button is clicked.
// article-feature and article-main-grid blocks listen for this event and re-fetch.
// No URL changes — the page stays completely still.

import { useEffect, useState } from 'react'

interface Category {
  id:   string
  name: string
  slug: string
}

export interface ArticleFilterData {
  artFilterAllLabel?: string
}

export const ARTICLE_CATEGORY_EVENT = 'article-category-change'

export default function ArticleFilterSection({ data }: { data: ArticleFilterData }) {
  const [categories,      setCategories]      = useState<Category[]>([])
  const [activeCategory,  setActiveCategory]  = useState('')

  useEffect(() => {
    fetch('/api/categories?limit=100&depth=0&sort=name')
      .then(r => r.json())
      .then(json => setCategories(json.docs ?? []))
      .catch(() => {})
  }, [])

  function selectCategory(slug: string) {
    setActiveCategory(slug)
    window.dispatchEvent(
      new CustomEvent(ARTICLE_CATEGORY_EVENT, { detail: { category: slug } })
    )
  }

  const allLabel = data.artFilterAllLabel || 'All Articles'
  const buttons  = [{ id: '__all', name: allLabel, slug: '' }, ...categories]

  return (
    <section
      style={{
        background:   '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        padding:      '24px 0',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 112px' }}>
        <div className="flex flex-wrap" style={{ gap: '8px' }}>
          {buttons.map(btn => {
            const active = activeCategory === btn.slug
            return (
              <button
                key={btn.id}
                onClick={() => selectCategory(btn.slug)}
                style={{
                  padding:    '11px 21px',
                  background: active ? '#171717' : '#ffffff',
                  border:     `1px solid ${active ? '#171717' : '#d4d4d4'}`,
                  color:      active ? '#ffffff' : '#404040',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  cursor:     'pointer',
                  transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {btn.name}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
