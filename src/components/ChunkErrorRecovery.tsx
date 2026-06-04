'use client'
import { useEffect } from 'react'

export default function ChunkErrorRecovery() {
  useEffect(() => {
    const isChunk = (msg?: string, name?: string) =>
      name === 'ChunkLoadError' ||
      msg?.includes('ChunkLoadError') ||
      msg?.includes('Loading chunk')

    const handleError = (e: ErrorEvent) => {
      if (isChunk(e.message, (e.error as Error | null)?.name)) {
        window.location.reload()
      }
    }

    const handleRejection = (e: PromiseRejectionEvent) => {
      if (isChunk(e.reason?.message, e.reason?.name)) {
        e.preventDefault()
        window.location.reload()
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return null
}
