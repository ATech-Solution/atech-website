'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const HEADER_HEIGHT = 88 // 80px header + 8px breathing room

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT
  window.scrollTo({ top, behavior: 'smooth' })
}

/**
 * Intercepts clicks on any <a> whose href is hash-only (e.g. #footer) and
 * smooth-scrolls to the target element instead of letting the browser jump.
 * Also handles the initial page load when the URL already contains a hash.
 */
export default function HashScrollHandler() {
  const pathname = usePathname()

  // Smooth scroll on initial load / route change when hash is present
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = hash.slice(1)
    // Small delay lets the page paint before we scroll
    const timer = setTimeout(() => scrollToId(id), 80)
    return () => clearTimeout(timer)
  }, [pathname])

  // Intercept click events globally via delegation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href') ?? ''

      // Hash-only link: "#footer"
      if (href.startsWith('#')) {
        e.preventDefault()
        const id = href.slice(1)
        if (!id) return
        history.pushState(null, '', `${pathname}#${id}`)
        scrollToId(id)
        return
      }

      // Same-page link that ends with a hash: "/static/about-us#company"
      // Only intercept when the pathname segment matches current page
      try {
        const parsed = new URL(href, window.location.href)
        if (parsed.pathname === window.location.pathname && parsed.hash) {
          e.preventDefault()
          const id = parsed.hash.slice(1)
          history.pushState(null, '', `${pathname}${parsed.hash}`)
          scrollToId(id)
        }
      } catch {
        // ignore malformed hrefs
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  return null
}
