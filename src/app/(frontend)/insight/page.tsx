// Page Template : Insight

import type { Metadata } from 'next'

export const revalidate = 60
import InsightHeroBlock      from '@/components/Blocks/InsightHeroBlock'
import InsightArticlesBlock  from '@/components/Blocks/InsightArticlesBlock'
import ITConsultingCTABlock  from '@/components/Blocks/ITConsultingCTABlock'
import ContactBlock          from '@/components/Blocks/ContactBlock'
import content from '@/components/language/insight.json'

export const metadata: Metadata = {
  title:       'Insights — Tech Trends & Articles | ATech Solutions',
  description: 'Stay ahead with ATech Solutions\' latest insights on technology trends, development best practices, and industry innovations.',
}

export default function InsightPage() {
  const { hero, articles, cta, contact } = content['insight']

  return (
    <div style={{ background: '#ffffff' }}>
      <InsightHeroBlock     data={hero}     />
      <InsightArticlesBlock data={articles} />
      <ITConsultingCTABlock data={cta}      />
      <ContactBlock         data={contact}  />
    </div>
  )
}
