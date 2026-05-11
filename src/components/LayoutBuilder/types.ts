// ── Block type constants ──────────────────────────────────────────────────────
export const BASIC_BLOCK_TYPES = [
  'container', 'grid', 'heading', 'text-editor', 'image',
  'video', 'button', 'divider', 'spacer', 'google-map', 'icon',
] as const

export const GENERAL_BLOCK_TYPES = [
  'tabs', 'accordion', 'image-box', 'icon-box', 'image-carousel',
  'basic-gallery', 'icon-list', 'counter', 'progress-bar',
  'testimonial', 'social-icons', 'alert', 'html',
] as const

// All generic, page-agnostic sections from src/components/block/Advance/
export const ADVANCE_BLOCK_TYPES = [
  'hero', 'hero-split', 'hero-centered',
  'features', 'services', 'testimonials', 'contact',
  'card-grid', 'cta-banner', 'process-steps', 'expertise-tiles',
  'company-stats', 'mission-vision', 'team-section', 'faq-section',
  'page-hero', 'project-grid', 'article-grid', 'article-featured',
  'jobs-list', 'involved-hero', 'quote-form', 'culture-values',
  'community-channels', 'community-ambassador', 'community-programs',
  'contact-hero', 'contact-stats', 'locations',
  'featured-case-study',
  'partnership',
] as const

export type BasicBlockType   = typeof BASIC_BLOCK_TYPES[number]
export type GeneralBlockType = typeof GENERAL_BLOCK_TYPES[number]
export type AdvanceBlockType = typeof ADVANCE_BLOCK_TYPES[number]
export type BlockType = BasicBlockType | GeneralBlockType | AdvanceBlockType

// ── Block template (from Blocks collection) ───────────────────────────────────
export interface BlockTemplate {
  id: string
  name: string
  blockType: BlockType
  category: 'basic' | 'general'
  // Content fields
  title?: string
  subtitle?: string
  image?: { id: string; url: string; alt: string } | null
  videoUrl?: string
  buttonLabel?: string
  buttonUrl?: string
  htmlContent?: string
  mapEmbedUrl?: string
  iconName?: string
  columns?: string
  alertType?: 'info' | 'success' | 'warning' | 'error'
  items?: BlockItem[]
  // Style fields
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  lineHeight?: string
  letterSpacing?: string
  paragraphSpacing?: string
  textShadowX?: string
  textShadowY?: string
  textShadowBlur?: string
  textShadowColor?: string
  textColorNormal?: string
  textColorHover?: string
  linkColorNormal?: string
  linkColorHover?: string
  backgroundColor?: string
  borderRadius?: string
  customCSS?: string
  // Advanced fields
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  marginTop?: string
  marginRight?: string
  marginBottom?: string
  marginLeft?: string
  width?: string
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  zIndex?: number
  cssClassName?: string
  htmlId?: string
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  hideOnDesktop?: boolean
}

export interface BlockItem {
  id?: string
  label?: string
  content?: string
  image?: { id: string; url: string; alt: string } | null
  icon?: string
  value?: string
  url?: string
}

// ── Media reference (subset used in overrides) ───────────────────────────────
export interface MediaRef { url: string; alt?: string }

// ── Per-page overrides (only the fields the user changed) ─────────────────────
export interface BlockOverrides {
  /** Block-internal style overrides (colors, typography, layout specific to this block type) */
  blockStyle?: Record<string, unknown>
  content?: {
    // ── Generic block fields ─────────────────────────────────────────────
    title?: string
    subtitle?: string
    image?: string | MediaRef | null
    videoUrl?: string
    buttonLabel?: string
    buttonUrl?: string
    htmlContent?: string
    mapEmbedUrl?: string
    iconName?: string
    columns?: string
    alertType?: 'info' | 'success' | 'warning' | 'error'
    items?: BlockItem[]

    // ── Home Hero ────────────────────────────────────────────────────────
    badge?: string
    heading?: string
    headingSub?: string
    body?: string
    ctaPrimaryLabel?: string
    ctaPrimaryUrl?: string
    ctaSecondaryLabel?: string
    ctaSecondaryUrl?: string
    heroImage?: MediaRef | null
    heroStats?: Array<{ statValue: string; statLabel: string }>
    floatingCards?: Array<{ cardText: string; cardPosition: string; cardIcon?: MediaRef | null }>

    // ── Home About ───────────────────────────────────────────────────────
    description?: string
    pillars?: Array<{ pillarIcon?: MediaRef | null; pillarTitle?: string; pillarDesc?: string }>

    // ── Home Services ────────────────────────────────────────────────────
    subheading?: string
    serviceItems?: Array<{ serviceIcon?: MediaRef | null; serviceTitle?: string; serviceDesc?: string; serviceHref?: string }>
    customSolutionHeading?: string
    customSolutionBody?: string
    customSolutionCtaLabel?: string
    customSolutionCtaUrl?: string

    // ── Home Testimonials ────────────────────────────────────────────────
    testimonialItems?: Array<{ clientName?: string; clientRole?: string; clientCompany?: string; quote?: string; rating?: number; avatar?: MediaRef | null }>

    // ── Service Cards ────────────────────────────────────────────────────
    cardItems?: Array<{ cardIconSrc?: string; cardTitle?: string; cardDescription?: string; cardFeatures?: string }>

    // ── Home Contact ─────────────────────────────────────────────────────
    contactSubheading?: string
    formHeading?: string
    submitLabel?: string
    infoHeading?: string
    contactEmail?: string
    contactPhone?: string
    contactLocation?: string

    // ── Button icons ──────────────────────────────────────────────────────
    ctaPrimaryIcon?: MediaRef | null
    ctaPrimaryIconPos?: 'left' | 'right'
    ctaSecondaryIcon?: MediaRef | null
    ctaSecondaryIconPos?: 'left' | 'right'
    buttonIcon?: MediaRef | null
    buttonIconPos?: 'left' | 'right'
    customSolutionCtaIcon?: MediaRef | null
    customSolutionCtaIconPos?: 'left' | 'right'
    ambassadorCtaIcon?: MediaRef | null
    ambassadorCtaIconPos?: 'left' | 'right'

    // ── Service Hero (generic service page hero with breadcrumb) ─────────
    badgeIconSrc?: string
    breadcrumbs?: Array<{ bcLabel?: string; bcHref?: string | null }>
    heroImagePosition?: 'left' | 'right'
    heroImagePadding?: boolean
    heroStatValue?: string
    heroStatLabel?: string

    // ── Card Grid theme ───────────────────────────────────────────────────
    cardGridTheme?: 'dark' | 'light'

    // ── Features theme / layout ───────────────────────────────────────────
    featuresTheme?: 'dark' | 'light'
    featuresColumns?: number

    // ── Process Steps ─────────────────────────────────────────────────────
    processSteps?: Array<{ stepNumber?: string; stepTitle?: string; stepDesc?: string }>

    // ── Expertise Tiles ───────────────────────────────────────────────────
    expertiseTiles?: Array<{ tileIconSrc?: string; tileLabel?: string; tileImage?: MediaRef | null }>

    // ── About Hero ────────────────────────────────────────────────────────
    aboutHeroHeading?: string
    aboutHeroSubheading?: string
    badgeIcon?: MediaRef | null
    aboutHeroVideoUrl?: string

    // ── About Company ─────────────────────────────────────────────────────
    aboutCompanyHeading?: string
    body1?: string
    body2?: string
    companyStats?: Array<{ statValue: string; statLabel: string }>
    companyImage?: MediaRef | null

    // ── About Mission & Vision ────────────────────────────────────────────
    missionIcon?: MediaRef | null
    missionHeading?: string
    missionBody?: string
    visionIcon?: MediaRef | null
    visionHeading?: string
    visionBody?: string
    valuesHeading?: string
    values?: Array<{ valueIcon?: MediaRef | null; valueTitle?: string; valueDesc?: string }>

    // ── About Leadership ──────────────────────────────────────────────────
    leadershipHeading?: string
    leadershipSubheading?: string
    teamMembers?: Array<{ memberAvatar?: MediaRef | null; memberName?: string; memberRole?: string; memberBio?: string }>

    // ── About FAQ ─────────────────────────────────────────────────────────
    faqHeading?: string
    faqSubheading?: string
    faqItems?: Array<{ faqQuestion?: string; faqAnswer?: string }>

    // ── Page Hero (portfolio, insight, article, faq, community) ───────────
    pageHeroAlign?: 'left' | 'center'
    pageHeroDark?:  boolean

    // ── Project Grid ──────────────────────────────────────────────────────
    projectHeading?: string
    projectSubheading?: string
    showCategoryFilter?: 'yes' | 'no'
    projectContentSource?: 'collection' | 'manual'
    projectLimit?: number
    projectCategory?: string
    projectOrderBy?: 'publishedAt_desc' | 'publishedAt_asc'
    projectItems?: Array<{ projectTag?: string; projectType?: string; projectTitle?: string; projectDesc?: string; projectCta?: string; projectUrl?: string; projectImage?: MediaRef | null }>

    // ── Article Grid ──────────────────────────────────────────────────────
    sectionLabel?:          string
    articleContentSource?:  'collection' | 'manual'
    articlePostsLimit?:     number
    articlePostsCategory?:  string
    articlePostsOrderBy?:   'publishedAt_desc' | 'publishedAt_asc'
    articleItems?:          Array<{ articleCategory?: string; articleDate?: string; articleTitle?: string; articleDesc?: string; articleCta?: string; articleUrl?: string; articleImage?: MediaRef | null }>

    // ── Article Featured ──────────────────────────────────────────────────
    featCategory?: string
    featDate?:     string
    featReadTime?: string
    featViews?:    string
    featTitle?:    string
    featDesc?:     string
    featCtaLabel?: string
    featCtaUrl?:   string

    // ── Jobs List ─────────────────────────────────────────────────────────
    jobItems?: Array<{ jobTitle?: string; jobType?: string; jobDesc?: string; jobCta?: string; jobUrl?: string }>

    // ── Involved Hero ─────────────────────────────────────────────────────
    ctaArrowSrc?: string

    // ── Culture Values ────────────────────────────────────────────────────
    cultureValues?: Array<{ valueTitle?: string; valueDesc?: string; valueIcon?: string }>

    // ── Community Channels ────────────────────────────────────────────────
    channelItems?: Array<{ channelIcon?: string; channelTitle?: string; channelDesc?: string; channelStats?: Array<{ statIcon?: string; statLabel?: string }>; channelCta?: string; channelUrl?: string }>

    // ── Community Ambassador ──────────────────────────────────────────────
    ambassadorBenefits?: Array<{ benefitIcon?: string; benefitTitle?: string; benefitDesc?: string }>
    ambassadorCta?: string
    ambassadorUrl?: string

    // ── Community Programs ────────────────────────────────────────────────
    programItems?: Array<{ programIcon?: string; programTitle?: string; programDesc?: string; programCta?: string; programUrl?: string }>

    // ── Contact Hero ──────────────────────────────────────────────────────
    contactCards?: Array<{ cardIconSrc?: string; cardTitle?: string; cardDesc?: string; cardValue?: string }>

    // ── Contact Stats ─────────────────────────────────────────────────────
    contactStatCtas?:  Array<{ contactCtaLabel?: string; contactCtaUrl?: string; contactCtaPrimary?: boolean; contactCtaIcon?: MediaRef | null; contactCtaIconPos?: 'left' | 'right' }>
    contactStatItems?: Array<{ contactStatValue?: string; contactStatLabel?: string }>

    // ── Locations ─────────────────────────────────────────────────────────
    officeItems?: Array<{ officeName?: string; officeAddress?: string }>

    // ── Featured Case Study ───────────────────────────────────────────────
    caseTitle?:              string
    caseDesc?:               string
    clientLogo?:             MediaRef | null
    caseImage?:              MediaRef | null
    floatingPlatform?:       string
    floatingPlatformType?:   string
    floatingIconSrc?:        string
    imagePosition?:          'left' | 'right'

    // ── Partnership ───────────────────────────────────────────────────────────
    partnershipNote?: string
  }
  style?: Partial<Pick<BlockTemplate,
    'textAlign' | 'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' |
    'letterSpacing' | 'paragraphSpacing' | 'textShadowX' | 'textShadowY' |
    'textShadowBlur' | 'textShadowColor' | 'textColorNormal' | 'textColorHover' |
    'linkColorNormal' | 'linkColorHover' | 'backgroundColor' | 'borderRadius' | 'customCSS'
  >>
  advanced?: Partial<Pick<BlockTemplate,
    'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' |
    'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft' |
    'width' | 'position' | 'zIndex' | 'cssClassName' | 'htmlId' |
    'hideOnMobile' | 'hideOnTablet' | 'hideOnDesktop'
  >>
}

// ── Layout block node (stored in page.layoutBuilder) ─────────────────────────
export interface LayoutBlock {
  id: string              // unique instance ID (uuid)
  blockId?: string        // reference to Blocks collection doc (null = detached)
  blockType: BlockType
  name: string            // user-editable display name
  order: number
  children: LayoutBlock[] // nested blocks (infinite depth, only containers)
  overrides: BlockOverrides
  detached?: boolean      // true = fully independent copy, no template link
  templateSnapshot?: Partial<BlockTemplate> // snapshot when detached
}

export type LayoutTree = LayoutBlock[]

// ── Sidebar state ─────────────────────────────────────────────────────────────
export type SidebarView = 'picker' | 'list' | 'properties'

export interface LayoutBuilderState {
  tree: LayoutTree
  selectedId: string | null
  sidebarView: SidebarView
  expandedIds: Set<string>
  renamingId: string | null
}
