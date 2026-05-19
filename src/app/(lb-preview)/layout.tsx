import type { Metadata } from 'next'
import { Syne, DM_Sans, Work_Sans } from 'next/font/google'
import React from 'react'
import '../../../public/assets/css/globals.css'
import { getFaviconUrl } from '@/lib/payload'

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

export async function generateMetadata(): Promise<Metadata> {
  const icon = await getFaviconUrl()
  return { title: 'Layout Preview', icons: [{ rel: 'icon', url: icon }] }
}

export default function LBPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${workSans.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
