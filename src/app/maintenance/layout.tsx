import type { Metadata } from 'next'
import { getFaviconUrl } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const icon = await getFaviconUrl()
  return {
    title: 'Under Construction | ATech',
    description: 'We are currently upgrading our systems. Check back soon.',
    icons: [{ rel: 'icon', url: icon }],
  }
}

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
