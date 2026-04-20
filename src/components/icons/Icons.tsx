// ─── All shared SVG icon components ─────────────────────────────────────────

export function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M1 7h12M7 1l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CheckBadgeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M5.5 9l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GlobeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M10 1.5C10 1.5 7 5.5 7 10s3 8.5 3 8.5M10 1.5C10 1.5 13 5.5 13 10s-3 8.5-3 8.5M1.5 10h17"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  )
}

export function CodeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M6 7L2 10l4 3M14 7l4 3-4 3M11.5 5l-3 10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DeviceIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="5" y="2" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="10" cy="15.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

export function UsersIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M2 17c0-3.314 2.686-6 6-6s6 2.686 6 6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M15 11a3 3 0 100-6M18 17c0-2.761-1.343-5.12-3.5-6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ConsultIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2L2 6v8l8 4 8-4V6l-8-4z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M2 6l8 4 8-4M10 10v8" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

export function LightbulbIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2C8.686 2 6 4.686 6 8c0 2.21 1.343 4.13 3 5.197V15a1 1 0 001 1h4a1 1 0 001-1v-1.803C16.657 12.13 18 10.21 18 8c0-3.314-2.686-6-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 18h6M10 21h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StarIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HandshakeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ShieldIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StarFilledIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1l1.85 3.75L14 5.4l-3 2.93.71 4.13L8 10.4l-3.71 2.06.71-4.13L2 5.4l4.15-.65L8 1z" />
    </svg>
  )
}

export function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M1 5l7 4.5L15 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export function PhoneIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 2h2.5l1.5 3.5-1.5 1A9 9 0 0010 10l1-1.5L14.5 10v2.5A1 1 0 0113.5 14C6.5 14 1.5 8.5 1.5 2.5A1 1 0 012.5 1.5L3 2z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LocationIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

// ─── Icon resolver — maps string key → icon component ────────────────────────

export function ServiceIcon({ name, size = 20 }: { name: string; size?: number }) {
  switch (name) {
    case 'check-badge': return <CheckBadgeIcon size={size} />
    case 'globe':       return <GlobeIcon size={size} />
    case 'device':      return <DeviceIcon size={size} />
    case 'users':       return <UsersIcon size={size} />
    case 'consult':     return <ConsultIcon size={size} />
    case 'lightbulb':   return <LightbulbIcon size={size} />
    case 'star':        return <StarIcon size={size} />
    case 'handshake':   return <HandshakeIcon size={size} />
    case 'shield':      return <ShieldIcon size={size} />
    case 'code':
    default:            return <CodeIcon size={size} />
  }
}
