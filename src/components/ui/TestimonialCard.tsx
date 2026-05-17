'use client'

// Reusable testimonial card — Figma node 1:26605
// Structure: [Avatar + Name/Byline] → [Quote] → [Stars]
// Card: white bg, #e5e5e5 border, 12px radius, 33px padding, 16px gap

import { useState } from 'react'

// Figma star icon (imgSvg18) — used for ratings row
const STAR_ICON = 'https://www.figma.com/api/mcp/asset/5bf4a52b-a694-42f9-9707-b7f575615006'

interface TestimonialCardProps {
  name:     string
  role?:    string
  company?: string
  quote:    string
  rating?:  number
}

export default function TestimonialCard({
  name,
  role,
  company,
  quote,
  rating = 5,
}: TestimonialCardProps) {
  const [starErr, setStarErr] = useState(false)
  // Figma: "[job title], Emperor Financial Group"
  const byline = [role, company].filter(Boolean).join(', ')

  return (
    <div
      className="flex flex-col"
      style={{
        background:   '#ffffff',
        border:       '1px solid #e5e5e5',
        borderRadius: '12px',
        padding:      '33px',
        gap:          '16px',
      }}
    >
      {/* ── Row 1: Avatar + Name/Byline ──────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Avatar — 48px circle, gold gradient, white initial letter */}
        <div
          style={{
            width:           48,
            height:          48,
            borderRadius:    '9999px',
            flexShrink:      0,
            background:      'linear-gradient(135deg,#ffd369,#ffb347)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            color:           '#171717',
            fontWeight:      700,
            fontSize:        '16px',
            fontFamily:      'var(--font-work-sans,sans-serif)',
          }}
        >
          {name.charAt(0).toUpperCase()}
        </div>

        {/* Name + byline */}
        <div className="flex flex-col">
          {/* Figma: text-[#171717] text-[16px] font-normal leading-[24px] */}
          <p
            style={{
              color:      '#171717',
              fontSize:   '16px',
              fontWeight: 400,
              lineHeight: '24px',
              fontFamily: 'var(--font-work-sans, sans-serif)',
              margin:     0,
            }}
          >
            {name}
          </p>
          {byline && (
            /* Figma: text-[#525252] text-[14px] font-normal leading-[20px] */
            <p
              style={{
                color:      '#525252',
                fontSize:   '14px',
                fontWeight: 400,
                lineHeight: '20px',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                margin:     0,
              }}
            >
              {byline}
            </p>
          )}
        </div>
      </div>

      {/* ── Row 2: Quote — Figma: #525252, 16px, leading-[24px], pt-[8px] ── */}
      <p
        style={{
          color:      '#525252',
          fontSize:   '16px',
          fontWeight: 400,
          lineHeight: '24px',
          fontFamily: 'var(--font-work-sans, sans-serif)',
          flex:       1,
          paddingTop: '8px',
          margin:     0,
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* ── Row 3: Stars — Figma h-[16px] w-[18px] per star icon ─────────── */}
      <div className="flex items-center gap-1">
        {Array.from({ length: rating }).map((_, i) =>
          !starErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={STAR_ICON}
              alt=""
              width={18}
              height={16}
              style={{ objectFit: 'contain' }}
              onError={() => setStarErr(true)}
            />
          ) : (
            <span key={i} style={{ color: '#f59e0b', fontSize: '16px', lineHeight: 1 }}>★</span>
          )
        )}
      </div>
    </div>
  )
}
