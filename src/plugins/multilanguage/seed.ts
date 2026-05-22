import type { Payload } from 'payload'

export async function seedMultilanguage(payload: Payload): Promise<void> {
  // ── Seed plugin entry ──────────────────────────────────────────────────────
  try {
    const existing = await payload.find({
      collection: 'plugins',
      where: { slug: { equals: 'multilanguage' } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'plugins',
        data: {
          name: 'Multilanguage',
          slug: 'multilanguage',
          pluginType: 'built-in',
          category: 'utility',
          status: 'active',
          version: '1.0.0',
          author: 'ATech',
          description:
            'Subdirectory locale routing (/en/, /id/), language switcher, browser auto-detection, and Translation Manager admin view.',
          autoActivate: true,
          features: [
            {
              featureName: 'Locale Routing',
              featureDescription: 'Subdirectory routing /en/ /id/ with middleware detection',
              featureType: 'hook',
            },
            {
              featureName: 'Language Switcher',
              featureDescription: 'Data-driven locale toggle in header, persists via cookie',
              featureType: 'script',
            },
            {
              featureName: 'Language Settings',
              featureDescription:
                'Admin-editable global: active locales, auto-detect, hreflang, switcher position',
              featureType: 'collection',
            },
            {
              featureName: 'Translation Manager',
              featureDescription:
                'Admin view at /admin/multilanguage/translations showing translation completeness per collection',
              featureType: 'hook',
            },
          ],
        },
      })
      payload.logger.info('✅ Multilanguage plugin seeded into Plugins collection.')
    }
  } catch (err) {
    payload.logger.warn(
      `⚠ Multilanguage plugin record seed skipped: ${(err as Error).message}`,
    )
  }

  // ── Seed default LanguageSettings if empty ─────────────────────────────────
  try {
    const settings = await payload.findGlobal({ slug: 'language-settings' as any })
    const locales = (settings as any)?.activeLocales
    if (Array.isArray(locales) && locales.length > 0) return

    await payload.updateGlobal({
      slug: 'language-settings' as any,
      data: {
        activeLocales: [
          { code: 'en',    label: 'English',             enabled: true },
          { code: 'zh-hk', label: 'Traditional Chinese', enabled: true },
          { code: 'zh-cn', label: 'Simplified Chinese',  enabled: true },
          { code: 'id',    label: 'Indonesian',           enabled: true },
        ],
        defaultLocale: 'en',
        autoDetect: true,
        showSwitcher: true,
        switcherPosition: 'header',
        hreflangEnabled: true,
      } as any,
    })
    payload.logger.info('✅ Multilanguage plugin: seeded default language settings.')
  } catch (err) {
    payload.logger.warn(
      `⚠ Multilanguage language settings seed skipped: ${(err as Error).message}`,
    )
  }
}
