/**
 * Frontend route group wrapper — intentionally minimal.
 * All real HTML structure lives in [locale]/layout.tsx, which handles
 * locale-aware lang attributes, hreflang, theme vars, and navigation.
 * Non-locale paths are handled by middleware (rewrite → /en/...) before
 * ever reaching this layout.
 */
export default function FrontendGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
