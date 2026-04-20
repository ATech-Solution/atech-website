// Community Channels — Figma node 1:30812
// Dark #171717 background (continuation), 3-col cards: Open Source, Discord, Events & Meetups

import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChannelStat {
  iconSrc: string
  label:   string
}

interface CommunityChannel {
  iconSrc:     string
  title:       string
  description: string
  stats:       ChannelStat[]
  ctaLabel:    string
  ctaUrl:      string
}

interface CommunityChannelsData {
  channels: CommunityChannel[]
}

// ─── CommunityChannelsBlock ───────────────────────────────────────────────────
export default function CommunityChannelsBlock({ data }: { data: CommunityChannelsData }) {
  const { channels } = data

  return (
    <section className="pb-16 px-6 md:px-10" style={{ background: '#171717' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {channels.map((ch) => (
            <div
              key={ch.title}
              className="flex flex-col gap-4 p-8"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {/* Icon */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ch.iconSrc} alt={ch.title} className="object-contain" style={{ width: '48px', height: '48px' }} />

              {/* Title */}
              <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', lineHeight: '32px' }}>
                {ch.title}
              </h3>

              {/* Description */}
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#d4d4d4', lineHeight: '1.625' }}>
                {ch.description}
              </p>

              {/* Stats */}
              <div className="flex flex-col gap-2 mt-auto">
                {ch.stats.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.iconSrc} alt="" className="object-contain" style={{ width: '16px', height: '16px' }} />
                    <span style={{ color: '#a3a3a3', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem' }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={ch.ctaUrl}
                className="mt-4 flex items-center justify-center py-4 text-base font-normal transition-opacity duration-200 hover:opacity-80"
                style={{ border: '2px solid #ffffff', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {ch.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
