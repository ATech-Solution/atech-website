'use client'
import { useEffect } from 'react'

export default function ChunkErrorRecovery() {
  useEffect(() => {
    const handle = (event: ErrorEvent) => {
      const isChunkError =
        event.message?.includes('ChunkLoadError') ||
        event.message?.includes('Loading chunk') ||
        (event.error as Error | null)?.name === 'ChunkLoadError'

      if (isChunkError) {
        window.location.reload()
      }
    }

    window.addEventListener('error', handle)
    return () => window.removeEventListener('error', handle)
  }, [])

  return null
}
