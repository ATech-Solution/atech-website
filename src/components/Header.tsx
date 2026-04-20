import Link from 'next/link'
import { getNavigation } from '@/lib/payload'
import MegaMenuNav, { type NavItem } from './MegaMenuNav'

// ─── Figma logo asset URLs (header — dark letterforms on white bg) ─────────
const LOGO_LEFT   = 'https://www.figma.com/api/mcp/asset/697468fe-b40b-4cac-b610-2a3566d015ed'
const LOGO_A      = 'https://www.figma.com/api/mcp/asset/940c073e-4589-4c98-967a-d2510b661041'
const LOGO_T      = 'https://www.figma.com/api/mcp/asset/ecadedb8-45e3-4efe-ab6b-9ed698366df3'
const LOGO_E      = 'https://www.figma.com/api/mcp/asset/4afb42e5-dd09-48d8-bf65-b961d6b728fc'
const LOGO_C      = 'https://www.figma.com/api/mcp/asset/00687f63-b3f1-4da4-b793-63331c229f8e'
const LOGO_H      = 'https://www.figma.com/api/mcp/asset/50a00709-1ac1-4282-9cae-9a04fea972f1'
const LOGO_RIGHT  = 'https://www.figma.com/api/mcp/asset/c4de28c4-7743-4839-bf8f-bdabf2419f29'

/** Reproduces the </>.Tech> logo from Figma exactly */
function AtechLogo() {
  return (
    <div style={{ position: 'relative', width: 127.264, height: 27.003, flexShrink: 0 }}>
      {/* Left < /> bracket */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_LEFT}
        alt=""
        style={{ position: 'absolute', left: 0, top: 0.3, width: 10.743, height: 26.705 }}
      />
      {/* Letter group: A t e c h */}
      <div
        style={{
          position: 'absolute',
          left: 16.16,
          top: 0,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1.413,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_A} alt="" style={{ width: 23.277, height: 24.978 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_T} alt="" style={{ width: 16.968, height: 24.68  }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_E} alt="" style={{ width: 18.626, height: 17.94  }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_C} alt="" style={{ width: 13.198, height: 17.688 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_H} alt="" style={{ width: 17.49,  height: 27.003 }} />
      </div>
      {/* Right > bracket */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_RIGHT}
        alt=""
        style={{ position: 'absolute', left: 116.79, top: 0.04, width: 10.479, height: 26.962 }}
      />
    </div>
  )
}

interface HeaderProps {
  theme?: any
}

export default async function Header({ theme }: HeaderProps = {}) {
  const nav = await getNavigation().catch(() => ({
    siteTitle: 'ATech',
    menuItems: [],
    logo: null,
    ctaLabel: 'Get a Quote',
    ctaUrl: '/contact',
  }))

  const defaultNav: NavItem[] = [
    { label: 'What We Do',  url: '/services' },
    { label: 'Who We Serve', url: '/about'   },
    { label: 'About Us',     url: '/company' },
    { label: 'Insights',     url: '/blog'    },
  ]

  const items: NavItem[] =
    (nav.menuItems as any[])?.length ? (nav.menuItems as NavItem[]) : defaultNav

  const ctaLabel = (theme as any)?.navCtaLabel ?? (nav as any).ctaLabel ?? 'Get a Quote'
  const ctaUrl   = (theme as any)?.navCtaUrl   ?? (nav as any).ctaUrl   ?? '/contact'

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
      }}
    >
      <div
        className="flex items-center justify-between px-6 md:px-[80px] mx-auto"
        style={{ maxWidth: '1280px', height: 80 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0" style={{ textDecoration: 'none' }}>
          <AtechLogo />
        </Link>

        {/* Nav + CTA — light theme */}
        <MegaMenuNav items={items} ctaLabel={ctaLabel} ctaUrl={ctaUrl} navTheme="light" />
      </div>
    </header>
  )
}
