'use client'

import { useState, useCallback, useEffect } from 'react'

interface TestimonialItem {
  clientName?:    string
  clientRole?:    string
  clientCompany?: string
  quote?:         string
  rating?:        number
  avatar?:        { url: string; alt?: string }
}

function StarIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="#f59e0b" aria-hidden>
      <path d="M9 0.5L11.45 5.45L17 6.27L13 10.14L13.91 15.73L9 13.14L4.09 15.73L5 10.14L1 6.27L6.55 5.45L9 0.5Z" />
    </svg>
  )
}

function TestimonialCardItem({ item }: { item: TestimonialItem }) {
  const byline  = [item.clientRole, item.clientCompany].filter(Boolean).join(', ')
  const rating  = item.rating ?? 5
  const initial = item.clientName?.charAt(0).toUpperCase() ?? '?'

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background:   '#ffffff',
        border:       '1px solid #e5e5e5',
        borderRadius: '12px',
        padding:      '33px',
        gap:          '16px',
      }}
    >
      {/* Avatar + Name/Byline */}
      <div className="flex items-center gap-4">
        {item.avatar?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.avatar.url}
            alt={item.avatar.alt ?? item.clientName ?? ''}
            style={{ width: 48, height: 48, borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width:          48,
              height:         48,
              borderRadius:   '9999px',
              flexShrink:     0,
              background:     'linear-gradient(135deg,#ffd369,#ffb347)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          '#171717',
              fontWeight:     700,
              fontSize:       '16px',
              fontFamily:     'var(--font-work-sans, sans-serif)',
            }}
          >
            {initial}
          </div>
        )}
        <div className="flex flex-col">
          {item.clientName && (
            <p style={{ color: '#171717', fontSize: '16px', fontWeight: 400, lineHeight: '24px', fontFamily: 'var(--font-work-sans, sans-serif)', margin: 0 }}>
              {item.clientName}
            </p>
          )}
          {byline && (
            <p style={{ color: '#525252', fontSize: '14px', fontWeight: 400, lineHeight: '20px', fontFamily: 'var(--font-work-sans, sans-serif)', margin: 0 }}>
              {byline}
            </p>
          )}
        </div>
      </div>

      {/* Quote */}
      {item.quote && (
        <p style={{ color: '#525252', fontSize: '16px', fontWeight: 400, lineHeight: '24px', fontFamily: 'var(--font-work-sans, sans-serif)', flex: 1, paddingTop: '8px', margin: 0 }}>
          &ldquo;{item.quote}&rdquo;
        </p>
      )}

      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: rating }).map((_, i) => <StarIcon key={i} />)}
      </div>
    </div>
  )
}

type Slot = TestimonialItem | null

export default function TestimonialsCarousel({ items }: { items: TestimonialItem[] }) {
  // Responsive: 3 per page on md+, 1 on mobile
  const [perPage, setPerPage] = useState(3)

  useEffect(() => {
    const update = () => setPerPage(window.innerWidth < 768 ? 1 : 3)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Group into pages, always padding the last page to perPage slots so
  // incomplete slides keep the same 3-column structure (empty columns are invisible).
  const pages: Slot[][] = []
  for (let i = 0; i < items.length; i += perPage) {
    const slice: Slot[] = items.slice(i, i + perPage)
    while (slice.length < perPage) slice.push(null)
    pages.push(slice)
  }
  const totalPages = pages.length

  const [current, setCurrent] = useState(0)

  // Clamp current when perPage changes (e.g. resize shrinks total pages)
  useEffect(() => {
    setCurrent(c => Math.min(c, Math.max(0, totalPages - 1)))
  }, [totalPages])

  const prev = useCallback(() => setCurrent(c => (c - 1 + totalPages) % totalPages), [totalPages])
  const next = useCallback(() => setCurrent(c => (c + 1) % totalPages), [totalPages])

  if (items.length === 0) return null

  // The flex container spans all pages side-by-side.
  // translateX % is relative to the container's own width, so
  // moving one page = (100 / totalPages)% of the container.
  const containerWidthPct = totalPages * 100
  const slideStepPct      = 100 / totalPages

  return (
    <div>
      {/* Sliding viewport */}
      <div style={{ overflow: 'hidden' }}>
        <div
          style={{
            display:    'flex',
            width:      `${containerWidthPct}%`,
            transform:  `translateX(-${current * slideStepPct}%)`,
            transition: 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        >
          {pages.map((page, pi) => (
            <div
              key={pi}
              style={{
                width:      `${slideStepPct}%`,
                flexShrink: 0,
                display:    'flex',
                gap:        '20px',
                alignItems: 'stretch',
              }}
            >
              {page.map((item, ci) => (
                // null slots reserve the column width but render nothing,
                // keeping the 3-column structure on partial last slides.
                <div key={ci} style={{ flex: 1, minWidth: 0 }}>
                  {item && <TestimonialCardItem item={item} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Nav controls — only when more than one page */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4" style={{ marginTop: '32px' }}>
          <button
            onClick={prev}
            aria-label="Previous page"
            style={{
              width:          44,
              height:         44,
              borderRadius:   '9999px',
              background:     '#171717',
              color:          '#ffd369',
              border:         'none',
              cursor:         'pointer',
              fontSize:       '18px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
              transition:     'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            ←
          </button>

          {/* Page dots */}
          <div className="flex items-center gap-2">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to page ${i + 1}`}
                style={{
                  width:        i === current ? 24 : 8,
                  height:       8,
                  borderRadius: 4,
                  background:   i === current ? '#171717' : 'rgba(23,23,23,0.3)',
                  border:       'none',
                  cursor:       'pointer',
                  padding:      0,
                  transition:   'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next page"
            style={{
              width:          44,
              height:         44,
              borderRadius:   '9999px',
              background:     '#171717',
              color:          '#ffd369',
              border:         'none',
              cursor:         'pointer',
              fontSize:       '18px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
              transition:     'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
