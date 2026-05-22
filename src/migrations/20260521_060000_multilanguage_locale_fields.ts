import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// ── UP ─────────────────────────────────────────────────────────────────────────
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)

  // ── 1. navigation.cta_label → navigation_locales ─────────────────────────
  await db.run(sql`CREATE TABLE \`navigation_locales\` (
    \`cta_label\` text DEFAULT 'Get a Quote',
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`navigation_locales\` (\`cta_label\`, \`_locale\`, \`_parent_id\`)
    SELECT \`cta_label\`, 'en', \`id\` FROM \`navigation\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_locales_locale_parent_id_unique\` ON \`navigation_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`navigation\` DROP COLUMN \`cta_label\`;`)

  // _navigation_v versioning
  await db.run(sql`CREATE TABLE \`_navigation_v_locales\` (
    \`version_cta_label\` text DEFAULT 'Get a Quote',
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`_navigation_v_locales\` (\`version_cta_label\`, \`_locale\`, \`_parent_id\`)
    SELECT \`version_cta_label\`, 'en', \`id\` FROM \`_navigation_v\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_locales_locale_parent_id_unique\` ON \`_navigation_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_navigation_v\` DROP COLUMN \`version_cta_label\`;`)

  // ── 2. navigation_menu_items localized fields ─────────────────────────────
  await db.run(sql`CREATE TABLE \`navigation_menu_items_locales\` (
    \`label\` text,
    \`featured_title\` text,
    \`featured_description\` text,
    \`featured_cta\` text DEFAULT 'Learn More',
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`navigation_menu_items_locales\` (\`label\`, \`featured_title\`, \`featured_description\`, \`featured_cta\`, \`_locale\`, \`_parent_id\`)
    SELECT \`label\`, \`featured_title\`, \`featured_description\`, \`featured_cta\`, 'en', \`id\` FROM \`navigation_menu_items\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_menu_items_locales_locale_parent_id_unique\` ON \`navigation_menu_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items\` DROP COLUMN \`featured_title\`;`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items\` DROP COLUMN \`featured_description\`;`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items\` DROP COLUMN \`featured_cta\`;`)

  // _navigation_v_version_menu_items versioning
  await db.run(sql`CREATE TABLE \`_navigation_v_version_menu_items_locales\` (
    \`label\` text,
    \`featured_title\` text,
    \`featured_description\` text,
    \`featured_cta\` text DEFAULT 'Learn More',
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`_navigation_v_version_menu_items_locales\` (\`label\`, \`featured_title\`, \`featured_description\`, \`featured_cta\`, \`_locale\`, \`_parent_id\`)
    SELECT \`label\`, \`featured_title\`, \`featured_description\`, \`featured_cta\`, 'en', \`id\` FROM \`_navigation_v_version_menu_items\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_menu_items_locales_locale_parent_id_unique\` ON \`_navigation_v_version_menu_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_menu_items\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_menu_items\` DROP COLUMN \`featured_title\`;`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_menu_items\` DROP COLUMN \`featured_description\`;`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_menu_items\` DROP COLUMN \`featured_cta\`;`)

  // ── 3. navigation_menu_items_columns.column_title ──────────────────────────
  await db.run(sql`CREATE TABLE \`navigation_menu_items_columns_locales\` (
    \`column_title\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_menu_items_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`navigation_menu_items_columns_locales\` (\`column_title\`, \`_locale\`, \`_parent_id\`)
    SELECT \`column_title\`, 'en', \`id\` FROM \`navigation_menu_items_columns\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_menu_items_columns_locales_locale_parent_id_unique\` ON \`navigation_menu_items_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items_columns\` DROP COLUMN \`column_title\`;`)

  await db.run(sql`CREATE TABLE \`_navigation_v_version_menu_items_columns_locales\` (
    \`column_title\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_menu_items_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`_navigation_v_version_menu_items_columns_locales\` (\`column_title\`, \`_locale\`, \`_parent_id\`)
    SELECT \`column_title\`, 'en', \`id\` FROM \`_navigation_v_version_menu_items_columns\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_menu_items_columns_locales_locale_parent_id_unique\` ON \`_navigation_v_version_menu_items_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_menu_items_columns\` DROP COLUMN \`column_title\`;`)

  // ── 4. navigation_menu_items_columns_links: label, description ─────────────
  await db.run(sql`CREATE TABLE \`navigation_menu_items_columns_links_locales\` (
    \`label\` text,
    \`description\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_menu_items_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`navigation_menu_items_columns_links_locales\` (\`label\`, \`description\`, \`_locale\`, \`_parent_id\`)
    SELECT \`label\`, \`description\`, 'en', \`id\` FROM \`navigation_menu_items_columns_links\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_menu_items_columns_links_locales_locale_parent_id_unique\` ON \`navigation_menu_items_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items_columns_links\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items_columns_links\` DROP COLUMN \`description\`;`)

  await db.run(sql`CREATE TABLE \`_navigation_v_version_menu_items_columns_links_locales\` (
    \`label\` text,
    \`description\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_menu_items_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`_navigation_v_version_menu_items_columns_links_locales\` (\`label\`, \`description\`, \`_locale\`, \`_parent_id\`)
    SELECT \`label\`, \`description\`, 'en', \`id\` FROM \`_navigation_v_version_menu_items_columns_links\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_menu_items_columns_links_locales_locale_parent_id_unique\` ON \`_navigation_v_version_menu_items_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_menu_items_columns_links\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_menu_items_columns_links\` DROP COLUMN \`description\`;`)

  // ── 5. navigation_footer_columns.heading ───────────────────────────────────
  await db.run(sql`CREATE TABLE \`navigation_footer_columns_locales\` (
    \`heading\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`navigation_footer_columns_locales\` (\`heading\`, \`_locale\`, \`_parent_id\`)
    SELECT \`heading\`, 'en', \`id\` FROM \`navigation_footer_columns\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_columns_locales_locale_parent_id_unique\` ON \`navigation_footer_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`navigation_footer_columns\` DROP COLUMN \`heading\`;`)

  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_columns_locales\` (
    \`heading\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`_navigation_v_version_footer_columns_locales\` (\`heading\`, \`_locale\`, \`_parent_id\`)
    SELECT \`heading\`, 'en', \`id\` FROM \`_navigation_v_version_footer_columns\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_footer_columns_locales_locale_parent_id_unique\` ON \`_navigation_v_version_footer_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_footer_columns\` DROP COLUMN \`heading\`;`)

  // ── 6. navigation_footer_columns_links.label ───────────────────────────────
  await db.run(sql`CREATE TABLE \`navigation_footer_columns_links_locales\` (
    \`label\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`navigation_footer_columns_links_locales\` (\`label\`, \`_locale\`, \`_parent_id\`)
    SELECT \`label\`, 'en', \`id\` FROM \`navigation_footer_columns_links\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_columns_links_locales_locale_parent_id_unique\` ON \`navigation_footer_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`navigation_footer_columns_links\` DROP COLUMN \`label\`;`)

  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_columns_links_locales\` (
    \`label\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`_navigation_v_version_footer_columns_links_locales\` (\`label\`, \`_locale\`, \`_parent_id\`)
    SELECT \`label\`, 'en', \`id\` FROM \`_navigation_v_version_footer_columns_links\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_footer_columns_links_locales_locale_parent_id_unique\` ON \`_navigation_v_version_footer_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_footer_columns_links\` DROP COLUMN \`label\`;`)

  // ── 7. navigation_footer_copyright_menu.label ──────────────────────────────
  await db.run(sql`CREATE TABLE \`navigation_footer_copyright_menu_locales\` (
    \`label\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_copyright_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`navigation_footer_copyright_menu_locales\` (\`label\`, \`_locale\`, \`_parent_id\`)
    SELECT \`label\`, 'en', \`id\` FROM \`navigation_footer_copyright_menu\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_copyright_menu_locales_locale_parent_id_unique\` ON \`navigation_footer_copyright_menu_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`navigation_footer_copyright_menu\` DROP COLUMN \`label\`;`)

  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_copyright_menu_locales\` (
    \`label\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_copyright_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`_navigation_v_version_footer_copyright_menu_locales\` (\`label\`, \`_locale\`, \`_parent_id\`)
    SELECT \`label\`, 'en', \`id\` FROM \`_navigation_v_version_footer_copyright_menu\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_footer_copyright_menu_locales_locale_parent_id_unique\` ON \`_navigation_v_version_footer_copyright_menu_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_navigation_v_version_footer_copyright_menu\` DROP COLUMN \`label\`;`)

  // ── 8. settings localized fields ──────────────────────────────────────────
  await db.run(sql`CREATE TABLE \`settings_locales\` (
    \`site_name\` text DEFAULT 'ATech',
    \`site_description\` text,
    \`maintenance_title\` text DEFAULT 'Under Construction.',
    \`maintenance_message\` text,
    \`maintenance_status_label\` text DEFAULT 'System upgrade in progress',
    \`maintenance_estimate\` text DEFAULT 'Soon',
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`settings_locales\` (\`site_name\`, \`site_description\`, \`maintenance_title\`, \`maintenance_message\`, \`maintenance_status_label\`, \`maintenance_estimate\`, \`_locale\`, \`_parent_id\`)
    SELECT \`site_name\`, \`site_description\`, \`maintenance_title\`, \`maintenance_message\`, \`maintenance_status_label\`, \`maintenance_estimate\`, 'en', \`id\` FROM \`settings\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`settings_locales_locale_parent_id_unique\` ON \`settings_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`site_name\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`site_description\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`maintenance_title\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`maintenance_message\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`maintenance_status_label\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`maintenance_estimate\`;`)

  // _settings_v locales
  await db.run(sql`CREATE TABLE \`_settings_v_locales\` (
    \`version_site_name\` text DEFAULT 'ATech',
    \`version_site_description\` text,
    \`version_maintenance_title\` text DEFAULT 'Under Construction.',
    \`version_maintenance_message\` text,
    \`version_maintenance_status_label\` text DEFAULT 'System upgrade in progress',
    \`version_maintenance_estimate\` text DEFAULT 'Soon',
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`_settings_v_locales\` (\`version_site_name\`, \`version_site_description\`, \`version_maintenance_title\`, \`version_maintenance_message\`, \`version_maintenance_status_label\`, \`version_maintenance_estimate\`, \`_locale\`, \`_parent_id\`)
    SELECT \`version_site_name\`, \`version_site_description\`, \`version_maintenance_title\`, \`version_maintenance_message\`, \`version_maintenance_status_label\`, \`version_maintenance_estimate\`, 'en', \`id\` FROM \`_settings_v\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_settings_v_locales_locale_parent_id_unique\` ON \`_settings_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_site_name\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_site_description\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_maintenance_title\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_maintenance_message\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_maintenance_status_label\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_maintenance_estimate\`;`)

  // ── 9. language_settings global ───────────────────────────────────────────
  await db.run(sql`CREATE TABLE \`language_settings\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`default_locale\` text DEFAULT 'en',
    \`auto_detect\` integer DEFAULT true,
    \`show_switcher\` integer DEFAULT true,
    \`switcher_position\` text DEFAULT 'header',
    \`hreflang_enabled\` integer DEFAULT true,
    \`_status\` text DEFAULT 'published',
    \`updated_at\` text,
    \`created_at\` text
  );`)
  await db.run(sql`CREATE INDEX \`language_settings__status_idx\` ON \`language_settings\` (\`_status\`);`)

  await db.run(sql`CREATE TABLE \`language_settings_active_locales\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`code\` text NOT NULL,
    \`label\` text NOT NULL,
    \`enabled\` integer DEFAULT true,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`language_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX \`language_settings_active_locales_order_idx\` ON \`language_settings_active_locales\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`language_settings_active_locales_parent_id_idx\` ON \`language_settings_active_locales\` (\`_parent_id\`);`)

  await db.run(sql`PRAGMA foreign_keys=ON;`)
}

// ── DOWN ───────────────────────────────────────────────────────────────────────
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)

  // Restore navigation.cta_label
  await db.run(sql`ALTER TABLE \`navigation\` ADD COLUMN \`cta_label\` text DEFAULT 'Get a Quote';`)
  await db.run(sql`UPDATE \`navigation\` SET \`cta_label\` = (SELECT \`cta_label\` FROM \`navigation_locales\` WHERE \`_parent_id\` = \`navigation\`.\`id\` AND \`_locale\` = 'en' LIMIT 1);`)
  await db.run(sql`DROP TABLE \`navigation_locales\`;`)
  await db.run(sql`ALTER TABLE \`_navigation_v\` ADD COLUMN \`version_cta_label\` text DEFAULT 'Get a Quote';`)
  await db.run(sql`DROP TABLE \`_navigation_v_locales\`;`)

  // Restore navigation_menu_items
  await db.run(sql`ALTER TABLE \`navigation_menu_items\` ADD COLUMN \`label\` text;`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items\` ADD COLUMN \`featured_title\` text;`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items\` ADD COLUMN \`featured_description\` text;`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items\` ADD COLUMN \`featured_cta\` text DEFAULT 'Learn More';`)
  await db.run(sql`DROP TABLE \`navigation_menu_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_menu_items_locales\`;`)

  // Restore navigation_menu_items_columns
  await db.run(sql`ALTER TABLE \`navigation_menu_items_columns\` ADD COLUMN \`column_title\` text;`)
  await db.run(sql`DROP TABLE \`navigation_menu_items_columns_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_menu_items_columns_locales\`;`)

  // Restore navigation_menu_items_columns_links
  await db.run(sql`ALTER TABLE \`navigation_menu_items_columns_links\` ADD COLUMN \`label\` text;`)
  await db.run(sql`ALTER TABLE \`navigation_menu_items_columns_links\` ADD COLUMN \`description\` text;`)
  await db.run(sql`DROP TABLE \`navigation_menu_items_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_menu_items_columns_links_locales\`;`)

  // Restore navigation_footer_columns
  await db.run(sql`ALTER TABLE \`navigation_footer_columns\` ADD COLUMN \`heading\` text;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_columns_locales\`;`)

  // Restore navigation_footer_columns_links
  await db.run(sql`ALTER TABLE \`navigation_footer_columns_links\` ADD COLUMN \`label\` text;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_columns_links_locales\`;`)

  // Restore navigation_footer_copyright_menu
  await db.run(sql`ALTER TABLE \`navigation_footer_copyright_menu\` ADD COLUMN \`label\` text;`)
  await db.run(sql`DROP TABLE \`navigation_footer_copyright_menu_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_copyright_menu_locales\`;`)

  // Restore settings
  await db.run(sql`ALTER TABLE \`settings\` ADD COLUMN \`site_name\` text DEFAULT 'ATech';`)
  await db.run(sql`ALTER TABLE \`settings\` ADD COLUMN \`site_description\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD COLUMN \`maintenance_title\` text DEFAULT 'Under Construction.';`)
  await db.run(sql`ALTER TABLE \`settings\` ADD COLUMN \`maintenance_message\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD COLUMN \`maintenance_status_label\` text DEFAULT 'System upgrade in progress';`)
  await db.run(sql`ALTER TABLE \`settings\` ADD COLUMN \`maintenance_estimate\` text DEFAULT 'Soon';`)
  await db.run(sql`DROP TABLE \`settings_locales\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_locales\`;`)

  // Drop language_settings tables
  await db.run(sql`DROP TABLE \`language_settings_active_locales\`;`)
  await db.run(sql`DROP TABLE \`language_settings\`;`)

  await db.run(sql`PRAGMA foreign_keys=ON;`)
}
