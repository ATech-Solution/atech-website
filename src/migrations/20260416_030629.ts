import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`plugins_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature_name\` text NOT NULL,
  	\`feature_description\` text,
  	\`feature_type\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plugins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plugins_features_order_idx\` ON \`plugins_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`plugins_features_parent_id_idx\` ON \`plugins_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`plugins\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`plugin_type\` text DEFAULT 'utility',
  	\`category\` text DEFAULT 'utility',
  	\`status\` text DEFAULT 'inactive' NOT NULL,
  	\`version\` text,
  	\`author\` text,
  	\`icon_id\` integer,
  	\`script_code\` text,
  	\`plugin_file_id\` integer,
  	\`settings\` text,
  	\`auto_activate\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`plugin_file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`plugins_slug_idx\` ON \`plugins\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`plugins_icon_idx\` ON \`plugins\` (\`icon_id\`);`)
  await db.run(sql`CREATE INDEX \`plugins_plugin_file_idx\` ON \`plugins\` (\`plugin_file_id\`);`)
  await db.run(sql`CREATE INDEX \`plugins_updated_at_idx\` ON \`plugins\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`plugins_created_at_idx\` ON \`plugins\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`blocks_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`icon\` text,
  	\`value\` text,
  	\`url\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blocks_items_order_idx\` ON \`blocks_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blocks_items_parent_id_idx\` ON \`blocks_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_items_image_idx\` ON \`blocks_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks_items_locales\` (
  	\`label\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_items_locales_locale_parent_id_unique\` ON \`blocks_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blocks\` (
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
  await db.run(sql`CREATE INDEX \`blocks_image_idx\` ON \`blocks\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_updated_at_idx\` ON \`blocks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blocks_created_at_idx\` ON \`blocks\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`blocks_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_locales_locale_parent_id_unique\` ON \`blocks_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`layout_builder\` text DEFAULT '[]';`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_layout_builder\` text DEFAULT '[]';`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`plugins_id\` integer REFERENCES plugins(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`blocks_id\` integer REFERENCES blocks(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_plugins_id_idx\` ON \`payload_locked_documents_rels\` (\`plugins_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blocks_id_idx\` ON \`payload_locked_documents_rels\` (\`blocks_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`plugins_features\`;`)
  await db.run(sql`DROP TABLE \`plugins\`;`)
  await db.run(sql`DROP TABLE \`blocks_items\`;`)
  await db.run(sql`DROP TABLE \`blocks_items_locales\`;`)
  await db.run(sql`DROP TABLE \`blocks\`;`)
  await db.run(sql`DROP TABLE \`blocks_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`categories_id\` integer,
  	\`media_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`redirects_id\` integer,
  	\`search_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "media_id", "forms_id", "form_submissions_id", "redirects_id", "search_id") SELECT "id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "media_id", "forms_id", "form_submissions_id", "redirects_id", "search_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`layout_builder\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_layout_builder\`;`)
}
