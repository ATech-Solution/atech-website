import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`theme_stats\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`theme_stats_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`theme_about_pillars\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`theme_about_pillars_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`theme_services\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`theme_services_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`theme_testimonials\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`theme_testimonials_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_theme_v_version_stats\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_theme_v_version_stats_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_theme_v_version_about_pillars\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_theme_v_version_about_pillars_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_theme_v_version_services\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_theme_v_version_services_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_theme_v_version_testimonials\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_theme_v_version_testimonials_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cta_label\` text DEFAULT 'Get a Quote',
  	\`cta_url\` text DEFAULT '/static/contact',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_navigation\`("id", "cta_label", "cta_url", "_status", "updated_at", "created_at") SELECT "id", "cta_label", "cta_url", "_status", "updated_at", "created_at" FROM \`navigation\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`ALTER TABLE \`__new_navigation\` RENAME TO \`navigation\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`navigation__status_idx\` ON \`navigation\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__navigation_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_cta_label\` text DEFAULT 'Get a Quote',
  	\`version_cta_url\` text DEFAULT '/static/contact',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer
  );
  `)
  await db.run(sql`INSERT INTO \`__new__navigation_v\`("id", "version_cta_label", "version_cta_url", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "snapshot", "published_locale", "latest") SELECT "id", "version_cta_label", "version_cta_url", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "snapshot", "published_locale", "latest" FROM \`_navigation_v\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__navigation_v\` RENAME TO \`_navigation_v\`;`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_version__status_idx\` ON \`_navigation_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_created_at_idx\` ON \`_navigation_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_updated_at_idx\` ON \`_navigation_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_snapshot_idx\` ON \`_navigation_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_published_locale_idx\` ON \`_navigation_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_latest_idx\` ON \`_navigation_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_theme\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'ATech',
  	\`site_tagline\` text,
  	\`logo_id\` integer,
  	\`favicon_id\` integer,
  	\`color_preset\` text DEFAULT 'dark-default',
  	\`color_scheme\` text DEFAULT 'dark',
  	\`primary_color\` text DEFAULT '#ffd369',
  	\`secondary_color\` text DEFAULT '#ffb347',
  	\`bg_color\` text DEFAULT '#292929',
  	\`surface_color\` text DEFAULT '#2f2f2f',
  	\`text_color\` text DEFAULT '#fafafa',
  	\`muted_color\` text DEFAULT '#525252',
  	\`border_color\` text DEFAULT '#383838',
  	\`testimonials_bg\` text,
  	\`preset_preview_note\` text,
  	\`heading_font\` text DEFAULT 'syne',
  	\`body_font\` text DEFAULT 'dm-sans',
  	\`footer_copyright\` text DEFAULT 'ATech Solutions Limited. All rights reserved.',
  	\`custom_c_s_s\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_theme\`("id", "site_name", "site_tagline", "logo_id", "favicon_id", "color_preset", "color_scheme", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "preset_preview_note", "heading_font", "body_font", "footer_copyright", "custom_c_s_s", "updated_at", "created_at") SELECT "id", "site_name", "site_tagline", "logo_id", "favicon_id", "color_preset", "color_scheme", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "preset_preview_note", "heading_font", "body_font", "footer_copyright", "custom_c_s_s", "updated_at", "created_at" FROM \`theme\`;`)
  await db.run(sql`DROP TABLE \`theme\`;`)
  await db.run(sql`ALTER TABLE \`__new_theme\` RENAME TO \`theme\`;`)
  await db.run(sql`CREATE INDEX \`theme_logo_idx\` ON \`theme\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_favicon_idx\` ON \`theme\` (\`favicon_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__theme_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_site_name\` text DEFAULT 'ATech',
  	\`version_site_tagline\` text,
  	\`version_logo_id\` integer,
  	\`version_favicon_id\` integer,
  	\`version_color_preset\` text DEFAULT 'dark-default',
  	\`version_color_scheme\` text DEFAULT 'dark',
  	\`version_primary_color\` text DEFAULT '#ffd369',
  	\`version_secondary_color\` text DEFAULT '#ffb347',
  	\`version_bg_color\` text DEFAULT '#292929',
  	\`version_surface_color\` text DEFAULT '#2f2f2f',
  	\`version_text_color\` text DEFAULT '#fafafa',
  	\`version_muted_color\` text DEFAULT '#525252',
  	\`version_border_color\` text DEFAULT '#383838',
  	\`version_testimonials_bg\` text,
  	\`version_preset_preview_note\` text,
  	\`version_heading_font\` text DEFAULT 'syne',
  	\`version_body_font\` text DEFAULT 'dm-sans',
  	\`version_footer_copyright\` text DEFAULT 'ATech Solutions Limited. All rights reserved.',
  	\`version_custom_c_s_s\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__theme_v\`("id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_color_preset", "version_color_scheme", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_preset_preview_note", "version_heading_font", "version_body_font", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_color_preset", "version_color_scheme", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_preset_preview_note", "version_heading_font", "version_body_font", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_theme_v\`;`)
  await db.run(sql`DROP TABLE \`_theme_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__theme_v\` RENAME TO \`_theme_v\`;`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_logo_idx\` ON \`_theme_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_favicon_idx\` ON \`_theme_v\` (\`version_favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_created_at_idx\` ON \`_theme_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_updated_at_idx\` ON \`_theme_v\` (\`updated_at\`);`)
  const dropCols: string[] = [
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`hero_badge\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`hero_heading\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`hero_body\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`about_heading\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`about_description\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`services_heading\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`services_subheading\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`custom_solution_heading\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`custom_solution_body\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`testimonials_heading\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`testimonials_subheading\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`contact_heading\``,
    `ALTER TABLE \`theme_locales\` DROP COLUMN \`contact_subheading\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_hero_badge\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_hero_heading\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_hero_body\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_about_heading\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_about_description\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_services_heading\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_services_subheading\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_custom_solution_heading\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_custom_solution_body\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_testimonials_heading\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_testimonials_subheading\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_contact_heading\``,
    `ALTER TABLE \`_theme_v_locales\` DROP COLUMN \`version_contact_subheading\``,
  ]
  for (const stmt of dropCols) {
    try { await db.run(sql.raw(stmt)) } catch { /* column may not exist — skip */ }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`theme_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`theme_stats_order_idx\` ON \`theme_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`theme_stats_parent_id_idx\` ON \`theme_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_stats_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`theme_stats_locales_locale_parent_id_unique\` ON \`theme_stats_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_about_pillars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`theme_about_pillars_order_idx\` ON \`theme_about_pillars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`theme_about_pillars_parent_id_idx\` ON \`theme_about_pillars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_about_pillars_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme_about_pillars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`theme_about_pillars_locales_locale_parent_id_unique\` ON \`theme_about_pillars_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`href\` text DEFAULT '#',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`theme_services_order_idx\` ON \`theme_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`theme_services_parent_id_idx\` ON \`theme_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_services_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`theme_services_locales_locale_parent_id_unique\` ON \`theme_services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text,
  	\`company\` text,
  	\`avatar_id\` integer,
  	\`rating\` numeric DEFAULT 5,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`theme_testimonials_order_idx\` ON \`theme_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`theme_testimonials_parent_id_idx\` ON \`theme_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_testimonials_avatar_idx\` ON \`theme_testimonials\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_testimonials_locales\` (
  	\`quote\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`theme_testimonials_locales_locale_parent_id_unique\` ON \`theme_testimonials_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_theme_v_version_stats_order_idx\` ON \`_theme_v_version_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_stats_parent_id_idx\` ON \`_theme_v_version_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_stats_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v_version_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_theme_v_version_stats_locales_locale_parent_id_unique\` ON \`_theme_v_version_stats_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_about_pillars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_theme_v_version_about_pillars_order_idx\` ON \`_theme_v_version_about_pillars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_about_pillars_parent_id_idx\` ON \`_theme_v_version_about_pillars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_about_pillars_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v_version_about_pillars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_theme_v_version_about_pillars_locales_locale_parent_id_unique\` ON \`_theme_v_version_about_pillars_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`href\` text DEFAULT '#',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_theme_v_version_services_order_idx\` ON \`_theme_v_version_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_services_parent_id_idx\` ON \`_theme_v_version_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_services_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v_version_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_theme_v_version_services_locales_locale_parent_id_unique\` ON \`_theme_v_version_services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text,
  	\`company\` text,
  	\`avatar_id\` integer,
  	\`rating\` numeric DEFAULT 5,
  	\`_uuid\` text,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_theme_v_version_testimonials_order_idx\` ON \`_theme_v_version_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_testimonials_parent_id_idx\` ON \`_theme_v_version_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_testimonials_avatar_idx\` ON \`_theme_v_version_testimonials\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_testimonials_locales\` (
  	\`quote\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v_version_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_theme_v_version_testimonials_locales_locale_parent_id_unique\` ON \`_theme_v_version_testimonials_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`navigation\` ADD \`site_title\` text DEFAULT 'ATech';`)
  await db.run(sql`ALTER TABLE \`navigation\` ADD \`logo_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`navigation\` ADD \`footer_text\` text DEFAULT '© 2026 ATech. All rights reserved.';`)
  await db.run(sql`CREATE INDEX \`navigation_logo_idx\` ON \`navigation\` (\`logo_id\`);`)
  await db.run(sql`ALTER TABLE \`_navigation_v\` ADD \`version_site_title\` text DEFAULT 'ATech';`)
  await db.run(sql`ALTER TABLE \`_navigation_v\` ADD \`version_logo_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_navigation_v\` ADD \`version_footer_text\` text DEFAULT '© 2026 ATech. All rights reserved.';`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_version_logo_idx\` ON \`_navigation_v\` (\`version_logo_id\`);`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`hero_cta_primary_label\` text DEFAULT 'Explore Services';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`hero_cta_primary_url\` text DEFAULT '/services';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`hero_cta_secondary_label\` text DEFAULT 'Client Testimonials';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`hero_cta_secondary_url\` text DEFAULT '/testimonials';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`hero_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`hero_layout\` text DEFAULT 'services-grid';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`services_bg_style\` text DEFAULT 'light';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`custom_solution_cta_label\` text DEFAULT 'Chat with us';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`custom_solution_cta_url\` text DEFAULT '/static/contact';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`testimonials_bg_style\` text DEFAULT 'yellow';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`testimonials_bg_color\` text;`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`contact_email\` text DEFAULT 'hello@atech.software';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`contact_phone\` text DEFAULT '+852 1234 5678';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`contact_location\` text DEFAULT 'Central, Hong Kong';`)
  await db.run(sql`CREATE INDEX \`theme_hero_image_idx\` ON \`theme\` (\`hero_image_id\`);`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`hero_badge\` text DEFAULT 'Welcome to ATech Solutions';`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`hero_heading\` text DEFAULT 'Build Software That Scales Your Business Forward';`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`hero_body\` text DEFAULT 'We build robust, scalable, and intelligent software solutions for startups and enterprises.';`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`about_heading\` text DEFAULT 'About ATech Solutions';`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`about_description\` text;`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`services_heading\` text DEFAULT 'Our Services';`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`services_subheading\` text;`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`custom_solution_heading\` text DEFAULT 'Need Custom Solution?';`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`custom_solution_body\` text;`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`testimonials_heading\` text DEFAULT 'Client Testimonials';`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`testimonials_subheading\` text DEFAULT 'What our clients say about working with us.';`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`contact_heading\` text DEFAULT 'Get in Touch';`)
  await db.run(sql`ALTER TABLE \`theme_locales\` ADD \`contact_subheading\` text DEFAULT 'Ready to start your next project? Let''''s discuss how we can help.';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_hero_cta_primary_label\` text DEFAULT 'Explore Services';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_hero_cta_primary_url\` text DEFAULT '/services';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_hero_cta_secondary_label\` text DEFAULT 'Client Testimonials';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_hero_cta_secondary_url\` text DEFAULT '/testimonials';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_hero_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_hero_layout\` text DEFAULT 'services-grid';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_services_bg_style\` text DEFAULT 'light';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_custom_solution_cta_label\` text DEFAULT 'Chat with us';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_custom_solution_cta_url\` text DEFAULT '/static/contact';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_testimonials_bg_style\` text DEFAULT 'yellow';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_testimonials_bg_color\` text;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_contact_email\` text DEFAULT 'hello@atech.software';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_contact_phone\` text DEFAULT '+852 1234 5678';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_contact_location\` text DEFAULT 'Central, Hong Kong';`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_hero_image_idx\` ON \`_theme_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_hero_badge\` text DEFAULT 'Welcome to ATech Solutions';`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_hero_heading\` text DEFAULT 'Build Software That Scales Your Business Forward';`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_hero_body\` text DEFAULT 'We build robust, scalable, and intelligent software solutions for startups and enterprises.';`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_about_heading\` text DEFAULT 'About ATech Solutions';`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_about_description\` text;`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_services_heading\` text DEFAULT 'Our Services';`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_services_subheading\` text;`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_custom_solution_heading\` text DEFAULT 'Need Custom Solution?';`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_custom_solution_body\` text;`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_testimonials_heading\` text DEFAULT 'Client Testimonials';`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_testimonials_subheading\` text DEFAULT 'What our clients say about working with us.';`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_contact_heading\` text DEFAULT 'Get in Touch';`)
  await db.run(sql`ALTER TABLE \`_theme_v_locales\` ADD \`version_contact_subheading\` text DEFAULT 'Ready to start your next project? Let''''s discuss how we can help.';`)
}
