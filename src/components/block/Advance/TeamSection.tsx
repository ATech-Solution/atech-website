// Team Section — Layout Builder (Advance)
// Dark (#292929) bg, centered heading + 3-col team member cards

interface TeamMember {
  memberAvatar?: { url: string; alt?: string } | null
  memberName?: string
  memberRole?: string
  memberBio?: string
}

interface TeamSectionProps {
  data: {
    leadershipHeading?: string
    leadershipSubheading?: string
    teamMembers?: TeamMember[]
  }
}

export default function TeamSection({ data }: TeamSectionProps) {
  const { leadershipHeading, leadershipSubheading, teamMembers = [] } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#292929' }}>
      <div className="mx-auto flex flex-col gap-16" style={{ maxWidth: '1280px' }}>
        {(leadershipHeading || leadershipSubheading) && (
          <div className="flex justify-center">
            <div style={{ maxWidth: '768px', width: '100%', textAlign: 'center' }}>
              {leadershipHeading && (
                <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400, color: '#ffcd37', letterSpacing: '-0.5px', marginBottom: leadershipSubheading ? '16px' : '0' }}>
                  {leadershipHeading}
                </h2>
              )}
              {leadershipSubheading && (
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#ffffff', lineHeight: '28px' }}>
                  {leadershipSubheading}
                </p>
              )}
            </div>
          </div>
        )}

        {teamMembers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-6 rounded-xl" style={{ background: '#ffffff' }}>
                <div className="overflow-hidden rounded-full mb-2" style={{ width: '96px', height: '96px', flexShrink: 0 }}>
                  {member.memberAvatar?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.memberAvatar.url} alt={member.memberAvatar.alt ?? member.memberName ?? ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold" style={{ background: 'linear-gradient(135deg, #ffd369, #ffb347)', color: '#171717' }}>
                      {(member.memberName ?? '?').charAt(0)}
                    </div>
                  )}
                </div>

                {member.memberName && (
                  <h3 className="text-center mt-2" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', fontWeight: 400, color: '#000000', lineHeight: '28px' }}>
                    {member.memberName}
                  </h3>
                )}
                {member.memberRole && (
                  <p className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252', lineHeight: '24px' }}>
                    {member.memberRole}
                  </p>
                )}
                {member.memberBio && (
                  <p className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#737373', lineHeight: '20px' }}>
                    {member.memberBio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
