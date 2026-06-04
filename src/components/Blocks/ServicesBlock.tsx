// Our Services section — Figma node 1:26504
// Yellow heading, 3×2 service card grid, "Need Custom Solution?" CTA banner

import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import IconCard from '@/components/ui/IconCard'
import { ServiceIcon } from '@/components/icons/Icons'

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
      className="py-20"
      style={{
        background: '#292929',
        borderTop: '1px solid #383838',
      }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {/* Section heading — yellow (#ffcd37) matching Figma exactly */}
        <div className="mb-16">
          <SectionHeader
            heading={heading}
            subheading={subheading}
            align="center"
            headingColor="#ffcd37"
            subheadingColor="#a3a3a3"
            headingFontWeight={400}
          />
        </div>

        {/* 3×2 Service cards grid — white cards matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {items.map((svc) => (
            <IconCard
              key={svc.title}
              icon={<ServiceIcon name={svc.icon} size={16} />}
              title={svc.title}
              description={svc.description}
              href={svc.href}
              align="left"
              size="md"
              theme="light"
            />
          ))}
        </div>

        {/* Need Custom Solution? — white banner, dark button matching Figma */}
        <div
          className="rounded-xl px-8 py-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
          }}
        >
          <div className="flex flex-col gap-2">
            <h3
              className="text-xl font-normal"
              style={{
                color: '#000000',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {customSolution.heading}
            </h3>
            <p
              className="text-base"
              style={{
                color: '#000000',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {customSolution.body}
            </p>
          </div>
          <Link
            href={customSolution.cta.url}
            className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-base font-normal whitespace-nowrap transition-opacity duration-200 hover:opacity-80"
            style={{
              background: '#292929',
              color: '#ffffff',
              fontFamily: 'var(--font-work-sans, sans-serif)',
            }}
          >
            {customSolution.cta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
