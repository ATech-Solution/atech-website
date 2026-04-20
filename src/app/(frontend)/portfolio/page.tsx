// Page Template : Portfolio

import type { Metadata } from 'next'

export const revalidate = 60
import PortfolioHeroBlock  from '@/components/Blocks/PortfolioHeroBlock'
import PortfolioGridBlock  from '@/components/Blocks/PortfolioGridBlock'
import ITConsultingCTABlock from '@/components/Blocks/ITConsultingCTABlock'
import ContactBlock        from '@/components/Blocks/ContactBlock'
import content from '@/components/language/portfolio.json'

export const metadata: Metadata = {
  title:       'Portfolio — Our Work | ATech Solutions',
  description:
    'Explore ATech Solutions portfolio of 150+ successful projects across FinTech, HealthTech, EdTech, E-commerce, SaaS, and more.',
}

export default function PortfolioPage() {
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
