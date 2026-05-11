'use client'

import { useState } from 'react'
import Link from 'next/link'

const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/45a54d06-5558-4992-9e87-c9de50d83829'
const LOAD_MORE_ICON = 'https://www.figma.com/api/mcp/asset/f3efc7ba-bda2-4fc7-a829-0d0f8cd39d4f'

export interface ProjectItem {
  projectTag?: string
  projectType?: string
  projectTitle?: string
  projectDesc?: string
  projectCta?: string
  projectUrl?: string
  projectImage?: { url: string; alt?: string } | null
  projectAllCategories?: string[]
}

interface ProjectGridFilterProps {
  heading?: string
  subheading?: string
  items: ProjectItem[]
  showCategoryFilter?: boolean
}

function ProjectCard({ item }: { item: ProjectItem }) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}
    >
      {/* Image thumbnail — 320px tall, matching Figma */}
      <div className="relative w-full shrink-0" style={{ height: '320px', background: '#d4d4d4' }}>
        {item.projectImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.projectImage.url}
            alt={item.projectImage.alt ?? item.projectTitle ?? ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-6">
        {/* Category + type badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {item.projectTag && (
            <span
              className="px-3 py-1 text-xs"
              style={{
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                color: '#171717',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                borderRadius: 0,
              }}
            >
              {item.projectTag}
            </span>
          )}
          {item.projectType && (
            <span
              className="px-3 py-1 text-xs"
              style={{
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                color: '#171717',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                borderRadius: 0,
              }}
            >
              {item.projectType}
            </span>
          )}
        </div>

        {/* Title */}
        {item.projectTitle && (
          <div className="pt-1">
            <h3
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: '#171717',
                lineHeight: '28px',
              }}
            >
              {item.projectTitle}
            </h3>
          </div>
        )}

        {/* Short description */}
        {item.projectDesc && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '0.875rem',
              color: '#525252',
              lineHeight: '20px',
            }}
          >
            {item.projectDesc}
          </p>
        )}

        {/* CTA link */}
        {item.projectCta && item.projectUrl && (
          <Link
            href={item.projectUrl}
            className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-70"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '0.875rem',
              color: '#171717',
            }}
          >
            {item.projectCta}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ARROW_ICON}
              alt=""
              style={{ width: '10.5px', height: '12px', objectFit: 'contain' }}
            />
          </Link>
        )}
      </div>
    </div>
  )
}

const PAGE_SIZE = 6

export function ProjectGridFilter({
  heading,
  subheading,
  items,
  showCategoryFilter = true,
}: ProjectGridFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Unique category labels derived from all items
  const categories = showCategoryFilter
    ? Array.from(
        new Set(
          items
            .flatMap((item) => [
              item.projectTag,
              ...(item.projectAllCategories ?? []),
            ])
            .filter(Boolean) as string[],
        ),
      )
    : []

  const filtered =
    activeCategory === 'all'
      ? items
      : items.filter((item) => {
          const cats = [
            item.projectTag,
            ...(item.projectAllCategories ?? []),
          ].filter(Boolean) as string[]
          return cats.includes(activeCategory)
        })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section id="projects" className="py-20 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>

        {/* Heading block */}
        {(heading || subheading) && (
          <div
            className="flex flex-col items-center gap-5 text-center"
            style={{ maxWidth: '768px', margin: '0 auto 3rem' }}
          >
            {heading && (
              <h2
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '3rem',
                  fontWeight: 400,
                  color: '#171717',
                  lineHeight: '48px',
                }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '1.125rem',
                  color: '#525252',
                  lineHeight: '28px',
                }}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Category filter tabs */}
        {showCategoryFilter && categories.length > 0 && (
          <div className="flex items-center gap-4 justify-center flex-wrap pt-4 pb-8">
            <button
              onClick={() => handleCategoryChange('all')}
              className="px-6 py-2 text-sm transition-colors cursor-pointer"
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                background: activeCategory === 'all' ? '#171717' : '#f5f5f5',
                color: activeCategory === 'all' ? '#ffffff' : '#171717',
                borderRadius: '8px',
                border: 'none',
              }}
            >
              All Projects
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="px-6 py-2 text-sm transition-colors cursor-pointer"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  background: activeCategory === cat ? '#171717' : '#f5f5f5',
                  color: activeCategory === cat ? '#ffffff' : '#171717',
                  borderRadius: '8px',
                  border: 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Card grid */}
        {visible.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((item, i) => (
              <ProjectCard key={i} item={item} />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex items-center justify-center mt-16">
            <button
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              className="inline-flex items-center gap-2 cursor-pointer transition-opacity duration-200 hover:opacity-70"
              style={{
                border: '2px solid #171717',
                borderRadius: '8px',
                padding: '18px 34px',
                background: 'transparent',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '1rem',
                color: '#171717',
              }}
            >
              Load More Projects
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOAD_MORE_ICON}
                alt=""
                style={{ width: '12px', height: '16px', objectFit: 'contain' }}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
