// QA Featured Case Study — Figma node 360:7846
// White background, 2-col: text+logo left, bordered dashboard image + floating badge right

interface QACaseStudyData {
  label:        string
  company:      string
  description:  string
  logoSrc:      string
  logoAlt:      string
  imageSrc:     string
  imageAlt:     string
  badgeIconSrc: string
  badge: {
    title:    string
    subtitle: string
  }
}

export default function QACaseStudyBlock({ data }: { data: QACaseStudyData }) {
  const { label, company, description, logoSrc, logoAlt, imageSrc, imageAlt, badgeIconSrc, badge } = data

  return (
    <section
      className="py-24"
      style={{ background: '#ffffff' }}
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-20 flex flex-col lg:flex-row gap-16 lg:gap-20 items-center"
        style={{ maxWidth: '1280px' }}
      >
        {/* ── Left: text + logo ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Label */}
          <span
            className="text-xs font-semibold uppercase tracking-[1.2px]"
            style={{
              color:      '#737373',
              fontFamily: 'var(--font-work-sans, sans-serif)',
            }}
          >
            {label}
          </span>

          {/* Company heading */}
          <h2
            style={{
              fontFamily:   'var(--font-work-sans, sans-serif)',
              fontSize:     'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight:   400,
              color:        '#171717',
              lineHeight:   '1.22',
              letterSpacing: '-0.5px',
            }}
          >
            {company}
          </h2>

          {/* Description */}
          <p
            className="pt-2"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '1.125rem',
              color:      '#525252',
              lineHeight: '1.625',
            }}
          >
            {description}
          </p>

          {/* Company logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt={logoAlt}
            className="object-contain mt-4"
            style={{ height: '56px', maxWidth: '200px' }}
          />
        </div>

        {/* ── Right: image card + floating badge ────────────────────────────── */}
        <div className="relative flex-1 min-w-0 w-full">
          {/* Dashboard image */}
          <div
            className="relative overflow-hidden w-full"
            style={{
              background:   '#f5f5f5',
              border:       '1px solid #e5e5e5',
              borderRadius: '24px',
              height:       '440px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ borderRadius: '24px' }}
            />
          </div>

          {/* Floating badge card */}
          <div
            className="absolute flex gap-4 items-center p-6"
            style={{
              left:         '-24px',
              bottom:       '-20px',
              background:   '#ffffff',
              border:       '1px solid #e5e5e5',
              borderRadius: '12px',
              boxShadow:    '0px 20px 25px -5px rgba(0,0,0,0.10), 0px 8px 10px -6px rgba(0,0,0,0.10)',
              minWidth:     '220px',
            }}
          >
            {/* Yellow icon circle */}
            <div
              className="flex items-center justify-center flex-shrink-0 rounded-full"
              style={{ background: '#ffd369', width: '48px', height: '48px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={badgeIconSrc}
                alt=""
                className="object-contain"
                style={{ width: '24px', height: '24px' }}
              />
            </div>

            {/* Badge text */}
            <div className="flex flex-col gap-1">
              <span
                className="font-semibold"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '1rem',
                  color:      '#171717',
                  lineHeight: '1.5',
                }}
              >
                {badge.title}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '0.75rem',
                  color:      '#525252',
                  lineHeight: '1.5',
                }}
              >
                {badge.subtitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
