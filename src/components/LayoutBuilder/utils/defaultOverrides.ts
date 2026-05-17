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

    case 'testimonials':
      return {
        content: {
          heading:          h.testimonials.heading,
          subheading:       h.testimonials.subheading,
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
          heading:     cnt.locations.heading,
          officeItems: cnt.locations.offices.map((o) => ({
            officeName:    o.name,
            officeAddress: o.address,
          })),
        },
      }

    case 'featured-case-study':
      return {
        content: {
          sectionLabel:        'Featured Case Study',
          caseTitle:           'Numiracle Group — MIFASHOW App',
          caseDesc:            'MiFaShow was developed to solve the challenge of limited access to live events by building a mobile application that integrates ticket purchasing with real-time streaming. The app enables users to buy tickets and instantly watch concerts, stage plays, and business conferences through a seamless in-app experience.',
          floatingPlatform:    'Android & iOS',
          floatingPlatformType: 'Mobile apps development',
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
          faqBackUrl: undefined,
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

    case 'partnership':
      return {
        content: {
          heading:         'Get Partnership Opportunities',
          description:     'Have ideas, questions, or want to collaborate?\nLeave your details and we\'ll get in touch with you soon.',
          partnershipNote: 'Join 15,000+ developers and tech leaders. Unsubscribe anytime.',
          submitLabel:     'Send Message',
        },
      }

    default:
      return {}
  }
}
