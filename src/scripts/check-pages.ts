import { getPayload } from 'payload'
import config from '../payload.config'

async function check() {
  const payload = await getPayload({ config })
  const all = await payload.find({ collection: 'pages', overrideAccess: true, draft: true })
  console.log('Total pages (override+draft):', all.totalDocs)
  all.docs.forEach((p: any) => console.log(' slug:', p.slug, '| status:', p.status, '| _status:', p._status))

  const pub = await payload.find({ collection: 'pages', overrideAccess: false })
  console.log('Total pages (public):', pub.totalDocs)
  process.exit(0)
}
check().catch((e) => { console.error(e); process.exit(1) })
