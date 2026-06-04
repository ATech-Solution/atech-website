import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ── portfolio_categories (no deps — create first) ─────────────────────────
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`portfolio_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`parent_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`portfolio_categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`portfolio_categories_slug_idx\` ON \`portfolio_categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_categories_parent_idx\` ON \`portfolio_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_categories_updated_at_idx\` ON \`portfolio_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_categories_created_at_idx\` ON \`portfolio_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`portfolio_categories_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`portfolio_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`portfolio_categories_locales_locale_parent_id_unique\` ON \`portfolio_categories_locales\` (\`_locale\`,\`_parent_id\`);`)

  // ── portfolio (depends on portfolio_categories + media) ───────────────────
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`portfolio\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`featured_image_id\` integer,
  	\`client\` text,
  	\`duration\` text,
  	\`year\` text,
  	\`team_size\` text,
  	\`published_at\` text,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`portfolio_slug_idx\` ON \`portfolio\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_featured_image_idx\` ON \`portfolio\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_updated_at_idx\` ON \`portfolio\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_created_at_idx\` ON \`portfolio\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`portfolio_locales\` (
  	\`title\` text NOT NULL,
  	\`excerpt\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`portfolio_locales_locale_parent_id_unique\` ON \`portfolio_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`portfolio_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`portfolio_categories_id\` integer,
  	\`portfolio_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`portfolio_categories_id\`) REFERENCES \`portfolio_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`portfolio_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_rels_order_idx\` ON \`portfolio_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_rels_parent_idx\` ON \`portfolio_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_rels_path_idx\` ON \`portfolio_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_rels_portfolio_categories_id_idx\` ON \`portfolio_rels\` (\`portfolio_categories_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_rels_portfolio_id_idx\` ON \`portfolio_rels\` (\`portfolio_id\`);`)

  // ── portfolio_key_metrics (depends on portfolio — create after) ───────────
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`portfolio_key_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`metric_value\` text,
  	\`metric_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_key_metrics_order_idx\` ON \`portfolio_key_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`portfolio_key_metrics_parent_id_idx\` ON \`portfolio_key_metrics\` (\`_parent_id\`);`)

  // ── _portfolio_v (versions — depends on portfolio + media) ────────────────
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_portfolio_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text NOT NULL,
  	\`version_featured_image_id\` integer,
  	\`version_client\` text,
  	\`version_duration\` text,
  	\`version_year\` text,
  	\`version_team_size\` text,
  	\`version_published_at\` text,
  	\`version_status\` text DEFAULT 'draft' NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_parent_idx\` ON \`_portfolio_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_version_slug_idx\` ON \`_portfolio_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_version_featured_image_idx\` ON \`_portfolio_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_version_updated_at_idx\` ON \`_portfolio_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_version_created_at_idx\` ON \`_portfolio_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_created_at_idx\` ON \`_portfolio_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_updated_at_idx\` ON \`_portfolio_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_portfolio_v_locales\` (
  	\`version_title\` text NOT NULL,
  	\`version_excerpt\` text,
  	\`version_content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_portfolio_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`_portfolio_v_locales_locale_parent_id_unique\` ON \`_portfolio_v_locales\` (\`_locale\`,\`_parent_id\`);`)

  // ── _portfolio_v_version_key_metrics (depends on _portfolio_v) ────────────
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_portfolio_v_version_key_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`metric_value\` text,
  	\`metric_label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_portfolio_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_key_metrics_order_idx\` ON \`_portfolio_v_version_key_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_version_key_metrics_parent_id_idx\` ON \`_portfolio_v_version_key_metrics\` (\`_parent_id\`);`)

  // ── _portfolio_v_rels (depends on _portfolio_v) ───────────────────────────
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_portfolio_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`portfolio_categories_id\` integer,
  	\`portfolio_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_portfolio_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`portfolio_categories_id\`) REFERENCES \`portfolio_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`portfolio_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_rels_order_idx\` ON \`_portfolio_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_rels_parent_idx\` ON \`_portfolio_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_rels_path_idx\` ON \`_portfolio_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_rels_portfolio_categories_id_idx\` ON \`_portfolio_v_rels\` (\`portfolio_categories_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_portfolio_v_rels_portfolio_id_idx\` ON \`_portfolio_v_rels\` (\`portfolio_id\`);`)

  // ── blocks_project_items ──────────────────────────────────────────────────
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`blocks_project_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`project_image_id\` integer,
  	\`project_tag\` text,
  	\`project_type\` text,
  	\`project_title\` text,
  	\`project_desc\` text,
  	\`project_cta\` text,
  	\`project_url\` text,
  	FOREIGN KEY (\`project_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blocks_project_items_order_idx\` ON \`blocks_project_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blocks_project_items_parent_id_idx\` ON \`blocks_project_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blocks_project_items_project_image_idx\` ON \`blocks_project_items\` (\`project_image_id\`);`)

  // ── ALTER TABLE blocks (add columns if missing) ───────────────────────────
  const blocksInfo: any[] = await db.all(sql`PRAGMA table_info(blocks);`)
  const blocksCols = blocksInfo.map((r: any) => r.name)
  if (!blocksCols.includes('show_category_filter'))
    await db.run(sql`ALTER TABLE \`blocks\` ADD \`show_category_filter\` integer DEFAULT true;`)
  if (!blocksCols.includes('project_content_source'))
    await db.run(sql`ALTER TABLE \`blocks\` ADD \`project_content_source\` text DEFAULT 'manual';`)
  if (!blocksCols.includes('project_limit'))
    await db.run(sql`ALTER TABLE \`blocks\` ADD \`project_limit\` numeric DEFAULT 9;`)
  if (!blocksCols.includes('project_category'))
    await db.run(sql`ALTER TABLE \`blocks\` ADD \`project_category\` text;`)
  if (!blocksCols.includes('project_order_by'))
    await db.run(sql`ALTER TABLE \`blocks\` ADD \`project_order_by\` text DEFAULT 'publishedAt_desc';`)

  const blocksLocalesInfo: any[] = await db.all(sql`PRAGMA table_info(blocks_locales);`)
  const blocksLocalesCols = blocksLocalesInfo.map((r: any) => r.name)
  if (!blocksLocalesCols.includes('project_heading'))
    await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`project_heading\` text;`)
  if (!blocksLocalesCols.includes('project_subheading'))
    await db.run(sql`ALTER TABLE \`blocks_locales\` ADD \`project_subheading\` text;`)

  // ── payload_locked_documents_rels (add columns if missing) ───────────────
  const pldrInfo: any[] = await db.all(sql`PRAGMA table_info(payload_locked_documents_rels);`)
  const pldrCols = pldrInfo.map((r: any) => r.name)
  if (!pldrCols.includes('portfolio_id')) {
    await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`portfolio_id\` integer REFERENCES portfolio(id);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_portfolio_id_idx\` ON \`payload_locked_documents_rels\` (\`portfolio_id\`);`)
  }
  if (!pldrCols.includes('portfolio_categories_id')) {
    await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`portfolio_categories_id\` integer REFERENCES portfolio_categories(id);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_portfolio_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`portfolio_categories_id\`);`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`_portfolio_v_version_key_metrics\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_portfolio_v_rels\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_portfolio_v_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_portfolio_v\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`portfolio_key_metrics\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`portfolio_rels\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`portfolio_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`portfolio\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`portfolio_categories_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`portfolio_categories\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`blocks_project_items\`;`)
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
  	\`plugins_id\` integer,
  	\`blocks_id\` integer,
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
  	FOREIGN KEY (\`plugins_id\`) REFERENCES \`plugins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blocks_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "media_id", "plugins_id", "blocks_id", "forms_id", "form_submissions_id", "redirects_id", "search_id") SELECT "id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "media_id", "plugins_id", "blocks_id", "forms_id", "form_submissions_id", "redirects_id", "search_id" FROM \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_plugins_id_idx\` ON \`payload_locked_documents_rels\` (\`plugins_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blocks_id_idx\` ON \`payload_locked_documents_rels\` (\`blocks_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`show_category_filter\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`project_content_source\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`project_limit\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`project_category\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`project_order_by\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`project_heading\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`project_subheading\`;`)
}
