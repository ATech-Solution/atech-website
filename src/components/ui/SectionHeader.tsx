// Reusable section heading + optional subheading.
// Used by: AboutBlock, ServicesBlock, TestimonialsBlock, ContactBlock

interface SectionHeaderProps {
  heading: string
  subheading?: string
  align?: 'center' | 'left'
  headingColor?: string
  subheadingColor?: string
}

export default function SectionHeader({
  heading,
  subheading,
  align = 'center',
  headingColor = 'var(--color-text, #fafafa)',
  subheadingColor = 'var(--color-muted, #525252)',
}: SectionHeaderProps) {
  const textAlign = align === 'center' ? 'text-center' : 'text-left'
  const itemsAlign = align === 'center' ? 'items-center' : 'items-start'

  return (
    <div className={`flex flex-col gap-6 ${itemsAlign} w-full`}>
      <h2
        className={`${textAlign} w-full leading-tight tracking-tight`}
        style={{
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          fontWeight: 700,
          color: headingColor,
          letterSpacing: '-0.01em',
        }}
      >
        {heading}
      </h2>
      {subheading && (
        <p
          className={`${textAlign} w-full leading-relaxed`}
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize: '1.125rem',
            color: subheadingColor,
            maxWidth: '44rem',
            ...(align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
          }}
        >
          {subheading}
        </p>
      )}
    </div>
  )
}
