// Page Template : Web Development Services
// Web Dev Service page — What we do / Web Dev Service
// Figma node: 1:27705

import type { Metadata } from 'next'

export const revalidate = 60
import {
  WebDevHeroBlock,
  WebDevServicesBlock,
  WebDevProcessBlock,
  ContactBlock,
} from '@/components/Blocks'
import content from '@/components/language/web-dev-service.json'
import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export const metadata: Metadata = {
  title:       'Web Development Services',
  description:
    'Build powerful, scalable web applications that drive business growth. Our expert developers create responsive, user-friendly websites and web platforms tailored to your specific needs and objectives.',
}

export default async function WebDevServicePage() {
  const page = await getPage('web-dev-service').catch(() => null)
  const layoutTree: any[] = Array.isArray((page as any)?.layoutBuilder)
    ? (page as any).layoutBuilder
    : []

  if (layoutTree.length > 0) {
    const blockIds  = collectBlockIds(layoutTree)
    const templates = await getBlockTemplates(blockIds)
    return (
      <div style={{ background: '#ffffff' }}>
        {layoutTree.map((node: any) => (
          <LayoutBlockRenderer key={node.id} node={node} templates={templates} />
        ))}
      </div>
    )
  }

  const { hero, services, process, contact } = content['web-dev-service']

  return (
    <div style={{ background: '#ffffff' }}>
      <WebDevHeroBlock     data={hero}     />
      <WebDevServicesBlock data={services} />
      <WebDevProcessBlock  data={process}  />
      <ContactBlock        data={contact}  />
    </div>
  )
}
