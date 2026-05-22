// Page Template : HR Recruitment

import type { Metadata } from 'next'

export const revalidate = 60
import HRRecruitHeroBlock      from '@/components/Blocks/HRRecruitHeroBlock'
import HRRecruitServicesBlock  from '@/components/Blocks/HRRecruitServicesBlock'
import HRRecruitExpertiseBlock from '@/components/Blocks/HRRecruitExpertiseBlock'
import ITConsultingCTABlock    from '@/components/Blocks/ITConsultingCTABlock'
import ContactBlock            from '@/components/Blocks/ContactBlock'
import content from '@/components/language/hr-recruitment.json'
import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export const metadata: Metadata = {
  title:       'HR Recruitment & Staff Augmentation Services',
  description:
    'Connect with top-tier talent and scale your team with precision. Our HR recruitment and staff augmentation services deliver the right professionals exactly when you need them.',
}

export default async function HRRecruitmentPage() {
  const page = await getPage('hr-recruitment').catch(() => null)
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

  const { hero, services, expertise, cta, contact } = content['hr-recruitment']

  return (
    <div style={{ background: '#ffffff' }}>
      <HRRecruitHeroBlock      data={hero}      />
      <HRRecruitServicesBlock  data={services}  />
      <ITConsultingCTABlock    data={cta}        />
      <HRRecruitExpertiseBlock data={expertise} />
      <ContactBlock            data={contact}   />
    </div>
  )
}
