// Page Template : Article Detail

import type { Metadata } from 'next'

export const revalidate = 60
import Link from 'next/link'
import ITConsultingCTABlock from '@/components/Blocks/ITConsultingCTABlock'
import ContactBlock         from '@/components/Blocks/ContactBlock'

export const metadata: Metadata = {
  title:       'The Future of AI in Software Development | ATech Solutions',
  description: 'Explore how artificial intelligence is revolutionizing the way we build software applications and automate development processes in 2025 and beyond.',
}

const CHEVRON = 'https://www.figma.com/api/mcp/asset/9379aa07-e73a-43dc-8529-4afa9b94dcea'

const cta = {
  heading:    'Ready to Leverage AI in Your Project?',
  subheading: 'Let us help you integrate cutting-edge AI solutions into your software development workflow.',
  button:     { label: 'Start Your Project', url: '/static/contact' },
  stats: [
    { value: '150+', label: 'Projects Delivered' },
    { value: '98%',  label: 'Client Satisfaction' },
    { value: '25+',  label: 'Industries Served' },
  ],
}

const contact = {
  heading:    'Get in Touch',
  subheading: "Have a question about this article? We'd love to hear from you.",
  form:  { heading: 'Send us a Message', submitLabel: 'Send Message' },
  info:  { heading: 'Contact Information', email: 'hello@atech.software', phone: '+852 1234 5678', location: 'Hong Kong' },
}

const relatedArticles = [
  {
    category: 'Cloud',
    date:     'March 12, 2025',
    title:    'Building Scalable Cloud Architecture for Enterprise Applications',
    url:      '/static/article-detail',
  },
  {
    category: 'Security',
    date:     'March 8, 2025',
    title:    'Cybersecurity Trends to Watch in 2025',
    url:      '/static/article-detail',
  },
  {
    category: 'Web Dev',
    date:     'March 5, 2025',
    title:    'Next.js 15: What\'s New and Why It Matters',
    url:      '/static/article-detail',
  },
]

import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'

export default async function ArticleDetailPage() {
  const page = await getPage('article-detail').catch(() => null)
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

  return ArticleDetailStatic()
}

function ArticleDetailStatic() {
  return (
    <div style={{ background: '#ffffff' }}>

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-10 py-6" style={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
        <div className="mx-auto flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link href="/"        className="text-sm hover:text-[#171717] transition-colors" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>Home</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CHEVRON} alt="" style={{ width: '7.5px', height: '12px' }} />
          <Link href="/static/insight"  className="text-sm hover:text-[#171717] transition-colors" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>Insights</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CHEVRON} alt="" style={{ width: '7.5px', height: '12px' }} />
          <Link href="/static/article" className="text-sm hover:text-[#171717] transition-colors" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>Our Articles</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CHEVRON} alt="" style={{ width: '7.5px', height: '12px' }} />
          <span className="text-sm" style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>The Future of AI in Software Development</span>
        </div>
      </div>

      {/* ── Article Header ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16" style={{ background: '#ffffff' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

            {/* Main column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Meta */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="px-3 py-1 text-xs"
                  style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)', borderRadius: 0 }}
                >
                  AI/ML
                </span>
                <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>March 15, 2025</span>
                <span style={{ color: '#d4d4d4' }}>·</span>
                <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>12 min read</span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily:    'var(--font-work-sans, sans-serif)',
                  fontSize:      'clamp(1.75rem, 3.5vw, 2.75rem)',
                  fontWeight:    400,
                  color:         '#171717',
                  letterSpacing: '-0.8px',
                  lineHeight:    1.1,
                }}
              >
                The Future of AI in Software Development
              </h1>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {['AI/ML', 'Development', 'Automation'].map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs" style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)', borderRadius: 0 }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hero image */}
              <div className="w-full flex items-center justify-center rounded-xl" style={{ height: '420px', background: '#d4d4d4' }}>
                <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)' }}>AI Development Trends Hero Image</span>
              </div>

              {/* Article body */}
              <div className="flex flex-col gap-6" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', color: '#525252', lineHeight: '1.75', fontSize: '1rem' }}>
                <p>
                  Artificial intelligence has moved from being a futuristic concept to an integral part of modern software development. In 2025, AI-powered tools are transforming how developers write code, debug applications, and optimize performance.
                </p>
                <p>
                  From intelligent code completion to automated testing frameworks, the integration of AI technologies is reshaping the entire software development lifecycle. This article explores the key trends, practical applications, and future implications of AI in development workflows.
                </p>

                <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#171717', marginTop: '8px' }}>
                  Key AI Developments in 2025
                </h2>
                <p>
                  The landscape of AI-powered development tools has expanded significantly. Machine learning models can now predict code patterns, suggest optimizations, and even generate entire functions based on natural language descriptions.
                </p>

                <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#171717', marginTop: '8px' }}>
                  Practical Applications
                </h2>
                <p>
                  The real-world impact of AI in software development extends beyond simple code suggestions. Development teams are leveraging AI to streamline entire workflows, from initial design to deployment and maintenance.
                </p>

                {/* Diagram placeholder */}
                <div className="w-full flex items-center justify-center rounded-xl" style={{ height: '280px', background: '#f5f5f5', border: '1px solid #e5e5e5' }}>
                  <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)' }}>AI Development Workflow Diagram</span>
                </div>

                <p>
                  Organizations implementing AI-powered development tools report significant improvements in code quality, reduced time-to-market, and enhanced developer productivity.
                </p>

                <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#171717', marginTop: '8px' }}>
                  Challenges and Considerations
                </h2>
                <p>
                  While AI brings tremendous benefits to software development, it also presents challenges that teams must address. Understanding these limitations is crucial for effective implementation.
                </p>

                {/* Challenge cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Code Quality Assurance', body: 'AI-generated code requires careful review to ensure it meets quality standards and follows best practices.' },
                    { title: 'Training Data Bias',     body: 'AI models may perpetuate biases present in their training data, requiring ongoing monitoring and adjustment.' },
                    { title: 'Integration Complexity', body: 'Incorporating AI tools into existing workflows requires careful planning and team training.' },
                    { title: 'Security Concerns',      body: 'Organizations must ensure AI tools don\'t inadvertently expose sensitive code or data.' },
                  ].map((card) => (
                    <div key={card.title} className="p-5 rounded-xl" style={{ background: '#f5f5f5' }}>
                      <h3 className="mb-2" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', fontWeight: 500, color: '#171717' }}>{card.title}</h3>
                      <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.6' }}>{card.body}</p>
                    </div>
                  ))}
                </div>

                <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#171717', marginTop: '8px' }}>
                  Looking Ahead
                </h2>
                <p>
                  The future of AI in software development looks promising, with emerging technologies set to further transform the industry. Natural language processing capabilities are expected to improve dramatically, enabling more intuitive interactions between developers and AI assistants.
                </p>
                <p>
                  As AI technology continues to evolve, we can expect to see more sophisticated tools that understand context, learn from team-specific patterns, and adapt to individual coding styles. The key to success will be finding the right balance between AI automation and human creativity.
                </p>

                {/* Key takeaways */}
                <div className="p-6 rounded-xl" style={{ background: '#171717' }}>
                  <h3 className="mb-4" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', fontWeight: 400, color: '#ffffff' }}>
                    Key Takeaways
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {[
                      'AI is transforming software development through code generation, testing, and optimization',
                      '78% of development teams now use AI-assisted coding tools',
                      'Organizations report 40% reduction in development time with AI tools',
                      'Challenges include code quality assurance and integration complexity',
                      'The future promises more sophisticated, context-aware AI development tools',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#a3a3a3', lineHeight: '1.6' }}>
                        <span style={{ color: '#ffcd37', flexShrink: 0, marginTop: '2px' }}>→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Views */}
                <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid #e5e5e5' }}>
                  <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>2,847 views</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Browse by category */}
              <div className="p-6 rounded-xl" style={{ background: '#f5f5f5' }}>
                <h3 className="mb-4" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', fontWeight: 400, color: '#171717' }}>
                  Browse by Category
                </h3>
                <p className="mb-4" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem', color: '#737373' }}>
                  Explore articles organized by technology and topic
                </p>
                <div className="flex flex-wrap gap-2">
                  {['All Articles', 'AI/ML', 'Cloud Computing', 'Security', 'Mobile Development', 'DevOps', 'Design', 'Web Development', 'Data Science'].map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 text-xs cursor-pointer transition-colors hover:bg-[#171717] hover:text-white"
                      style={{ background: '#ffffff', border: '1px solid #e5e5e5', color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)', borderRadius: 0 }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related articles */}
              <div className="p-6 rounded-xl" style={{ background: '#f5f5f5' }}>
                <h3 className="mb-4" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', fontWeight: 400, color: '#171717' }}>
                  Related Articles
                </h3>
                <div className="flex flex-col gap-4">
                  {relatedArticles.map((article) => (
                    <Link key={article.title} href={article.url} className="flex flex-col gap-1 hover:opacity-70 transition-opacity">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs" style={{ background: '#ffffff', border: '1px solid #e5e5e5', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)', borderRadius: 0 }}>
                          {article.category}
                        </span>
                        <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.625rem' }}>
                          {article.date}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717', lineHeight: '1.4' }}>
                        {article.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ITConsultingCTABlock data={cta}     />
      <ContactBlock         data={contact} />
    </div>
  )
}
