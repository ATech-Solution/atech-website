import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fff' }}>
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '6rem', fontWeight: 800, margin: 0, lineHeight: 1, color: '#111' }}>
            404
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#555', marginTop: '1rem' }}>
            Page not found
          </p>
          <p style={{ fontSize: '0.95rem', color: '#888', marginTop: '0.5rem' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '2rem',
              padding: '10px 24px',
              borderRadius: 8,
              background: '#111',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            ← Back to home
          </Link>
        </section>
      </body>
    </html>
  )
}
