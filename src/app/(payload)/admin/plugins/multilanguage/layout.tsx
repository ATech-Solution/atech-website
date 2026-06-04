import type { Metadata } from 'next'
import React from 'react'
import { getFaviconUrl } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const icon = await getFaviconUrl()
  return { title: 'Translation Manager', icons: [{ rel: 'icon', url: icon }] }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
