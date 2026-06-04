'use client'

import { useEffect, useState } from 'react'

const cache: Record<string, { value: boolean; ts: number }> = {}
const TTL = 30_000

export function usePluginActive(slug: string): boolean | null {
  const [active, setActive] = useState<boolean | null>(null)

  useEffect(() => {
    const cached = cache[slug]
    if (cached && Date.now() - cached.ts < TTL) {
      setActive(cached.value)
      return
    }

    fetch(`/api/plugins?where[slug][equals]=${slug}&where[status][equals]=active&depth=0&limit=1`)
      .then((r) => r.json())
      .then((data) => {
        const value = (data?.docs?.length ?? 0) > 0
        cache[slug] = { value, ts: Date.now() }
        setActive(value)
      })
      .catch(() => setActive(false))
  }, [slug])

  return active
}
