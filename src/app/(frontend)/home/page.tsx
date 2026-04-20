// Page Template : Home

import type { Metadata } from 'next'
import { getPage, getTheme, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'
import {
  HeroBlock,
  AboutBlock,
  ServicesBlock,
  TestimonialsBlock,
  ContactBlock,
} from '@/components/Blocks'
import en from '@/components/language/home.json'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [page, theme] = await Promise.all([
    getPage('home').catch(() => null),
    getTheme(),
  ])
  return {
    title:
      (page?.meta as any)?.title ??
      (theme as any)?.siteName ??
      'ATech Solutions — Engineering the Future',
    description:
      (page?.meta as any)?.description ??
      'We build robust, scalable, and intelligent software solutions for startups and enterprises.',
  }
}

export default async function HomePage() {
  const [page] = await Promise.all([
    getPage('home').catch(() => null),
    getTheme(),
  ])

  // ── Layout Builder path: if the home page has layout-builder content, render it
  const layoutTree: any[] = Array.isArray((page as any)?.layoutBuilder)
    ? (page as any).layoutBuilder
    : []

  if (layoutTree.length > 0) {
    const blockIds  = collectBlockIds(layoutTree)
    const templates = await getBlockTemplates(blockIds)
    return (
      <div style={{ background: 'var(--color-bg, #292929)', color: 'var(--color-text, #fafafa)' }}>
        {layoutTree.map((node: any) => (
          <LayoutBlockRenderer key={node.id} node={node} templates={templates} />
        ))}
      </div>
    )
  }

  // ── Figma-driven static sections (fallback when no layout-builder content)
  const { hero, about, services, testimonials, contact } = en.home

  return (
    <div style={{ background: 'var(--color-bg, #292929)', color: 'var(--color-text, #fafafa)' }}>
      <HeroBlock         data={hero}         />
      <AboutBlock        data={about}        />
      <ServicesBlock     data={services}     />
      <TestimonialsBlock data={testimonials} />
      <ContactBlock      data={contact}      />
    </div>
  )
}
