// Testimonials Section — Layout Builder variant (Advance)
// Used by: home-testimonials block type

interface TestimonialItem {
  clientName?:    string
  clientRole?:    string
  clientCompany?: string
  quote?:         string
  rating?:        number
  avatar?:        { url: string; alt?: string }
}

interface TestimonialsSectionData {
  heading?:          string
  subheading?:       string
  testimonialItems?: TestimonialItem[]
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? '#f59e0b' : 'none'} aria-hidden>
      <path
        d="M8 1.5l1.9 3.8 4.2.6-3 2.9.7 4.2L8 11l-3.8 2 .7-4.2-3-2.9 4.2-.6L8 1.5z"
        stroke="#f59e0b"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  const byline  = [item.clientRole, item.clientCompany].filter(Boolean).join(', ')
  const rating  = item.rating ?? 5
  const initials = item.clientName?.charAt(0) ?? '?'

  return (
    <div
      className="flex flex-col rounded-2xl p-8"
      style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}
    >
      <div className="flex items-center gap-4 mb-6">
        {item.avatar?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.avatar.url}
            alt={item.avatar.alt ?? item.clientName ?? ''}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #ffd369, #ffb347)', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
          >
            {initials}
          </div>
        )}
        <div>
          {item.clientName && (
            <p
              className="text-sm font-semibold leading-tight mb-0.5"
              style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              {item.clientName}
            </p>
          )}
          {byline && (
            <p className="text-xs" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {byline}
            </p>
          )}
        </div>
      </div>

      {item.quote && (
        <p
          className="text-sm leading-relaxed flex-1 mb-6"
          style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          &ldquo;{item.quote}&rdquo;
        </p>
      )}

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>
    </div>
  )
}

export default function TestimonialsSection({ data }: { data: TestimonialsSectionData }) {
  const items = data.testimonialItems ?? []

  return (
    <section className="py-24" style={{ background: '#ffd369' }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {(data.heading || data.subheading) && (
          <div className="flex flex-col gap-6 items-center w-full mb-16">
            {data.heading && (
              <h2
                className="text-center w-full leading-tight tracking-tight"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  fontWeight: 700,
                  color: '#171717',
                  letterSpacing: '-0.01em',
                }}
              >
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p
                className="text-center w-full leading-relaxed"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '1.125rem',
                  color: '#525252',
                  maxWidth: '44rem',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {data.subheading}
              </p>
            )}
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <TestimonialCard key={i} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
