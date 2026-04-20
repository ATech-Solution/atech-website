// Portfolio Grid — Figma node 1:29121 (projects section)
// White background, centered heading, 3×N project cards with tag + type + title + description + CTA

import Link from 'next/link'

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/45a54d06-5558-4992-9e87-c9de50d83829'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProjectItem {
  tag:        string
  type:       string
  title:      string
  description:string
  ctaLabel:   string
  ctaUrl:     string
}

interface PortfolioGridData {
  heading:    string
  subheading: string
  arrowSrc:   string
  items:      ProjectItem[]
}

// ─── Single project card ──────────────────────────────────────────────────────
function ProjectCard({ tag, type, title, description, ctaLabel, ctaUrl }: ProjectItem) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
      {/* Image placeholder */}
      <div className="w-full flex items-center justify-center" style={{ height: '280px', background: '#d4d4d4' }}>
        <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem' }}>
          {title}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-col p-6 gap-3">
        {/* Tag + type */}
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 text-xs"
            style={{
              background:   '#f5f5f5',
              border:       '1px solid #e5e5e5',
              color:        '#171717',
              fontFamily:   'var(--font-work-sans, sans-serif)',
              borderRadius: 0,
            }}
          >
            {tag}
          </span>
          <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
            {type}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '1.25rem',
            fontWeight: 400,
            color:      '#171717',
            lineHeight: '28px',
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '20px' }}>
          {description}
        </p>

        {/* CTA */}
        <Link
          href={ctaUrl}
          className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-70"
          style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717' }}
        >
          {ctaLabel}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ARROW_ICON} alt="" className="object-contain" style={{ width: '10.5px', height: '12px' }} />
        </Link>
      </div>
    </div>
  )
}

// ─── PortfolioGridBlock ───────────────────────────────────────────────────────
export default function PortfolioGridBlock({ data }: { data: PortfolioGridData }) {
  const { heading, subheading, items } = data

  return (
    <section id="projects" className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily:    'var(--font-work-sans, sans-serif)',
              fontSize:      'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight:    400,
              color:         '#171717',
              letterSpacing: '-0.5px',
              lineHeight:    '40px',
            }}
          >
            {heading}
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252', lineHeight: '24px' }}
          >
            {subheading}
          </p>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <ProjectCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
