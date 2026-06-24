// Testimonials Section — Layout Builder variant (Advance)
// Used by: testimonials / home-testimonials block types
// Modes: collection (fetches from Testimonials collection) | manual (uses overrides.testimonialItems)
// Carousel: enabled via enableCarousel — 3 cards per slide on desktop, 1 on mobile

import type React from 'react'
import TestimonialsCarousel from './TestimonialsCarousel'

interface TestimonialItem {
  clientName?:    string
  clientRole?:    string
  clientCompany?: string
  quote?:         string
  rating?:        number
  avatar?:        { url: string; alt?: string }
}

interface TestimonialsSectionData {
  heading?:                  string
  subheading?:               string
  testimonialsContentSource?: 'collection' | 'manual'
  testimonialsLimit?:        number
  enableCarousel?:           boolean
  testimonialItems?:         TestimonialItem[]
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

export type { TestimonialItem, TestimonialsSectionData }

// ── Shared shell (handles grid vs carousel layout) ───────────────────────────

export function TestimonialsShell({ data, items }: { data: TestimonialsSectionData; items: TestimonialItem[] }) {
  const enableCarousel = data.enableCarousel ?? false

  return (
    <section
      className="py-20"
      style={{
        background:   'var(--color-bg, #ffd369)',
        paddingTop:   'var(--section-padding-y, 80px)',
        paddingBottom:'var(--section-padding-y, 80px)',
      }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: 'var(--content-max-width, 1280px)' }}>
        {(data.heading || data.subheading) && (
          <div className="flex flex-col items-center gap-4 mb-16">
            {data.heading && (
              <h2
                className="text-center w-full"
                style={{
                  fontFamily:    'var(--font-work-sans, sans-serif)',
                  fontSize:      'var(--heading-font-size, clamp(1.75rem, 3vw, 2.25rem))',
                  fontWeight:    'var(--heading-font-weight, 400)' as React.CSSProperties['fontWeight'],
                  // color:         'var(--color-text, #171717)',
                  color:         '#171717',
                  letterSpacing: '-0.01em',
                  lineHeight:    1.2,
                  margin:        0,
                }}
              >
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p
                className="text-center"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   'var(--body-font-size, 1rem)',
                  color:      'var(--color-muted, #525252)',
                  maxWidth:   '44rem',
                  margin:     0,
                  lineHeight: '24px',
                }}
              >
                {data.subheading}
              </p>
            )}
          </div>
        )}

        {items.length > 0 && (
          enableCarousel ? (
            <TestimonialsCarousel items={items} />
          ) : (
            // Grid mode: show first 3 items only
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {items.slice(0, 3).map((item, i) => (
                <TestimonialCardItem key={i} item={item} />
              ))}
            </div>
          )
        )}
      </div>
    </section>
  )
}

// ── Sync default export (manual mode / admin preview) ────────────────────────

export default function TestimonialsSection({ data }: { data: TestimonialsSectionData }) {
  const items = (data.testimonialItems ?? []).map((t) => ({
    clientName:    t.clientName,
    clientRole:    t.clientRole,
    clientCompany: t.clientCompany,
    quote:         t.quote,
    rating:        t.rating,
    avatar:        t.avatar,
  }))
  return <TestimonialsShell data={data} items={items} />
}

