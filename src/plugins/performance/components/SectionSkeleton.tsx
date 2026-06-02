// src/plugins/performance/components/SectionSkeleton.tsx

interface SectionSkeletonProps {
  rows?: number
  className?: string
}

export function SectionSkeleton({ rows = 3, className }: SectionSkeletonProps) {
  return (
    <div className={`w-full animate-pulse py-8 px-4 ${className ?? ''}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="mb-4 h-6 rounded-md bg-gray-200 dark:bg-gray-700"
          style={{ width: `${85 - i * 10}%` }}
        />
      ))}
    </div>
  )
}
