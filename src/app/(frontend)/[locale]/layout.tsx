import type { Metadata } from 'next'
import { Syne, DM_Sans, Work_Sans } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
import ChunkErrorRecovery from '@/components/ChunkErrorRecovery'
import AdminBar from '@/components/AdminBar'
import { ChatbotWidget } from '@/components/ChatbotWidget'
import { ScrollToTop } from '@/components/ScrollToTop'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import {
  getTheme,
  getSettings,
  getActivePlugins,
  getNavigation,
  getLanguageSettings,
} from '@/lib/payload'
import { buildThemeCssVars } from '@/lib/theme'
import '../../globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ATech',
    template: '%s | ATech',
  },
  description: 'ATech — built with Next.js and Payload CMS',
}

export async function generateStaticParams() {
  try {
    const s = await getLanguageSettings()
    const codes = ((s as any)?.activeLocales ?? [])
      .filter((l: any) => l.enabled)
      .map((l: any) => l.code as string)
    if (codes.length > 0) return codes.map((locale) => ({ locale }))
  } catch {}
  return [{ locale: 'en' }, { locale: 'zh-hk' }, { locale: 'zh-cn' }, { locale: 'id' }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const langSettings = await getLanguageSettings()
  const activeCodes: string[] = ((langSettings as any)?.activeLocales ?? [])
    .filter((l: any) => l.enabled)
    .map((l: any) => l.code as string)
  const validLocales = activeCodes.length > 0 ? activeCodes : ['en']
  const safeLocale = validLocales.includes(locale) ? locale : (validLocales[0] ?? 'en')

  const theme = await getTheme(safeLocale)
  const settings = await getSettings(safeLocale)
  const navigation = await getNavigation(safeLocale).catch(() => null)
  const plugins = await getActivePlugins()

  const themeVars = buildThemeCssVars(theme)
  const customCSS = (theme as any)?.customCSS ?? ''
  const faviconUrl = (theme as any)?.favicon?.url ?? '/images/favicon-.png'

  const scriptPlugins = plugins.filter(
    (p: any) =>
      ['frontend-script', 'third-party-embed'].includes(p.pluginType) &&
      typeof p.scriptCode === 'string' &&
      p.scriptCode.trim() !== '',
  )

  const isChatbotActive = plugins.some((p: any) => p.slug === 'chatbot')
  const isMultilangActive = plugins.some((p: any) => p.slug === 'multilanguage')

  const activeLocales: { code: string; label: string }[] = isMultilangActive
    ? ((langSettings as any)?.activeLocales ?? [])
        .filter((l: any) => l.enabled)
        .map((l: any) => ({ code: l.code, label: l.label }))
    : []

  const showSwitcher =
    isMultilangActive && (langSettings as any)?.showSwitcher && activeLocales.length > 1

  // ── hreflang tags ──────────────────────────────────────────────────────────
  const hreflangEnabled = isMultilangActive && (langSettings as any)?.hreflangEnabled
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atech.software'

  return (
    <html lang={safeLocale} className={`${syne.variable} ${dmSans.variable} ${workSans.variable}`}>
      <head>
        {/* Chunk load error recovery */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){
  function isChunk(msg,name){return name==='ChunkLoadError'||/ChunkLoadError|Loading chunk/.test(msg||'')}
  function recover(){if(sessionStorage.getItem('_cer'))return;sessionStorage.setItem('_cer','1');window.location.reload(true)}
  window.addEventListener('error',function(e){if(isChunk(e.message,e.error&&e.error.name))recover()});
  window.addEventListener('unhandledrejection',function(e){if(isChunk(e.reason&&e.reason.message,e.reason&&e.reason.name)){e.preventDefault();recover()}});
})()` }} />
        <link rel="icon" href={faviconUrl} sizes="any" />
        <link rel="apple-touch-icon" href={faviconUrl} />
        {themeVars && <style dangerouslySetInnerHTML={{ __html: themeVars }} />}
        {customCSS && <style dangerouslySetInnerHTML={{ __html: customCSS }} />}
        {hreflangEnabled && activeLocales.map((l) => (
          <link
            key={l.code}
            rel="alternate"
            hrefLang={l.code}
            href={`${siteUrl}/${l.code}/`}
          />
        ))}
        {hreflangEnabled && (
          <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/en/`} />
        )}
        {scriptPlugins.map((p: any) => (
          <script key={p.id} dangerouslySetInnerHTML={{ __html: p.scriptCode }} />
        ))}
      </head>
      <body suppressHydrationWarning>
        <ChunkErrorRecovery />
        <ThemeProvider initialVars={themeVars}>
          <Header
            theme={theme}
            languageSwitcher={showSwitcher ? (
              <LanguageSwitcher activeLocales={activeLocales} currentLocale={safeLocale} />
            ) : null}
          />
          <main className="main-content">{children}</main>
          <Footer theme={theme} settings={settings} navigation={navigation} />
          <AdminBar />
          <ScrollToTop />
          {isChatbotActive && <ChatbotWidget />}
        </ThemeProvider>
      </body>
    </html>
  )
}
