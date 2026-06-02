// src/plugins/performance/components/SuspenseSection.tsx
import { Suspense } from 'react'
import { SectionSkeleton } from './SectionSkeleton'
import { getPerformanceSettings } from '@/lib/payload'

interface SuspenseSectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

/**
 * Async Server Component that wraps children in a <Suspense> boundary
 * for streaming SSR. Reads streamingEnabled from PerformanceSettingsGlobal
 * at runtime — when disabled, renders children directly with zero overhead.
 */
export async function SuspenseSection({
  children,
  fallback,
  className,
}: SuspenseSectionProps) {
  const settings = await getPerformanceSettings()
  const enabled =
    settings?.pluginEnabled !== false && (settings as any)?.streamingEnabled !== false

  if (!enabled) return <>{children}</>

  const skeletonRows = (settings as any)?.skeletonRows ?? 3

  return (
    <div className={className}>
      <Suspense fallback={fallback ?? <SectionSkeleton rows={skeletonRows} />}>
        {children}
      </Suspense>
    </div>
  )
}
