// Team Section — Layout Builder (Advance)
// Dark (#292929) bg, centered heading + configurable 2-col (centered) or 3-col team cards

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
    teamColumns?: 2 | 3
    teamMembers?: TeamMember[]
  }
}

export default function TeamSection({ data }: TeamSectionProps) {
  const { leadershipHeading, leadershipSubheading, teamColumns = 3, teamMembers = [] } = data

  const is2Col = teamColumns === 2

  return (
    <section style={{ background: '#292929', padding: '80px 0' }}>
      <div
        className="mx-auto px-8 flex flex-col"
        style={{ maxWidth: '1280px', gap: '64px' }}
      >
        {/* Header */}
        {(leadershipHeading || leadershipSubheading) && (
          <div className="flex flex-col items-center gap-6 text-center">
            {leadershipHeading && (
              <h2
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '2.25rem',
                  fontWeight: 400,
                  color: '#ffcd37',
                  lineHeight: '40px',
                  letterSpacing: '-0.5px',
                }}
              >
                {leadershipHeading}
              </h2>
            )}
            {leadershipSubheading && (
              <p
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '1.25rem',
                  color: '#ffffff',
                  lineHeight: '28px',
                  maxWidth: '768px',
                }}
              >
                {leadershipSubheading}
              </p>
            )}
          </div>
        )}

        {/* Cards grid */}
        {teamMembers.length > 0 && (
          <div className="w-full">
            <div
              className={`grid gap-8 ${is2Col ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
            >
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center"
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '24px',
                    gap: '8px',
                  }}
                >
                  {/* Avatar — 209px circle matching Figma */}
                  <div
                    style={{
                      width: '209px',
                      height: '209px',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {member.memberAvatar?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.memberAvatar.url}
                        alt={member.memberAvatar.alt ?? member.memberName ?? ''}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #ffd369, #ffb347)', fontSize: '4rem', fontWeight: 400, color: '#171717' }}
                      >
                        {(member.memberName ?? '?').charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  {member.memberName && (
                    <h3
                      className="text-center w-full"
                      style={{
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        color: '#000000',
                        lineHeight: '28px',
                        paddingTop: '8px',
                      }}
                    >
                      {member.memberName}
                    </h3>
                  )}

                  {/* Role */}
                  {member.memberRole && (
                    <p
                      className="text-center w-full"
                      style={{
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                        fontSize: '1rem',
                        color: '#525252',
                        lineHeight: '24px',
                      }}
                    >
                      {member.memberRole}
                    </p>
                  )}

                  {/* Bio */}
                  {member.memberBio && (
                    <p
                      className="text-center w-full"
                      style={{
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                        fontSize: '0.875rem',
                        color: '#737373',
                        lineHeight: '20px',
                      }}
                    >
                      {member.memberBio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
