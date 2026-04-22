'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'invalid'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [status, setStatus]       = useState<Status>('idle')
  const [errorMsg, setErrorMsg]   = useState('')
  const [showPass, setShowPass]   = useState(false)

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
        // Redirect to admin after 3 s
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

  return (
    <div className="card">
      <div className="logo">A<span>Tech</span></div>

      {status === 'invalid' && (
        <>
          <div className="alert-box">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="10" cy="10" r="9" stroke="#f87171" strokeWidth="1.5" />
              <path d="M10 6v5M10 13.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p>This reset link is missing or invalid. Request a new one below.</p>
          </div>
          <div className="footer">
            <Link href="/forgot-password">Request a new reset link</Link>
          </div>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="success-box">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginBottom: 8 }}>
              <circle cx="10" cy="10" r="9" stroke="#4ade80" strokeWidth="1.5" />
              <path d="M6 10l3 3 5-5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>Password updated successfully!</p>
            <p className="sub">Redirecting you to login…</p>
          </div>
          <div className="footer">
            <Link href="/admin">Go to login now →</Link>
          </div>
        </>
      )}

      {(status === 'idle' || status === 'submitting' || status === 'error') && (
        <>
          <h1>Set a new password</h1>
          <p className="desc">Choose a strong password for your ATech account.</p>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="password">New password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)} aria-label="Toggle password visibility">
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="confirm">Confirm password</label>
              <input
                id="confirm"
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {/* Password strength hint */}
            {password.length > 0 && (
              <div className="strength-row">
                {['Weak', 'Fair', 'Good', 'Strong'].map((label, i) => (
                  <div
                    key={label}
                    className="strength-seg"
                    style={{
                      background: password.length > (i + 1) * 3
                        ? i < 1 ? '#f87171' : i < 2 ? '#fbbf24' : i < 3 ? '#34d399' : '#22c55e'
                        : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
              </div>
            )}

            {status === 'error' && <p className="error">{errorMsg}</p>}

            <button type="submit" className="btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <div className="footer">
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0d1117;
          --surface: #161b22;
          --border: rgba(255,255,255,0.06);
          --border-solid: rgba(255,255,255,0.1);
          --accent: #034F98;
          --accent-hover: #023a70;
          --accent-light: #3c97eb;
          --text: #e6edf3;
          --muted: rgba(230,237,243,0.45);
          --input-bg: rgba(255,255,255,0.04);
          --input-border: rgba(255,255,255,0.1);
          --input-focus: #3c97eb;
        }
        html, body { min-height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .wrap {
          min-height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative; padding: 2rem; isolation: isolate;
        }
        .wrap::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 15% 15%, rgba(3,79,152,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 85% 85%, rgba(60,151,235,0.06) 0%, transparent 55%);
          z-index: -2;
        }
        .wrap::after {
          content: ''; position: absolute; inset: 0;
          background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%);
          z-index: -1;
        }
        .card {
          width: 100%; max-width: 440px;
          background: var(--surface);
          border: 1px solid var(--border-solid);
          border-top: 3px solid var(--accent);
          border-radius: 12px;
          padding: 40px 40px 36px;
          animation: slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
        }
        .logo { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--text); margin-bottom: 28px; letter-spacing: -0.02em; }
        .logo span { color: var(--accent-light); }
        h1 { font-size: 1.35rem; font-weight: 600; color: var(--text); margin-bottom: 8px; letter-spacing: -0.01em; }
        p.desc { font-size: 0.875rem; color: var(--muted); line-height: 1.6; margin-bottom: 28px; }
        .field-group { margin-bottom: 16px; }
        label { display: block; font-size: 0.78rem; font-weight: 500; color: var(--muted); margin-bottom: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
        input[type="text"], input[type="password"] {
          width: 100%; padding: 11px 14px; border-radius: 7px;
          background: var(--input-bg); border: 1px solid var(--input-border);
          color: var(--text); font-size: 0.95rem; font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s; outline: none;
        }
        input[type="text"]:focus, input[type="password"]:focus {
          border-color: var(--input-focus);
          box-shadow: 0 0 0 3px rgba(60,151,235,0.15);
        }
        .input-wrap { position: relative; }
        .input-wrap input { padding-right: 42px; }
        .eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--muted); cursor: pointer; padding: 2px;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: var(--text); }
        .strength-row { display: flex; gap: 4px; margin-bottom: 16px; }
        .strength-seg { flex: 1; height: 3px; border-radius: 2px; transition: background 0.2s; }
        .btn {
          width: 100%; padding: 12px; border-radius: 8px; margin-top: 8px;
          background: var(--accent); color: #ffffff; border: none;
          font-size: 0.95rem; font-weight: 600; font-family: inherit; cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s; letter-spacing: 0.01em;
        }
        .btn:hover:not(:disabled) { background: var(--accent-hover); box-shadow: 0 4px 12px rgba(3,79,152,0.4); }
        .btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .error { font-size: 0.83rem; color: #f87171; margin-bottom: 12px; line-height: 1.5; }
        .alert-box {
          display: flex; align-items: flex-start; gap: 12px;
          background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2);
          border-radius: 8px; padding: 16px; margin-bottom: 20px;
        }
        .alert-box p { color: var(--text); font-size: 0.875rem; line-height: 1.6; }
        .success-box {
          text-align: center; padding: 28px 20px;
          background: rgba(3,79,152,0.08); border: 1px solid rgba(3,79,152,0.2);
          border-radius: 8px; margin-bottom: 20px;
        }
        .success-box p { color: var(--text); font-size: 0.9rem; line-height: 1.6; }
        .success-box p.sub { color: var(--muted); font-size: 0.8rem; margin-top: 4px; }
        .footer { margin-top: 24px; text-align: center; font-size: 0.83rem; color: var(--muted); }
        .footer a { color: var(--accent-light); text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
        .corner { position: fixed; width: 60px; height: 60px; opacity: 0.15; }
        .corner.tl { top: 1.5rem; left: 1.5rem; border-top: 1px solid var(--accent); border-left: 1px solid var(--accent); }
        .corner.br { bottom: 1.5rem; right: 1.5rem; border-bottom: 1px solid var(--accent); border-right: 1px solid var(--accent); }
        @keyframes slide-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="wrap">
        <div className="corner tl" />
        <div className="corner br" />
        <Suspense fallback={<div className="card"><div className="logo">A<span>Tech</span></div><p className="desc">Loading…</p></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </>
  )
}
