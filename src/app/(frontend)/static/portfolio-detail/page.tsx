// Page Template : Portfolio Detail

import type { Metadata } from 'next'

export const revalidate = 60
import Link from 'next/link'
import ITConsultingCTABlock from '@/components/Blocks/ITConsultingCTABlock'
import ContactBlock         from '@/components/Blocks/ContactBlock'

export const metadata: Metadata = {
  title:       'Case Study — Portfolio | ATech Solutions',
  description: 'Detailed case study showcasing the problem, solution, and results delivered by ATech Solutions.',
}

const cta = {
  heading:    'Ready to Build Your Success Story?',
  subheading: 'Let us create a solution that transforms your business.',
  button:     { label: 'Start Your Project', url: '/static/contact' },
  stats: [
    { value: '150+', label: 'Projects Delivered' },
    { value: '98%',  label: 'Client Satisfaction' },
    { value: '25+',  label: 'Industries Served' },
  ],
}

const contact = {
  heading:    'Get in Touch',
  subheading: "Ready to start your next project? Let's discuss how we can help.",
  form:  { heading: 'Send us a Message', submitLabel: 'Send Message' },
  info:  { heading: 'Contact Information', email: 'hello@atech.software', phone: '+852 1234 5678', location: 'Hong Kong' },
}

import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export default async function PortfolioDetailPage() {
  const page = await getPage('portfolio-detail').catch(() => null)
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

  return PortfolioDetailStatic()
}

function PortfolioDetailStatic() {
  return (
    <div style={{ background: '#ffffff' }}>
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-10 py-6" style={{ background: '#ffffff', borderBottom: '1px solid #e5e5e5' }}>
        <div className="mx-auto flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link href="/" className="text-sm hover:text-[#171717] transition-colors" style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)' }}>Home</Link>
          <span style={{ color: '#d4d4d4', fontSize: '0.75rem' }}>›</span>
          <Link href="/static/portfolio" className="text-sm hover:text-[#171717] transition-colors" style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)' }}>Portfolio</Link>
          <span style={{ color: '#d4d4d4', fontSize: '0.75rem' }}>›</span>
          <span className="text-sm" style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>Case Study</span>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24" style={{ background: '#ffffff' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="flex flex-col gap-4 mb-10 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs" style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                FinTech
              </span>
              <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>Mobile App</span>
            </div>
            <h1
              style={{
                fontFamily:    'var(--font-work-sans, sans-serif)',
                fontSize:      'clamp(2rem, 4vw, 3rem)',
                fontWeight:    400,
                color:         '#171717',
                letterSpacing: '-1.2px',
                lineHeight:    1.1,
              }}
            >
              PayFlow Banking
            </h1>
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.625' }}>
              Next-generation mobile banking platform with AI-powered insights and seamless transactions.
            </p>
          </div>

          {/* Image placeholder */}
          <div className="w-full rounded-xl flex items-center justify-center mb-16" style={{ height: '480px', background: '#e5e5e5' }}>
            <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)' }}>Project Screenshot</span>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              <div>
                <h2 className="mb-4" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#171717' }}>
                  The Challenge
                </h2>
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', color: '#525252', lineHeight: '1.75', fontSize: '1rem' }}>
                  Our client needed a modern mobile banking platform that could handle millions of daily transactions while providing an intuitive experience for users of all technical levels. Legacy systems were creating friction and preventing growth.
                </p>
              </div>
              <div>
                <h2 className="mb-4" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#171717' }}>
                  Our Solution
                </h2>
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', color: '#525252', lineHeight: '1.75', fontSize: '1rem' }}>
                  We designed and built a React Native application with a robust Node.js backend, implementing real-time transaction processing, AI-powered spending insights, biometric authentication, and seamless integration with existing banking infrastructure.
                </p>
              </div>
              <div>
                <h2 className="mb-4" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#171717' }}>
                  Results
                </h2>
                <div className="grid grid-cols-3 gap-6 mt-6">
                  {[
                    { value: '2M+', label: 'Active Users' },
                    { value: '99.9%', label: 'Uptime' },
                    { value: '4.8★', label: 'App Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center p-6 rounded-xl" style={{ background: '#f5f5f5' }}>
                      <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.875rem', fontWeight: 400, color: '#171717' }}>{stat.value}</span>
                      <span className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem', color: '#737373' }}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-xl" style={{ background: '#f5f5f5' }}>
                <h3 className="mb-4" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', fontWeight: 400, color: '#171717' }}>
                  Project Details
                </h3>
                {[
                  { label: 'Client', value: 'PayFlow Inc.' },
                  { label: 'Timeline', value: '6 months' },
                  { label: 'Team Size', value: '8 engineers' },
                  { label: 'Platform', value: 'iOS & Android' },
                ].map((detail) => (
                  <div key={detail.label} className="flex flex-col mb-3">
                    <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      {detail.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717' }}>
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#f5f5f5' }}>
                <h3 className="mb-4" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', fontWeight: 400, color: '#171717' }}>
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Plaid API'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs"
                      style={{ background: '#ffffff', border: '1px solid #e5e5e5', color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ITConsultingCTABlock data={cta}     />
      <ContactBlock        data={contact}  />
    </div>
  )
}
