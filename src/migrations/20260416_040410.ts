import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  await db.run(sql`CREATE TABLE \`theme_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`theme_footer_columns_links_order_idx\` ON \`theme_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`theme_footer_columns_links_parent_id_idx\` ON \`theme_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_footer_columns_links_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme_footer_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`theme_footer_columns_links_locales_locale_parent_id_unique\` ON \`theme_footer_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`theme_footer_columns_order_idx\` ON \`theme_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`theme_footer_columns_parent_id_idx\` ON \`theme_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_footer_columns_locales\` (
  	\`heading\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`theme_footer_columns_locales_locale_parent_id_unique\` ON \`theme_footer_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`theme\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'ATech',
  	\`site_tagline\` text,
  	\`logo_id\` integer,
  	\`favicon_id\` integer,
  	\`primary_color\` text,
  	\`secondary_color\` text,
  	\`bg_color\` text,
  	\`surface_color\` text,
  	\`text_color\` text,
  	\`muted_color\` text,
  	\`border_color\` text,
  	\`testimonials_bg\` text,
  	\`heading_font\` text DEFAULT 'syne',
  	\`body_font\` text DEFAULT 'dm-sans',
  	\`nav_cta_label\` text DEFAULT 'Get a Quote',
  	\`nav_cta_url\` text DEFAULT '/contact',
  	\`hero_cta_primary_label\` text DEFAULT 'Explore Services',
  	\`hero_cta_primary_url\` text DEFAULT '/services',
  	\`hero_cta_secondary_label\` text DEFAULT 'Client Testimonials',
  	\`hero_cta_secondary_url\` text DEFAULT '/testimonials',
  	\`hero_image_id\` integer,
  	\`hero_layout\` text DEFAULT 'services-grid',
  	\`services_bg_style\` text DEFAULT 'light',
  	\`custom_solution_cta_label\` text DEFAULT 'Chat with us',
  	\`custom_solution_cta_url\` text DEFAULT '/contact',
  	\`testimonials_bg_style\` text DEFAULT 'yellow',
  	\`testimonials_bg_color\` text,
  	\`contact_email\` text DEFAULT 'hello@atech.software',
  	\`contact_phone\` text DEFAULT '+852 1234 5678',
  	\`contact_location\` text DEFAULT 'Central, Hong Kong',
  	\`footer_copyright\` text DEFAULT 'ATech Solutions Limited. All rights reserved.',
  	\`custom_c_s_s\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`theme_logo_idx\` ON \`theme\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_favicon_idx\` ON \`theme\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_hero_image_idx\` ON \`theme\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`theme_locales\` (
  	\`hero_badge\` text DEFAULT 'Welcome to ATech Solutions',
  	\`hero_heading\` text DEFAULT 'Build Software That Scales Your Business Forward',
  	\`hero_body\` text DEFAULT 'We build robust, scalable, and intelligent software solutions for startups and enterprises.',
  	\`about_heading\` text DEFAULT 'About ATech Solutions',
  	\`about_description\` text,
  	\`services_heading\` text DEFAULT 'Our Services',
  	\`services_subheading\` text,
  	\`custom_solution_heading\` text DEFAULT 'Need Custom Solution?',
  	\`custom_solution_body\` text,
  	\`testimonials_heading\` text DEFAULT 'Client Testimonials',
  	\`testimonials_subheading\` text DEFAULT 'What our clients say about working with us.',
  	\`contact_heading\` text DEFAULT 'Get in Touch',
  	\`contact_subheading\` text DEFAULT 'Ready to start your next project? Let''''s discuss how we can help.',
  	\`footer_description\` text DEFAULT 'Engineering robust software solutions for startups and enterprises. Headquartered in Hong Kong.',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`theme\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`theme_locales_locale_parent_id_unique\` ON \`theme_locales\` (\`_locale\`,\`_parent_id\`);`)
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
  await db.run(sql`CREATE TABLE \`_theme_v_version_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`href\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v_version_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_theme_v_version_footer_columns_links_order_idx\` ON \`_theme_v_version_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_footer_columns_links_parent_id_idx\` ON \`_theme_v_version_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_footer_columns_links_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v_version_footer_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_theme_v_version_footer_columns_links_locales_locale_parent_id_unique\` ON \`_theme_v_version_footer_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_theme_v_version_footer_columns_order_idx\` ON \`_theme_v_version_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_footer_columns_parent_id_idx\` ON \`_theme_v_version_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_version_footer_columns_locales\` (
  	\`heading\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v_version_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_theme_v_version_footer_columns_locales_locale_parent_id_unique\` ON \`_theme_v_version_footer_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_site_name\` text DEFAULT 'ATech',
  	\`version_site_tagline\` text,
  	\`version_logo_id\` integer,
  	\`version_favicon_id\` integer,
  	\`version_primary_color\` text,
  	\`version_secondary_color\` text,
  	\`version_bg_color\` text,
  	\`version_surface_color\` text,
  	\`version_text_color\` text,
  	\`version_muted_color\` text,
  	\`version_border_color\` text,
  	\`version_testimonials_bg\` text,
  	\`version_heading_font\` text DEFAULT 'syne',
  	\`version_body_font\` text DEFAULT 'dm-sans',
  	\`version_nav_cta_label\` text DEFAULT 'Get a Quote',
  	\`version_nav_cta_url\` text DEFAULT '/contact',
  	\`version_hero_cta_primary_label\` text DEFAULT 'Explore Services',
  	\`version_hero_cta_primary_url\` text DEFAULT '/services',
  	\`version_hero_cta_secondary_label\` text DEFAULT 'Client Testimonials',
  	\`version_hero_cta_secondary_url\` text DEFAULT '/testimonials',
  	\`version_hero_image_id\` integer,
  	\`version_hero_layout\` text DEFAULT 'services-grid',
  	\`version_services_bg_style\` text DEFAULT 'light',
  	\`version_custom_solution_cta_label\` text DEFAULT 'Chat with us',
  	\`version_custom_solution_cta_url\` text DEFAULT '/contact',
  	\`version_testimonials_bg_style\` text DEFAULT 'yellow',
  	\`version_testimonials_bg_color\` text,
  	\`version_contact_email\` text DEFAULT 'hello@atech.software',
  	\`version_contact_phone\` text DEFAULT '+852 1234 5678',
  	\`version_contact_location\` text DEFAULT 'Central, Hong Kong',
  	\`version_footer_copyright\` text DEFAULT 'ATech Solutions Limited. All rights reserved.',
  	\`version_custom_c_s_s\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_logo_idx\` ON \`_theme_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_favicon_idx\` ON \`_theme_v\` (\`version_favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_hero_image_idx\` ON \`_theme_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_created_at_idx\` ON \`_theme_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_updated_at_idx\` ON \`_theme_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_theme_v_locales\` (
  	\`version_hero_badge\` text DEFAULT 'Welcome to ATech Solutions',
  	\`version_hero_heading\` text DEFAULT 'Build Software That Scales Your Business Forward',
  	\`version_hero_body\` text DEFAULT 'We build robust, scalable, and intelligent software solutions for startups and enterprises.',
  	\`version_about_heading\` text DEFAULT 'About ATech Solutions',
  	\`version_about_description\` text,
  	\`version_services_heading\` text DEFAULT 'Our Services',
  	\`version_services_subheading\` text,
  	\`version_custom_solution_heading\` text DEFAULT 'Need Custom Solution?',
  	\`version_custom_solution_body\` text,
  	\`version_testimonials_heading\` text DEFAULT 'Client Testimonials',
  	\`version_testimonials_subheading\` text DEFAULT 'What our clients say about working with us.',
  	\`version_contact_heading\` text DEFAULT 'Get in Touch',
  	\`version_contact_subheading\` text DEFAULT 'Ready to start your next project? Let''''s discuss how we can help.',
  	\`version_footer_description\` text DEFAULT 'Engineering robust software solutions for startups and enterprises. Headquartered in Hong Kong.',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_theme_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_theme_v_locales_locale_parent_id_unique\` ON \`_theme_v_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`theme_stats\`;`)
  await db.run(sql`DROP TABLE \`theme_stats_locales\`;`)
  await db.run(sql`DROP TABLE \`theme_about_pillars\`;`)
  await db.run(sql`DROP TABLE \`theme_about_pillars_locales\`;`)
  await db.run(sql`DROP TABLE \`theme_services\`;`)
  await db.run(sql`DROP TABLE \`theme_services_locales\`;`)
  await db.run(sql`DROP TABLE \`theme_testimonials\`;`)
  await db.run(sql`DROP TABLE \`theme_testimonials_locales\`;`)
  await db.run(sql`DROP TABLE \`theme_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`theme_footer_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`theme_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`theme_footer_columns_locales\`;`)
  await db.run(sql`DROP TABLE \`theme\`;`)
  await db.run(sql`DROP TABLE \`theme_locales\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_stats\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_stats_locales\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_about_pillars\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_about_pillars_locales\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_services\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_services_locales\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_testimonials_locales\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_footer_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_footer_columns_locales\`;`)
  await db.run(sql`DROP TABLE \`_theme_v\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_locales\`;`)
}
