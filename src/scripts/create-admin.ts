import { getPayload } from 'payload'
import config from '../payload.config'

async function createAdmin() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@domain.com' } },
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    console.log('User admin@domain.com already exists.')
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      email: 'admin@domain.com',
      password: 'Password!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
  })

  console.log('Admin user created: admin@domain.com')
  process.exit(0)
}

createAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
