// Community Channels Section — dark #171717 background, 3-col channel cards with stats

import Link from 'next/link'

interface ChannelStat {
  statIcon?:  string
  statLabel?: string
}

interface ChannelItem {
  channelIcon?:  string
  channelTitle?: string
  channelDesc?:  string
  channelStats?: ChannelStat[]
  channelCta?:   string
  channelUrl?:   string
}

interface CommunityChannelsData {
  channelItems?: ChannelItem[]
}

export default function CommunityChannelsSection({ data }: { data: CommunityChannelsData }) {
  const { channelItems = [] } = data

  return (
    <section className="pb-16 px-6 md:px-10" style={{ background: '#171717' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {channelItems.map((ch, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-8"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {ch.channelIcon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ch.channelIcon} alt={ch.channelTitle ?? ''} className="object-contain" style={{ width: '48px', height: '48px' }} />
              )}
              {ch.channelTitle && (
                <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', lineHeight: '32px' }}>
                  {ch.channelTitle}
                </h3>
              )}
              {ch.channelDesc && (
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#d4d4d4', lineHeight: '1.625' }}>
                  {ch.channelDesc}
                </p>
              )}
              {ch.channelStats && ch.channelStats.length > 0 && (
                <div className="flex flex-col gap-2 mt-auto">
                  {ch.channelStats.map((s, j) => (
                    <div key={j} className="flex items-center gap-2">
                      {s.statIcon && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.statIcon} alt="" className="object-contain" style={{ width: '16px', height: '16px' }} />
                      )}
                      {s.statLabel && (
                        <span style={{ color: '#a3a3a3', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem' }}>
                          {s.statLabel}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {ch.channelCta && ch.channelUrl && (
                <Link
                  href={ch.channelUrl}
                  className="mt-4 flex items-center justify-center py-4 text-base font-normal transition-opacity duration-200 hover:opacity-80"
                  style={{ border: '2px solid #ffffff', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {ch.channelCta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
