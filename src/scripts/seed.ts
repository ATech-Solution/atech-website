/**
 * Seed script — populates Payload with default content.
 * Run: npm run seed
 */
import { getPayload } from 'payload'
import config from '../payload.config'

// ─────────────────────────────────────────────────────────────────────────────
// Legacy layout blocks (original blocks field — kept for backwards compat)
// ─────────────────────────────────────────────────────────────────────────────

const homeLayout = [
  {
    blockType: 'hero' as const,
    heading: 'Build Software That Scales Your Business Forward',
    subheading:
      'We build robust, scalable, and intelligent software solutions for startups and enterprises.',
    ctaLabel: 'Explore Services',
    ctaUrl: '/services',
  },
]

const aboutLayout = [
  {
    blockType: 'hero' as const,
    heading: 'About Us',
    subheading:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ctaLabel: 'Contact Us',
    ctaUrl: '/',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Homepage Layout Builder tree — typed blocks (no raw HTML)
// ─────────────────────────────────────────────────────────────────────────────

const homepageLayoutBuilder = [
  // ── Hero ────────────────────────────────────────────────────────────────────
  {
    id: 'lb-home-hero-001',
    blockType: 'hero-section',
    name: 'Hero Section',
    order: 0,
    children: [],
    overrides: {
      content: {
        htmlContent: 'Welcome to ATech Solutions',
        title: 'Build Software That Scales Your Business Forward',
        subtitle: 'We build robust, scalable, and intelligent software solutions for startups and enterprises. Elevate your technological capabilities with our expert engineering teams.',
        buttonLabel: 'Explore Services',
        buttonUrl: '/services',
        items: [
          { label: 'Get in Touch', url: '/contact' },           // secondary CTA (no value = not a stat)
          { label: 'Projects Delivered', value: '250+' },
          { label: 'Client Retention',   value: '98%'  },
          { label: 'Years Experience',   value: '10+'  },
        ],
      },
    },
  },

  // ── About — container → heading + grid of icon-boxes ────────────────────────
  {
    id: 'lb-home-about-001',
    blockType: 'container',
    name: 'About Section',
    order: 1,
    children: [
      {
        id: 'lb-home-about-heading-001',
        blockType: 'heading',
        name: 'About Heading',
        order: 0,
        children: [],
        overrides: {
          content: {
            title: 'About ATech Solutions',
            subtitle: 'We are a leading technology company specialising in custom software development, quality assurance, and IT consulting services for businesses of all sizes.',
          },
          style: { textAlign: 'center' },
        },
      },
      {
        id: 'lb-home-about-grid-001',
        blockType: 'grid',
        name: 'Pillars Grid',
        order: 1,
        children: [
          {
            id: 'lb-home-pillar-1',
            blockType: 'icon-box',
            name: 'Innovation',
            order: 0,
            children: [],
            overrides: {
              content: {
                iconName: '💡',
                title: 'Innovation',
                subtitle: 'Cutting-edge solutions using the latest technologies and industry best practices to keep you ahead of the curve.',
              },
            },
          },
          {
            id: 'lb-home-pillar-2',
            blockType: 'icon-box',
            name: 'Expertise',
            order: 1,
            children: [],
            overrides: {
              content: {
                iconName: '⭐',
                title: 'Expertise',
                subtitle: 'An experienced team of developers, designers, and consultants dedicated to delivering exceptional outcomes.',
              },
            },
          },
          {
            id: 'lb-home-pillar-3',
            blockType: 'icon-box',
            name: 'Partnership',
            order: 2,
            children: [],
            overrides: {
              content: {
                iconName: '🤝',
                title: 'Partnership',
                subtitle: 'Long-term relationships built on trust, transparency, and a consistent track record of exceptional results.',
              },
            },
          },
        ],
        overrides: { content: { columns: '3' } },
      },
    ],
    overrides: {
      style: { backgroundColor: 'var(--color-bg,#292929)' },
      advanced: { paddingTop: '96px', paddingBottom: '96px', paddingLeft: '40px', paddingRight: '40px' },
    },
  },

  // ── Services ─────────────────────────────────────────────────────────────────
  {
    id: 'lb-home-services-001',
    blockType: 'services-section',
    name: 'Services Section',
    order: 2,
    children: [],
    overrides: {
      content: {
        title: 'Our Services',
        subtitle: 'Comprehensive technology solutions tailored to your business needs.',
        htmlContent: 'Need a Custom Solution?',
        buttonLabel: 'Chat with us',
        buttonUrl: '/contact',
        items: [
          { icon: '✓',   label: 'QA Testing Services',  content: 'Comprehensive testing for quality and reliability.',    url: '/services/qa-testing'     },
          { icon: '🌐',  label: 'Web Development',       content: 'Custom web apps with modern frameworks.',              url: '/services/web-development' },
          { icon: '📱',  label: 'App Development',       content: 'Native and cross-platform mobile apps.',               url: '/services/app-development' },
          { icon: '👥',  label: 'HR Recruitment',        content: 'Staff augmentation and dedicated teams.',              url: '/services/hr-recruitment'  },
          { icon: '🏗',  label: 'IT Consultancy',        content: 'Strategic tech guidance and transformation.',          url: '/services/it-consultancy'  },
          { icon: '</>',  label: 'Product Development',  content: 'Design and develop scalable digital products.',        url: '/contact'                  },
        ],
      },
    },
  },

  // ── Testimonials ─────────────────────────────────────────────────────────────
  {
    id: 'lb-home-testimonials-001',
    blockType: 'testimonials-section',
    name: 'Testimonials Section',
    order: 3,
    children: [],
    overrides: {
      content: {
        title: 'Client Testimonials',
        subtitle: 'What our clients say about working with us.',
        items: [
          { label: 'John Smith',    value: 'CEO, TechCorp',      content: 'ATech Solutions delivered exceptional results on our web platform. Their team is professional and highly skilled.'  },
          { label: 'Sarah Johnson', value: 'CTO, StartupX',      content: 'The mobile app they developed exceeded our expectations. Great communication and timely delivery.'                  },
          { label: 'Mike Chen',     value: 'Director, Enterprise Inc', content: 'Outstanding IT consulting services. They helped us modernise our entire technology infrastructure.'            },
        ],
      },
    },
  },

  // ── Contact ──────────────────────────────────────────────────────────────────
  {
    id: 'lb-home-contact-001',
    blockType: 'contact-section',
    name: 'Contact Section',
    order: 4,
    children: [],
    overrides: {
      content: {
        title: 'Get in Touch',
        subtitle: "Ready to start your next project? Let's discuss how we can help.",
        buttonLabel: 'Start a Project',
        buttonUrl: '/contact',
        items: [
          { icon: '📧', label: 'Email',    content: 'hello@atech.software', url: 'mailto:hello@atech.software' },
          { icon: '📞', label: 'Phone',    content: '+852 1234 5678',         url: 'tel:+85212345678'           },
          { icon: '📍', label: 'Location', content: 'Central, Hong Kong'                                        },
        ],
      },
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Services page Layout Builder tree
// ─────────────────────────────────────────────────────────────────────────────

const servicesLayoutBuilder = [
  {
    id: 'lb-services-hero-001',
    blockType: 'hero-section',
    name: 'Services Hero',
    order: 0,
    children: [],
    overrides: {
      content: {
        htmlContent: 'What We Do',
        title: 'Our Services',
        subtitle: 'Comprehensive technology solutions tailored to your business needs. We partner with startups and enterprises to deliver results that matter.',
        buttonLabel: 'Get in Touch',
        buttonUrl: '/contact',
        items: [],
      },
    },
  },
  {
    id: 'lb-services-grid-001',
    blockType: 'services-section',
    name: 'Services Grid',
    order: 1,
    children: [],
    overrides: {
      content: {
        title: 'Everything You Need',
        subtitle: 'From ideation to deployment — we cover the full technology lifecycle.',
        htmlContent: 'Need a Custom Solution?',
        buttonLabel: 'Chat with us',
        buttonUrl: '/contact',
        items: [
          { icon: '✓',   label: 'QA Testing Services',  content: 'Comprehensive testing strategies for web, mobile, and API — ensuring your product ships with confidence.',       url: '/services/qa-testing'     },
          { icon: '🌐',  label: 'Web Development',       content: 'Modern, performant web applications built with React, Next.js, and cloud-native architectures.',               url: '/services/web-development' },
          { icon: '📱',  label: 'App Development',       content: 'Native iOS, Android, and cross-platform mobile apps crafted for exceptional user experiences.',                url: '/services/app-development' },
          { icon: '👥',  label: 'HR Recruitment',        content: 'Dedicated engineering teams, staff augmentation, and technical talent sourcing for your exact needs.',        url: '/services/hr-recruitment'  },
          { icon: '🏗',  label: 'IT Consultancy',        content: 'Strategic technology guidance, architecture reviews, and digital transformation roadmaps.',                   url: '/services/it-consultancy'  },
          { icon: '</>',  label: 'Product Development',  content: 'End-to-end product design and engineering — from MVP through scale — with your vision at the centre.',       url: '/contact'                  },
        ],
      },
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function upsertPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  title: string,
  layout: typeof homeLayout,
  layoutBuilder?: any[],
) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    overrideAccess: true,
    draft: true,
  })

  const data: any = { title, slug, status: 'published', layout }
  if (layoutBuilder) data.layoutBuilder = layoutBuilder

  if (existing.totalDocs > 0) {
    const id = existing.docs[0].id
    await payload.update({
      collection: 'pages',
      id,
      overrideAccess: true,
      data,
    })
    console.log(`Page "${slug}" updated → published.`)
  } else {
    await payload.create({
      collection: 'pages',
      overrideAccess: true,
      data,
    })
    console.log(`Page "${slug}" created → published.`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed entry point
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding navigation global…')
  await payload.updateGlobal({
    slug: 'navigation',
    overrideAccess: true,
    data: {
      siteTitle: 'ATech',
      menuItems: [
        { label: 'Home',     url: '/',          openInNewTab: false },
        { label: 'About',    url: '/about',     openInNewTab: false },
        { label: 'Services', url: '/services',  openInNewTab: false },
        { label: 'Contact',  url: '/contact',   openInNewTab: false },
      ],
      footerText: `© ${new Date().getFullYear()} ATech Solutions. All rights reserved.`,
    },
  })

  console.log('Seeding layout-builder plugin record…')
  const existingPlugin = await payload.find({
    collection: 'plugins',
    where: { slug: { equals: 'layout-builder' } },
    overrideAccess: true,
  })
  if (existingPlugin.totalDocs === 0) {
    await payload.create({
      collection: 'plugins',
      overrideAccess: true,
      data: {
        name: 'Layout Builder',
        slug: 'layout-builder',
        description: 'Visual page layout builder with drag-and-drop block management.',
        pluginType: 'built-in',
        category: 'layout',
        status: 'active',
        version: '1.0.0',
        author: 'ATech',
        autoActivate: true,
      } as any,
    })
    console.log('Plugin "layout-builder" created → active.')
  } else {
    console.log('Plugin "layout-builder" already exists — skipping.')
  }

  await upsertPage(payload, 'home',     'Home',     homeLayout,  homepageLayoutBuilder)
  await upsertPage(payload, 'about',    'About',    aboutLayout)
  await upsertPage(payload, 'services', 'Services', [],          servicesLayoutBuilder)

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
