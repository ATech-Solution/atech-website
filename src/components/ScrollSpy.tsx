'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface ScrollSpyProps {
  /** Header height in px — used as rootMargin top offset. Defaults to 96. */
  headerOffset?: number
}

/**
 * Auto-discovers every `.section-anchor[id]` element on the page and silently
 * updates the URL hash (history.replaceState) as the user scrolls through them.
 * No section list needed — just drop `<ScrollSpy />` in any page.
 */
export default function ScrollSpy({ headerOffset = 96 }: ScrollSpyProps) {
  const pathname = usePathname()

  useEffect(() => {
    const intersecting = new Set<string>()
    let observers: IntersectionObserver[] = []

    const discover = (): Element[] =>
      Array.from(document.querySelectorAll('.section-anchor[id]')).sort((a, b) => {
        return (
          a.getBoundingClientRect().top + window.scrollY -
          (b.getBoundingClientRect().top + window.scrollY)
        )
      })

    const pickActive = (elements: Element[]) => {
      for (const el of elements) {
        if (intersecting.has(el.id)) {
          const hash = `#${el.id}`
          if (window.location.hash !== hash) {
            history.replaceState(null, '', pathname + hash)
          }
          return
        }
      }
      if (window.location.hash) {
        history.replaceState(null, '', pathname)
      }
    }

    const elements = discover()
    if (elements.length === 0) return

    elements.forEach((el) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            intersecting.add(el.id)
          } else {
            intersecting.delete(el.id)
          }
          pickActive(elements)
        },
        { rootMargin: `-${headerOffset}px 0px -50% 0px`, threshold: 0 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [pathname, headerOffset])

  return null
}
