import type { Metadata } from 'next'
import { Syne, DM_Sans, Work_Sans } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
import { getTheme } from '@/lib/payload'
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
  const themeVars = buildThemeCssVars(theme)
  const customCSS  = (theme as any)?.customCSS ?? ''

  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${workSans.variable}`}>
      <head>
        {themeVars && <style dangerouslySetInnerHTML={{ __html: themeVars }} />}
        {customCSS  && <style dangerouslySetInnerHTML={{ __html: customCSS  }} />}
      </head>
      <body>
        <ThemeProvider initialVars={themeVars}>
          <Header theme={theme} />
          <main className="main-content">{children}</main>
          <Footer theme={theme} />
        </ThemeProvider>
      </body>
    </html>
  )
}
