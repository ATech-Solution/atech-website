import type { Metadata } from 'next'
import { Syne, DM_Sans, Work_Sans } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
import ChunkErrorRecovery from '@/components/ChunkErrorRecovery'
import AdminBar from '@/components/AdminBar'
import { getTheme, getSettings, getActivePlugins, getNavigation } from '@/lib/payload'
import { buildThemeCssVars } from '@/lib/theme'
import '../../../public/assets/css/globals.css'

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getTheme()
  const settings = await getSettings()
  const navigation = await getNavigation().catch(() => null)
  const plugins = await getActivePlugins()
  const themeVars = buildThemeCssVars(theme)
  const customCSS  = (theme as any)?.customCSS ?? ''
  const faviconUrl = (theme as any)?.favicon?.url ?? '/images/favicon-.png'
  const scriptPlugins = plugins.filter(
    (p: any) =>
      ['frontend-script', 'third-party-embed'].includes(p.pluginType) &&
      typeof p.scriptCode === 'string' &&
      p.scriptCode.trim() !== '',
  )

  
  // console.log('theme',theme)
  // console.log('settings',settings)

  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${workSans.variable}`}>
      <head>
        {/* Runs synchronously before any chunk loads. On ChunkLoadError, force-reloads once
            (bypassing cache) so the browser fetches fresh HTML with current chunk hashes. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){
  function isChunk(msg,name){return name==='ChunkLoadError'||/ChunkLoadError|Loading chunk/.test(msg||'')}
  function recover(){if(sessionStorage.getItem('_cer'))return;sessionStorage.setItem('_cer','1');window.location.reload(true)}
  window.addEventListener('error',function(e){if(isChunk(e.message,e.error&&e.error.name))recover()});
  window.addEventListener('unhandledrejection',function(e){if(isChunk(e.reason&&e.reason.message,e.reason&&e.reason.name)){e.preventDefault();recover()}});
})()` }} />
        <link rel="icon" href={faviconUrl} sizes="any" />
        <link rel="apple-touch-icon" href={faviconUrl} />
        {themeVars && <style dangerouslySetInnerHTML={{ __html: themeVars }} />}
        {customCSS  && <style dangerouslySetInnerHTML={{ __html: customCSS  }} />}
        {scriptPlugins.map((p: any) => (
          <script key={p.id} dangerouslySetInnerHTML={{ __html: p.scriptCode }} />
        ))}
      </head>
      <body>
        <ChunkErrorRecovery />
        <ThemeProvider initialVars={themeVars}>
          <Header theme={theme} />
          <main className="main-content">{children}</main>
          <Footer theme={theme} settings={settings} navigation={navigation} />
          <AdminBar />
        </ThemeProvider>
      </body>
    </html>
  )
}
