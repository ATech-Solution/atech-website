// About ATech Solutions section — Figma node 1:26467
// Centered heading + description + 3 icon pillars (Innovation, Expertise, Partnership)

import SectionHeader from '@/components/ui/SectionHeader'
import IconCard from '@/components/ui/IconCard'
import { ServiceIcon } from '@/components/icons/Icons'

interface Pillar {
  icon: string
  title: string
  description: string
}

interface AboutData {
  heading: string
  description: string
  pillars: Pillar[]
}

export default function AboutBlock({ data }: { data: AboutData }) {
  const { heading, description, pillars } = data

  return (
    <section
      className="py-24"
      style={{
        background: 'var(--color-bg, #292929)',
        borderTop: '1px solid var(--color-border, #383838)',
      }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {/* Section heading */}
        <div className="mb-16">
          <SectionHeader heading={heading} subheading={description} align="center" />
        </div>

        {/* Pillars grid — centered icon, centered text */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pillars.map((pillar) => (
            <IconCard
              key={pillar.title}
              icon={<ServiceIcon name={pillar.icon} size={24} />}
              title={pillar.title}
              description={pillar.description}
              align="center"
              size="md"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
