'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArticleSubmitData {
  articleSubmitHeading?: string
  articleSubmitSubheading?: string
  articleSubmitCtaLabel?: string
  articleSubmitSuccessMessage?: string
}

// ─── reCAPTCHA global types ───────────────────────────────────────────────────

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: string | HTMLElement, params: Record<string, string>) => number
      getResponse: (widgetId?: number) => string
      reset: (widgetId?: number) => void
      ready: (cb: () => void) => void
    }
  }
}

// ─── Field styles ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  border: '1px solid #e5e5e5',
  borderRadius: '0',
  fontFamily: 'var(--font-work-sans, sans-serif)',
  fontSize: '15px',
  color: '#171717',
  background: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
  lineHeight: '1.5',
  transition: 'border-color 0.15s ease',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-work-sans, sans-serif)',
  fontSize: '14px',
  fontWeight: 500,
  color: '#171717',
  marginBottom: '8px',
}

// ─── ArticleSubmitSection ─────────────────────────────────────────────────────

export default function ArticleSubmitSection({ data }: { data: ArticleSubmitData }) {
  const {
    articleSubmitHeading = 'Submit an Article',
    articleSubmitSubheading = 'Share your knowledge with our community.',
    articleSubmitCtaLabel = 'Submit Article',
    articleSubmitSuccessMessage = 'Thank you! Your article has been submitted for review.',
  } = data

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
  const captchaContainerId = useId().replace(/:/g, '')
  const captchaContainerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  const [form, setForm] = useState({ title: '', authorName: '', email: '', content: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Load reCAPTCHA script
  useEffect(() => {
    if (!siteKey) return
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      renderCaptcha()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = renderCaptcha
    document.head.appendChild(script)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  function renderCaptcha() {
    if (!siteKey || !captchaContainerRef.current) return
    window.grecaptcha?.ready(() => {
      if (widgetIdRef.current !== null) return
      widgetIdRef.current = window.grecaptcha!.render(captchaContainerRef.current!, {
        sitekey: siteKey,
      })
    })
  }

  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const recaptchaToken = siteKey ? (window.grecaptcha?.getResponse(widgetIdRef.current ?? undefined) ?? '') : 'dev-bypass'

    if (siteKey && !recaptchaToken) {
      setErrorMsg('Please complete the reCAPTCHA.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/submit-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed.')
      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Something went wrong. Please try again.')
      setStatus('error')
      window.grecaptcha?.reset(widgetIdRef.current ?? undefined)
    }
  }

  const fieldFocus = (name: string) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
  })

  const getInputStyle = (name: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === name ? '#171717' : '#e5e5e5',
  })

  // ── Success state ──────────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <section style={{ background: 'var(--section-bg, #ffffff)', padding: '96px clamp(24px, 7vw, 104px)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 400,
            color: '#171717',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            {articleSubmitSuccessMessage}
          </h2>
          <button
            onClick={() => {
              setStatus('idle')
              setForm({ title: '', authorName: '', email: '', content: '' })
              widgetIdRef.current = null
            }}
            style={{
              marginTop: '8px',
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '14px',
              color: '#525252',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Submit another article
          </button>
        </div>
      </section>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  return (
    <section style={{ background: 'var(--section-bg, #ffffff)', padding: '96px clamp(24px, 7vw, 104px)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            color: '#171717',
            lineHeight: 1,
            margin: '0 0 16px',
          }}>
            {articleSubmitHeading}
          </h2>
          {articleSubmitSubheading && (
            <p style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '17px',
              color: '#525252',
              lineHeight: '27px',
              margin: 0,
            }}>
              {articleSubmitSubheading}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>
              Article Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="e.g. How We Scaled Our Infrastructure to 10M Users"
              style={getInputStyle('title')}
              {...fieldFocus('title')}
            />
          </div>

          {/* Author + Email row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>
                Your Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={form.authorName}
                onChange={(e) => setField('authorName', e.target.value)}
                placeholder="Full name"
                style={getInputStyle('authorName')}
                {...fieldFocus('authorName')}
              />
            </div>
            <div>
              <label style={labelStyle}>
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="you@example.com"
                style={getInputStyle('email')}
                {...fieldFocus('email')}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label style={labelStyle}>
              Article Content <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              required
              rows={10}
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
              placeholder="Write your article here…"
              style={{
                ...getInputStyle('content'),
                resize: 'vertical',
                minHeight: '200px',
              }}
              {...fieldFocus('content')}
            />
          </div>

          {/* reCAPTCHA */}
          {siteKey && (
            <div>
              <div
                id={`recaptcha-${captchaContainerId}`}
                ref={captchaContainerRef}
              />
            </div>
          )}

          {/* Error message */}
          {status === 'error' && errorMsg && (
            <p style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '14px',
              color: '#ef4444',
              margin: 0,
              padding: '12px 16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
            }}>
              {errorMsg}
            </p>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 40px',
                background: status === 'submitting' ? '#525252' : '#171717',
                color: '#ffffff',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '15px',
                fontWeight: 400,
                border: 'none',
                cursor: status === 'submitting' ? 'wait' : 'pointer',
                transition: 'background 0.15s ease',
                letterSpacing: '0.2px',
              }}
            >
              {status === 'submitting' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Submitting…
                </>
              ) : articleSubmitCtaLabel}
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
