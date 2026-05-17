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

import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export default async function ArticlePage() {
  const page = await getPage('article').catch(() => null)
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
