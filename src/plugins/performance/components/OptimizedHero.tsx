// src/plugins/performance/components/OptimizedHero.tsx
import Image, { type ImageProps } from 'next/image'

/**
 * Drop-in replacement for <Image> on above-the-fold hero images.
 * Always sets priority (emits <link rel="preload">) and sizes="100vw"
 * for full-width hero images to improve LCP score.
 */
export function OptimizedHero(props: ImageProps) {
  return (
    <Image
      sizes={props.sizes ?? '100vw'}
      {...props}
      priority
    />
  )
}
