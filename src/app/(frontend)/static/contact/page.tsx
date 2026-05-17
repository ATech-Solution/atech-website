// Page Template : Contact

import type { Metadata } from 'next'

export const revalidate = 60
import ContactHeroBlock      from '@/components/Blocks/ContactHeroBlock'
import ContactStatsBlock     from '@/components/Blocks/ContactStatsBlock'
import ContactLocationsBlock from '@/components/Blocks/ContactLocationsBlock'
import ContactBlock          from '@/components/Blocks/ContactBlock'
import content from '@/components/language/contact.json'

export const metadata: Metadata = {
  title:       'Contact Us — Get in Touch | ATech Solutions',
  description: 'Have a project in mind? Contact ATech Solutions today. Our team of experts is ready to help you build powerful digital solutions.',
}

import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export default async function ContactPage() {
  const page = await getPage('contact').catch(() => null)
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

  const { hero, stats, locations, form } = content['contact']

  const contactBlockData = {
    heading:    form.heading,
    subheading: form.subheading,
    form:       { heading: form.heading, submitLabel: form.submitLabel },
    info:       {
      heading:  'Contact Information',
      email:    'hello@atech.software',
      phone:    '+852 1234 5678',
      location: 'Hong Kong',
    },
  }

  return (
    <div style={{ background: '#ffffff' }}>
      <ContactHeroBlock      data={hero}            />
      <ContactStatsBlock     data={stats}           />
      <ContactLocationsBlock data={locations}       />
      <ContactBlock          data={contactBlockData} />
    </div>
  )
}
