// Page Template : Get Involved Community

import type { Metadata } from 'next'

export const revalidate = 60
import CommunityHeroBlock      from '@/components/Blocks/CommunityHeroBlock'
import CommunityChannelsBlock  from '@/components/Blocks/CommunityChannelsBlock'
import CommunityAmbassadorBlock from '@/components/Blocks/CommunityAmbassadorBlock'
import CommunityProgramsBlock  from '@/components/Blocks/CommunityProgramsBlock'
import content from '@/components/language/get-involved-community.json'

export const metadata: Metadata = {
  title:       'Community — Get Involved | ATech Solutions',
  description: 'Join the ATech Solutions community. Contribute to open source, join our Discord, attend events, become an ambassador, or participate in our mentorship program.',
}

import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export default async function GetInvolvedCommunityPage() {
  const page = await getPage('get-involved-community').catch(() => null)
  const layoutTree: any[] = Array.isArray((page as any)?.layoutBuilder)
    ? (page as any).layoutBuilder
    : []

  if (layoutTree.length > 0) {
    const blockIds  = collectBlockIds(layoutTree)
    const templates = await getBlockTemplates(blockIds)
    return (
      <div style={{ background: '#171717' }}>
        {layoutTree.map((node: any) => (
          <LayoutBlockRenderer key={node.id} node={node} templates={templates} />
        ))}
      </div>
    )
  }

  const { hero, channels, ambassador, programs } = content['getInvolvedCommunity']

  return (
    <div style={{ background: '#171717' }}>
      <CommunityHeroBlock       data={hero}        />
      <CommunityChannelsBlock   data={{ channels }} />
      <CommunityAmbassadorBlock data={ambassador}  />
      <CommunityProgramsBlock   data={{ programs }} />
    </div>
  )
}
