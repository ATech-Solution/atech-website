// Reusable testimonial card: avatar initials + name/role + quote + star rating.
// Used by: TestimonialsBlock

import { StarFilledIcon } from '@/components/icons/Icons'

interface TestimonialCardProps {
  name: string
  role?: string
  company?: string
  quote: string
  rating?: number
}

export default function TestimonialCard({
  name,
  role,
  company,
  quote,
  rating = 5,
}: TestimonialCardProps) {
  const byline = [role, company].filter(Boolean).join(', ')

  return (
    <div
      className="flex flex-col rounded-2xl p-8"
      style={{
        background: '#ffffff',
        border: '1px solid #e5e5e5',
      }}
    >
      {/* Avatar + name row */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
          style={{
            background: 'linear-gradient(135deg, #ffd369, #ffb347)',
            color: '#171717',
            fontFamily: 'var(--font-work-sans, sans-serif)',
          }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <p
            className="text-sm font-semibold leading-tight mb-0.5"
            style={{
              color: '#171717',
              fontFamily: 'var(--font-work-sans, sans-serif)',
            }}
          >
            {name}
          </p>
          {byline && (
            <p
              className="text-xs"
              style={{
                color: '#525252',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {byline}
            </p>
          )}
        </div>
      </div>

      {/* Quote */}
      <p
        className="text-sm leading-relaxed flex-1 mb-6"
        style={{
          color: '#525252',
          fontFamily: 'var(--font-work-sans, sans-serif)',
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* Stars */}
      <div className="flex gap-1" style={{ color: '#f59e0b' }}>
        {Array.from({ length: rating }).map((_, i) => (
          <StarFilledIcon key={i} size={16} />
        ))}
      </div>
    </div>
  )
}
