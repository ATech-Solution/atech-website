import payload from 'payload'
import config from '../payload.config'

async function main() {
  await payload.init({ config })
  await payload.update({
    collection: 'users',
    where: { email: { equals: 'tan@atech.software' } },
    data: { password: 'DevTest123!' }
  })
  console.log('Password reset to DevTest123!')
  process.exit(0)
}
main().catch(e => { console.error(e); process.exit(1) })
