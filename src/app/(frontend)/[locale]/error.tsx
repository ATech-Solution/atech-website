'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h2>Something went wrong.</h2>
      <button onClick={reset} style={{ marginTop: '1rem', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  )
}
