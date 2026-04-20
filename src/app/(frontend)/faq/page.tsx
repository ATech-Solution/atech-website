// Page Template : FAQ

import type { Metadata } from 'next'

export const revalidate = 60
import FAQAccordionBlock from '@/components/Blocks/FAQAccordionBlock'
import ContactBlock      from '@/components/Blocks/ContactBlock'
import content from '@/components/language/faq.json'

export const metadata: Metadata = {
  title:       'Frequently Asked Questions — ATech Solutions',
  description:
    'Find answers to common questions about working with ATech Solutions — project timelines, pricing, technologies, support, and more.',
}

export default function FAQPage() {
  const { faq, contact } = content['faq']

  return (
    <div style={{ background: '#ffffff' }}>
      <section className="px-6 md:px-10 pt-16 pb-0" style={{ background: '#ffffff' }}>
        <div className="mx-auto text-center" style={{ maxWidth: '768px' }}>
          <h1
            className="mb-4"
            style={{
              fontFamily:    'var(--font-work-sans, sans-serif)',
              fontSize:      'clamp(2rem, 4vw, 3rem)',
              fontWeight:    400,
              color:         '#000000',
              letterSpacing: '-1.2px',
              lineHeight:    1,
            }}
          >
            Frequently Asked Questions
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '1.125rem',
              color:      '#525252',
              lineHeight: '1.625',
            }}
          >
            Find answers to common questions about working with ATech Solutions.
          </p>
        </div>
      </section>
      <FAQAccordionBlock data={faq}     />
      <ContactBlock      data={contact} />
    </div>
  )
}
