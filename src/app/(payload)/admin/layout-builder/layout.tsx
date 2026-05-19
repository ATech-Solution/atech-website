import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  icons: [{ rel: 'icon', url: '/images/favicon-.png' }],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
