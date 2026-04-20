// Page Template : Article

import type { Metadata } from 'next'

export const revalidate = 60
import ArticleHeroBlock     from '@/components/Blocks/ArticleHeroBlock'
import ArticleFeaturedBlock from '@/components/Blocks/ArticleFeaturedBlock'
import ArticleGridBlock     from '@/components/Blocks/ArticleGridBlock'
import ITConsultingCTABlock from '@/components/Blocks/ITConsultingCTABlock'
import ContactBlock         from '@/components/Blocks/ContactBlock'
import content from '@/components/language/article.json'

export const metadata: Metadata = {
  title:       'Our Articles — Tech Insights | ATech Solutions',
  description: 'Expert perspectives on software development, digital transformation, and emerging technologies shaping the future of business.',
}

export default function ArticlePage() {
  const { hero, featured, articles, cta, contact } = content['article']

  return (
    <div style={{ background: '#ffffff' }}>
      <ArticleHeroBlock     data={hero}     />
      <ArticleFeaturedBlock data={featured} />
      <ArticleGridBlock     data={articles} />
      <ITConsultingCTABlock data={cta}      />
      <ContactBlock         data={contact}  />
    </div>
  )
}
