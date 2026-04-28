import type { Config } from 'tailwindcss'
import containerQueries from '@tailwindcss/container-queries'

// ─────────────────────────────────────────────────────────────────────────────
// ATech Design System — Tailwind Config
// Extracted from Figma:
//   Lofi  → node 1:23412  (wireframe / layout reference)
//   Hifi  → node 1:26172  (production design — dark navy + gold palette)
// ─────────────────────────────────────────────────────────────────────────────

const config: Config = {
  corePlugins: {
    preflight: false, // Prevents Tailwind from breaking the Admin UI
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',    
    // ...other paths
    './src/**/**/LayoutPreview.tsx', // Target your plugin file specifically
    './src/components/LayoutBuilder/LayoutPreview.tsx'
  ],

  // content: [],

  theme: {
    extend: {
      // screens: {
        // Standard MD is 768px, LG is 1024px. 
        // We create smaller triggers specifically for the plugin UI:
        // If --md-trigger exists, use it. Otherwise, use 768px.
        // 'md': { min: 'var(--md-trigger, 768px)' },
        // If --lg-trigger exists, use it. Otherwise, use 1024px.
        // 'lg': { min: 'var(--lg-trigger, 1024px)' },
      // },
      
      // ── Colors ─────────────────────────────────────────────────────────────
      colors: {

        // Brand primaries (Figma variables: atech/primary, Atech/Black)
        primary: {
          DEFAULT:  '#ffd369',   // ATech gold — buttons, accents, CTA
          hover:    '#f5c842',   // Gold darkened for hover state
          glow:     'rgba(255,211,105,0.25)',   // Button glow shadow
          'glow-lg':'rgba(255,211,105,0.35)',
        },

        // ── Dark theme — main website pages ──────────────────────────────────
        // Used in: hero, service cards, header, footer, section backgrounds
        dark: {
          base:     '#0b1120',   // Deepest bg — footer, sections, header backdrop
          page:     '#292929',   // Page / body background (Atech Black)
          surface:  '#1e293b',   // Card surfaces (slate-800, used w/ backdrop-blur)
          elevated: 'rgba(30,41,59,0.7)',  // Glassmorphism cards (backdrop-blur-card)
          icon:     'rgba(56,189,248,0.1)', // Icon container fill (sky tint)
          cta:      'rgba(56,189,248,0.05)',// CTA card ghost fill
        },

        // ── Light theme — mega menu panels, forms, dropdowns ─────────────────
        light: {
          base:      '#ffffff',   // Panel / sheet background
          surface:   '#f5f5f5',   // Icon boxes, input backgrounds
          cta:       '#f0f0f0',   // CTA bar inside mega menu
          separator: '#d9d9d9',   // Dividers
          border:    '#e5e5e5',   // Panel borders
          // Light page background (Figma: atech/white 20 fill)
          tint:      '#f0f5fc',
        },

        // ── Text ─────────────────────────────────────────────────────────────
        content: {
          primary:   '#ffffff',                 // Headings on dark bg
          secondary: '#dcdcdc',                 // Subtitles / hero body
          muted:     '#64748b',                 // Card descriptions, footer links
          nav:       'rgba(248,250,252,0.8)',   // Nav items on dark header
          // Light-theme text
          dark:      '#171717',                 // Primary text on white (mega menu titles)
          body:      '#525252',                 // Body text on white (descriptions)
          'nav-lt':  '#404040',                 // Nav items on white header
          black:     '#292929',                 // CTA text in mega menu
        },

        // ── Borders ──────────────────────────────────────────────────────────
        outline: {
          ghost:   'rgba(255,255,255,0.05)',  // Subtlest card borders
          subtle:  'rgba(255,255,255,0.1)',   // Section dividers
          soft:    'rgba(255,255,255,0.3)',   // Pill badge borders
          light:   '#e5e5e5',                // Light panel borders
          sky:     'rgba(56,189,248,0.2)',   // Logo icon border
          'sky-dashed': 'rgba(56,189,248,0.3)', // CTA card dashed border
        },

        // ── Accent — sky blue (used for icon tints & glow) ───────────────────
        sky: {
          DEFAULT: '#38bdf8',                // sky-400 — icon SVG strokes
          light:   '#0ea5e9',                // sky-500
          tint:    'rgba(56,189,248,0.1)',   // Icon bg fill
          glow:    'rgba(56,189,248,0.15)',  // Button shadow glow
        },

        // ── Semantic ─────────────────────────────────────────────────────────
        success: '#10b981',   // Emerald — kept from previous config
        neutral: {
          deep:  '#170F49',   // Figma: Neutral/800 — deep navy
          black: '#000000',
          white: '#ffffff',
        },

        // ── Legacy alias — keeps existing class names working ─────────────────
        atech: {
          base:     '#0b1120',   // updated from #030b1a → Figma hifi value
          surface:  '#292929',   // updated from #061225 → Figma hifi value
          elevated: '#1e293b',   // updated from #0a1e38 → Figma hifi value
          border:   'rgba(255,255,255,0.05)', // updated → Figma ghost border
          sky:      '#0ea5e9',
          'sky-lt': '#38bdf8',
          indigo:   '#6366f1',   // kept for backward compat
          text:     '#e2e8f0',
          muted:    '#64748b',
          dim:      '#64748b',
          green:    '#10b981',
          // new additions under atech namespace
          black:    '#292929',
          primary:  '#ffd369',
        },
      },

      // ── Typography — Font Families ──────────────────────────────────────────
      // Lofi: Inter (wireframe reference, system-level)
      // Hifi: Inter (headings/sections) + Work Sans (nav/UI) + Syne/DM Sans (brand)
      fontFamily: {
        display:  ['var(--font-syne)',      'Syne',      'sans-serif'],  // Brand display
        body:     ['var(--font-dm-sans)',   'DM Sans',   'sans-serif'],  // Prose body
        sans:     ['var(--font-work-sans)', 'Work Sans', 'sans-serif'],  // UI/nav/buttons
        inter:    ['Inter',                              'sans-serif'],  // Hifi page type
      },

      // ── Typography — Font Sizes (Figma type scale) ──────────────────────────
      // Format: [fontSize, { lineHeight, letterSpacing, fontWeight }]
      fontSize: {
        // Display / Hero
        'display-2xl': ['80px', { lineHeight: '80px',  letterSpacing: '-2px',   fontWeight: '700' }],
        'display-xl':  ['72px', { lineHeight: '72px',  letterSpacing: '-1.8px', fontWeight: '700' }],
        'display-lg':  ['56px', { lineHeight: '60px',  letterSpacing: '-1.4px', fontWeight: '700' }],
        'display-md':  ['48px', { lineHeight: '52px',  letterSpacing: '-1.2px', fontWeight: '700' }],

        // Headings (matching Figma hifi heading scale)
        'h1':    ['36px', { lineHeight: '40px',  letterSpacing: '-0.5px', fontWeight: '700' }],
        'h2':    ['30px', { lineHeight: '36px',  letterSpacing: '-0.3px', fontWeight: '700' }],
        'h3':    ['20px', { lineHeight: '28px',  letterSpacing: '0',      fontWeight: '700' }],
        'h4':    ['16px', { lineHeight: '24px',  letterSpacing: '0',      fontWeight: '600' }],

        // Body
        'body-xl': ['20px', { lineHeight: '32px',    fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '29.25px', fontWeight: '400' }],
        'body':    ['16px', { lineHeight: '24px',    fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '22.75px', fontWeight: '400' }],

        // UI
        'nav':     ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'btn-lg':  ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'btn':     ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label':   ['12px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.6px' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },

      // ── Typography — Letter Spacing ──────────────────────────────────────────
      letterSpacing: {
        'display': '-0.025em',  // -1.8px at 72px ≈ -0.025em
        'heading': '-0.015em',  // headings
        'tight':   '-0.0125em', // -0.5px at 40px ≈ -0.0125em
        'normal':  '0em',
        'label':   '0.05em',    // 0.6px at 12px ≈ 0.05em
        'wide':    '0.1em',
      },

      // ── Typography — Line Heights ────────────────────────────────────────────
      lineHeight: {
        'none':    '1',
        'tight':   '1.1',       // Hifi H1 (72/72 = 1.0)
        'snug':    '1.25',      // H2 stats (36/30 = 1.2)
        'normal':  '1.4',       // H3 (28/20 = 1.4)
        'relaxed': '1.5',       // Body (24/16 = 1.5)
        'body':    '1.625',     // Card descriptions (22.75/14 = 1.625)
        'loose':   '1.75',      // Comfortable reading
      },

      // ── Border Radius ────────────────────────────────────────────────────────
      borderRadius: {
        'none':   '0',
        'sm':     '4px',
        'tag':    '6px',
        DEFAULT:  '8px',    // icon boxes, input fields
        'md':     '12px',   // mega menu link items
        'lg':     '16px',   // mega menu panel, icon backgrounds
        'xl':     '24px',   // service cards
        '2xl':    '32px',
        'full':   '9999px', // pill buttons, badges
        // semantic aliases
        'panel':  '16px',
        'card':   '24px',
        'btn':    '9999px',
        'icon':   '8px',
        'badge':  '9999px',
      },

      // ── Box Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        // Panel drop shadows (mega menu, tooltips)
        'panel':    '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)',
        'panel-sm': '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)',

        // Glow effects (Figma hifi CTA / nav buttons)
        'glow-sky':       '0 0 20px 0 rgba(56,189,248,0.15)',
        'glow-primary':   '0 4px 16px rgba(255,211,105,0.25)',
        'glow-primary-lg':'0 6px 24px rgba(255,211,105,0.35)',

        // Card shadows
        'card':    '0 4px 24px rgba(0,0,0,0.25)',
        'card-lg': '0 24px 64px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.30)',
      },

      // ── Backdrop Blur ────────────────────────────────────────────────────────
      backdropBlur: {
        'card':   '6px',   // Figma glass cards (backdrop-blur: 6px)
        'header': '16px',  // Sticky header blur
        'panel':  '12px',
      },

      // ── Spacing (site-level tokens) ──────────────────────────────────────────
      spacing: {
        '18': '72px',
        '22': '88px',
        '25': '100px',
        '30': '120px',
      },

      // ── Max Width ────────────────────────────────────────────────────────────
      maxWidth: {
        'site':    '1280px',   // Figma container max-width
        'content': '672px',    // Text / hero content column
        'card':    '384px',    // Footer brand column
        'narrow':  '576px',    // Sub-hero body copy
      },

      // ── Animations ───────────────────────────────────────────────────────────
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse_slow: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      animation: {
        'fade-up':    'fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
        'scale-in':   'scaleIn 0.2s cubic-bezier(0.4,0,0.2,1) forwards',
        'pulse-slow': 'pulse_slow 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
    },
  },

  plugins: [
    // require('@tailwindcss/container-queries'),
    containerQueries
  ],
}

export default config
