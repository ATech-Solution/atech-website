'use client'

import { useState } from 'react'
import Link from 'next/link'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/users/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })

      // Payload returns 200 regardless of whether the email exists (prevents enumeration)
      if (res.ok || res.status === 200) {
        setStatus('sent')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.errors?.[0]?.message ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #09090f;
          --surface: #111118;
          --border: rgba(255,255,255,0.07);
          --border-solid: rgba(255,255,255,0.12);
          --accent: #034F98;
          --accent-hover: #023a70;
          --text: #f0f0f0;
          --muted: rgba(240,240,240,0.45);
          --input-bg: rgba(255,255,255,0.05);
          --input-border: rgba(255,255,255,0.12);
          --input-focus: #034F98;
        }
        html, body { min-height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .wrap {
          min-height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative; padding: 2rem; isolation: isolate;
        }
        .wrap::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(3,79,152,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 50% 70% at 80% 90%, rgba(3,79,152,0.06) 0%, transparent 55%);
          z-index: -2;
        }
        .wrap::after {
          content: ''; position: absolute; inset: 0;
          background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 80%);
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
        }
        .logo { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--text); margin-bottom: 28px; letter-spacing: -0.02em; }
        .logo span { color: var(--accent); }
        h1 { font-size: 1.35rem; font-weight: 600; color: var(--text); margin-bottom: 8px; }
        p.desc { font-size: 0.875rem; color: var(--muted); line-height: 1.6; margin-bottom: 28px; }
        label { display: block; font-size: 0.8rem; font-weight: 500; color: var(--muted); margin-bottom: 6px; letter-spacing: 0.04em; text-transform: uppercase; }
        input[type="email"] {
          width: 100%; padding: 12px 14px; border-radius: 8px;
          background: var(--input-bg); border: 1px solid var(--input-border);
          color: var(--text); font-size: 0.95rem; font-family: inherit;
          transition: border-color 0.15s; margin-bottom: 20px; outline: none;
        }
        input[type="email"]:focus { border-color: var(--input-focus); }
        .btn {
          width: 100%; padding: 12px; border-radius: 8px;
          background: var(--accent); color: #ffffff; border: none;
          font-size: 0.95rem; font-weight: 600; font-family: inherit; cursor: pointer;
          transition: background 0.15s; letter-spacing: 0.01em;
        }
        .btn:hover:not(:disabled) { background: var(--accent-hover); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error { font-size: 0.83rem; color: #f87171; margin-bottom: 14px; }
        .success-box {
          text-align: center; padding: 24px;
          background: rgba(3,79,152,0.08); border: 1px solid rgba(3,79,152,0.2);
          border-radius: 8px;
        }
        .success-box p { color: var(--text); font-size: 0.9rem; line-height: 1.6; }
        .footer { margin-top: 24px; text-align: center; font-size: 0.83rem; color: var(--muted); }
        .footer a { color: #3c97eb; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .corner { position: fixed; width: 60px; height: 60px; opacity: 0.2; }
        .corner.tl { top: 1.5rem; left: 1.5rem; border-top: 1px solid #034F98; border-left: 1px solid #034F98; }
        .corner.br { bottom: 1.5rem; right: 1.5rem; border-bottom: 1px solid #034F98; border-right: 1px solid #034F98; }
      `}</style>

      <div className="wrap">
        <div className="corner tl" />
        <div className="corner br" />

        <div className="card">
          <div className="logo">A<span>Tech</span></div>

          {status === 'sent' ? (
            <div className="success-box">
              <p>
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
                Check your inbox and follow the instructions.
              </p>
            </div>
          ) : (
            <>
              <h1>Forgot your password?</h1>
              <p className="desc">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                {status === 'error' && <p className="error">{errorMsg}</p>}
                <button type="submit" className="btn" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}

          <div className="footer">
            <Link href="/admin">← Back to login</Link>
          </div>
        </div>
      </div>
    </>
  )
}
