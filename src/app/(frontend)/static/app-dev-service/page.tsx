// Page Template : App Development Services
// App Development Services page — What we do / Custom Mobile
// Figma node: 1:27155

import type { Metadata } from 'next'

export const revalidate = 60

import {
  WebDevHeroBlock,
  WebDevServicesBlock,
  AppDevCTABlock,
  ContactBlock,
} from '@/components/Blocks'
import content from '@/components/language/app-dev-service.json'
import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export const metadata: Metadata = {
  title:       'App Development Services',
  description:
    'Transform your ideas into powerful, scalable, and user-centric applications. We build high-performance native and cross-platform apps tailored to your business goals.',
}

export default async function AppDevServicePage() {
  const page = await getPage('app-dev-service').catch(() => null)
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

  const { hero, services, cta, contact } = content['app-dev-service']

  return (
    <div style={{ background: '#ffffff' }}>
      <WebDevHeroBlock     data={hero}     />
      <WebDevServicesBlock data={services} />
      <AppDevCTABlock      data={cta}      />
      <ContactBlock        data={contact}  />
    </div>
  )
}
