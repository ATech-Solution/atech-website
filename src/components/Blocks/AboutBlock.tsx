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
      className="py-20"
      style={{
        background: '#292929',
        borderTop: '1px solid #383838',
      }}
    >
      <div className="mx-auto px-6 md:px-10 lg:px-20" style={{ maxWidth: '1280px' }}>
        {/* Section heading */}
        <div className="mb-16">
          <SectionHeader
            heading={heading}
            subheading={description}
            align="center"
            headingColor="#fafafa"
            subheadingColor="#fafafa"
            headingFontWeight={400}
          />
        </div>

        {/* Pillars grid — Figma: transparent bg, 64px icon box, gold title */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pillars.map((pillar) => (
            <IconCard
              key={pillar.title}
              icon={<ServiceIcon name={pillar.icon} size={20} />}
              title={pillar.title}
              description={pillar.description}
              align="center"
              size="md"
              theme="transparent"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
