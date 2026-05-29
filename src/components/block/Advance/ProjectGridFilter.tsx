'use client'

import { useState } from 'react'
import Link from 'next/link'

function ArrowRightIcon() {
  return (
    <svg width="10.5" height="12" viewBox="0 0 10.5 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10.2797 6.52969C10.5727 6.23672 10.5727 5.76094 10.2797 5.46797L6.52969 1.71797C6.23672 1.425 5.76094 1.425 5.46797 1.71797C5.175 2.01094 5.175 2.48672 5.46797 2.77969L7.94063 5.25H0.75C0.335156 5.25 0 5.58516 0 6C0 6.41484 0.335156 6.75 0.75 6.75H7.93828L5.47031 9.22031C5.17734 9.51328 5.17734 9.98906 5.47031 10.282C5.76328 10.575 6.23906 10.575 6.53203 10.282L10.282 6.53203L10.2797 6.52969" fill="#171717" />
    </svg>
  )
}

function ArrowRightLgIcon() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M1 8h10M6 2l5 6-5 6" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg width="12" height="16" viewBox="0 0 12.0047 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M5.29609 14.7063C5.68672 15.0969 6.32109 15.0969 6.71172 14.7063L11.7117 9.70625C12.1023 9.31563 12.1023 8.68125 11.7117 8.29063C11.3211 7.9 10.6867 7.9 10.2961 8.29063L7.00234 11.5875V2C7.00234 1.44687 6.55547 1 6.00234 1C5.44922 1 5.00234 1.44687 5.00234 2V11.5844L1.70859 8.29375C1.31797 7.90312 0.683594 7.90312 0.292969 8.29375C-0.0976562 8.68437 -0.0976562 9.31875 0.292969 9.70938L5.29297 14.7094L5.29609 14.7063" fill="#171717" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
      <path d="M8 2L2 8l6 6" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
      <path d="M2 2l6 6-6 6" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PageButton({ label, active, disabled, onClick }: { label: React.ReactNode; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '40px', height: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background:  active ? '#171717' : '#ffffff',
        border:      `1px solid ${active ? '#171717' : '#d4d4d4'}`,
        color:       active ? '#ffffff' : '#404040',
        fontFamily:  'var(--font-work-sans, sans-serif)',
        fontSize:    '16px', fontWeight: 400,
        cursor:      disabled ? 'default' : 'pointer',
        opacity:     disabled ? 0.4 : 1,
        flexShrink:  0,
        transition:  'background 0.15s, border-color 0.15s, color 0.15s',
      }}
    >
      {label}
    </button>
  )
}

function buildPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

export interface ProjectItem {
  projectTag?: string
  projectType?: string
  projectTitle?: string
  projectDesc?: string
  projectCta?: string
  projectUrl?: string
  projectImage?: { url: string; alt?: string } | null
  projectAllCategories?: string[]
}

interface ProjectGridFilterProps {
  heading?:          string
  subheading?:       string
  items:             ProjectItem[]
  showCategoryFilter?: boolean
  pageSize?:         number
  loadMoreType?:     'pagination' | 'load-more' | 'link'
  loadMoreLabel?:    string
  loadMoreUrl?:      string
}

function ProjectCard({ item }: { item: ProjectItem }) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}
    >
      {/* Image thumbnail — 320px tall, matching Figma */}
      <div className="relative w-full shrink-0" style={{ height: '320px', background: '#d4d4d4' }}>
        {item.projectImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.projectImage.url}
            alt={item.projectImage.alt ?? item.projectTitle ?? ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-6">
        {/* Category + type badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {item.projectTag && (
            <span
              className="px-3 py-1 text-xs"
              style={{
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                color: '#171717',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                borderRadius: 0,
              }}
            >
              {item.projectTag}
            </span>
          )}
          {item.projectType && (
            <span
              className="px-3 py-1 text-xs"
              style={{
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                color: '#171717',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                borderRadius: 0,
              }}
            >
              {item.projectType}
            </span>
          )}
        </div>

        {/* Title */}
        {item.projectTitle && (
          <div className="pt-1">
            <h3
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: '#171717',
                lineHeight: '28px',
              }}
            >
              {item.projectTitle}
            </h3>
          </div>
        )}

        {/* Short description */}
        {item.projectDesc && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '0.875rem',
              color: '#525252',
              lineHeight: '20px',
            }}
          >
            {item.projectDesc}
          </p>
        )}

        {/* CTA link */}
        {item.projectCta && item.projectUrl && (
          <Link
            href={item.projectUrl}
            className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-70"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '0.875rem',
              color: '#171717',
            }}
          >
            {item.projectCta}
            <ArrowRightIcon />
          </Link>
        )}
      </div>
    </div>
  )
}

export function ProjectGridFilter({
  heading,
  subheading,
  items,
  showCategoryFilter = true,
  pageSize      = 6,
  loadMoreType  = 'pagination',
  loadMoreLabel,
  loadMoreUrl,
}: ProjectGridFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [visibleCount,   setVisibleCount]   = useState(pageSize)
  const [page,           setPage]           = useState(1)

  const categories = showCategoryFilter
    ? Array.from(
        new Set(
          items
            .flatMap((item) => [item.projectTag, ...(item.projectAllCategories ?? [])])
            .filter(Boolean) as string[],
        ),
      )
    : []

  const filtered =
    activeCategory === 'all'
      ? items
      : items.filter((item) => {
          const cats = [item.projectTag, ...(item.projectAllCategories ?? [])].filter(Boolean) as string[]
          return cats.includes(activeCategory)
        })

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat)
    setVisibleCount(pageSize)
    setPage(1)
  }

  // Visible items by mode
  const visible =
    loadMoreType === 'load-more'
      ? filtered.slice(0, visibleCount)
      : loadMoreType === 'pagination'
        ? filtered.slice((page - 1) * pageSize, page * pageSize)
        : filtered  // link mode: show all (or the initial set)

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const hasMore    = visibleCount < filtered.length
  const pageList   = buildPages(page, totalPages)

  return (
    <section id="projects" className="py-20 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>

        {(heading || subheading) && (
          <div className="flex flex-col items-center gap-5 text-center" style={{ maxWidth: '768px', margin: '0 auto 3rem' }}>
            {heading && (
              <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '3rem', fontWeight: 400, color: '#171717', lineHeight: '48px' }}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '28px' }}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {showCategoryFilter && categories.length > 0 && (
          <div className="flex items-center gap-4 justify-center flex-wrap pt-4 pb-8">
            <button
              onClick={() => handleCategoryChange('all')}
              className="px-6 py-2 text-sm transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-work-sans, sans-serif)', background: activeCategory === 'all' ? '#171717' : '#f5f5f5', color: activeCategory === 'all' ? '#ffffff' : '#171717', borderRadius: '8px', border: 'none' }}
            >
              All Projects
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="px-6 py-2 text-sm transition-colors cursor-pointer"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', background: activeCategory === cat ? '#171717' : '#f5f5f5', color: activeCategory === cat ? '#ffffff' : '#171717', borderRadius: '8px', border: 'none' }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {visible.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((item, i) => <ProjectCard key={i} item={item} />)}
          </div>
        )}

        {/* ── Load More — append next batch ── */}
        {loadMoreType === 'load-more' && hasMore && (
          <div className="flex items-center justify-center mt-16">
            <button
              onClick={() => setVisibleCount((n) => n + pageSize)}
              className="inline-flex items-center gap-2 cursor-pointer transition-opacity duration-200 hover:opacity-70"
              style={{ border: '2px solid #171717', borderRadius: '8px', padding: '18px 34px', background: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#171717' }}
            >
              {loadMoreLabel || 'Load More Projects'}
              <ArrowDownIcon />
            </button>
          </div>
        )}

        {/* ── Link — navigate to a URL ── */}
        {loadMoreType === 'link' && loadMoreUrl && (
          <div className="flex items-center justify-center mt-16">
            <Link
              href={loadMoreUrl}
              className="inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
              style={{ border: '2px solid #171717', borderRadius: '8px', padding: '18px 34px', background: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#171717', textDecoration: 'none' }}
            >
              {loadMoreLabel || 'View All Projects'}
              <ArrowRightLgIcon />
            </Link>
          </div>
        )}

        {/* ── Pagination — numbered page buttons ── */}
        {loadMoreType === 'pagination' && totalPages > 1 && (
          <div className="flex justify-center mt-16">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PageButton label={<ChevronLeft />} disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} />

              {pageList.map((p, i) =>
                p === '...' ? (
                  <span key={`e-${i}`} style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', color: '#737373', padding: '0 12px' }}>...</span>
                ) : (
                  <PageButton key={p} label={p} active={p === page} onClick={() => setPage(p as number)} />
                )
              )}

              <PageButton label={<ChevronRight />} disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
