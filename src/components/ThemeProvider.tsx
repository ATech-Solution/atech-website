'use client'

import { useEffect, useRef } from 'react'

interface ThemeProviderProps {
  /** CSS :root { ... } block rendered server-side — applied immediately on mount */
  initialVars: string
  children: React.ReactNode
}

function applyVarBlock(cssBlock: string) {
  if (!cssBlock || typeof document === 'undefined') return
  // Parse :root { ... } and apply each var to documentElement
  const match = cssBlock.match(/:root\s*\{([^}]+)\}/)
  if (!match) return
  match[1].split(';').forEach((decl) => {
    const [prop, val] = decl.split(':').map((s) => s.trim())
    if (prop?.startsWith('--') && val) {
      document.documentElement.style.setProperty(prop, val)
    }
  })
}

async function fetchAndApplyTheme() {
  try {
    const res = await fetch('/api/theme', { cache: 'no-store' })
    if (!res.ok) return
    const { vars } = (await res.json()) as { vars: Record<string, string> }
    Object.entries(vars).forEach(([prop, val]) => {
      document.documentElement.style.setProperty(prop, val)
    })
  } catch {
    // silent — server-side vars still applied
  }
}

export default function ThemeProvider({ initialVars, children }: ThemeProviderProps) {
  const applied = useRef(false)

  useEffect(() => {
    if (!applied.current) {
      applyVarBlock(initialVars)
      applied.current = true
    }

    // Re-fetch on tab focus to pick up admin changes without a hard reload
    const handleFocus = () => fetchAndApplyTheme()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [initialVars])

  return <>{children}</>
}
