'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'invalid'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [status, setStatus]     = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (!token) setStatus('invalid')
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirm) {
      setErrorMsg('Passwords do not match.')
      setStatus('error')
      return
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/users/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('success')
        setTimeout(() => router.push('/admin'), 3000)
      } else {
        setErrorMsg(
          data?.errors?.[0]?.message ??
          data?.message ??
          'Invalid or expired reset link. Please request a new one.',
        )
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  const strengthColor = (i: number) =>
    password.length > (i + 1) * 3
      ? i < 1 ? '#f87171' : i < 2 ? '#fbbf24' : i < 3 ? '#34d399' : '#22c55e'
      : 'rgba(255,255,255,0.1)'

  return (
    <div className="rp-card">
      {/* Site logo — white version for dark background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-white.png"
        alt="ATech Software"
        className="rp-logo"
        width={120}
        height={26}
      />

      {status === 'invalid' && (
        <>
          <div className="rp-alert">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="10" cy="10" r="9" stroke="#f87171" strokeWidth="1.5" />
              <path d="M10 6v5M10 13.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p>This reset link is missing or invalid. Request a new one below.</p>
          </div>
          <div className="rp-foot">
            <Link href="/forgot-password">Request a new reset link →</Link>
          </div>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="rp-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 12 }}>
              <circle cx="12" cy="12" r="11" stroke="#4ade80" strokeWidth="1.5" />
              <path d="M7 12l3.5 3.5L17 9" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>Password updated successfully!</p>
            <p className="rp-sub">Redirecting you to login…</p>
          </div>
          <div className="rp-foot">
            <Link href="/admin">Go to login now →</Link>
          </div>
        </>
      )}

      {(status === 'idle' || status === 'submitting' || status === 'error') && (
        <>
          <h1 className="rp-title">Set a new password</h1>
          <p className="rp-desc">Choose a strong password for your ATech account.</p>

          <form onSubmit={handleSubmit}>
            <div className="rp-field">
              <label htmlFor="rp-password">New password</label>
              <div className="rp-input-wrap">
                <input
                  id="rp-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="rp-eye"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {password.length > 0 && (
              <div className="rp-strength">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="rp-seg" style={{ background: strengthColor(i) }} />
                ))}
              </div>
            )}

            <div className="rp-field">
              <label htmlFor="rp-confirm">Confirm password</label>
              <input
                id="rp-confirm"
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {status === 'error' && <p className="rp-error">{errorMsg}</p>}

            <button type="submit" className="rp-btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <div className="rp-foot">
            <Link href="/admin">← Back to login</Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <>
      <style>{`
        /* ── Section wrapper — sits inside the site layout (Header + Footer already rendered) ── */
        .rp-section {
          background: #292929;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          position: relative;
          isolation: isolate;
        }
        /* Subtle brand glow — mirrors the homepage atmosphere */
        .rp-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 10% 20%, rgba(3,79,152,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(3,79,152,0.10) 0%, transparent 50%);
          z-index: -1;
          pointer-events: none;
        }
        /* Faint grid texture */
        .rp-section::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 80%);
          z-index: -1;
          pointer-events: none;
        }

        /* ── Card ── */
        .rp-card {
          width: 100%;
          max-width: 460px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-top: 3px solid #034F98;
          border-radius: 14px;
          padding: 44px 44px 40px;
          animation: rp-rise 0.55s cubic-bezier(0.16,1,0.3,1) both;
          box-shadow: 0 12px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04);
        }
        @keyframes rp-rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo */
        .rp-logo {
          display: block;
          height: 28px;
          width: auto;
          margin-bottom: 36px;
          object-fit: contain;
        }

        /* Headings & text */
        .rp-title {
          font-family: var(--font-work-sans, 'Work Sans', sans-serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: #f0f0f0;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .rp-desc {
          font-family: var(--font-work-sans, 'Work Sans', sans-serif);
          font-size: 0.9rem;
          color: rgba(240,240,240,0.5);
          line-height: 1.6;
          margin: 0 0 28px;
        }

        /* Fields */
        .rp-field { margin-bottom: 16px; }
        .rp-field label {
          display: block;
          font-family: var(--font-work-sans, 'Work Sans', sans-serif);
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(240,240,240,0.5);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 7px;
        }
        .rp-field input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #f0f0f0;
          font-size: 0.95rem;
          font-family: var(--font-work-sans, 'Work Sans', sans-serif);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .rp-field input:focus {
          border-color: #034F98;
          box-shadow: 0 0 0 3px rgba(3,79,152,0.2);
        }
        .rp-field input::placeholder { color: rgba(240,240,240,0.25); }

        /* Eye toggle */
        .rp-input-wrap { position: relative; }
        .rp-input-wrap input { padding-right: 44px; }
        .rp-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(240,240,240,0.35);
          cursor: pointer; padding: 4px; transition: color 0.15s; line-height: 0;
        }
        .rp-eye:hover { color: rgba(240,240,240,0.8); }

        /* Strength bar */
        .rp-strength { display: flex; gap: 5px; margin: -8px 0 16px; }
        .rp-seg { flex: 1; height: 3px; border-radius: 3px; transition: background 0.25s; }

        /* Submit button */
        .rp-btn {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          background: #034F98;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: var(--font-work-sans, 'Work Sans', sans-serif);
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
        }
        .rp-btn:hover:not(:disabled) {
          background: #023a70;
          box-shadow: 0 4px 16px rgba(3,79,152,0.45);
        }
        .rp-btn:active:not(:disabled) { transform: translateY(1px); }
        .rp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Error message */
        .rp-error {
          font-family: var(--font-work-sans, 'Work Sans', sans-serif);
          font-size: 0.83rem;
          color: #f87171;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        /* Alert box (invalid token) */
        .rp-alert {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .rp-alert p {
          font-family: var(--font-work-sans, 'Work Sans', sans-serif);
          font-size: 0.875rem;
          color: rgba(240,240,240,0.85);
          line-height: 1.6;
          margin: 0;
        }

        /* Success box */
        .rp-success {
          text-align: center;
          padding: 32px 20px;
          background: rgba(3,79,152,0.08);
          border: 1px solid rgba(3,79,152,0.2);
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .rp-success p {
          font-family: var(--font-work-sans, 'Work Sans', sans-serif);
          font-size: 0.95rem;
          color: #f0f0f0;
          line-height: 1.6;
          margin: 0;
        }
        .rp-sub {
          color: rgba(240,240,240,0.45) !important;
          font-size: 0.82rem !important;
          margin-top: 6px !important;
        }

        /* Footer link row */
        .rp-foot {
          margin-top: 24px;
          text-align: center;
          font-family: var(--font-work-sans, 'Work Sans', sans-serif);
          font-size: 0.83rem;
          color: rgba(240,240,240,0.4);
        }
        .rp-foot a {
          color: #3c97eb;
          text-decoration: none;
          transition: color 0.15s;
        }
        .rp-foot a:hover { color: #60aef0; text-decoration: underline; }

        @media (max-width: 500px) {
          .rp-card { padding: 32px 24px 28px; }
          .rp-section { padding: 48px 16px; }
        }
      `}</style>

      <section className="rp-section">
        <Suspense
          fallback={
            <div className="rp-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-white.png" alt="ATech Software" className="rp-logo" width={120} height={26} />
              <p className="rp-desc">Loading…</p>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </section>
    </>
  )
}
