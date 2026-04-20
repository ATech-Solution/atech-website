// Project Grid Section — 3×N project cards: tag + type + title + description + CTA

import Link from 'next/link'

const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/45a54d06-5558-4992-9e87-c9de50d83829'

interface ProjectItem {
  projectTag?:   string
  projectType?:  string
  projectTitle?: string
  projectDesc?:  string
  projectCta?:   string
  projectUrl?:   string
}

interface ProjectGridData {
  heading?:    string
  subheading?: string
  projectItems?: ProjectItem[]
}

function ProjectCard({ item }: { item: ProjectItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
      <div className="w-full flex items-center justify-center" style={{ height: '280px', background: '#d4d4d4' }}>
        <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem' }}>
          {item.projectTitle}
        </span>
      </div>
      <div className="flex flex-col p-6 gap-3">
        <div className="flex items-center gap-3">
          {item.projectTag && (
            <span
              className="px-3 py-1 text-xs"
              style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)', borderRadius: 0 }}
            >
              {item.projectTag}
            </span>
          )}
          {item.projectType && (
            <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
              {item.projectType}
            </span>
          )}
        </div>
        {item.projectTitle && (
          <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', fontWeight: 400, color: '#171717', lineHeight: '28px' }}>
            {item.projectTitle}
          </h3>
        )}
        {item.projectDesc && (
          <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '20px' }}>
            {item.projectDesc}
          </p>
        )}
        {item.projectCta && item.projectUrl && (
          <Link
            href={item.projectUrl}
            className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-70"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717' }}
          >
            {item.projectCta}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ARROW_ICON} alt="" className="object-contain" style={{ width: '10.5px', height: '12px' }} />
          </Link>
        )}
      </div>
    </div>
  )
}

export default function ProjectGridSection({ data }: { data: ProjectGridData }) {
  const { heading, subheading, projectItems = [] } = data

  return (
    <section id="projects" className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {(heading || subheading) && (
          <div className="mb-16 text-center">
            {heading && (
              <h2
                className="mb-4"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 400, color: '#171717', letterSpacing: '-0.5px', lineHeight: '40px' }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252', lineHeight: '24px' }}>
                {subheading}
              </p>
            )}
          </div>
        )}
        {projectItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectItems.map((item, i) => (
              <ProjectCard key={i} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
