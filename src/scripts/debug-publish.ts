import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const payload = await getPayload({ config })

  console.log('--- find({ draft: true, overrideAccess: true }) ---')
  const r1 = await payload.find({ collection: 'pages', overrideAccess: true, draft: true })
  console.log('total:', r1.totalDocs)
  r1.docs.forEach((d:any) => console.log('  ', d.slug, '_status:', d._status))

  console.log('--- find({ draft: false, overrideAccess: true }) ---')
  const r2 = await payload.find({ collection: 'pages', overrideAccess: true, draft: false })
  console.log('total:', r2.totalDocs)
  r2.docs.forEach((d:any) => console.log('  ', d.slug, '_status:', d._status))

  console.log('--- find({ overrideAccess: true }) (no draft param) ---')
  const r3 = await payload.find({ collection: 'pages', overrideAccess: true })
  console.log('total:', r3.totalDocs)
  r3.docs.forEach((d:any) => console.log('  ', d.slug, '_status:', d._status))

  console.log('--- find({ overrideAccess: false }) (no draft param) ---')
  const r4 = await payload.find({ collection: 'pages', overrideAccess: false })
  console.log('total:', r4.totalDocs)
  r4.docs.forEach((d:any) => console.log('  ', d.slug, '_status:', d._status))

  process.exit(0)
}
run().catch(e => { console.error(e); process.exit(1) })
