// ── Block type constants ──────────────────────────────────────────────────────
export const BASIC_BLOCK_TYPES = [
  'container', 'grid', 'heading', 'text-editor', 'image',
  'video', 'button', 'divider', 'spacer', 'google-map', 'icon',
] as const

export const GENERAL_BLOCK_TYPES = [
  'tabs', 'accordion', 'image-box', 'icon-box', 'image-carousel',
  'basic-gallery', 'icon-list', 'counter', 'progress-bar',
  'testimonial', 'social-icons', 'alert', 'html',
  'form',
] as const

// All generic, page-agnostic sections from src/components/block/Advance/
export const ADVANCE_BLOCK_TYPES = [
  'hero', 'hero-split', 'hero-centered',
  'features', 'services', 'services-mascot', 'testimonials', 'contact',
  'card-grid', 'cta-banner', 'process-steps', 'expertise-tiles',
  'company-stats', 'mission-vision', 'team-section', 'faq-section',
  'page-hero', 'project-grid', 'article-grid', 'article-featured',
  'jobs-list', 'involved-hero', 'quote-form', 'culture-values',
  'community-hero',
  'community-channels', 'community-ambassador', 'community-programs',
  'contact-hero', 'contact-stats', 'locations',
  'featured-case-study',
  'partnership',
  'portfolio-hero', 'portfolio-statistics', 'portfolio-main',
  'portfolio-detail-top', 'portfolio-featured-image', 'portfolio-detail-overview',
  'article-detail-hero', 'article-detail-content', 'article-related',
  'faq-main',
  'breadcrumb',
  'faq-about',
  'article-submit',
  'serve-hero',
  'serve-value',
  'serve-model',
  'insights-advantages',
  'insights-tech-guide',
  'article-hero',
  'article-filter',
  'article-feature',
  'article-main-grid',
  'subscribe',
  'clients',
  'quote-intro',
  'case-study',
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
    backgroundImage?: MediaRef | null
    mascotImage?: MediaRef | null
    mascotBubbleText?: string
    heroStats?: Array<{ statValue: string; statLabel: string }>
    floatingCards?: Array<{ cardText: string; cardPosition: string; cardIcon?: MediaRef | null }>

    // ── Home About ───────────────────────────────────────────────────────
    description?: string
    pillars?: Array<{ pillarIcon?: MediaRef | null; pillarTitle?: string; pillarDesc?: string }>

    // ── Home Services ────────────────────────────────────────────────────
    subheading?: string
    serviceItems?: Array<{ serviceIcon?: MediaRef | null; serviceTitle?: string; serviceDesc?: string; serviceFeatures?: string; serviceHref?: string }>
    customSolutionHeading?: string
    customSolutionBody?: string
    customSolutionCtaLabel?: string
    customSolutionCtaUrl?: string

    // ── Home Testimonials ────────────────────────────────────────────────
    testimonialsContentSource?: 'collection' | 'manual'
    testimonialsLimit?: number
    enableCarousel?: boolean
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
    contactEmailIcon?: MediaRef | null
    contactPhoneIcon?: MediaRef | null
    contactLocationIcon?: MediaRef | null

    // ── Button icons ──────────────────────────────────────────────────────
    ctaPrimaryIcon?: MediaRef | null
    ctaPrimaryIconPos?: 'left' | 'right'
    ctaPrimaryIconFill?: boolean
    ctaSecondaryIcon?: MediaRef | null
    ctaSecondaryIconPos?: 'left' | 'right'
    ctaSecondaryIconFill?: boolean
    buttonIcon?: MediaRef | null
    buttonIconPos?: 'left' | 'right'
    buttonIconFill?: boolean
    customSolutionCtaIcon?: MediaRef | null
    customSolutionCtaIconPos?: 'left' | 'right'
    customSolutionCtaIconFill?: boolean
    ambassadorCtaIcon?: MediaRef | null
    ambassadorCtaIconPos?: 'left' | 'right'
    ambassadorCtaIconFill?: boolean

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

    // ── Insights Advantages ───────────────────────────────────────────────────
    advSectionBg?: 'yellow' | 'white' | 'dark'
    advantageItems?: Array<{ advIcon?: MediaRef | null; advTitle?: string; advDesc?: string }>

    // ── Insights Tech Guide ───────────────────────────────────────────────────
    guideItems?: Array<{ guideIcon?: MediaRef | null; guideTitle?: string; guideDesc?: string; guideTags?: string; guideCtaLabel?: string; guideCtaUrl?: string }>

    // ── Article Hero ──────────────────────────────────────────────────────────
    heroBg?: 'white' | 'dark'

    // ── Subscribe ─────────────────────────────────────────────────────────────
    subBadgeLabel?:       string
    subBadgeIcon?:        MediaRef | null
    subHeading?:          string
    subSubheading?:       string
    subInputPlaceholder?: string
    subButtonLabel?:      string
    subNote?:             string
    subSuccessMessage?:   string
    subApiEndpoint?:      string

    // ── Clients ───────────────────────────────────────────────────────────────
    clientsHeading?:   string
    clientsGrayscale?: boolean
    clientsPageSize?:  number
    clientItems?: Array<{ clientName?: string; clientLogo?: MediaRef | null; clientUrl?: string }>

    // ── Quote-Intro ───────────────────────────────────────────────────────────
    quoteStyle?: 'quote' | 'intro'
    quoteText?:  string
    quoteBody?:  string

    // ── Case Study ────────────────────────────────────────────────────────────
    csVariant?:          'light' | 'dark1' | 'dark2'
    headingAccent?:      string
    headingAccentFirst?: boolean
    headingPrimary?:     string

    // ── Article Main Grid ─────────────────────────────────────────────────────
    mainGridSectionLabel?:  string
    mainGridContentSource?: 'collection' | 'manual'
    mainGridLimit?:         number
    mainGridPageSize?:      number
    mainGridCategory?:      string
    mainGridOrderBy?:       'publishedAt_desc' | 'publishedAt_asc'
    mainGridItems?:         Array<{ mgImage?: MediaRef | null; mgCategory?: string; mgDate?: string; mgTitle?: string; mgExcerpt?: string; mgCtaLabel?: string; mgCtaUrl?: string }>
    mainGridLoadMoreType?:  'pagination' | 'load-more' | 'link'
    mainGridLoadMoreLabel?: string
    mainGridLoadMoreUrl?:   string

    // ── Community Hero ────────────────────────────────────────────────────────
    communityHeroTitle?:     string
    communityHeroDesc?:      string
    communityHeroBackLabel?: string
    communityHeroBackUrl?:   string

    // ── Article Filter ────────────────────────────────────────────────────────
    artFilterAllLabel?: string

    // ── Article Feature ───────────────────────────────────────────────────────
    artFeatSectionLabel?:  string
    artFeatContentSource?: 'collection' | 'manual'
    artFeatImage?:         MediaRef | null
    artFeatCategory?:      string
    artFeatDate?:          string
    artFeatTitle?:         string
    artFeatDesc?:          string
    artFeatReadTime?:      string
    artFeatViews?:         string
    artFeatCtaLabel?:      string
    artFeatCtaUrl?:        string

    // ── About Hero ────────────────────────────────────────────────────────
    aboutHeroHeading?: string
    aboutHeroSubheading?: string
    badgeIcon?: MediaRef | null
    badgeIconUrl?: string
    aboutHeroVideoUrl?: string
    aboutHeroMediaType?: 'video' | 'image'
    aboutHeroImage?: MediaRef | null

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
    teamColumns?: 2 | 3
    teamMembers?: Array<{ memberAvatar?: MediaRef | null; memberName?: string; memberRole?: string; memberBio?: string }>

    // ── FAQ Section / FAQ Main ────────────────────────────────────────────
    faqContentSource?: 'collection' | 'manual'
    faqCategorySlug?: string
    faqLimit?: number
    faqBackLabel?: string

    // ── About FAQ ─────────────────────────────────────────────────────────
    faqHeading?: string
    faqSubheading?: string
    faqItems?: Array<{ faqQuestion?: string; faqAnswer?: string }>
    faqSeeMoreLabel?: string
    faqSeeMoreUrl?: string

    // ── Article Submit ────────────────────────────────────────────────────
    articleSubmitHeading?: string
    articleSubmitSubheading?: string
    articleSubmitCtaLabel?: string
    articleSubmitSuccessMessage?: string

    // ── Page Hero (portfolio, insight, article, faq, community) ───────────
    pageHeroAlign?:    'left' | 'center'
    pageHeroDark?:     boolean
    pageHeroCtaStyle?: 'rounded' | 'square'

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
    ctaArrowSrc?:       string
    involvedHeroImage?: MediaRef | null

    // ── Culture Values ────────────────────────────────────────────────────
    cultureValues?: Array<{ valueTitle?: string; valueDesc?: string; valueIcon?: string }>
    cultureImage?:  MediaRef | null

    // ── Community Channels ────────────────────────────────────────────────
    channelItems?: Array<{ channelIcon?: string; channelTitle?: string; channelDesc?: string; channelStats?: Array<{ statIcon?: string; statLabel?: string }>; channelCta?: string; channelUrl?: string }>

    // ── Community Ambassador ──────────────────────────────────────────────
    ambassadorBenefits?: Array<{ benefitIcon?: string; benefitTitle?: string; benefitDesc?: string }>
    ambassadorImage?:    MediaRef | null
    ambassadorCta?: string
    ambassadorUrl?: string

    // ── Community Programs ────────────────────────────────────────────────
    programItems?: Array<{ programIcon?: string; programTitle?: string; programDesc?: string; programCta?: string; programUrl?: string }>

    // ── Contact Hero ──────────────────────────────────────────────────────
    contactCards?: Array<{ cardIconSrc?: string; cardTitle?: string; cardDesc?: string; cardValue?: string }>

    // ── Jobs List ─────────────────────────────────────────────────────────
    jobSource?:   'manual' | 'collection'
    jobCategory?: string
    jobLimit?:    number

    // ── Contact Stats ─────────────────────────────────────────────────────
    contactStatsStyle?: 'light' | 'dark'
    contactStatCtas?:  Array<{ contactCtaLabel?: string; contactCtaUrl?: string; contactCtaPrimary?: boolean; contactCtaIcon?: MediaRef | null; contactCtaIconPos?: 'left' | 'right'; contactCtaIconFill?: boolean }>
    contactStatItems?: Array<{ contactStatValue?: string; contactStatLabel?: string }>

    // ── Locations ─────────────────────────────────────────────────────────
    officeItems?: Array<{ officeName?: string; officeAddress?: string }>
    locationCards?: Array<{ cardOffices?: Array<{ officeName?: string; officeAddress?: string }> }>

    // ── Featured Case Study ───────────────────────────────────────────────
    caseTitle?:              string
    caseDesc?:               string
    caseFeatures?:           string
    clientLogo?:             MediaRef | null
    clientLogos?:            MediaRef[]
    caseImage?:              MediaRef | null
    floatingPlatform?:       string
    floatingPlatformType?:   string
    floatingIconSrc?:        string
    imagePosition?:          'left' | 'right'
    sectionBg?:              string

    // ── Partnership ───────────────────────────────────────────────────────────
    partnershipNote?: string

    // ── Serve Hero ────────────────────────────────────────────────────────────
    serveHeroStatIconSrc?: string
    serveHeroStatIconBg?:  string
    serveHeroStatValue?:   string
    serveHeroStatLabel?:   string

    // ── Serve Value ───────────────────────────────────────────────────────────
    serveValueItems?: Array<{ valueIconSrc?: string; valueTitle?: string; valueDesc?: string }>

    // ── Serve Model ───────────────────────────────────────────────────────────
    serveModelItems?: Array<{
      modelTitle?:      string
      modelIconSrc?:    string
      modelDesc?:       string
      modelFeatures?:   string
      modelFeatured?:   boolean
      modelBadgeLabel?: string
    }>

    // ── Form block ────────────────────────────────────────────────────────────
    formRef?: string | null
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
