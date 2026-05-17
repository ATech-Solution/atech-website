// Page Template : About Us

import type { Metadata } from 'next'

export const revalidate = 60
import AboutHeroBlock          from '@/components/Blocks/AboutHeroBlock'
import AboutCompanyBlock       from '@/components/Blocks/AboutCompanyBlock'
import AboutMissionVisionBlock from '@/components/Blocks/AboutMissionVisionBlock'
import AboutLeadershipBlock    from '@/components/Blocks/AboutLeadershipBlock'
import FAQAccordionBlock       from '@/components/Blocks/FAQAccordionBlock'
import ContactBlock            from '@/components/Blocks/ContactBlock'
import content from '@/components/language/about-us.json'
import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export const metadata: Metadata = {
  title:       'About ATech Solutions',
  description:
    'We are a global software development company dedicated to transforming innovative ideas into market-leading digital solutions that drive business growth and success.',
}

export default async function AboutUsPage() {
  const page = await getPage('about-us').catch(() => null)
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

  const { hero, company, mission, leadership, faq, contact } = content['about-us']

  return (
    <div style={{ background: '#ffffff' }}>
      <AboutHeroBlock          data={hero}        />
      <AboutCompanyBlock       data={company}     />
      <AboutMissionVisionBlock data={mission}     />
      <AboutLeadershipBlock    data={leadership}  />
      <FAQAccordionBlock       data={faq}         />
      <ContactBlock            data={contact}     />
    </div>
  )
}
