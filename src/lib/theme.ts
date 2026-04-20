/** Preset color palettes available in the admin Colors tab */
export const COLOR_PRESETS: Record<string, Record<string, string>> = {
  'dark-default': {
    '--color-bg': '#292929',
    '--color-surface': '#2f2f2f',
    '--color-text': '#fafafa',
    '--color-muted': '#525252',
    '--color-border': '#383838',
    '--color-accent': '#ffd369',
    '--color-secondary': '#ffb347',
  },
  'light-default': {
    '--color-bg': '#ffffff',
    '--color-surface': '#f5f5f5',
    '--color-text': '#171717',
    '--color-muted': '#525252',
    '--color-border': '#e5e5e5',
    '--color-accent': '#ffd369',
    '--color-secondary': '#ffb347',
  },
  'ocean-blue': {
    '--color-bg': '#0b1a2e',
    '--color-surface': '#0f2540',
    '--color-text': '#e2e8f0',
    '--color-muted': '#94a3b8',
    '--color-border': '#1e3a5f',
    '--color-accent': '#38bdf8',
    '--color-secondary': '#0ea5e9',
  },
  'midnight-navy': {
    '--color-bg': '#0c1535',
    '--color-surface': '#111d42',
    '--color-text': '#f1f5f9',
    '--color-muted': '#94a3b8',
    '--color-border': '#1e2d5a',
    '--color-accent': '#6366f1',
    '--color-secondary': '#818cf8',
  },
  'forest-green': {
    '--color-bg': '#0d1f15',
    '--color-surface': '#122a1c',
    '--color-text': '#f0fdf4',
    '--color-muted': '#86efac',
    '--color-border': '#166534',
    '--color-accent': '#10b981',
    '--color-secondary': '#34d399',
  },
  'corporate-light': {
    '--color-bg': '#f8fafc',
    '--color-surface': '#f1f5f9',
    '--color-text': '#0f172a',
    '--color-muted': '#64748b',
    '--color-border': '#e2e8f0',
    '--color-accent': '#6366f1',
    '--color-secondary': '#818cf8',
  },
  'sunset-orange': {
    '--color-bg': '#1c0a00',
    '--color-surface': '#2d1200',
    '--color-text': '#fff7ed',
    '--color-muted': '#fed7aa',
    '--color-border': '#431407',
    '--color-accent': '#f97316',
    '--color-secondary': '#fb923c',
  },
}

/** Build CSS variable map from theme global data */
export function buildThemeCssVarMap(theme: any): Record<string, string> {
  if (!theme) return {}

  const preset = theme.colorPreset as string | undefined

  // If a preset is selected (not 'custom'), use its palette as base
  if (preset && preset !== 'custom' && COLOR_PRESETS[preset]) {
    const base = { ...COLOR_PRESETS[preset] }
    // Allow individual color overrides only when preset is custom
    return base
  }

  // Custom — build from individual color fields
  const isDark = (theme.colorScheme ?? 'dark') === 'dark'
  const defaults = isDark
    ? COLOR_PRESETS['dark-default']
    : COLOR_PRESETS['light-default']

  const map: Record<string, string> = { ...defaults }

  if (theme.primaryColor)   map['--color-accent']     = theme.primaryColor
  if (theme.secondaryColor) map['--color-secondary']  = theme.secondaryColor
  if (theme.bgColor)        map['--color-bg']         = theme.bgColor
  if (theme.surfaceColor)   map['--color-surface']    = theme.surfaceColor
  if (theme.textColor)      map['--color-text']       = theme.textColor
  if (theme.mutedColor)     map['--color-muted']      = theme.mutedColor
  if (theme.borderColor)    map['--color-border']     = theme.borderColor

  return map
}

/** Build a :root { ... } CSS block string from the variable map */
export function buildThemeCssVars(theme: any): string {
  const map = buildThemeCssVarMap(theme)
  const entries = Object.entries(map).filter(([, v]) => v.trim() !== '')
  if (!entries.length) return ''
  const declarations = entries.map(([k, v]) => `  ${k}: ${v};`).join('\n')
  return `:root {\n${declarations}\n}`
}
