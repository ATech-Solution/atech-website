'use client'

// Community Hero Section — Layout Builder variant (Advance)
// Used by: community-hero block type
// Dark section with a configurable back button (history.back or custom URL) + centred heading/description.

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export interface CommunityHeroData {
  communityHeroTitle?:     string
  communityHeroDesc?:      string
  communityHeroBackLabel?: string
  communityHeroBackUrl?:   string
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
      <path d="M15 7H1M6 1L1 7l5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BackButton({ label, url }: { label: string; url?: string }) {
  const router = useRouter()

  const style: React.CSSProperties = {
    display:        'inline-flex',
    alignItems:     'center',
    gap:            '8px',
    fontFamily:     'var(--font-work-sans, sans-serif)',
    fontSize:       '14px',
    fontWeight:     400,
    color:          'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    background:     'none',
    border:         'none',
    cursor:         'pointer',
    padding:        0,
    transition:     'color 0.15s',
  }

  if (url) {
    return (
      <Link href={url} style={style} className="hover:!text-white">
        <ArrowLeftIcon />
        {label}
      </Link>
    )
  }

  return (
    <button onClick={() => router.back()} style={style} className="hover:!text-white">
      <ArrowLeftIcon />
      {label}
    </button>
  )
}

export default function CommunityHeroSection({ data }: { data: CommunityHeroData }) {
  const title     = data.communityHeroTitle     || 'Get Involved in Our Community'
  const desc      = data.communityHeroDesc      || ''
  const backLabel = data.communityHeroBackLabel || 'Back'
  const backUrl   = data.communityHeroBackUrl

  return (
    <section
      style={{
        background: 'var(--section-bg, #171717)',
        padding:    '96px 80px 80px',
        position:   'relative',
      }}
    >
      {/* Back button — top left */}
      <div
        style={{
          position: 'absolute',
          top:      '40px',
          left:     '80px',
        }}
        className="max-sm:relative max-sm:top-auto max-sm:left-auto max-sm:mb-8"
      >
        <BackButton label={backLabel} url={backUrl} />
      </div>

      {/* Centred heading + description */}
      <div
        className="mx-auto"
        style={{
          maxWidth:       '768px',
          textAlign:      'center',
          display:        'flex',
          flexDirection:  'column',
          gap:            '24px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            color:      '#ffffff',
            lineHeight: '1.1',
            margin:     0,
          }}
        >
          {title}
        </h1>

        {desc && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '18px',
              fontWeight: 400,
              color:      'rgba(255,255,255,0.6)',
              lineHeight: '1.667',
              margin:     0,
            }}
          >
            {desc}
          </p>
        )}
      </div>
    </section>
  )
}
