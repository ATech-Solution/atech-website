import { getPayload } from 'payload'
import config from '@payload-config'

export default async function SecurityDashboard() {
  const payload = await getPayload({ config })

  let recentFailedLogins: any[] = []
  let currentLockouts: any[] = []
  let blockedIps: any[] = []
  let recentAuditEvents: any[] = []

  try {
    const [failedLogins, lockouts, ipEvents, auditEvents] = await Promise.all([
      payload.find({
        collection: 'audit-logs' as any,
        where: { action: { equals: 'failed-login' } },
        sort: '-createdAt',
        limit: 10,
        depth: 1,
      }),
      payload.find({
        collection: 'security-events' as any,
        where: {
          and: [
            { eventType: { equals: 'failed-login' } },
            { resolved: { equals: false } },
          ],
        },
        sort: '-updatedAt',
        limit: 10,
        depth: 0,
      }),
      payload.find({
        collection: 'security-events' as any,
        where: { eventType: { equals: 'ip-blocked' } },
        sort: '-createdAt',
        limit: 10,
        depth: 0,
      }),
      payload.find({
        collection: 'audit-logs' as any,
        sort: '-createdAt',
        limit: 15,
        depth: 1,
      }),
    ])
    recentFailedLogins = failedLogins.docs
    currentLockouts    = lockouts.docs
    blockedIps         = ipEvents.docs
    recentAuditEvents  = auditEvents.docs
  } catch {
    // Show empty dashboard if DB not ready
  }

  const actionColor: Record<string, string> = {
    login:        '#16a34a',
    'failed-login': '#dc2626',
    create:       '#2563eb',
    update:       '#d97706',
    delete:       '#9333ea',
    'ip-blocked': '#dc2626',
    '2fa-enabled':  '#0891b2',
    '2fa-verified': '#16a34a',
    'ip-unlocked':  '#16a34a',
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, fontFamily: 'var(--font-sans, system-ui)' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Security Dashboard</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>
        Real-time overview of security events, lockouts, and audit trail.
      </p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Failed Logins (recent)', value: recentFailedLogins.length, color: '#dc2626' },
          { label: 'Active Lockouts',        value: currentLockouts.length,    color: '#d97706' },
          { label: 'Blocked IP Events',      value: blockedIps.length,         color: '#9333ea' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 10,
            padding: '20px 24px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Active lockouts */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Active Lockouts</h2>
          {currentLockouts.length === 0
            ? <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>No active lockouts.</p>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                    <th style={{ padding: '4px 8px' }}>IP</th>
                    <th style={{ padding: '4px 8px' }}>Attempts</th>
                    <th style={{ padding: '4px 8px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLockouts.map((ev: any) => (
                    <tr key={ev.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>{ev.ip}</td>
                      <td style={{ padding: '6px 8px', color: '#dc2626', fontWeight: 600 }}>{ev.count}</td>
                      <td style={{ padding: '6px 8px' }}>
                        <a
                          href={`/api/security/unlock-ip`}
                          style={{ color: '#60a5fa', fontSize: 12, textDecoration: 'none' }}
                          onClick={(e) => {
                            e.preventDefault()
                            fetch('/api/security/unlock-ip', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ip: ev.ip }),
                            }).then(() => window.location.reload())
                          }}
                        >
                          Unlock
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          <a href="/admin/collections/security-events" style={{ display: 'block', marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            View all security events →
          </a>
        </div>

        {/* Recent failed logins */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Recent Failed Logins</h2>
          {recentFailedLogins.length === 0
            ? <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>No failed logins recorded.</p>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                    <th style={{ padding: '4px 8px' }}>IP</th>
                    <th style={{ padding: '4px 8px' }}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFailedLogins.map((ev: any) => (
                    <tr key={ev.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>{ev.ip ?? '—'}</td>
                      <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.5)' }}>
                        {new Date(ev.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>

      {/* Audit trail */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Recent Audit Events</h2>
        {recentAuditEvents.length === 0
          ? <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>No events yet.</p>
          : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                  <th style={{ padding: '4px 8px' }}>Action</th>
                  <th style={{ padding: '4px 8px' }}>Collection</th>
                  <th style={{ padding: '4px 8px' }}>User</th>
                  <th style={{ padding: '4px 8px' }}>IP</th>
                  <th style={{ padding: '4px 8px' }}>When</th>
                </tr>
              </thead>
              <tbody>
                {recentAuditEvents.map((ev: any) => (
                  <tr key={ev.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '6px 8px' }}>
                      <span style={{
                        background: `${actionColor[ev.action] ?? '#6b7280'}22`,
                        color: actionColor[ev.action] ?? '#9ca3af',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 11,
                        fontWeight: 600,
                      }}>
                        {ev.action}
                      </span>
                    </td>
                    <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.6)' }}>{ev.collection ?? '—'}</td>
                    <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.6)' }}>
                      {(ev.user as any)?.email ?? ev.user ?? '—'}
                    </td>
                    <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 12 }}>{ev.ip ?? '—'}</td>
                    <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      {new Date(ev.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        <a href="/admin/collections/audit-logs" style={{ display: 'block', marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          View full audit log →
        </a>
      </div>
    </div>
  )
}
