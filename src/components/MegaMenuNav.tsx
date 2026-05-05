'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────────

interface MegaMenuLink {
  label: string
  url: string
  description?: string
  icon?: { url: string; alt?: string; width?: number; height?: number } | null
}

interface MegaMenuColumn {
  columnTitle?: string
  links?: MegaMenuLink[]
}

interface FeaturedCard {
  title?: string
  description?: string
  url?: string
  cta?: string
  image?: { url: string; alt?: string; width?: number; height?: number } | null
}

export interface NavItem {
  label: string
  url?: string
  openInNewTab?: boolean
  megaMenu?: boolean
  megaMenuStyle?: 'with-description' | 'category-grid' | 'no-icon'
  columns?: MegaMenuColumn[]
  featured?: FeaturedCard
}

interface MegaMenuNavProps {
  items: NavItem[]
  ctaLabel?: string
  ctaUrl?: string
  /** 'light' = white header (dark text), 'dark' = dark header (light text) */
  navTheme?: 'light' | 'dark'
}

// ── Constants ─────────────────────────────────────────────────────────────────

const fontWorkSans  = 'var(--font-work-sans, "Work Sans", sans-serif)'
const panelShadow   = '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)'

// ── Chevron icon ──────────────────────────────────────────────────────────────

function ChevronDown({ rotated, color }: { rotated: boolean; color: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{
        display: 'inline-block',
        transform: rotated ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
      }}
    >
      <path
        d="M2 3.5L5 6.5L8 3.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Mail icon ─────────────────────────────────────────────────────────────────

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#292929" strokeWidth="1.5" />
      <path d="M1 5l7 5 7-5" stroke="#292929" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ── Arrow right ───────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ display: 'inline', marginLeft: 4 }}>
      <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="#292929" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Grid Mega Panel ───────────────────────────────────────────────────────────

function GridMegaPanel({ item }: { item: NavItem }) {
  const links    = (item.columns ?? []).flatMap((col) => col.links ?? [])
  const ctaUrl   = item.featured?.url ?? '/contact'
  const ctaLabel = item.featured?.cta ?? 'Get in touch'

  return (
    <div
      role="region"
      aria-label={`${item.label} menu`}
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: 16,
        width: 652,
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: 16,
        boxShadow: panelShadow,
        padding: 25,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: 32,
          rowGap: 4,
          marginBottom: 20,
        }}
      >
        {links.map((link) => (
          <GridLinkItem key={link.url} link={link} />
        ))}
      </div>

      <div
        style={{
          background: '#f0f0f0',
          borderRadius: 14,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 20px',
        }}
      >
        <Link
          href={ctaUrl}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <div
            style={{
              width: 40, height: 40,
              background: '#f5f5f5',
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MailIcon />
          </div>
          <div>
            <div
              style={{
                fontFamily: fontWorkSans, fontWeight: 700, fontSize: 16,
                color: '#292929', lineHeight: 1.2,
                display: 'flex', alignItems: 'center',
              }}
            >
              {ctaLabel}<ArrowRight />
            </div>
            <div
              style={{
                fontFamily: fontWorkSans, fontWeight: 400, fontSize: 14,
                color: '#525252', lineHeight: 1.2, marginTop: 2,
              }}
            >
              {item.featured?.description ?? 'Let us assist you'}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

// ── Grid link item ────────────────────────────────────────────────────────────

function GridLinkItem({ link }: { link: MegaMenuLink }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={link.url}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 16,
        padding: 12, borderRadius: 12, textDecoration: 'none',
        background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: 40, height: 40,
          background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 16,
        }}
      >
        {link.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={link.icon.url} alt={link.icon.alt ?? ''} style={{ width: 20, height: 20, objectFit: 'contain' }} />
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="#525252" strokeWidth="1.5" />
          </svg>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span
          style={{
            fontFamily: fontWorkSans, fontWeight: 400, fontSize: 14,
            color: '#171717', lineHeight: '20px', display: 'block',
          }}
        >
          {link.label}
        </span>
        {link.description && (
          <span
            style={{
              fontFamily: fontWorkSans, fontWeight: 400, fontSize: 12,
              color: '#525252', lineHeight: '16px', display: 'block',
            }}
          >
            {link.description}
          </span>
        )}
      </div>
    </Link>
  )
}

// ── Category grid panel ───────────────────────────────────────────────────────

function CategoryGridMegaPanel({ item }: { item: NavItem }) {
  const columns  = item.columns ?? []
  const ctaUrl   = item.featured?.url ?? '/contact'
  const ctaLabel = item.featured?.cta ?? 'Get in touch'

  return (
    <div
      role="region"
      aria-label={`${item.label} menu`}
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: 16,
        width: 652,
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: 16,
        boxShadow: panelShadow,
        padding: 25,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, 1fr)`,
          gap: 32,
          marginBottom: 20,
        }}
      >
        {columns.map((col, i) => (
          <div key={i}>
            {col.columnTitle && (
              <div
                style={{
                  fontFamily: fontWorkSans,
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#171717',
                  marginBottom: 12,
                  paddingLeft: 12,
                }}
              >
                {col.columnTitle}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(col.links ?? []).map((link) => (
                <CategoryLinkItem key={link.url} link={link} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: '#f0f0f0',
          borderRadius: 14,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 20px',
        }}
      >
        <Link
          href={ctaUrl}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <div
            style={{
              width: 40, height: 40,
              background: '#f5f5f5',
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MailIcon />
          </div>
          <div>
            <div
              style={{
                fontFamily: fontWorkSans, fontWeight: 700, fontSize: 16,
                color: '#292929', lineHeight: 1.2,
                display: 'flex', alignItems: 'center',
              }}
            >
              {ctaLabel}<ArrowRight />
            </div>
            <div
              style={{
                fontFamily: fontWorkSans, fontWeight: 400, fontSize: 14,
                color: '#525252', lineHeight: 1.2, marginTop: 2,
              }}
            >
              {item.featured?.description ?? 'Let us assist you'}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

// ── Category link item ────────────────────────────────────────────────────────

function CategoryLinkItem({ link }: { link: MegaMenuLink }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={link.url}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
        background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: '#292929',
        }}
      >
        {link.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={link.icon.url} alt={link.icon.alt ?? ''} style={{ width: 20, height: 20, objectFit: 'contain' }} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="#525252" strokeWidth="1.5" />
          </svg>
        )}
      </div>
      <span
        style={{
          fontFamily: fontWorkSans, fontWeight: 400, fontSize: 14,
          color: '#171717', lineHeight: '20px',
        }}
      >
        {link.label}
      </span>
    </Link>
  )
}

// ── Simple list panel ─────────────────────────────────────────────────────────

function ListMegaPanel({ item }: { item: NavItem }) {
  const links = (item.columns ?? []).flatMap((col) => col.links ?? [])

  return (
    <div
      role="region"
      aria-label={`${item.label} menu`}
      style={{
        position: 'absolute',
        top: '100%', left: '50%',
        transform: 'translateX(-50%)',
        marginTop: 16, width: 240,
        background: '#ffffff', border: '1px solid #e5e5e5',
        borderRadius: 16, boxShadow: panelShadow,
        padding: 9, zIndex: 100,
      }}
    >
      {links.map((link) => (
        <ListLinkItem key={link.url} link={link} />
      ))}
    </div>
  )
}

// ── List link item ────────────────────────────────────────────────────────────

function ListLinkItem({ link }: { link: MegaMenuLink }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={link.url}
      style={{
        display: 'block', padding: '10px 16px', borderRadius: 8,
        textDecoration: 'none', fontFamily: fontWorkSans, fontWeight: 400,
        fontSize: 14, color: '#171717', lineHeight: '20px',
        background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {link.label}
    </Link>
  )
}

// ── Panel type helper ─────────────────────────────────────────────────────────

function resolveMegaPanel(item: NavItem) {
  if (item.megaMenuStyle === 'category-grid') return <CategoryGridMegaPanel item={item} />
  if (item.megaMenuStyle === 'no-icon') return <ListMegaPanel item={item} />
  const hasDescriptions = (item.columns ?? []).flatMap((col) => col.links ?? []).some((l) => l.description)
  if (item.megaMenuStyle === 'with-description' || hasDescriptions) return <GridMegaPanel item={item} />
  return <ListMegaPanel item={item} />
}

// ── Mobile Drawer ─────────────────────────────────────────────────────────────

function MobileDrawer({
  items,
  ctaLabel,
  ctaUrl,
  open,
  onClose,
}: MegaMenuNavProps & { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 z-50 h-full overflow-y-auto"
        style={{
          width: 300,
          background: '#ffffff',
          borderLeft: '1px solid #e5e5e5',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: '1px solid #e5e5e5' }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: '#171717', fontFamily: fontWorkSans }}>
            Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8, background: '#f5f5f5',
              border: 'none', cursor: 'pointer', color: '#525252', fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>

        <nav style={{ padding: 16 }}>
          {items.map((item) => (
            <div key={item.label} style={{ borderBottom: '1px solid #f0f0f0' }}>
              {item.megaMenu ? (
                <>
                  <button
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 0', fontFamily: fontWorkSans, fontSize: 14, fontWeight: 500,
                      color: '#171717', background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    {item.label}
                    <ChevronDown rotated={expanded === item.label} color="#6b7280" />
                  </button>
                  {expanded === item.label && (
                    <div style={{ paddingBottom: 12, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {(item.columns ?? []).flatMap((col) => col.links ?? []).map((link) => (
                        <Link
                          key={link.url}
                          href={link.url}
                          onClick={onClose}
                          style={{
                            display: 'block', padding: '6px 0',
                            fontSize: 13, color: '#525252',
                            fontFamily: fontWorkSans, textDecoration: 'none',
                          }}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.url ?? '#'}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  style={{
                    display: 'block', padding: '14px 0',
                    fontSize: 14, fontWeight: 500, color: '#171717',
                    fontFamily: fontWorkSans, textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <Link
            href={ctaUrl ?? '/contact'}
            onClick={onClose}
            style={{
              marginTop: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px 20px', borderRadius: 6,
              fontSize: 14, fontWeight: 400,
              background: '#171717', color: '#ffffff',
              fontFamily: fontWorkSans, textDecoration: 'none',
            }}
          >
            {ctaLabel ?? 'Get a Quote'}
          </Link>
        </nav>
      </div>
    </>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MegaMenuNav({ items, ctaLabel, ctaUrl, navTheme = 'dark' }: MegaMenuNavProps) {
  const [activeMenu, setActiveMenu]   = useState<string | null>(null)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const closeTimer                    = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Colors driven by navTheme
  const isLight       = navTheme === 'light'
  const navTextColor  = isLight ? '#404040' : 'var(--color-muted, #a3a3a3)'
  const navHoverColor = isLight ? '#171717' : 'var(--color-text, #fafafa)'
  const chevronColor  = isLight ? '#404040' : '#6b7280'

  const openMenu  = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(label)
  }, [])

  const closeMenu = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  return (
    <>
      {/* Desktop nav */}
      <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
        {items.map((item) => (
          <div
            key={item.label}
            style={{ position: 'relative' }}
            onMouseEnter={() => item.megaMenu && openMenu(item.label)}
            onMouseLeave={() => item.megaMenu && closeMenu()}
          >
            {item.megaMenu ? (
              <button
                onClick={() => {
                  if (!item.url) return
                  if (item.openInNewTab) {
                    window.open(item.url, '_blank', 'noopener,noreferrer')
                  } else {
                    window.location.href = item.url
                  }
                }}
                onFocus={() => openMenu(item.label)}
                aria-expanded={activeMenu === item.label}
                aria-haspopup="true"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 12px', borderRadius: 8,
                  fontSize: 14, fontWeight: 400,
                  fontFamily: fontWorkSans,
                  color: activeMenu === item.label ? navHoverColor : navTextColor,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  transition: 'color 0.15s',
                }}
              >
                {item.label}
                <ChevronDown rotated={activeMenu === item.label} color={chevronColor} />
              </button>
            ) : (
              <Link
                href={item.url ?? '#'}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 12px', borderRadius: 8,
                  fontSize: 14, fontWeight: 400,
                  fontFamily: fontWorkSans,
                  color: navTextColor, textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = navHoverColor }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = navTextColor  }}
              >
                {item.label}
                {/* <ChevronDown rotated={false} color={chevronColor} /> */}
              </Link>
            )}

            {/* Mega panel */}
            {item.megaMenu && activeMenu === item.label && (
              <div
                onMouseEnter={cancelClose}
                onMouseLeave={closeMenu}
                onKeyDown={(e) => e.key === 'Escape' && setActiveMenu(null)}
              >
                {resolveMegaPanel(item)}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Desktop CTA — black button matching Figma */}
      <Link
        href={ctaUrl ?? '/contact'}
        className="hidden md:inline-flex items-center"
        style={{
          padding: '8px 20px',
          borderRadius: 6,
          height: 32,
          fontSize: 14,
          fontWeight: 400,
          fontFamily: fontWorkSans,
          background: '#171717',
          color: '#ffffff',
          textDecoration: 'none',
          transition: 'opacity 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'    }}
      >
        {ctaLabel ?? 'Get a Quote'}
      </Link>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-lg"
        style={{
          background: isLight ? '#f5f5f5' : 'var(--color-surface, #2f2f2f)',
          border: 'none', cursor: 'pointer',
        }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        {[18, 18, 12].map((w, i) => (
          <span
            key={i}
            style={{
              display: 'block', width: w, height: 1.5, borderRadius: 2,
              background: isLight ? '#171717' : 'var(--color-text, #fafafa)',
              ...(i === 2 ? { alignSelf: 'flex-start', marginLeft: 3 } : {}),
            }}
          />
        ))}
      </button>

      {/* Mobile drawer */}
      <MobileDrawer
        items={items}
        ctaLabel={ctaLabel}
        ctaUrl={ctaUrl}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  )
}
