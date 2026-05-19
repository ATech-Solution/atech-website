import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_seo_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`topic\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_seo_topics_order_idx\` ON \`pages_seo_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_seo_topics_parent_id_idx\` ON \`pages_seo_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_seo_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`topic\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_seo_topics_order_idx\` ON \`_pages_v_version_seo_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_seo_topics_parent_id_idx\` ON \`_pages_v_version_seo_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`posts_seo_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`topic\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_seo_topics_order_idx\` ON \`posts_seo_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`posts_seo_topics_parent_id_idx\` ON \`posts_seo_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_version_seo_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`topic\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_version_seo_topics_order_idx\` ON \`_posts_v_version_seo_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_seo_topics_parent_id_idx\` ON \`_posts_v_version_seo_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`portfolio_seo_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`topic\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`portfolio_seo_topics_order_idx\` ON \`portfolio_seo_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_seo_topics_parent_id_idx\` ON \`portfolio_seo_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_portfolio_v_version_seo_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`topic\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_portfolio_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_portfolio_v_version_seo_topics_order_idx\` ON \`_portfolio_v_version_seo_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_v_version_seo_topics_parent_id_idx\` ON \`_portfolio_v_version_seo_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`job_vacancies_seo_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`topic\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`job_vacancies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`job_vacancies_seo_topics_order_idx\` ON \`job_vacancies_seo_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`job_vacancies_seo_topics_parent_id_idx\` ON \`job_vacancies_seo_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`job_vacancies_locales\` (
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_og_title\` text,
  	\`meta_og_description\` text,
  	\`seo_llms_entry\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`job_vacancies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`job_vacancies_locales_locale_parent_id_unique\` ON \`job_vacancies_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_robots_disallow\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`path\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_robots_disallow_order_idx\` ON \`settings_robots_disallow\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_robots_disallow_parent_id_idx\` ON \`settings_robots_disallow\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_version_robots_disallow\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`path\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_version_robots_disallow_order_idx\` ON \`_settings_v_version_robots_disallow\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_version_robots_disallow_parent_id_idx\` ON \`_settings_v_version_robots_disallow\` (\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_locales\` (
  	\`title\` text NOT NULL,
  	\`excerpt\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_og_title\` text,
  	\`meta_og_description\` text,
  	\`seo_llms_entry\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_locales\`("title", "excerpt", "meta_title", "meta_description", "id", "_locale", "_parent_id") SELECT "title", "excerpt", "meta_title", "meta_description", "id", "_locale", "_parent_id" FROM \`pages_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_locales\` RENAME TO \`pages_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_locales_locale_parent_id_unique\` ON \`pages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_locales\` (
  	\`version_title\` text NOT NULL,
  	\`version_excerpt\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_og_title\` text,
  	\`version_meta_og_description\` text,
  	\`version_seo_llms_entry\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_locales\`("version_title", "version_excerpt", "version_meta_title", "version_meta_description", "id", "_locale", "_parent_id") SELECT "version_title", "version_excerpt", "version_meta_title", "version_meta_description", "id", "_locale", "_parent_id" FROM \`_pages_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_locales\` RENAME TO \`_pages_v_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_locales_locale_parent_id_unique\` ON \`_pages_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_posts_locales\` (
  	\`title\` text NOT NULL,
  	\`excerpt\` text,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_og_title\` text,
  	\`meta_og_description\` text,
  	\`seo_llms_entry\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_posts_locales\`("title", "excerpt", "content", "meta_title", "meta_description", "id", "_locale", "_parent_id") SELECT "title", "excerpt", "content", "meta_title", "meta_description", "id", "_locale", "_parent_id" FROM \`posts_locales\`;`)
  await db.run(sql`DROP TABLE \`posts_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_posts_locales\` RENAME TO \`posts_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_locales_locale_parent_id_unique\` ON \`posts_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__posts_v_locales\` (
  	\`version_title\` text NOT NULL,
  	\`version_excerpt\` text,
  	\`version_content\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_og_title\` text,
  	\`version_meta_og_description\` text,
  	\`version_seo_llms_entry\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__posts_v_locales\`("version_title", "version_excerpt", "version_content", "version_meta_title", "version_meta_description", "id", "_locale", "_parent_id") SELECT "version_title", "version_excerpt", "version_content", "version_meta_title", "version_meta_description", "id", "_locale", "_parent_id" FROM \`_posts_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__posts_v_locales\` RENAME TO \`_posts_v_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_posts_v_locales_locale_parent_id_unique\` ON \`_posts_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`meta_no_index\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`meta_canonical\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`seo_content_type\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`seo_target_audience\` text;`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_meta_no_index\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_meta_canonical\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_seo_content_type\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_seo_target_audience\` text;`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`meta_no_index\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`meta_canonical\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`seo_content_type\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`seo_target_audience\` text;`)
  await db.run(sql`CREATE INDEX \`posts_meta_meta_image_idx\` ON \`posts\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_meta_no_index\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_meta_canonical\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_seo_content_type\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_seo_target_audience\` text;`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_meta_version_meta_image_idx\` ON \`_posts_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`portfolio\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`portfolio\` ADD \`meta_no_index\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`portfolio\` ADD \`meta_canonical\` text;`)
  await db.run(sql`ALTER TABLE \`portfolio\` ADD \`seo_content_type\` text;`)
  await db.run(sql`ALTER TABLE \`portfolio\` ADD \`seo_target_audience\` text;`)
  await db.run(sql`CREATE INDEX \`portfolio_meta_meta_image_idx\` ON \`portfolio\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` ADD \`meta_og_title\` text;`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` ADD \`meta_og_description\` text;`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` ADD \`seo_llms_entry\` text;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_portfolio_v\` ADD \`version_meta_no_index\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v\` ADD \`version_meta_canonical\` text;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v\` ADD \`version_seo_content_type\` text;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v\` ADD \`version_seo_target_audience\` text;`)
  await db.run(sql`CREATE INDEX \`_portfolio_v_version_meta_version_meta_image_idx\` ON \`_portfolio_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` ADD \`version_meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` ADD \`version_meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` ADD \`version_meta_og_title\` text;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` ADD \`version_meta_og_description\` text;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` ADD \`version_seo_llms_entry\` text;`)
  await db.run(sql`ALTER TABLE \`job_vacancies\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`job_vacancies\` ADD \`meta_no_index\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`job_vacancies\` ADD \`meta_canonical\` text;`)
  await db.run(sql`ALTER TABLE \`job_vacancies\` ADD \`seo_content_type\` text;`)
  await db.run(sql`ALTER TABLE \`job_vacancies\` ADD \`seo_target_audience\` text;`)
  await db.run(sql`CREATE INDEX \`job_vacancies_meta_meta_image_idx\` ON \`job_vacancies\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`canonical_domain\` text DEFAULT 'https://atech.software';`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`crawl_delay\` numeric;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`llms_txt_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_canonical_domain\` text DEFAULT 'https://atech.software';`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_crawl_delay\` numeric;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_llms_txt_enabled\` integer DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_seo_topics\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_seo_topics\`;`)
  await db.run(sql`DROP TABLE \`posts_seo_topics\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_version_seo_topics\`;`)
  await db.run(sql`DROP TABLE \`portfolio_seo_topics\`;`)
  await db.run(sql`DROP TABLE \`_portfolio_v_version_seo_topics\`;`)
  await db.run(sql`DROP TABLE \`job_vacancies_seo_topics\`;`)
  await db.run(sql`DROP TABLE \`job_vacancies_locales\`;`)
  await db.run(sql`DROP TABLE \`settings_robots_disallow\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_version_robots_disallow\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`layout_builder\` text DEFAULT '[]',
  	\`published_at\` text,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`page_template\` text,
  	\`is_frontpage\` integer DEFAULT false,
  	\`portfolio_detail_template\` integer DEFAULT false,
  	\`article_detail_template\` integer DEFAULT false,
  	\`parent_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages\`("id", "slug", "layout_builder", "published_at", "status", "page_template", "is_frontpage", "portfolio_detail_template", "article_detail_template", "parent_id", "updated_at", "created_at") SELECT "id", "slug", "layout_builder", "published_at", "status", "page_template", "is_frontpage", "portfolio_detail_template", "article_detail_template", "parent_id", "updated_at", "created_at" FROM \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_parent_idx\` ON \`pages\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text NOT NULL,
  	\`version_layout_builder\` text DEFAULT '[]',
  	\`version_published_at\` text,
  	\`version_status\` text DEFAULT 'draft' NOT NULL,
  	\`version_page_template\` text,
  	\`version_is_frontpage\` integer DEFAULT false,
  	\`version_portfolio_detail_template\` integer DEFAULT false,
  	\`version_article_detail_template\` integer DEFAULT false,
  	\`version_parent_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v\`("id", "parent_id", "version_slug", "version_layout_builder", "version_published_at", "version_status", "version_page_template", "version_is_frontpage", "version_portfolio_detail_template", "version_article_detail_template", "version_parent_id", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "parent_id", "version_slug", "version_layout_builder", "version_published_at", "version_status", "version_page_template", "version_is_frontpage", "version_portfolio_detail_template", "version_article_detail_template", "version_parent_id", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v\` RENAME TO \`_pages_v\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_parent_idx\` ON \`_pages_v\` (\`version_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`author_id\` integer,
  	\`featured_image_id\` integer,
  	\`published_at\` text,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_posts\`("id", "slug", "author_id", "featured_image_id", "published_at", "status", "updated_at", "created_at") SELECT "id", "slug", "author_id", "featured_image_id", "published_at", "status", "updated_at", "created_at" FROM \`posts\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`ALTER TABLE \`__new_posts\` RENAME TO \`posts\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_author_idx\` ON \`posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_featured_image_idx\` ON \`posts\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new__posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text NOT NULL,
  	\`version_author_id\` integer,
  	\`version_featured_image_id\` integer,
  	\`version_published_at\` text,
  	\`version_status\` text DEFAULT 'draft' NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__posts_v\`("id", "parent_id", "version_slug", "version_author_id", "version_featured_image_id", "version_published_at", "version_status", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "parent_id", "version_slug", "version_author_id", "version_featured_image_id", "version_published_at", "version_status", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__posts_v\` RENAME TO \`_posts_v\`;`)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_author_idx\` ON \`_posts_v\` (\`version_author_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_featured_image_idx\` ON \`_posts_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_portfolio\` (
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
  await db.run(sql`INSERT INTO \`__new_portfolio\`("id", "slug", "featured_image_id", "client", "duration", "year", "team_size", "published_at", "status", "updated_at", "created_at") SELECT "id", "slug", "featured_image_id", "client", "duration", "year", "team_size", "published_at", "status", "updated_at", "created_at" FROM \`portfolio\`;`)
  await db.run(sql`DROP TABLE \`portfolio\`;`)
  await db.run(sql`ALTER TABLE \`__new_portfolio\` RENAME TO \`portfolio\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`portfolio_slug_idx\` ON \`portfolio\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_featured_image_idx\` ON \`portfolio\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_updated_at_idx\` ON \`portfolio\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_created_at_idx\` ON \`portfolio\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new__portfolio_v\` (
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
  await db.run(sql`INSERT INTO \`__new__portfolio_v\`("id", "parent_id", "version_slug", "version_featured_image_id", "version_client", "version_duration", "version_year", "version_team_size", "version_published_at", "version_status", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "parent_id", "version_slug", "version_featured_image_id", "version_client", "version_duration", "version_year", "version_team_size", "version_published_at", "version_status", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_portfolio_v\`;`)
  await db.run(sql`DROP TABLE \`_portfolio_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__portfolio_v\` RENAME TO \`_portfolio_v\`;`)
  await db.run(sql`CREATE INDEX \`_portfolio_v_parent_idx\` ON \`_portfolio_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_v_version_version_slug_idx\` ON \`_portfolio_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_v_version_version_featured_image_idx\` ON \`_portfolio_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_v_version_version_updated_at_idx\` ON \`_portfolio_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_v_version_version_created_at_idx\` ON \`_portfolio_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_v_created_at_idx\` ON \`_portfolio_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_v_updated_at_idx\` ON \`_portfolio_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_job_vacancies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`position_type\` text DEFAULT 'full-time' NOT NULL,
  	\`category\` text,
  	\`location\` text,
  	\`excerpt\` text,
  	\`description\` text,
  	\`apply_label\` text DEFAULT 'Apply Now',
  	\`apply_url\` text,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_job_vacancies\`("id", "title", "position_type", "category", "location", "excerpt", "description", "apply_label", "apply_url", "status", "order", "updated_at", "created_at") SELECT "id", "title", "position_type", "category", "location", "excerpt", "description", "apply_label", "apply_url", "status", "order", "updated_at", "created_at" FROM \`job_vacancies\`;`)
  await db.run(sql`DROP TABLE \`job_vacancies\`;`)
  await db.run(sql`ALTER TABLE \`__new_job_vacancies\` RENAME TO \`job_vacancies\`;`)
  await db.run(sql`CREATE INDEX \`job_vacancies_updated_at_idx\` ON \`job_vacancies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`job_vacancies_created_at_idx\` ON \`job_vacancies\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`pages_locales\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`meta_og_title\`;`)
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`meta_og_description\`;`)
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`seo_llms_entry\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_meta_og_title\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_meta_og_description\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_seo_llms_entry\`;`)
  await db.run(sql`ALTER TABLE \`posts_locales\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`posts_meta_meta_image_idx\` ON \`posts_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`posts_locales\` DROP COLUMN \`meta_og_title\`;`)
  await db.run(sql`ALTER TABLE \`posts_locales\` DROP COLUMN \`meta_og_description\`;`)
  await db.run(sql`ALTER TABLE \`posts_locales\` DROP COLUMN \`seo_llms_entry\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_meta_version_meta_image_idx\` ON \`_posts_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` DROP COLUMN \`version_meta_og_title\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` DROP COLUMN \`version_meta_og_description\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` DROP COLUMN \`version_seo_llms_entry\`;`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` DROP COLUMN \`meta_title\`;`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` DROP COLUMN \`meta_description\`;`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` DROP COLUMN \`meta_og_title\`;`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` DROP COLUMN \`meta_og_description\`;`)
  await db.run(sql`ALTER TABLE \`portfolio_locales\` DROP COLUMN \`seo_llms_entry\`;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` DROP COLUMN \`version_meta_title\`;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` DROP COLUMN \`version_meta_description\`;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` DROP COLUMN \`version_meta_og_title\`;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` DROP COLUMN \`version_meta_og_description\`;`)
  await db.run(sql`ALTER TABLE \`_portfolio_v_locales\` DROP COLUMN \`version_seo_llms_entry\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`canonical_domain\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`crawl_delay\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`llms_txt_enabled\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_canonical_domain\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_crawl_delay\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_llms_txt_enabled\`;`)
}
