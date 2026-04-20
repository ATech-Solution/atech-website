import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`blocks_hero_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`stat_value\` text,
  	\`stat_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_hero_stats_order_idx\` ON \`blocks_hero_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_hero_stats_parent_id_idx\` ON \`blocks_hero_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_floating_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`card_text\` text,
  	\`card_position\` text DEFAULT 'top-right',
  	\`card_icon_id\` integer,
  	FOREIGN KEY (\`card_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_floating_cards_order_idx\` ON \`blocks_floating_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_floating_cards_parent_id_idx\` ON \`blocks_floating_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_floating_cards_card_icon_idx\` ON \`blocks_floating_cards\` (\`card_icon_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_pillars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pillar_icon_id\` integer,
  	FOREIGN KEY (\`pillar_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_pillars_order_idx\` ON \`blocks_pillars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_pillars_parent_id_idx\` ON \`blocks_pillars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_pillars_pillar_icon_idx\` ON \`blocks_pillars\` (\`pillar_icon_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_pillars_locales\` (
  	\`pillar_title\` text,
  	\`pillar_desc\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks_pillars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_pillars_locales_locale_parent_id_unique\` ON \`blocks_pillars_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_service_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`service_icon_id\` integer,
  	\`service_href\` text,
  	FOREIGN KEY (\`service_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_service_items_order_idx\` ON \`blocks_service_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_service_items_parent_id_idx\` ON \`blocks_service_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_service_items_service_icon_idx\` ON \`blocks_service_items\` (\`service_icon_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_service_items_locales\` (
  	\`service_title\` text,
  	\`service_desc\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks_service_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_service_items_locales_locale_parent_id_unique\` ON \`blocks_service_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_testimonial_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`client_name\` text,
  	\`client_role\` text,
  	\`client_company\` text,
  	\`rating\` numeric DEFAULT 5,
  	\`avatar_id\` integer,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_testimonial_items_order_idx\` ON \`blocks_testimonial_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_testimonial_items_parent_id_idx\` ON \`blocks_testimonial_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_testimonial_items_avatar_idx\` ON \`blocks_testimonial_items\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_testimonial_items_locales\` (
  	\`quote\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks_testimonial_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_testimonial_items_locales_locale_parent_id_unique\` ON \`blocks_testimonial_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`page_template\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`page_type\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_page_template\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_page_type\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`badge\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`cta_primary_label\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`cta_primary_url\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`cta_secondary_label\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`cta_secondary_url\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`hero_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`custom_solution_cta_label\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`custom_solution_cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`contact_email\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`contact_phone\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`contact_location\` text;`)
  await db.run(sql`CREATE INDEX \`blocks_hero_image_idx\` ON \`blocks\` (\`hero_image_id\`);`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`body\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`subheading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`custom_solution_heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`custom_solution_body\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`contact_subheading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`form_heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`submit_label\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`info_heading\` text;`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`color_scheme\` text DEFAULT 'dark';`)
  await db.run(sql`ALTER TABLE \`theme\` DROP COLUMN \`nav_cta_label\`;`)
  await db.run(sql`ALTER TABLE \`theme\` DROP COLUMN \`nav_cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_color_scheme\` text DEFAULT 'dark';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` DROP COLUMN \`version_nav_cta_label\`;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` DROP COLUMN \`version_nav_cta_url\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`blocks_hero_stats\`;`)
  await db.run(sql`DROP TABLE \`blocks_floating_cards\`;`)
  await db.run(sql`DROP TABLE \`blocks_pillars\`;`)
  await db.run(sql`DROP TABLE \`blocks_pillars_locales\`;`)
  await db.run(sql`DROP TABLE \`blocks_service_items\`;`)
  await db.run(sql`DROP TABLE \`blocks_service_items_locales\`;`)
  await db.run(sql`DROP TABLE \`blocks_testimonial_items\`;`)
  await db.run(sql`DROP TABLE \`blocks_testimonial_items_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_blocks\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`block_type\` text NOT NULL,
  	\`category\` text DEFAULT 'basic' NOT NULL,
  	\`image_id\` integer,
  	\`video_url\` text,
  	\`button_label\` text,
  	\`button_url\` text,
  	\`html_content\` text,
  	\`map_embed_url\` text,
  	\`icon_name\` text,
  	\`columns\` text DEFAULT '3',
  	\`alert_type\` text DEFAULT 'info',
  	\`text_align\` text DEFAULT 'left',
  	\`font_family\` text,
  	\`font_size\` text,
  	\`font_weight\` text,
  	\`line_height\` text,
  	\`letter_spacing\` text,
  	\`paragraph_spacing\` text,
  	\`text_shadow_x\` text,
  	\`text_shadow_y\` text,
  	\`text_shadow_blur\` text,
  	\`text_shadow_color\` text,
  	\`text_color_normal\` text,
  	\`text_color_hover\` text,
  	\`link_color_normal\` text,
  	\`link_color_hover\` text,
  	\`background_color\` text,
  	\`border_radius\` text,
  	\`custom_c_s_s\` text,
  	\`padding_top\` text,
  	\`padding_right\` text,
  	\`padding_bottom\` text,
  	\`padding_left\` text,
  	\`margin_top\` text,
  	\`margin_right\` text,
  	\`margin_bottom\` text,
  	\`margin_left\` text,
  	\`width\` text,
  	\`position\` text DEFAULT 'relative',
  	\`z_index\` numeric,
  	\`css_class_name\` text,
  	\`html_id\` text,
  	\`hide_on_mobile\` integer DEFAULT false,
  	\`hide_on_tablet\` integer DEFAULT false,
  	\`hide_on_desktop\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_blocks\`("id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at") SELECT "id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at" FROM \`blocks\`;`)
  await db.run(sql`DROP TABLE \`blocks\`;`)
  await db.run(sql`ALTER TABLE \`__new_blocks\` RENAME TO \`blocks\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`blocks_image_idx\` ON \`blocks\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_updated_at_idx\` ON \`blocks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blocks_created_at_idx\` ON \`blocks\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`page_type\` text DEFAULT 'other';`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`page_template\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_page_type\` text DEFAULT 'other';`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_page_template\`;`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`nav_cta_label\` text DEFAULT 'Get a Quote';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`nav_cta_url\` text DEFAULT '/contact';`)
  await db.run(sql`ALTER TABLE \`theme\` DROP COLUMN \`color_scheme\`;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_nav_cta_label\` text DEFAULT 'Get a Quote';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_nav_cta_url\` text DEFAULT '/contact';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` DROP COLUMN \`version_color_scheme\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`body\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`subheading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`custom_solution_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`custom_solution_body\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`contact_subheading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`form_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`submit_label\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`info_heading\`;`)
}
