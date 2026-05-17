import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFrontpage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFrontpage()
  if (!page) return {}
  return {
    title: (page?.meta as any)?.title ?? page.title,
    description: (page?.meta as any)?.description ?? undefined,
  }
}

export default async function RootPage() {
  const page = await getFrontpage()

  if (!page) notFound()

  const layoutBuilderTree: any[] = Array.isArray((page as any).layoutBuilder)
    ? (page as any).layoutBuilder
    : []

  const blockIds  = collectBlockIds(layoutBuilderTree)
  const templates = await getBlockTemplates(blockIds)

  return (
    <>
      {layoutBuilderTree.length > 0 ? (
        layoutBuilderTree.map((node: any) => (
          <LayoutBlockRenderer key={node.id} node={node} templates={templates} />
        ))
      ) : (
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h1>{page.title}</h1>
          <p style={{ opacity: 0.5, marginTop: 8 }}>No layout blocks yet.</p>
        </section>
      )}
    </>
  )
}
