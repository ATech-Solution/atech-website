'use client'

// Subscribe Section — Layout Builder variant (Advance)
// Used by: subscribe block type
// White outer wrapper, dark #171717 inner panel, centered newsletter sign-up form

import { useState } from 'react'

export interface SubscribeSectionData {
  subBadgeLabel?:      string
  subBadgeIcon?:       { url: string } | null
  subHeading?:         string
  subSubheading?:      string
  subInputPlaceholder?: string
  subButtonLabel?:     string
  subNote?:            string
  subSuccessMessage?:  string
  subApiEndpoint?:     string
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" rx="1" stroke="#171717" strokeWidth="1.2" />
      <path d="M1 5l7 5 7-5" stroke="#171717" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export default function SubscribeSection({ data }: { data: SubscribeSectionData }) {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const badgeLabel      = data.subBadgeLabel      || 'Newsletter'
  const heading         = data.subHeading         || 'Stay Updated with Tech Insights'
  const subheading      = data.subSubheading      || 'Subscribe to our newsletter and get the latest articles, industry trends, and expert insights delivered directly to your inbox every week.'
  const placeholder     = data.subInputPlaceholder || 'Enter your email address'
  const buttonLabel     = data.subButtonLabel     || 'Subscribe Now'
  const note            = data.subNote            || 'Join 15,000+ subscribers. Unsubscribe anytime.'
  const successMessage  = data.subSuccessMessage  || 'Thank you for subscribing!'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setMessage('')

    try {
      if (data.subApiEndpoint) {
        const res = await fetch(data.subApiEndpoint, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email }),
        })
        if (!res.ok) throw new Error('Subscription failed')
      }
      setStatus('success')
      setMessage(successMessage)
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section
      style={{ background: '#ffffff' }}
      className="px-6 md:px-[112px] py-20"
    >
      {/* Dark inner panel */}
      <div
        style={{ background: '#171717' }}
        className="px-6 md:px-[112px] lg:px-[224px] py-16"
      >
        {/* Content — centered, max 768px */}
        <div
          className="mx-auto flex flex-col items-center gap-4"
          style={{ maxWidth: '768px' }}
        >
          {/* Badge */}
          <div
            style={{
              background:    '#ffffff',
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '8px',
              padding:       '8px 16px',
            }}
          >
            {data.subBadgeIcon?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.subBadgeIcon.url} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            ) : (
              <MailIcon />
            )}
            <span
              style={{
                fontFamily:    'var(--font-work-sans, sans-serif)',
                fontSize:      '14px',
                fontWeight:    400,
                color:         '#171717',
                letterSpacing: '0.7px',
                textTransform: 'uppercase',
                lineHeight:    '20px',
              }}
            >
              {badgeLabel}
            </span>
          </div>

          {/* Heading */}
          <h2
            className="text-center pt-2"
            style={{
              fontFamily:  'var(--font-work-sans, sans-serif)',
              fontSize:    'clamp(2rem, 4vw, 3rem)',
              fontWeight:  400,
              color:       '#ffffff',
              lineHeight:  '1',
              margin:      0,
            }}
          >
            {heading}
          </h2>

          {/* Subheading */}
          <p
            className="text-center pt-2"
            style={{
              fontFamily:  'var(--font-work-sans, sans-serif)',
              fontSize:    '18px',
              fontWeight:  400,
              color:       '#d4d4d4',
              lineHeight:  '28px',
              margin:      0,
              maxWidth:    '710px',
            }}
          >
            {subheading}
          </p>

          {/* Form row */}
          {status === 'success' ? (
            <p
              className="pt-4 text-center"
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '16px',
                color:      '#ffffff',
                lineHeight: '24px',
              }}
            >
              {message}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full"
              style={{ maxWidth: '576px' }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                style={{
                  flex:        '1 0 0',
                  background:  '#ffffff',
                  border:      'none',
                  padding:     '18px 24px',
                  fontFamily:  'var(--font-work-sans, sans-serif)',
                  fontSize:    '16px',
                  color:       '#171717',
                  outline:     'none',
                  minWidth:    0,
                }}
                className="placeholder:text-[#737373]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  background:  '#ffffff',
                  border:      'none',
                  padding:     '16px 32px',
                  fontFamily:  'var(--font-work-sans, sans-serif)',
                  fontSize:    '16px',
                  fontWeight:  400,
                  color:       '#171717',
                  cursor:      status === 'loading' ? 'wait' : 'pointer',
                  whiteSpace:  'nowrap',
                  flexShrink:  0,
                  transition:  'opacity 0.2s',
                }}
                className="hover:opacity-80"
              >
                {status === 'loading' ? 'Subscribing…' : buttonLabel}
              </button>
            </form>
          )}

          {/* Error message */}
          {status === 'error' && (
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', color: '#f87171', margin: 0 }}>
              {message}
            </p>
          )}

          {/* Note */}
          {note && (
            <p
              className="text-center"
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '14px',
                fontWeight: 400,
                color:      '#a3a3a3',
                lineHeight: '20px',
                margin:     0,
              }}
            >
              {note}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
