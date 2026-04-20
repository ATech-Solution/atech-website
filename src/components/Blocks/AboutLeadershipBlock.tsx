// About Leadership — Figma node 1:29839
// Dark (#292929) background, centered heading + 3-col team cards

import SectionHeader from '@/components/ui/SectionHeader'

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeamMember {
  avatarSrc: string
  name:      string
  role:      string
  bio:       string
}

interface AboutLeadershipData {
  heading:    string
  subheading: string
  team:       TeamMember[]
}

// ─── AboutLeadershipBlock ─────────────────────────────────────────────────────
export default function AboutLeadershipBlock({ data }: { data: AboutLeadershipData }) {
  const { heading, subheading, team } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#292929' }}>
      <div className="mx-auto flex flex-col gap-16" style={{ maxWidth: '1280px' }}>
        <div className="flex justify-center">
          <div style={{ maxWidth: '768px', width: '100%' }}>
            <SectionHeader
              heading={heading}
              subheading={subheading}
              align="center"
              headingColor="#ffcd37"
              subheadingColor="#ffffff"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center gap-2 p-6 rounded-xl"
              style={{ background: '#ffffff' }}
            >
              {/* Avatar */}
              <div className="overflow-hidden rounded-full mb-2" style={{ width: '96px', height: '96px', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.avatarSrc} alt={member.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <h3
                className="text-center mt-2"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', fontWeight: 400, color: '#000000', lineHeight: '28px' }}
              >
                {member.name}
              </h3>
              <p
                className="text-center"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252', lineHeight: '24px' }}
              >
                {member.role}
              </p>
              <p
                className="text-center"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#737373', lineHeight: '20px' }}
              >
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
