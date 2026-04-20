import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Under Construction | ATech',
  description: 'We are currently upgrading our systems. Check back soon.',
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
