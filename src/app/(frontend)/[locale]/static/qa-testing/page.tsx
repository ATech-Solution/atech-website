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
import en from '@/components/language/qa-testing.json'
import zhHk from '@/components/language/qa-testing.zh-hk.json'
import zhCn from '@/components/language/qa-testing.zh-cn.json'
import id from '@/components/language/qa-testing.id.json'

export const metadata: Metadata = {
  title:       'QA Testing Services',
  description:
    'Ensure flawless software performance with our rigorous automated and manual testing protocols. Comprehensive QA solutions that guarantee your applications meet the highest quality standards.',
}

// Per-locale content; falls back to English when a locale has no translation.
const dictionaries = {
  'en':    en,
  'zh-hk': zhHk,
  'zh-cn': zhCn,
  'id':    id,
} as const

export default async function QATestingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const content = dictionaries[locale as keyof typeof dictionaries] ?? en
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
