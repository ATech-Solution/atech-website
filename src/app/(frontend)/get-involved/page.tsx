// Page Template : Get Involved

import type { Metadata } from 'next'

export const revalidate = 60
import GetInvolvedHeroBlock    from '@/components/Blocks/GetInvolvedHeroBlock'
import GetInvolvedQuoteBlock   from '@/components/Blocks/GetInvolvedQuoteBlock'
import GetInvolvedJobsBlock    from '@/components/Blocks/GetInvolvedJobsBlock'
import GetInvolvedCultureBlock from '@/components/Blocks/GetInvolvedCultureBlock'
import GetInvolvedCTABlock     from '@/components/Blocks/GetInvolvedCTABlock'
import content from '@/components/language/get-involved.json'

export const metadata: Metadata = {
  title:       'Get Involved — Partner, Work & Collaborate | ATech Solutions',
  description: 'Join ATech Solutions as a partner, team member, or collaborator. Get a custom quote, explore job openings, and be part of our growing community.',
}

export default function GetInvolvedPage() {
  const { hero, quote, jobs, culture, cta } = content['getInvolved']

  return (
    <div style={{ background: '#ffffff' }}>
      <GetInvolvedHeroBlock    data={hero}    />
      <GetInvolvedQuoteBlock   data={quote}   />
      <GetInvolvedJobsBlock    data={jobs}    />
      <GetInvolvedCultureBlock data={culture} />
      <GetInvolvedCTABlock     data={cta}     />
    </div>
  )
}
