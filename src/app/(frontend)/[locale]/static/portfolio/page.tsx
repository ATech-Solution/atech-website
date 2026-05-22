// Page Template : Portfolio

import type { Metadata } from 'next'

export const revalidate = 60
import PortfolioHeroBlock   from '@/components/Blocks/PortfolioHeroBlock'
import PortfolioGridBlock   from '@/components/Blocks/PortfolioGridBlock'
import ITConsultingCTABlock from '@/components/Blocks/ITConsultingCTABlock'
import ContactBlock         from '@/components/Blocks/ContactBlock'
import content from '@/components/language/portfolio.json'
import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export const metadata: Metadata = {
  title:       'Portfolio — Our Work | ATech Solutions',
  description:
    'Explore ATech Solutions portfolio of 150+ successful projects across FinTech, HealthTech, EdTech, E-commerce, SaaS, and more.',
}

export default async function PortfolioPage() {
  const page = await getPage('portfolio').catch(() => null)
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

  const { hero, projects, cta, contact } = content['portfolio']

  return (
    <div style={{ background: '#ffffff' }}>
      <PortfolioHeroBlock  data={hero}     />
      <PortfolioGridBlock  data={projects} />
      <ITConsultingCTABlock data={cta}     />
      <ContactBlock        data={contact}  />
    </div>
  )
}
