// Page Template : Article Item

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostItem, getArticleTemplatePage } from '@/lib/payload'
import { getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export const revalidate = 60

type Props = { params: Promise<{ slug: string; locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const item = await getPostItem(slug, locale)
  if (!item) return {}
  return {
    title: `${item.title} | ATech Solutions`,
    description: item.excerpt ?? undefined,
  }
}

export default async function ArticleItemPage({ params }: Props) {
  const { slug, locale } = await params
  const [item, templatePage] = await Promise.all([
    getPostItem(slug, locale),
    getArticleTemplatePage(locale),
  ])

  if (!item) notFound()

  const layoutTree: any[] = Array.isArray(templatePage?.layoutBuilder)
    ? templatePage.layoutBuilder
    : []

  if (layoutTree.length > 0) {
    const blockIds  = collectBlockIds(layoutTree)
    const templates = await getBlockTemplates(blockIds, locale)
    return (
      <div style={{ background: '#ffffff' }}>
        {layoutTree.map((node: any) => (
          <LayoutBlockRenderer key={node.id} node={node} templates={templates} articleItem={item} />
        ))}
      </div>
    )
  }

  // No template page designated yet — blank page
  return <div style={{ background: '#ffffff', minHeight: '60vh' }} />
}
