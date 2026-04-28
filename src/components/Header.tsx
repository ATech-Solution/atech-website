import Link from 'next/link'
import { getNavigation } from '@/lib/payload'
import MegaMenuNav, { type NavItem } from './MegaMenuNav'

interface HeaderProps {
  theme?: any
}

export default async function Header({ theme }: HeaderProps = {}) {
  console.log("theme",theme)
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
  const siteName = (theme as any)?.siteName ?? ''
  const logo     = (theme as any)?.logo ?? ''

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
          <div style={{ position: 'relative', width: 127.264, height: 27.003, flexShrink: 0 }}>
            {/* Left < /> bracket */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo ? (
              <>
              <img
              src={logo.url}
              alt={logo.alt}
              style={{ position: 'absolute', left: 0, top: 0.3, width: 'auto', height: 'auto' }}
              />
              </>): (theme.siteName)
            }
          </div>
        </Link>

        {/* Nav + CTA — light theme */}
        <MegaMenuNav items={items} ctaLabel={ctaLabel} ctaUrl={ctaUrl} navTheme="light" />
      </div>
    </header>
  )
}
