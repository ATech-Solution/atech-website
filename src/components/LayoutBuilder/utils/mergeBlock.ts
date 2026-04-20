import type { BlockTemplate, BlockOverrides } from '../types'

/**
 * Deep merge a block template with per-page overrides.
 * Override values take precedence over template values.
 * Null/undefined override values are ignored (template value is kept).
 */
export function mergeBlock(
  template: Partial<BlockTemplate>,
  overrides: BlockOverrides,
): BlockTemplate {
  const content = { ...template, ...(overrides.content ?? {}) }
  const style   = { ...template, ...(overrides.style   ?? {}) }
  const advanced = { ...template, ...(overrides.advanced ?? {}) }

  return {
    ...content,
    ...style,
    ...advanced,
  } as BlockTemplate
}

/**
 * Given a full block template and a partial override object,
 * returns only the keys that differ from the template.
 * Used to minimise stored override data.
 */
export function diffOverrides(
  template: Partial<BlockTemplate>,
  current: Partial<BlockTemplate>,
): BlockOverrides {
  const contentKeys: (keyof BlockTemplate)[] = [
    'title', 'subtitle', 'image', 'videoUrl', 'buttonLabel', 'buttonUrl',
    'htmlContent', 'mapEmbedUrl', 'iconName', 'columns', 'alertType', 'items',
  ]
  const styleKeys: (keyof BlockTemplate)[] = [
    'textAlign', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight',
    'letterSpacing', 'paragraphSpacing', 'textShadowX', 'textShadowY',
    'textShadowBlur', 'textShadowColor', 'textColorNormal', 'textColorHover',
    'linkColorNormal', 'linkColorHover', 'backgroundColor', 'borderRadius', 'customCSS',
  ]
  const advancedKeys: (keyof BlockTemplate)[] = [
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'width', 'position', 'zIndex', 'cssClassName', 'htmlId',
    'hideOnMobile', 'hideOnTablet', 'hideOnDesktop',
  ]

  const pickDiff = (keys: (keyof BlockTemplate)[]) => {
    const diff: Record<string, unknown> = {}
    for (const key of keys) {
      if (current[key] !== undefined && current[key] !== template[key]) {
        diff[key] = current[key]
      }
    }
    return diff
  }

  return {
    content:  pickDiff(contentKeys)  as BlockOverrides['content'],
    style:    pickDiff(styleKeys)    as BlockOverrides['style'],
    advanced: pickDiff(advancedKeys) as BlockOverrides['advanced'],
  }
}
