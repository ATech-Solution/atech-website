'use client'

import React from 'react'
import { useConfig } from '@payloadcms/ui'

export function AdminLogo() {
  const { config } = useConfig()
  const serverURL = config?.serverURL ?? ''

  const [logoUrl, setLogoUrl] = React.useState<string | null>(null)
  const [siteName, setSiteName] = React.useState<string>('ATech')

  React.useEffect(() => {
    fetch(`${serverURL}/api/globals/theme?depth=1`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.logo?.url) setLogoUrl(data.logo.url)
        if (data?.siteName) setSiteName(data.siteName)
      })
      .catch(() => {})
  }, [serverURL])

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={siteName}
        style={{ maxHeight: 40, width: 'auto', objectFit: 'contain' }}
      />
    )
  }

  return (
    <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
      {siteName}
    </span>
  )
}
