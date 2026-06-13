import homeEn      from '@/components/language/home.json'
import qaEn        from '@/components/language/qa-testing.json'
import hrEn        from '@/components/language/hr-recruitment.json'
import aboutEn     from '@/components/language/about-us.json'
import wwsEn       from '@/components/language/who-we-serve.json'
import portfolioEn from '@/components/language/portfolio.json'
import insightEn   from '@/components/language/insight.json'
import articleEn   from '@/components/language/article.json'
import faqEn       from '@/components/language/faq.json'
import involvedEn  from '@/components/language/get-involved.json'
import communityEn from '@/components/language/get-involved-community.json'
import contactEn   from '@/components/language/contact.json'
import type { BlockOverrides, BlockType } from '../types'

const h   = homeEn.home
const qa  = qaEn['qa-testing']
const hr  = hrEn['hr-recruitment']
const au  = aboutEn['about-us']
const wws = wwsEn['who-we-serve']
const pf  = portfolioEn.portfolio
const ins = insightEn.insight
const art = articleEn.article
const faq = faqEn.faq
const inv = involvedEn.getInvolved
const com = communityEn.getInvolvedCommunity
const cnt = contactEn.contact

export function getDefaultOverrides(blockType: BlockType): BlockOverrides {
  switch (blockType) {
    case 'hero':
      return {
        content: {
          badge:              h.hero.badge,
          heading:            h.hero.heading,
          headingSub:         h.hero.headingSub,
          body:               h.hero.body,
          ctaPrimaryLabel:    h.hero.cta.primary.label,
          ctaPrimaryUrl:      h.hero.cta.primary.url,
          ctaSecondaryLabel:  h.hero.cta.secondary.label,
          ctaSecondaryUrl:    h.hero.cta.secondary.url,
          heroStats:          h.hero.stats.map((s) => ({ statValue: s.value, statLabel: s.label })),
          floatingCards:      h.hero.floatingCards.map((c) => ({ cardText: c.text, cardPosition: c.position })),
        },
      }

    case 'features':
      return {
        content: {
          heading:         wws.whyUs.heading,
          description:     wws.whyUs.subheading,
          featuresTheme:   'light' as const,
          featuresColumns: 2,
          pillars:         wws.whyUs.pillars.map((p) => ({
            pillarIcon:  { url: p.iconSrc },
            pillarTitle: p.title,
            pillarDesc:  p.description,
          })),
        },
      }

    case 'services':
      return {
        content: {
          heading:                h.services.heading,
          subheading:             h.services.subheading,
          serviceItems:           h.services.items.map((s) => ({
            serviceTitle: s.title,
            serviceDesc:  s.description,
            serviceHref:  s.href,
          })),
          customSolutionHeading:  h.services.customSolution.heading,
          customSolutionBody:     h.services.customSolution.body,
          customSolutionCtaLabel: h.services.customSolution.cta.label,
          customSolutionCtaUrl:   h.services.customSolution.cta.url,
        },
      }

    case 'services-mascot':
      return {
        content: {
          heading:    'Our Services',
          subheading: 'Comprehensive technology solutions tailored to your business needs.',
          serviceItems: [
            { serviceTitle: 'IT Outsourcing',               serviceDesc: 'Reliable teams designed to scale your operations with flexibility and affordability.', serviceHref: '/services' },
            { serviceTitle: 'IT & Management Consultancy',  serviceDesc: 'Strategic guidance to align your technology investments with business goals and drive growth.', serviceHref: '/services' },
            { serviceTitle: 'HR Outsourcing',               serviceDesc: 'Staff augmentation and dedicated development teams for your projects.', serviceHref: '/services' },
            { serviceTitle: 'Venture Building',             serviceDesc: 'End-to-end support to launch and scale new ventures from concept to market-ready product.', serviceHref: '/services' },
          ],
          mascotBubbleText: "Hi I'm TAC, the Ambassador of ATech!",
          mascotImage: { url: '/assets/blocks/tac-mascot.png', alt: 'TAC mascot' },
        },
      }

    case 'testimonials':
      return {
        content: {
          heading:                    h.testimonials.heading,
          subheading:                 h.testimonials.subheading,
          testimonialsContentSource:  'manual',
          testimonialsLimit:          9,
          enableCarousel:             false,
          testimonialItems: h.testimonials.items.map((t) => ({
            clientName:    t.name,
            clientRole:    t.role,
            clientCompany: t.company,
            quote:         t.quote,
            rating:        t.rating,
          })),
        },
      }

    case 'contact':
      return {
        content: {
          heading:           h.contact.heading,
          contactSubheading: h.contact.subheading,
          formHeading:       h.contact.form.heading,
          submitLabel:       h.contact.form.submitLabel,
          infoHeading:       h.contact.info.heading,
          contactEmail:      h.contact.info.email,
          contactPhone:      h.contact.info.phone,
          contactLocation:   h.contact.info.location,
        },
      }

    case 'hero-split':
      return {
        content: {
          badge:             wws.hero.badge,
          badgeIconSrc:      wws.hero.badgeIconSrc,
          breadcrumbs:       wws.hero.breadcrumb.map((b) => ({ bcLabel: b.label, bcHref: b.href })),
          heading:           wws.hero.heading,
          body:              wws.hero.body,
          ctaPrimaryLabel:   wws.hero.cta.primary.label,
          ctaPrimaryUrl:     wws.hero.cta.primary.url,
          ctaSecondaryLabel: wws.hero.cta.secondary.label,
          ctaSecondaryUrl:   wws.hero.cta.secondary.url,
          heroImage:         { url: wws.hero.image.src, alt: wws.hero.image.alt },
          heroStatValue:     '500+',
          heroStatLabel:     'Projects Delivered',
        },
      }

    case 'card-grid':
      return {
        content: {
          heading:      wws.industries.heading,
          subtitle:     wws.industries.subheading,
          cardGridTheme:'light' as const,
          cardItems:    wws.industries.items.map((s) => ({
            cardIconSrc:     s.iconSrc,
            cardTitle:       s.title,
            cardDescription: s.description,
            cardFeatures:    s.features.join('\n'),
          })),
        },
      }

    case 'process-steps':
      return {
        content: {
          heading:      qa.process.heading,
          subheading:   qa.process.subheading,
          processSteps: qa.process.steps.map((s) => ({
            stepNumber: s.number,
            stepTitle:  s.title,
            stepDesc:   s.description,
          })),
        },
      }

    case 'cta-banner':
      return {
        content: {
          heading:     qa.cta.heading,
          subtitle:    qa.cta.subheading,
          buttonLabel: qa.cta.button.label,
          buttonUrl:   qa.cta.button.url,
          heroStats:   qa.cta.stats.map((s) => ({ statValue: s.value, statLabel: s.label })),
        },
      }

    case 'hero-centered':
      return {
        content: {
          badge:               au.hero.badge,
          badgeIcon:           { url: au.hero.badgeIconSrc },
          aboutHeroHeading:    au.hero.heading,
          aboutHeroSubheading: au.hero.subheading,
        },
      }

    case 'company-stats':
      return {
        content: {
          aboutCompanyHeading: au.company.heading,
          body1:               au.company.body1,
          body2:               au.company.body2,
          companyStats:        au.company.stats.map((s) => ({ statValue: s.value, statLabel: s.label })),
        },
      }

    case 'mission-vision':
      return {
        content: {
          missionIcon:    { url: au.mission.missionIconSrc },
          missionHeading: au.mission.missionHeading,
          missionBody:    au.mission.missionBody,
          visionIcon:     { url: au.mission.visionIconSrc },
          visionHeading:  au.mission.visionHeading,
          visionBody:     au.mission.visionBody,
          valuesHeading:  au.mission.valuesHeading,
          values:         au.mission.values.map((v) => ({
            valueIcon:  { url: v.iconSrc },
            valueTitle: v.title,
            valueDesc:  v.description,
          })),
        },
      }

    case 'team-section':
      return {
        content: {
          leadershipHeading:    au.leadership.heading,
          leadershipSubheading: au.leadership.subheading,
          teamMembers:          au.leadership.team.map((m) => ({
            memberAvatar: { url: m.avatarSrc },
            memberName:   m.name,
            memberRole:   m.role,
            memberBio:    m.bio,
          })),
        },
      }

    case 'faq-section':
      return {
        content: {
          faqHeading:    au.faq.heading,
          faqSubheading: au.faq.subheading,
          faqItems:      au.faq.items.map((f) => ({ faqQuestion: f.question, faqAnswer: f.answer })),
        },
      }

    case 'expertise-tiles':
      return {
        content: {
          heading:        hr.expertise.heading,
          subheading:     hr.expertise.subheading,
          expertiseTiles: hr.expertise.tiles.map((t) => ({ tileIconSrc: t.iconSrc, tileLabel: t.label })),
        },
      }

    case 'page-hero':
      return {
        content: {
          badge:             pf.hero.badge,
          badgeIconSrc:      pf.hero.badgeIconSrc,
          heading:           pf.hero.heading,
          subheading:        pf.hero.subheading,
          ctaPrimaryLabel:   pf.hero.cta.primary.label,
          ctaPrimaryUrl:     pf.hero.cta.primary.url,
          ctaSecondaryLabel: pf.hero.cta.secondary.label,
          ctaSecondaryUrl:   pf.hero.cta.secondary.url,
          heroStats:         pf.hero.stats.map((s) => ({ statValue: s.value, statLabel: s.label })),
          pageHeroAlign:     'center' as const,
          pageHeroDark:      false,
        },
      }

    case 'project-grid':
      return {
        content: {
          heading:      pf.projects.heading,
          subheading:   pf.projects.subheading,
          projectItems: pf.projects.items.map((p) => ({
            projectTag:   p.tag,
            projectType:  p.type,
            projectTitle: p.title,
            projectDesc:  p.description,
            projectCta:   p.ctaLabel,
            projectUrl:   p.ctaUrl,
          })),
        },
      }

    case 'article-grid':
      return {
        content: {
          heading:      ins.articles.heading,
          subheading:   ins.articles.subheading,
          articleItems: ins.articles.items.map((a) => ({
            articleCategory: a.category,
            articleDate:     a.date,
            articleTitle:    a.title,
            articleDesc:     a.description,
            articleCta:      a.ctaLabel,
            articleUrl:      a.ctaUrl,
          })),
        },
      }

    case 'article-featured':
      return {
        content: {
          sectionLabel: art.featured.sectionLabel,
          featCategory: art.featured.category,
          featDate:     art.featured.date,
          featReadTime: art.featured.readTime,
          featViews:    art.featured.views,
          featTitle:    art.featured.title,
          featDesc:     art.featured.description,
          featCtaLabel: art.featured.ctaLabel,
          featCtaUrl:   art.featured.ctaUrl,
        },
      }

    case 'jobs-list':
      return {
        content: {
          jobSource:  'manual' as const,
          heading:   inv.jobs.heading,
          subheading: inv.jobs.subheading,
          jobItems:  inv.jobs.openings.map((j) => ({
            jobTitle: j.title,
            jobType:  j.type,
            jobDesc:  j.description,
            jobCta:   j.ctaLabel,
            jobUrl:   j.ctaUrl,
          })),
        },
      }

    case 'involved-hero':
      return {
        content: {
          badge:             inv.hero.badge,
          badgeIconSrc:      inv.hero.badgeIconSrc,
          heading:           inv.hero.heading,
          subheading:        inv.hero.subheading,
          ctaPrimaryLabel:   inv.hero.cta.primary.label,
          ctaPrimaryUrl:     inv.hero.cta.primary.url,
          ctaSecondaryLabel: inv.hero.cta.secondary.label,
          ctaSecondaryUrl:   inv.hero.cta.secondary.url,
          ctaArrowSrc:       inv.hero.ctaArrowSrc,
        },
      }

    case 'quote-form':
      return {
        content: {
          heading:     inv.quote.heading,
          subheading:  inv.quote.subheading,
          submitLabel: inv.quote.submitLabel,
        },
      }

    case 'culture-values':
      return {
        content: {
          heading:       inv.culture.heading,
          description:   inv.culture.description,
          cultureValues: inv.culture.values.map((v) => ({
            valueTitle: v.title,
            valueDesc:  v.description,
            valueIcon:  v.iconSrc,
          })),
        },
      }

    case 'community-channels':
      return {
        content: {
          channelItems: com.channels.map((ch) => ({
            channelIcon:  ch.iconSrc,
            channelTitle: ch.title,
            channelDesc:  ch.description,
            channelStats: ch.stats.map((s) => ({ statIcon: s.iconSrc, statLabel: s.label })),
            channelCta:   ch.ctaLabel,
            channelUrl:   ch.ctaUrl,
          })),
        },
      }

    case 'community-ambassador':
      return {
        content: {
          heading:             com.ambassador.heading,
          description:         com.ambassador.description,
          ambassadorBenefits:  com.ambassador.benefits.map((b) => ({
            benefitIcon:  b.iconSrc,
            benefitTitle: b.title,
            benefitDesc:  b.description,
          })),
          ambassadorCta: com.ambassador.ctaLabel,
          ambassadorUrl: com.ambassador.ctaUrl,
        },
      }

    case 'community-programs':
      return {
        content: {
          programItems: com.programs.map((p) => ({
            programIcon:  p.iconSrc,
            programTitle: p.title,
            programDesc:  p.description,
            programCta:   p.ctaLabel,
            programUrl:   p.ctaUrl,
          })),
        },
      }

    case 'contact-hero':
      return {
        content: {
          badge:        cnt.hero.badge,
          heading:      cnt.hero.heading,
          subheading:   cnt.hero.subheading,
          contactCards: cnt.hero.cards.map((c) => ({
            cardIconSrc: c.iconSrc,
            cardTitle:   c.title,
            cardDesc:    c.description,
            cardValue:   c.value,
          })),
        },
      }

    case 'contact-stats':
      return {
        content: {
          contactStatsStyle: 'light' as const,
          heading:          cnt.stats.heading,
          subheading:       cnt.stats.subheading,
          contactStatCtas:  cnt.stats.cta.map((c) => ({
            contactCtaLabel:   c.label,
            contactCtaUrl:     c.url,
            contactCtaPrimary: c.primary,
          })),
          contactStatItems: cnt.stats.items.map((s) => ({
            contactStatValue: s.value,
            contactStatLabel: s.label,
          })),
        },
      }

    case 'locations':
      return {
        content: {
          heading: cnt.locations.heading ?? 'Our Locations',
          locationCards: [
            {
              cardOffices: [
                { officeName: 'Hong Kong Head Office',            officeAddress: 'Room C, 22/F, King Palace Plaza, No.55 King Yip Street, Kwun Tong, KLN' },
                { officeName: 'Hong Kong Science Park (HKSTP)',   officeAddress: 'Unit 962, 9/F, Building 19W, No. 19 Science Park West Avenue, Hong Kong Science Park, Pak Shek Kok, N.T.' },
              ],
            },
            {
              cardOffices: [
                { officeName: 'China Branch Office',     officeAddress: '广州市南沙区黄阁镇市南公路黄阁段230号(自编三栋)105-13' },
                { officeName: 'Indonesia Branch Office', officeAddress: 'Jl. Pluit Timur Raya No.17, RT.5/RW.6, Pluit, Kec. Penjaringan, Jkt Utara, Daerah Khusus Ibukota Jakarta 14450' },
              ],
            },
            {
              cardOffices: [
                { officeName: 'Malaysia Branch Office', officeAddress: 'A-1-12 Vertical Business Suite No. 8, Jalan Kerinchi, Bangsar South, 59200, Kuala Lumpur' },
              ],
            },
          ],
        },
      }

    case 'featured-case-study':
      return {
        content: {
          sectionLabel:        'Featured Case Study',
          sectionBg:           '#ffffff',
          caseTitle:           'HomAge: Revolutionizing Elderly Care Management',
          caseDesc:            'HomAge is a project funded by the City University of Hong Kong that provides frail elders home-visiting healthcare services. ATech worked with HomAge\'s team of nurses and social workers shoulder-to-shoulder to design and develop an end-to-end system.',
          caseFeatures:        'Real-time coordination of caregiver tasks and schedules.\nSecure portal for families to track health metrics and reports.\nCentralized record-keeping ensuring care continuity across shifts.',
          floatingPlatform:    '40%',
          floatingPlatformType: 'Efficiency Increase',
          ctaPrimaryLabel:     'View Case Study',
          ctaPrimaryUrl:       '#',
          imagePosition:       'right',
        },
      }

    case 'faq-main':
      return {
        content: {
          faqContentSource: 'collection' as const,
          faqLimit: 100,
          faqBackLabel: 'Back',
        },
      }

    case 'breadcrumb':
      return {
        content: {
          breadcrumbs: [
            { bcLabel: 'Home', bcHref: '/' },
            { bcLabel: 'Page', bcHref: null },
          ],
        },
      }

    case 'faq-about':
      return {
        content: {
          badge:             'FAQ',
          faqContentSource:  'manual' as const,
          faqCategorySlug:   '',
          faqLimit:          20,
          faqHeading:        au.faq.heading,
          faqSubheading:     au.faq.subheading,
          faqItems:          au.faq.items.map((f) => ({ faqQuestion: f.question, faqAnswer: f.answer })),
          faqSeeMoreLabel:   'See more',
          faqSeeMoreUrl:     undefined,
        },
      }

    case 'article-submit':
      return {
        content: {
          articleSubmitHeading:        'Submit an Article',
          articleSubmitSubheading:     'Share your knowledge with our community.',
          articleSubmitCtaLabel:       'Submit Article',
          articleSubmitSuccessMessage: 'Thank you! Your article has been submitted for review.',
        },
      }

    case 'serve-model':
      return {
        content: {
          heading:    'Flexible Engagement Models',
          subheading: "Choose the partnership model that best fits your startup's stage and needs.",
          serveModelItems: [
            {
              modelTitle:    'Project-Based',
              modelDesc:     'Fixed scope and timeline for MVP development and specific features.',
              modelFeatures: 'Clear deliverables and milestones\nFixed budget and timeline\nIdeal for MVPs and prototypes',
              modelFeatured: false,
            },
            {
              modelTitle:      'Dedicated Team',
              modelDesc:       'Your own dedicated development team working exclusively on your product.',
              modelFeatures:   'Full-time dedicated developers\nFlexible team scaling\nLong-term partnership',
              modelFeatured:   true,
              modelBadgeLabel: 'Most Popular',
            },
            {
              modelTitle:    'Staff Augmentation',
              modelDesc:     'Extend your in-house team with skilled engineers on demand.',
              modelFeatures: 'Seamless team integration\nOn-demand scaling\nRetain full control',
              modelFeatured: false,
            },
          ],
        },
      }

    case 'serve-value':
      return {
        content: {
          heading:    'Why Startups Choose ATech',
          subheading: 'We understand the unique challenges startups face and provide solutions designed for rapid growth and scalability.',
          serveValueItems: [
            { valueTitle: 'Fast MVP Development',   valueDesc: 'Launch your product in weeks, not months, with our agile development approach.' },
            { valueTitle: 'Cost-Effective Solutions', valueDesc: 'Flexible pricing models and efficient development to maximize your runway.' },
            { valueTitle: 'Scalable Architecture',   valueDesc: 'Build on solid foundations that grow seamlessly with your user base.' },
            { valueTitle: 'Strategic Guidance',      valueDesc: 'Tech consultancy and strategic advice from experienced startup advisors.' },
          ],
        },
      }

    case 'serve-hero':
      return {
        content: {
          heading:           'Technology Partner for Ambitious Startups',
          body:              'From MVP to scale, we empower startups with agile development, strategic tech guidance, and flexible solutions that grow with your vision. Build faster, smarter, and more cost-effectively with ATech.',
          ctaPrimaryLabel:   'Get Started',
          ctaPrimaryUrl:     '/static/contact',
          ctaSecondaryLabel: 'View Success Stories',
          ctaSecondaryUrl:   '/portfolio',
          serveHeroStatValue: '50+ Startups Launched',
          serveHeroStatLabel: 'From Seed to Series B',
        },
      }

    case 'partnership':
      return {
        content: {
          heading:         'Get Partnership Opportunities',
          description:     'Have ideas, questions, or want to collaborate?\nLeave your details and we\'ll get in touch with you soon.',
          partnershipNote: 'Join 15,000+ developers and tech leaders. Unsubscribe anytime.',
          submitLabel:     'Send Message',
        },
      }

    case 'quote-intro':
      return {
        content: {
          quoteStyle: 'quote',
          quoteText:  'I want to scale my IT team without high hiring costs.',
          quoteBody:  'We source and manage IT talent from Malaysia, Indonesia, and China, trained professionals who slot into your team and hit the ground running. You get the capacity. We handle the rest.',
        },
      }

    case 'case-study-scroll':
      return {
        content: {
          caseScrollItems: [
            {
              cssImage:      null,
              cssClientLogo: null,
              cssHeading:    'Digital Transformation & System Integration',
              cssBody:       'Built a cross-border dev team for a trading platform. Lower costs, faster shipping, tighter HK–Indonesia collaboration.',
            },
            {
              cssImage:      null,
              cssClientLogo: null,
              cssHeading:    'Business Process Re-engineering',
              cssBody:       'Digitised home-based health coaching operations for elderly care. Less admin, better patient outcomes.',
            },
            {
              cssImage:      null,
              cssClientLogo: null,
              cssHeading:    'Data Analytics & Performance Optimization',
              cssBody:       'Supported AI-driven clinic analytics for Medtrik. Real-time insights on patient flow, doctor performance, and financials.',
            },
          ],
        },
      }

    case 'case-study':
      return {
        content: {
          csVariant:          'dark1',
          imagePosition:      'right',
          headingAccentFirst: false,
          headingPrimary:     'Scaling IT talent for',
          headingAccent:      'Quality HealthCare',
          body:               'We embedded a remote engineering team within 3 weeks — no overhead, no delays. The client focused on product; we handled the rest.',
          clientLogo:         null,
          caseImage:          null,
        },
      }

    case 'clients':
      return {
        content: {
          clientsHeading:   'Trusted by',
          clientsGrayscale: true,
          clientsPageSize:  6,
          clientItems: [
            { clientName: 'Quality HealthCare', clientLogo: null, clientUrl: '' },
            { clientName: 'BOCI',               clientLogo: null, clientUrl: '' },
            { clientName: 'Bank of China',      clientLogo: null, clientUrl: '' },
            { clientName: 'CCB',                clientLogo: null, clientUrl: '' },
            { clientName: 'Emperor Group',      clientLogo: null, clientUrl: '' },
          ],
        },
      }

    case 'step-scroll':
      return {
        content: {
          sbTitle:    'Hire Across Asia. Without Hiring Headache.',
          sbSubtitle: 'Finding the right tech talent in Hong Kong is slow and expensive. We give you access to trained professionals across Indonesia and Malaysia onboarded, managed, and supported by us. You get the output. We handle the rest.',
          sbSteps: [
            { stepTitle: 'Early-stage Discovery',           stepBody: 'Defining goals, identifying user needs, and establishing a solid foundation for the project.',            stepIcon: { url: '/media/step-icon-discovery.png',   alt: 'Discovery'   }, stepFeatured: false },
            { stepTitle: 'Ideation & Validation',           stepBody: 'Generating creative solutions and testing assumptions to ensure market viability.',                       stepIcon: { url: '/media/step-icon-ideation.png',    alt: 'Ideation'    }, stepFeatured: false },
            { stepTitle: 'Development & Technical Roadmap', stepBody: 'Building out the core infrastructure and planning the technical milestones for scale.',                   stepIcon: { url: '/media/step-icon-development.png', alt: 'Development' }, stepFeatured: false },
            { stepTitle: 'Go-to-Market Strategy',           stepBody: 'Executing the launch plan and establishing a competitive presence in the industry.',                     stepIcon: { url: '/media/step-icon-gtm.png',         alt: 'GTM'         }, stepFeatured: true  },
          ],
        },
      }

    case 'image-info':
      return {
        content: {
          iibTitle:        'Hire Across Asia. Without Hiring Headache.',
          iibSubtitle:     'Finding the right tech talent in Hong Kong is slow and expensive. We give you access to trained professionals across Indonesia and Malaysia — onboarded, managed, and supported by us.',
          iibBgImage:      null,
          iibMode:         'scroll',
          iibTooltipText:  'We find you the matching talent and sometimes we can match you with our trained from day one consultant, no ramp-up time, no hand-holding',
          iibTooltipMascot: null,
          iibPins: [
            { label: 'Chinese hires',                                        icon: '🇨🇳', iconBg: '#dc2626', posX: 44, posY: 22, lineLength: 112 },
            { label: 'Managed with Teamtrics — remote performance, tracked', icon: '',    iconBg: '',        posX: 30, posY: 43, lineLength: 0   },
            { label: 'Malaysian hires cover Cantonese-speaking roles',       icon: '🇲🇾', iconBg: '#1e40af', posX: 34, posY: 60, lineLength: 80  },
            { label: 'Indonesian talent reduces overhead',                   icon: '🇮🇩', iconBg: '#ef4444', posX: 50, posY: 74, lineLength: 112 },
          ],
        },
      }

    case 'about-content-2':
      return {
        content: {
          ac2Heading:       'Our Mission & Vision',
          ac2MissionTitle:  'Our Mission',
          ac2MissionBody:   'As the premier partner for operational excellence, we empower businesses to thrive in the hybrid era. We provide the essential tools and platforms, strategic consultancy, and operational services to build resilient, agile, and scalable, human-centric organizations.',
          ac2VisionTitle:   'Our Vision',
          ac2VisionBody:    'To create a world where work is defined by outcomes, not locations, unlocking human potential and enabling any organization to achieve seamless, integrated growth. We turn bold ideas into market-ready products and operational challenges into sustainable competitive advantages.',
          ac2ValuesHeading: 'Our Values',
          ac2Values: [
            { valueTitle: 'Innovation',    valueDesc: 'Constantly pushing boundaries' },
            { valueTitle: 'Integrity',     valueDesc: 'Honest and transparent partnerships' },
            { valueTitle: 'Excellence',    valueDesc: 'Delivering quality in everything' },
            { valueTitle: 'Collaboration', valueDesc: 'Working together for success' },
          ],
        },
      }

    case 'about-content-1':
      return {
        content: {
          ac1Heading: 'Most tech projects fail. Not because of bad ideas, but the wrong team.',
          ac1Body:    'We started ATech because we saw too many good businesses stuck, waiting on slow agencies, burning money on the wrong hires, shipping products that didn\'t fit the market. We do it differently. One team. Software, AI, talent, and strategy, working together from Hong Kong, with roots across Malaysia and Indonesia. Built for Asian businesses. Trusted by global brands.',
        },
      }

    case 'portfolio-content':
      return {
        content: {
          pfTheme:         'light',
          pfImagePosition: 'right',
          pfHeading:       'Project Name: Tagline Here',
          pfBody:          'Describe the project and the business problem it solves for the client.',
        },
      }

    case 'product-content':
      return {
        content: {
          pcTheme:    'dark',
          pcTitle:    'Product Name: Your Tagline Here',
          pcBody:     'Describe what makes this product unique. Focus on the problem it solves and the value it delivers to your users.',
          pcCtaLabel: 'Learn more',
          pcCtaUrl:   '#',
        },
      }

    default:
      return {}
  }
}
