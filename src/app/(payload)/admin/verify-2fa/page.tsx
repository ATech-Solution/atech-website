'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Verify2FAPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/security/2fa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: code.trim() }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error ?? 'Invalid code. Please try again.')
        setCode('')
        inputRef.current?.focus()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0d0d0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'var(--font-sans, system-ui)',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Shield icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', border: '1.5px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: '#fff' }}>
          Two-Factor Authentication
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 32 }}>
          Enter the 6-digit code from your authenticator app, or a backup code.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\s/g, ''))}
              maxLength={20}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${error ? '#dc2626' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 10,
                color: '#fff',
                fontSize: 20,
                fontFamily: 'monospace',
                letterSpacing: '0.25em',
                textAlign: 'center',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, fontSize: 13, color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length < 6}
            style={{
              width: '100%',
              padding: '13px 16px',
              background: loading || code.length < 6 ? 'rgba(59,130,246,0.3)' : '#3b82f6',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading || code.length < 6 ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Verifying…' : 'Verify Code'}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
          Lost access to your authenticator?{' '}
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Use one of your backup codes above.</span>
        </p>
      </div>
    </div>
  )
}
