'use client'

import Link from 'next/link'
import Image from 'next/image'

interface PortfolioHeroSectionProps {
  data: {
    portfolioHeroBadge?: string
    portfolioHeroHeading?: string
    portfolioHeroSubheading?: string
    portfolioHeroCtaPrimaryLabel?: string
    portfolioHeroCtaPrimaryUrl?: string
    portfolioHeroCtaSecondaryLabel?: string
    portfolioHeroCtaSecondaryUrl?: string
  }
}

export default function PortfolioHeroSection({ data }: PortfolioHeroSectionProps) {
  const {
    portfolioHeroBadge        = 'Our Work',
    portfolioHeroHeading      = 'Our Portfolio',
    portfolioHeroSubheading   = 'Explore our collection of successful projects across industries. From startups to enterprises, we deliver exceptional digital solutions that drive results.',
    portfolioHeroCtaPrimaryLabel   = 'View Projects',
    portfolioHeroCtaPrimaryUrl     = '#projects',
    portfolioHeroCtaSecondaryLabel = 'Start Your Project',
    portfolioHeroCtaSecondaryUrl   = '/static/contact',
  } = data

  return (
    <section
      className="w-full flex items-center justify-center py-20"
      style={{ background: '#ffffff' }}
    >
      <div className="w-full mx-auto px-6 md:px-10 lg:px-48" style={{ maxWidth: '1280px' }}>
        <div className="flex flex-col items-center text-center gap-6" style={{ maxWidth: '896px', margin: '0 auto' }}>

          {/* Badge */}
          {portfolioHeroBadge && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-center"
              style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}
            >
              <Image
                src="/assets/portfolio-badge-icon.svg"
                alt=""
                width={16}
                height={16}
                className="flex-shrink-0"
              />
              <span
                className="text-xs font-normal tracking-[0.6px] uppercase"
                style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {portfolioHeroBadge}
              </span>
            </div>
          )}

          {/* Heading */}
          {portfolioHeroHeading && (
            <h1
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 400,
                color: '#171717',
                letterSpacing: '-1.8px',
                lineHeight: 1,
              }}
            >
              {portfolioHeroHeading}
            </h1>
          )}

          {/* Subheading */}
          {portfolioHeroSubheading && (
            <p
              className="max-w-2xl"
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '1.25rem',
                color: '#525252',
                lineHeight: '1.625',
              }}
            >
              {portfolioHeroSubheading}
            </p>
          )}

          {/* CTAs */}
          {(portfolioHeroCtaPrimaryLabel || portfolioHeroCtaSecondaryLabel) && (
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {portfolioHeroCtaPrimaryLabel && (
                <Link
                  href={portfolioHeroCtaPrimaryUrl ?? '#'}
                  className="inline-flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80 active:opacity-60"
                  style={{
                    background: '#171717',
                    color: '#ffffff',
                    padding: '16px 32px',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: '1rem',
                    fontWeight: 400,
                    lineHeight: '1.5',
                  }}
                >
                  {portfolioHeroCtaPrimaryLabel}
                  <Image
                    src="/assets/portfolio-arrow-down-icon.svg"
                    alt=""
                    width={12}
                    height={16}
                    className="flex-shrink-0"
                  />
                </Link>
              )}

              {portfolioHeroCtaSecondaryLabel && (
                <Link
                  href={portfolioHeroCtaSecondaryUrl ?? '#'}
                  className="inline-flex items-center justify-center rounded-lg transition-opacity hover:opacity-80 active:opacity-60"
                  style={{
                    border: '2px solid #171717',
                    color: '#171717',
                    padding: '16px 32px',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: '1rem',
                    fontWeight: 400,
                    lineHeight: '1.5',
                  }}
                >
                  {portfolioHeroCtaSecondaryLabel}
                </Link>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
