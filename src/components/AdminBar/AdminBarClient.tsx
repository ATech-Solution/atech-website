'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface AdminBarClientProps {
  userId: string
  email: string
  displayName: string
}

export default function AdminBarClient({ userId, email, displayName }: AdminBarClientProps) {
  const [open, setOpen]           = useState(false)
  const [pageId, setPageId]       = useState<string | null>(null)
  const [showAccount, setShowAccount] = useState(false)
  const pathname = usePathname()

  // Resolve the current page's Payload document ID for the edit link
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean)
    const slug = segments[segments.length - 1]
    if (!slug) { setPageId(null); return }

    fetch(`/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=0&limit=1`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setPageId(data?.docs?.[0]?.id ? String(data.docs[0].id) : null))
      .catch(() => setPageId(null))
  }, [pathname])

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' })
    } finally {
      window.location.reload()
    }
  }, [])

  return (
    <>
      <style>{`
        .ab-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.45);
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.18s ease, background 0.18s ease;
          flex-shrink: 0;
          outline: none;
        }
        .ab-btn:hover, .ab-btn:focus-visible {
          color: #a5b4fc;
          background: rgba(99,102,241,0.14);
        }
        .ab-btn:active { transform: scale(0.93); }

        .ab-tab {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9997;
          background: rgba(6,6,14,0.88);
          border: 1px solid rgba(255,255,255,0.08);
          border-right: none;
          border-radius: 8px 0 0 8px;
          padding: 12px 7px;
          cursor: pointer;
          backdrop-filter: blur(16px) saturate(1.4);
          box-shadow: -3px 0 18px rgba(0,0,0,0.35), inset 1px 0 0 rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s, background 0.2s;
        }
        .ab-tab:hover { background: rgba(20,20,38,0.94); }

        .ab-panel {
          position: fixed;
          right: 0;
          top: 50%;
          z-index: 9998;
          background: rgba(6,6,14,0.92);
          backdrop-filter: blur(24px) saturate(1.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-right: none;
          border-radius: 14px 0 0 14px;
          box-shadow: -6px 0 40px rgba(0,0,0,0.45), inset 1px 0 0 rgba(255,255,255,0.06);
          padding: 14px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          width: 52px;
          transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.22s ease;
        }
        .ab-panel.open  { transform: translateY(-50%) translateX(0);    opacity: 1; pointer-events: all; }
        .ab-panel.closed{ transform: translateY(-50%) translateX(100%); opacity: 0; pointer-events: none; }

        .ab-divider {
          width: 22px;
          height: 1px;
          background: rgba(255,255,255,0.08);
          border-radius: 1px;
          margin: 4px 0;
          flex-shrink: 0;
        }

        .ab-account-popup {
          position: absolute;
          right: calc(100% + 12px);
          bottom: 0;
          background: rgba(6,6,14,0.97);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 14px 12px;
          min-width: 172px;
          backdrop-filter: blur(24px);
          box-shadow: -6px 6px 32px rgba(0,0,0,0.6);
          z-index: 10000;
          animation: abPopIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes abPopIn {
          from { opacity: 0; transform: scale(0.88) translateY(4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }

        .ab-logout-btn {
          width: 100%;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.28);
          border-radius: 7px;
          color: #fca5a5;
          font-size: 12px;
          font-weight: 500;
          padding: 7px 0;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.01em;
          transition: background 0.15s, border-color 0.15s;
        }
        .ab-logout-btn:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.45);
        }

        .ab-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 6px #6366f1;
          flex-shrink: 0;
        }
      `}</style>

      {/* Pull tab — visible when panel is closed */}
      {!open && (
        <button
          className="ab-tab"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(165,180,252,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8 2 3 6 8 10" />
          </svg>
        </button>
      )}

      {/* Slide-in panel */}
      <div className={`ab-panel ${open ? 'open' : 'closed'}`} role="complementary" aria-label="Admin panel">

        {/* Close / collapse */}
        <button
          className="ab-btn"
          onClick={() => { setOpen(false); setShowAccount(false) }}
          aria-label="Close admin menu"
          title="Collapse"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 2 9 6 4 10" />
          </svg>
        </button>

        <div className="ab-divider" />

        {/* Gear → Admin dashboard */}
        <a
          className="ab-btn"
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          title="Admin dashboard"
          aria-label="Open admin dashboard"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </a>

        {/* Edit → current page in Payload admin */}
        <a
          className="ab-btn"
          href={pageId ? `/admin/collections/pages/${pageId}` : '/admin/collections/pages'}
          target="_blank"
          rel="noopener noreferrer"
          title={pageId ? 'Edit this page' : 'Pages list'}
          aria-label={pageId ? 'Edit this page' : 'Pages list'}
          style={{ opacity: pageId ? 1 : 0.4 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </a>

        <div className="ab-divider" style={{ marginTop: 'auto' }} />

        {/* Account */}
        <div style={{ position: 'relative' }}>
          <button
            className="ab-btn"
            onClick={() => setShowAccount(v => !v)}
            title={displayName}
            aria-label="Account"
            aria-expanded={showAccount}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {showAccount && (
            <>
              {/* Click-away backdrop */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
                onClick={() => setShowAccount(false)}
              />
              <div className="ab-account-popup">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div className="ab-dot" />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'inherit', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Signed in
                  </span>
                </div>
                <p style={{ margin: '0 0 2px', fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: 'inherit', lineHeight: 1.3 }}>
                  {displayName}
                </p>
                <p style={{ margin: '0 0 12px', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {email}
                </p>
                <button className="ab-logout-btn" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
