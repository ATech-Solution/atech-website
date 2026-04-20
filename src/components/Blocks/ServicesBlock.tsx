// Our Services section — Figma node 1:26504
// Yellow heading, 3×2 service card grid, "Need Custom Solution?" CTA banner

import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import IconCard from '@/components/ui/IconCard'
import { ServiceIcon, ArrowIcon } from '@/components/icons/Icons'

interface ServiceItem {
  icon: string
  title: string
  description: string
  href: string
}

interface CustomSolution {
  heading: string
  body: string
  cta: { label: string; url: string }
}

interface ServicesData {
  heading: string
  subheading: string
  items: ServiceItem[]
  customSolution: CustomSolution
}

export default function ServicesBlock({ data }: { data: ServicesData }) {
  const { heading, subheading, items, customSolution } = data

  return (
    <section
      className="py-24"
      style={{
        background: 'var(--color-bg, #292929)',
        borderTop: '1px solid var(--color-border, #383838)',
      }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {/* Section heading — yellow accent on heading */}
        <div className="mb-16">
          <SectionHeader
            heading={heading}
            subheading={subheading}
            align="center"
            headingColor="var(--color-accent, #ffd369)"
            subheadingColor="var(--color-muted, #525252)"
          />
        </div>

        {/* 3×2 Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {items.map((svc) => (
            <IconCard
              key={svc.title}
              icon={<ServiceIcon name={svc.icon} size={20} />}
              title={svc.title}
              description={svc.description}
              href={svc.href}
              align="left"
              size="md"
            />
          ))}
        </div>

        {/* Need Custom Solution? banner */}
        <div
          className="rounded-2xl px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{
            background: 'var(--color-surface, #2f2f2f)',
            border: '1px solid var(--color-border, #383838)',
          }}
        >
          <div>
            <h3
              className="text-xl font-semibold mb-1"
              style={{
                color: 'var(--color-text, #fafafa)',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {customSolution.heading}
            </h3>
            <p
              className="text-sm"
              style={{
                color: 'var(--color-muted, #525252)',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {customSolution.body}
            </p>
          </div>
          <Link
            href={customSolution.cta.url}
            className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-opacity duration-200 hover:opacity-90"
            style={{
              background: 'var(--color-accent, #ffd369)',
              color: '#171717',
              fontFamily: 'var(--font-work-sans, sans-serif)',
              boxShadow: '0 4px 14px rgba(255,211,105,0.25)',
            }}
          >
            {customSolution.cta.label} <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
