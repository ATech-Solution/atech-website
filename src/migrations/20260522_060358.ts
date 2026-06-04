import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Rename locale code 'id' (Indonesian) → 'zh-hk' (Traditional Chinese)
  // The _locale column is a plain TEXT value with no SQL constraint,
  // so this is a data-only migration — no schema changes required.

  const tables = [
    'language_settings_active_locales',
    'pages_locales', '_pages_v_locales',
    'posts_locales', '_posts_v_locales',
    'navigation_locales', '_navigation_v_locales',
    'navigation_menu_items_locales', '_navigation_v_version_menu_items_locales',
    'navigation_menu_items_columns_locales', '_navigation_v_version_menu_items_columns_locales',
    'navigation_menu_items_columns_links_locales', '_navigation_v_version_menu_items_columns_links_locales',
    'navigation_footer_columns_locales', '_navigation_v_version_footer_columns_locales',
    'navigation_footer_columns_links_locales', '_navigation_v_version_footer_columns_links_locales',
    'navigation_footer_copyright_menu_locales', '_navigation_v_version_footer_copyright_menu_locales',
    'settings_locales', '_settings_v_locales',
    'portfolio_locales', '_portfolio_v_locales',
    'portfolio_categories_locales',
    'categories_locales',
    'faqs_locales', 'faq_categories_locales',
    'testimonials_locales',
    'job_vacancies_locales',
    'blocks_locales',
    'blocks_items_locales', 'blocks_pillars_locales', 'blocks_service_items_locales',
    'blocks_testimonial_items_locales', 'blocks_company_stats_locales',
    'blocks_values_locales', 'blocks_team_members_locales', 'blocks_faq_items_locales',
    'blocks_portfolio_stats_locales',
    'theme_locales', '_theme_v_locales',
    'search_locales',
    'forms_locales', 'forms_emails_locales',
    'forms_blocks_checkbox_locales', 'forms_blocks_email_locales',
    'forms_blocks_message_locales', 'forms_blocks_number_locales',
    'forms_blocks_select_locales', 'forms_blocks_select_options_locales',
    'forms_blocks_text_locales', 'forms_blocks_textarea_locales',
    'pages_blocks_hero_locales', 'pages_blocks_rich_text_locales',
    'pages_blocks_media_block_locales', 'pages_blocks_cta_locales',
    'pages_blocks_cards_grid_locales', 'pages_blocks_cards_grid_cards_locales',
    'pages_blocks_testimonials_locales', 'pages_blocks_testimonials_items_locales',
    'pages_blocks_stats_locales', 'pages_blocks_stats_items_locales',
    'pages_blocks_faq_locales', 'pages_blocks_faq_items_locales',
    'pages_blocks_video_locales', 'pages_blocks_banner_locales',
    'pages_blocks_form_block_locales', 'pages_blocks_code_locales',
  ]

  for (const table of tables) {
    try {
      // language_settings_active_locales stores locale code in 'code' column
      if (table === 'language_settings_active_locales') {
        await db.run(sql`UPDATE ${sql.raw(`"${table}"`)} SET code = 'zh-hk', label = 'Traditional Chinese' WHERE code = 'id'`)
      } else {
        await db.run(sql`UPDATE ${sql.raw(`"${table}"`)} SET _locale = 'zh-hk' WHERE _locale = 'id'`)
      }
    } catch {
      // Table may not exist in all environments; continue
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const tables = [
    'language_settings_active_locales',
    'pages_locales', '_pages_v_locales',
    'posts_locales', '_posts_v_locales',
    'navigation_locales', 'settings_locales', 'portfolio_locales',
    'categories_locales', 'faqs_locales', 'testimonials_locales',
    'job_vacancies_locales', 'blocks_locales', 'theme_locales', 'search_locales',
  ]

  for (const table of tables) {
    try {
      if (table === 'language_settings_active_locales') {
        await db.run(sql`UPDATE ${sql.raw(`"${table}"`)} SET code = 'id', label = 'Indonesian' WHERE code = 'zh-hk'`)
      } else {
        await db.run(sql`UPDATE ${sql.raw(`"${table}"`)} SET _locale = 'id' WHERE _locale = 'zh-hk'`)
      }
    } catch {
      // ignore missing tables
    }
  }
}
