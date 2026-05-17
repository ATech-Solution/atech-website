// Page Template : IT Consulting
// Strategic IT Consulting service page — What we do / Strategic IT consulting
// Figma node: 1:27375

import type { Metadata } from 'next'

export const revalidate = 60
import {
  ITConsultingHeroBlock,
  WebDevServicesBlock,
  WebDevProcessBlock,
  ITConsultingCTABlock,
  ContactBlock,
} from '@/components/Blocks'
import content from '@/components/language/it-consulting.json'
import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export const metadata: Metadata = {
  title:       'Strategic IT Consulting Services',
  description:
    'Navigate complex technology decisions with confidence. Our expert consultants provide strategic guidance to optimize your IT infrastructure, accelerate digital transformation, and drive business growth.',
}

export default async function ITConsultingPage() {
  const page = await getPage('it-consulting').catch(() => null)
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

  const { hero, services, process, cta, contact } = content['it-consulting']

  return (
    <div style={{ background: '#ffffff' }}>
      <ITConsultingHeroBlock data={hero}     />
      <WebDevServicesBlock   data={services} />
      <WebDevProcessBlock    data={process}  />
      <ITConsultingCTABlock  data={cta}      />
      <ContactBlock          data={contact}  />
    </div>
  )
}
