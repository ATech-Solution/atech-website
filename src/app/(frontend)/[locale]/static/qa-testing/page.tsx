// Page Template : QA Testing Services
// QA Testing service page — What we do / QA Testing
// Figma node: 1:26808

import type { Metadata } from 'next'

export const revalidate = 60
import {
  QAHeroBlock,
  QAServicesBlock,
  QAProcessBlock,
  QACaseStudyBlock,
  QACTABlock,
  ContactBlock,
} from '@/components/Blocks'
import content from '@/components/language/qa-testing.json'

export const metadata: Metadata = {
  title:       'QA Testing Services',
  description:
    'Ensure flawless software performance with our rigorous automated and manual testing protocols. Comprehensive QA solutions that guarantee your applications meet the highest quality standards.',
}

export default function QATestingPage() {
  const { hero, services, process, caseStudy, cta, contact } = content['qa-testing']

  return (
    <div style={{ background: '#ffffff' }}>
      <QAHeroBlock        data={hero}        />
      <QAServicesBlock    data={services}    />
      <QAProcessBlock     data={process}     />
      <QACaseStudyBlock   data={caseStudy}   />
      <QACTABlock         data={cta}         />
      <ContactBlock       data={contact}     />
    </div>
  )
}
