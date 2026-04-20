import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`blocks_company_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`stat_value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_company_stats_order_idx\` ON \`blocks_company_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_company_stats_parent_id_idx\` ON \`blocks_company_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_company_stats_locales\` (
  	\`stat_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks_company_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_company_stats_locales_locale_parent_id_unique\` ON \`blocks_company_stats_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_values\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value_icon_id\` integer,
  	FOREIGN KEY (\`value_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_values_order_idx\` ON \`blocks_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_values_parent_id_idx\` ON \`blocks_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_values_value_icon_idx\` ON \`blocks_values\` (\`value_icon_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_values_locales\` (
  	\`value_title\` text,
  	\`value_desc\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks_values\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_values_locales_locale_parent_id_unique\` ON \`blocks_values_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_team_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`avatar_id\` integer,
  	\`member_name\` text,
  	\`member_role\` text,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_team_members_order_idx\` ON \`blocks_team_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_team_members_parent_id_idx\` ON \`blocks_team_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_team_members_avatar_idx\` ON \`blocks_team_members\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_team_members_locales\` (
  	\`member_bio\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks_team_members\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_team_members_locales_locale_parent_id_unique\` ON \`blocks_team_members_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_faq_items_order_idx\` ON \`blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_faq_items_parent_id_idx\` ON \`blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_faq_items_locales\` (
  	\`question\` text,
  	\`answer\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks_faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_faq_items_locales_locale_parent_id_unique\` ON \`blocks_faq_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_breadcrumb_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`breadcrumb_label\` text,
  	\`breadcrumb_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_breadcrumb_items_order_idx\` ON \`blocks_breadcrumb_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_breadcrumb_items_parent_id_idx\` ON \`blocks_breadcrumb_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_card_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`card_icon_src\` text,
  	\`card_title\` text,
  	\`card_description\` text,
  	\`card_features\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_card_items_order_idx\` ON \`blocks_card_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_card_items_parent_id_idx\` ON \`blocks_card_items\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`badge_icon_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`about_hero_video_url\` text;`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`company_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`mission_icon_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`vision_icon_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`badge_icon_src\` text;`)
  await db.run(sql`CREATE INDEX \`blocks_badge_icon_idx\` ON \`blocks\` (\`badge_icon_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_company_image_idx\` ON \`blocks\` (\`company_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_mission_icon_idx\` ON \`blocks\` (\`mission_icon_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_vision_icon_idx\` ON \`blocks\` (\`vision_icon_id\`);`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`about_hero_heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`about_hero_subheading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`about_company_heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`body1\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`body2\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`mission_heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`mission_body\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`vision_heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`vision_body\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`values_heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`leadership_heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`leadership_subheading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`faq_heading\` text;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`faq_subheading\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`blocks_company_stats\`;`)
  await db.run(sql`DROP TABLE \`blocks_company_stats_locales\`;`)
  await db.run(sql`DROP TABLE \`blocks_values\`;`)
  await db.run(sql`DROP TABLE \`blocks_values_locales\`;`)
  await db.run(sql`DROP TABLE \`blocks_team_members\`;`)
  await db.run(sql`DROP TABLE \`blocks_team_members_locales\`;`)
  await db.run(sql`DROP TABLE \`blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`blocks_faq_items_locales\`;`)
  await db.run(sql`DROP TABLE \`blocks_breadcrumb_items\`;`)
  await db.run(sql`DROP TABLE \`blocks_card_items\`;`)
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
  	\`badge\` text,
  	\`cta_primary_label\` text,
  	\`cta_primary_url\` text,
  	\`cta_secondary_label\` text,
  	\`cta_secondary_url\` text,
  	\`hero_image_id\` integer,
  	\`custom_solution_cta_label\` text,
  	\`custom_solution_cta_url\` text,
  	\`contact_email\` text,
  	\`contact_phone\` text,
  	\`contact_location\` text,
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
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_blocks\`("id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "badge", "cta_primary_label", "cta_primary_url", "cta_secondary_label", "cta_secondary_url", "hero_image_id", "custom_solution_cta_label", "custom_solution_cta_url", "contact_email", "contact_phone", "contact_location", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at") SELECT "id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "badge", "cta_primary_label", "cta_primary_url", "cta_secondary_label", "cta_secondary_url", "hero_image_id", "custom_solution_cta_label", "custom_solution_cta_url", "contact_email", "contact_phone", "contact_location", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at" FROM \`blocks\`;`)
  await db.run(sql`DROP TABLE \`blocks\`;`)
  await db.run(sql`ALTER TABLE \`__new_blocks\` RENAME TO \`blocks\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`blocks_image_idx\` ON \`blocks\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_hero_image_idx\` ON \`blocks\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_updated_at_idx\` ON \`blocks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blocks_created_at_idx\` ON \`blocks\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`about_hero_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`about_hero_subheading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`about_company_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`body1\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`body2\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`mission_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`mission_body\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`vision_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`vision_body\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`values_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`leadership_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`leadership_subheading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`faq_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`faq_subheading\`;`)
}
