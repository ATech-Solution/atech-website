// Page Template : Who We Serve

import type { Metadata } from 'next'

export const revalidate = 60
import WhoWeServeHeroBlock     from '@/components/Blocks/WhoWeServeHeroBlock'
import WhoWeServeStartupsBlock from '@/components/Blocks/WhoWeServeStartupsBlock'
import WhoWeServeWhyUsBlock    from '@/components/Blocks/WhoWeServeWhyUsBlock'
import ITConsultingCTABlock    from '@/components/Blocks/ITConsultingCTABlock'
import ContactBlock            from '@/components/Blocks/ContactBlock'
import content from '@/components/language/who-we-serve.json'
import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export const metadata: Metadata = {
  title:       'Who We Serve — Technology Partner for Ambitious Startups',
  description:
    'From MVP to scale, we empower startups with agile development, strategic tech guidance, and flexible solutions that grow with your vision.',
}

export default async function WhoWeServePage() {
  const page = await getPage('who-we-serve').catch(() => null)
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

  const { hero, industries, whyUs, cta, contact } = content['who-we-serve']

  const heroData  = { ...hero, stat: { value: '500+', label: 'Projects Delivered' } }
  const whyUsData = { heading: whyUs.heading, items: whyUs.pillars }

  return (
    <div style={{ background: '#ffffff' }}>
      <WhoWeServeHeroBlock     data={heroData}    />
      <WhoWeServeStartupsBlock data={industries}  />
      <WhoWeServeWhyUsBlock    data={whyUsData}   />
      <ITConsultingCTABlock    data={cta}         />
      <ContactBlock            data={contact}     />
    </div>
  )
}
