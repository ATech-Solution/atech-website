import payload from 'payload'
import config from '../payload.config'

async function main() {
  await payload.init({ config })
  // Unlock by resetting lockout fields
  await payload.update({
    collection: 'users',
    where: { email: { equals: 'tan@atech.software' } },
    data: { lockUntil: null, loginAttempts: 0 } as any
  })
  console.log('User unlocked')
  process.exit(0)
}
main().catch(e => { console.error(e); process.exit(1) })
