import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_cards_grid_cards_locales\` (
  	\`heading\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cards_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_cards_grid_cards_locales\`("heading", "body", "id", "_locale", "_parent_id") SELECT "heading", "body", "id", "_locale", "_parent_id" FROM \`pages_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_cards_grid_cards_locales\` RENAME TO \`pages_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_cards_grid_cards_locales_locale_parent_id_unique\` ON \`pages_blocks_cards_grid_cards_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_testimonials_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`author\` text,
  	\`role\` text,
  	\`avatar_id\` integer,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_testimonials_items\`("_order", "_parent_id", "id", "author", "role", "avatar_id") SELECT "_order", "_parent_id", "id", "author", "role", "avatar_id" FROM \`pages_blocks_testimonials_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_testimonials_items\` RENAME TO \`pages_blocks_testimonials_items\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_items_order_idx\` ON \`pages_blocks_testimonials_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_items_parent_id_idx\` ON \`pages_blocks_testimonials_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_items_avatar_idx\` ON \`pages_blocks_testimonials_items\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_testimonials_items_locales\` (
  	\`quote\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_testimonials_items_locales\`("quote", "id", "_locale", "_parent_id") SELECT "quote", "id", "_locale", "_parent_id" FROM \`pages_blocks_testimonials_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_testimonials_items_locales\` RENAME TO \`pages_blocks_testimonials_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_testimonials_items_locales_locale_parent_id_unique\` ON \`pages_blocks_testimonials_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_stats_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`number\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_stats_items\`("_order", "_parent_id", "id", "number") SELECT "_order", "_parent_id", "id", "number" FROM \`pages_blocks_stats_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_stats_items\` RENAME TO \`pages_blocks_stats_items\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_items_order_idx\` ON \`pages_blocks_stats_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_items_parent_id_idx\` ON \`pages_blocks_stats_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_stats_items_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_stats_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_stats_items_locales\`("label", "id", "_locale", "_parent_id") SELECT "label", "id", "_locale", "_parent_id" FROM \`pages_blocks_stats_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_stats_items_locales\` RENAME TO \`pages_blocks_stats_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_stats_items_locales_locale_parent_id_unique\` ON \`pages_blocks_stats_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_faq_items_locales\` (
  	\`question\` text,
  	\`answer\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_faq_items_locales\`("question", "answer", "id", "_locale", "_parent_id") SELECT "question", "answer", "id", "_locale", "_parent_id" FROM \`pages_blocks_faq_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_faq_items_locales\` RENAME TO \`pages_blocks_faq_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_faq_items_locales_locale_parent_id_unique\` ON \`pages_blocks_faq_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`url\` text,
  	\`poster_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_video\`("_order", "_parent_id", "_path", "id", "url", "poster_id", "block_name") SELECT "_order", "_parent_id", "_path", "id", "url", "poster_id", "block_name" FROM \`pages_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_video\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_video\` RENAME TO \`pages_blocks_video\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_order_idx\` ON \`pages_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_parent_id_idx\` ON \`pages_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_path_idx\` ON \`pages_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_poster_idx\` ON \`pages_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_form_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`form_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_form_block\`("_order", "_parent_id", "_path", "id", "form_id", "block_name") SELECT "_order", "_parent_id", "_path", "id", "form_id", "block_name" FROM \`pages_blocks_form_block\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_form_block\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_form_block\` RENAME TO \`pages_blocks_form_block\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_order_idx\` ON \`pages_blocks_form_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_parent_id_idx\` ON \`pages_blocks_form_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_path_idx\` ON \`pages_blocks_form_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_form_idx\` ON \`pages_blocks_form_block\` (\`form_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_banner_locales\` (
  	\`message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_banner_locales\`("message", "id", "_locale", "_parent_id") SELECT "message", "id", "_locale", "_parent_id" FROM \`pages_blocks_banner_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_banner_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_banner_locales\` RENAME TO \`pages_blocks_banner_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_banner_locales_locale_parent_id_unique\` ON \`pages_blocks_banner_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_code\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`language\` text DEFAULT 'typescript',
  	\`code\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_code\`("_order", "_parent_id", "_path", "id", "language", "code", "block_name") SELECT "_order", "_parent_id", "_path", "id", "language", "code", "block_name" FROM \`pages_blocks_code\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_code\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_code\` RENAME TO \`pages_blocks_code\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_code_order_idx\` ON \`pages_blocks_code\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_code_parent_id_idx\` ON \`pages_blocks_code\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_code_path_idx\` ON \`pages_blocks_code\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_cards_grid_cards_locales\` (
  	\`heading\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cards_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_cards_grid_cards_locales\`("heading", "body", "id", "_locale", "_parent_id") SELECT "heading", "body", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_cards_grid_cards_locales\` RENAME TO \`_pages_v_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_cards_grid_cards_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_cards_grid_cards_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_testimonials_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`author\` text,
  	\`role\` text,
  	\`avatar_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_testimonials_items\`("_order", "_parent_id", "id", "author", "role", "avatar_id", "_uuid") SELECT "_order", "_parent_id", "id", "author", "role", "avatar_id", "_uuid" FROM \`_pages_v_blocks_testimonials_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_items\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_testimonials_items\` RENAME TO \`_pages_v_blocks_testimonials_items\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_items_order_idx\` ON \`_pages_v_blocks_testimonials_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_items_parent_id_idx\` ON \`_pages_v_blocks_testimonials_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_items_avatar_idx\` ON \`_pages_v_blocks_testimonials_items\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_testimonials_items_locales\` (
  	\`quote\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_testimonials_items_locales\`("quote", "id", "_locale", "_parent_id") SELECT "quote", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_testimonials_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_testimonials_items_locales\` RENAME TO \`_pages_v_blocks_testimonials_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_testimonials_items_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_testimonials_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_stats_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_stats_items\`("_order", "_parent_id", "id", "number", "_uuid") SELECT "_order", "_parent_id", "id", "number", "_uuid" FROM \`_pages_v_blocks_stats_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats_items\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_stats_items\` RENAME TO \`_pages_v_blocks_stats_items\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_items_order_idx\` ON \`_pages_v_blocks_stats_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_items_parent_id_idx\` ON \`_pages_v_blocks_stats_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_stats_items_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_stats_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_stats_items_locales\`("label", "id", "_locale", "_parent_id") SELECT "label", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_stats_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_stats_items_locales\` RENAME TO \`_pages_v_blocks_stats_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_stats_items_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_stats_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_faq_items_locales\` (
  	\`question\` text,
  	\`answer\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_faq_items_locales\`("question", "answer", "id", "_locale", "_parent_id") SELECT "question", "answer", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_faq_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_faq_items_locales\` RENAME TO \`_pages_v_blocks_faq_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_faq_items_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_faq_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`url\` text,
  	\`poster_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_video\`("_order", "_parent_id", "_path", "id", "url", "poster_id", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "url", "poster_id", "_uuid", "block_name" FROM \`_pages_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_video\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_video\` RENAME TO \`_pages_v_blocks_video\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_order_idx\` ON \`_pages_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_parent_id_idx\` ON \`_pages_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_path_idx\` ON \`_pages_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_poster_idx\` ON \`_pages_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_form_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_form_block\`("_order", "_parent_id", "_path", "id", "form_id", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "form_id", "_uuid", "block_name" FROM \`_pages_v_blocks_form_block\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_form_block\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_form_block\` RENAME TO \`_pages_v_blocks_form_block\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_order_idx\` ON \`_pages_v_blocks_form_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_parent_id_idx\` ON \`_pages_v_blocks_form_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_path_idx\` ON \`_pages_v_blocks_form_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_form_idx\` ON \`_pages_v_blocks_form_block\` (\`form_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_banner_locales\` (
  	\`message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_banner_locales\`("message", "id", "_locale", "_parent_id") SELECT "message", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_banner_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_banner_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_banner_locales\` RENAME TO \`_pages_v_blocks_banner_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_banner_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_banner_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_code\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`language\` text DEFAULT 'typescript',
  	\`code\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_code\`("_order", "_parent_id", "_path", "id", "language", "code", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "language", "code", "_uuid", "block_name" FROM \`_pages_v_blocks_code\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_code\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_code\` RENAME TO \`_pages_v_blocks_code\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_code_order_idx\` ON \`_pages_v_blocks_code\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_code_parent_id_idx\` ON \`_pages_v_blocks_code\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_code_path_idx\` ON \`_pages_v_blocks_code\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_theme\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'ATech',
  	\`site_tagline\` text,
  	\`logo_id\` integer,
  	\`favicon_id\` integer,
  	\`primary_color\` text DEFAULT '#ffd369',
  	\`secondary_color\` text DEFAULT '#ffb347',
  	\`bg_color\` text DEFAULT '#292929',
  	\`surface_color\` text DEFAULT '#2f2f2f',
  	\`text_color\` text DEFAULT '#fafafa',
  	\`muted_color\` text DEFAULT '#525252',
  	\`border_color\` text DEFAULT '#383838',
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
  await db.run(sql`INSERT INTO \`__new_theme\`("id", "site_name", "site_tagline", "logo_id", "favicon_id", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "heading_font", "body_font", "nav_cta_label", "nav_cta_url", "hero_cta_primary_label", "hero_cta_primary_url", "hero_cta_secondary_label", "hero_cta_secondary_url", "hero_image_id", "hero_layout", "services_bg_style", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_bg_style", "testimonials_bg_color", "contact_email", "contact_phone", "contact_location", "footer_copyright", "custom_c_s_s", "updated_at", "created_at") SELECT "id", "site_name", "site_tagline", "logo_id", "favicon_id", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "heading_font", "body_font", "nav_cta_label", "nav_cta_url", "hero_cta_primary_label", "hero_cta_primary_url", "hero_cta_secondary_label", "hero_cta_secondary_url", "hero_image_id", "hero_layout", "services_bg_style", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_bg_style", "testimonials_bg_color", "contact_email", "contact_phone", "contact_location", "footer_copyright", "custom_c_s_s", "updated_at", "created_at" FROM \`theme\`;`)
  await db.run(sql`DROP TABLE \`theme\`;`)
  await db.run(sql`ALTER TABLE \`__new_theme\` RENAME TO \`theme\`;`)
  await db.run(sql`CREATE INDEX \`theme_logo_idx\` ON \`theme\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_favicon_idx\` ON \`theme\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_hero_image_idx\` ON \`theme\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__theme_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_site_name\` text DEFAULT 'ATech',
  	\`version_site_tagline\` text,
  	\`version_logo_id\` integer,
  	\`version_favicon_id\` integer,
  	\`version_primary_color\` text DEFAULT '#ffd369',
  	\`version_secondary_color\` text DEFAULT '#ffb347',
  	\`version_bg_color\` text DEFAULT '#292929',
  	\`version_surface_color\` text DEFAULT '#2f2f2f',
  	\`version_text_color\` text DEFAULT '#fafafa',
  	\`version_muted_color\` text DEFAULT '#525252',
  	\`version_border_color\` text DEFAULT '#383838',
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
  await db.run(sql`INSERT INTO \`__new__theme_v\`("id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_heading_font", "version_body_font", "version_nav_cta_label", "version_nav_cta_url", "version_hero_cta_primary_label", "version_hero_cta_primary_url", "version_hero_cta_secondary_label", "version_hero_cta_secondary_url", "version_hero_image_id", "version_hero_layout", "version_services_bg_style", "version_custom_solution_cta_label", "version_custom_solution_cta_url", "version_testimonials_bg_style", "version_testimonials_bg_color", "version_contact_email", "version_contact_phone", "version_contact_location", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_heading_font", "version_body_font", "version_nav_cta_label", "version_nav_cta_url", "version_hero_cta_primary_label", "version_hero_cta_primary_url", "version_hero_cta_secondary_label", "version_hero_cta_secondary_url", "version_hero_image_id", "version_hero_layout", "version_services_bg_style", "version_custom_solution_cta_label", "version_custom_solution_cta_url", "version_testimonials_bg_style", "version_testimonials_bg_color", "version_contact_email", "version_contact_phone", "version_contact_location", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_theme_v\`;`)
  await db.run(sql`DROP TABLE \`_theme_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__theme_v\` RENAME TO \`_theme_v\`;`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_logo_idx\` ON \`_theme_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_favicon_idx\` ON \`_theme_v\` (\`version_favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_hero_image_idx\` ON \`_theme_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_created_at_idx\` ON \`_theme_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_updated_at_idx\` ON \`_theme_v\` (\`updated_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_cards_grid_cards_locales\` (
  	\`heading\` text NOT NULL,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cards_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_cards_grid_cards_locales\`("heading", "body", "id", "_locale", "_parent_id") SELECT "heading", "body", "id", "_locale", "_parent_id" FROM \`pages_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_cards_grid_cards_locales\` RENAME TO \`pages_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_cards_grid_cards_locales_locale_parent_id_unique\` ON \`pages_blocks_cards_grid_cards_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_testimonials_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`author\` text NOT NULL,
  	\`role\` text,
  	\`avatar_id\` integer,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_testimonials_items\`("_order", "_parent_id", "id", "author", "role", "avatar_id") SELECT "_order", "_parent_id", "id", "author", "role", "avatar_id" FROM \`pages_blocks_testimonials_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_testimonials_items\` RENAME TO \`pages_blocks_testimonials_items\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_items_order_idx\` ON \`pages_blocks_testimonials_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_items_parent_id_idx\` ON \`pages_blocks_testimonials_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_items_avatar_idx\` ON \`pages_blocks_testimonials_items\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_testimonials_items_locales\` (
  	\`quote\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_testimonials_items_locales\`("quote", "id", "_locale", "_parent_id") SELECT "quote", "id", "_locale", "_parent_id" FROM \`pages_blocks_testimonials_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_testimonials_items_locales\` RENAME TO \`pages_blocks_testimonials_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_testimonials_items_locales_locale_parent_id_unique\` ON \`pages_blocks_testimonials_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_stats_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`number\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_stats_items\`("_order", "_parent_id", "id", "number") SELECT "_order", "_parent_id", "id", "number" FROM \`pages_blocks_stats_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_stats_items\` RENAME TO \`pages_blocks_stats_items\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_items_order_idx\` ON \`pages_blocks_stats_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_items_parent_id_idx\` ON \`pages_blocks_stats_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_stats_items_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_stats_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_stats_items_locales\`("label", "id", "_locale", "_parent_id") SELECT "label", "id", "_locale", "_parent_id" FROM \`pages_blocks_stats_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_stats_items_locales\` RENAME TO \`pages_blocks_stats_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_stats_items_locales_locale_parent_id_unique\` ON \`pages_blocks_stats_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_faq_items_locales\` (
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_faq_items_locales\`("question", "answer", "id", "_locale", "_parent_id") SELECT "question", "answer", "id", "_locale", "_parent_id" FROM \`pages_blocks_faq_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_faq_items_locales\` RENAME TO \`pages_blocks_faq_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_faq_items_locales_locale_parent_id_unique\` ON \`pages_blocks_faq_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`url\` text NOT NULL,
  	\`poster_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_video\`("_order", "_parent_id", "_path", "id", "url", "poster_id", "block_name") SELECT "_order", "_parent_id", "_path", "id", "url", "poster_id", "block_name" FROM \`pages_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_video\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_video\` RENAME TO \`pages_blocks_video\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_order_idx\` ON \`pages_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_parent_id_idx\` ON \`pages_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_path_idx\` ON \`pages_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_poster_idx\` ON \`pages_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_form_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`form_id\` integer NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_form_block\`("_order", "_parent_id", "_path", "id", "form_id", "block_name") SELECT "_order", "_parent_id", "_path", "id", "form_id", "block_name" FROM \`pages_blocks_form_block\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_form_block\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_form_block\` RENAME TO \`pages_blocks_form_block\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_order_idx\` ON \`pages_blocks_form_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_parent_id_idx\` ON \`pages_blocks_form_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_path_idx\` ON \`pages_blocks_form_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_form_idx\` ON \`pages_blocks_form_block\` (\`form_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_banner_locales\` (
  	\`message\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_banner_locales\`("message", "id", "_locale", "_parent_id") SELECT "message", "id", "_locale", "_parent_id" FROM \`pages_blocks_banner_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_banner_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_banner_locales\` RENAME TO \`pages_blocks_banner_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_banner_locales_locale_parent_id_unique\` ON \`pages_blocks_banner_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_code\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`language\` text DEFAULT 'typescript',
  	\`code\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_code\`("_order", "_parent_id", "_path", "id", "language", "code", "block_name") SELECT "_order", "_parent_id", "_path", "id", "language", "code", "block_name" FROM \`pages_blocks_code\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_code\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_code\` RENAME TO \`pages_blocks_code\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_code_order_idx\` ON \`pages_blocks_code\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_code_parent_id_idx\` ON \`pages_blocks_code\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_code_path_idx\` ON \`pages_blocks_code\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_cards_grid_cards_locales\` (
  	\`heading\` text NOT NULL,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cards_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_cards_grid_cards_locales\`("heading", "body", "id", "_locale", "_parent_id") SELECT "heading", "body", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_cards_grid_cards_locales\` RENAME TO \`_pages_v_blocks_cards_grid_cards_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_cards_grid_cards_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_cards_grid_cards_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_testimonials_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`author\` text NOT NULL,
  	\`role\` text,
  	\`avatar_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_testimonials_items\`("_order", "_parent_id", "id", "author", "role", "avatar_id", "_uuid") SELECT "_order", "_parent_id", "id", "author", "role", "avatar_id", "_uuid" FROM \`_pages_v_blocks_testimonials_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_items\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_testimonials_items\` RENAME TO \`_pages_v_blocks_testimonials_items\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_items_order_idx\` ON \`_pages_v_blocks_testimonials_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_items_parent_id_idx\` ON \`_pages_v_blocks_testimonials_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_items_avatar_idx\` ON \`_pages_v_blocks_testimonials_items\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_testimonials_items_locales\` (
  	\`quote\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_testimonials_items_locales\`("quote", "id", "_locale", "_parent_id") SELECT "quote", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_testimonials_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_testimonials_items_locales\` RENAME TO \`_pages_v_blocks_testimonials_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_testimonials_items_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_testimonials_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_stats_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_stats_items\`("_order", "_parent_id", "id", "number", "_uuid") SELECT "_order", "_parent_id", "id", "number", "_uuid" FROM \`_pages_v_blocks_stats_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats_items\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_stats_items\` RENAME TO \`_pages_v_blocks_stats_items\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_items_order_idx\` ON \`_pages_v_blocks_stats_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_items_parent_id_idx\` ON \`_pages_v_blocks_stats_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_stats_items_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_stats_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_stats_items_locales\`("label", "id", "_locale", "_parent_id") SELECT "label", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_stats_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_stats_items_locales\` RENAME TO \`_pages_v_blocks_stats_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_stats_items_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_stats_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_faq_items_locales\` (
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_faq_items_locales\`("question", "answer", "id", "_locale", "_parent_id") SELECT "question", "answer", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_faq_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_faq_items_locales\` RENAME TO \`_pages_v_blocks_faq_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_faq_items_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_faq_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`url\` text NOT NULL,
  	\`poster_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_video\`("_order", "_parent_id", "_path", "id", "url", "poster_id", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "url", "poster_id", "_uuid", "block_name" FROM \`_pages_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_video\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_video\` RENAME TO \`_pages_v_blocks_video\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_order_idx\` ON \`_pages_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_parent_id_idx\` ON \`_pages_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_path_idx\` ON \`_pages_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_poster_idx\` ON \`_pages_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_form_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_id\` integer NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_form_block\`("_order", "_parent_id", "_path", "id", "form_id", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "form_id", "_uuid", "block_name" FROM \`_pages_v_blocks_form_block\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_form_block\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_form_block\` RENAME TO \`_pages_v_blocks_form_block\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_order_idx\` ON \`_pages_v_blocks_form_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_parent_id_idx\` ON \`_pages_v_blocks_form_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_path_idx\` ON \`_pages_v_blocks_form_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_form_idx\` ON \`_pages_v_blocks_form_block\` (\`form_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_banner_locales\` (
  	\`message\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_banner_locales\`("message", "id", "_locale", "_parent_id") SELECT "message", "id", "_locale", "_parent_id" FROM \`_pages_v_blocks_banner_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_banner_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_banner_locales\` RENAME TO \`_pages_v_blocks_banner_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_banner_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_banner_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_code\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`language\` text DEFAULT 'typescript',
  	\`code\` text NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_code\`("_order", "_parent_id", "_path", "id", "language", "code", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "language", "code", "_uuid", "block_name" FROM \`_pages_v_blocks_code\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_code\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_code\` RENAME TO \`_pages_v_blocks_code\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_code_order_idx\` ON \`_pages_v_blocks_code\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_code_parent_id_idx\` ON \`_pages_v_blocks_code\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_code_path_idx\` ON \`_pages_v_blocks_code\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_theme\` (
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
  await db.run(sql`INSERT INTO \`__new_theme\`("id", "site_name", "site_tagline", "logo_id", "favicon_id", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "heading_font", "body_font", "nav_cta_label", "nav_cta_url", "hero_cta_primary_label", "hero_cta_primary_url", "hero_cta_secondary_label", "hero_cta_secondary_url", "hero_image_id", "hero_layout", "services_bg_style", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_bg_style", "testimonials_bg_color", "contact_email", "contact_phone", "contact_location", "footer_copyright", "custom_c_s_s", "updated_at", "created_at") SELECT "id", "site_name", "site_tagline", "logo_id", "favicon_id", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "heading_font", "body_font", "nav_cta_label", "nav_cta_url", "hero_cta_primary_label", "hero_cta_primary_url", "hero_cta_secondary_label", "hero_cta_secondary_url", "hero_image_id", "hero_layout", "services_bg_style", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_bg_style", "testimonials_bg_color", "contact_email", "contact_phone", "contact_location", "footer_copyright", "custom_c_s_s", "updated_at", "created_at" FROM \`theme\`;`)
  await db.run(sql`DROP TABLE \`theme\`;`)
  await db.run(sql`ALTER TABLE \`__new_theme\` RENAME TO \`theme\`;`)
  await db.run(sql`CREATE INDEX \`theme_logo_idx\` ON \`theme\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_favicon_idx\` ON \`theme\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_hero_image_idx\` ON \`theme\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__theme_v\` (
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
  await db.run(sql`INSERT INTO \`__new__theme_v\`("id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_heading_font", "version_body_font", "version_nav_cta_label", "version_nav_cta_url", "version_hero_cta_primary_label", "version_hero_cta_primary_url", "version_hero_cta_secondary_label", "version_hero_cta_secondary_url", "version_hero_image_id", "version_hero_layout", "version_services_bg_style", "version_custom_solution_cta_label", "version_custom_solution_cta_url", "version_testimonials_bg_style", "version_testimonials_bg_color", "version_contact_email", "version_contact_phone", "version_contact_location", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_heading_font", "version_body_font", "version_nav_cta_label", "version_nav_cta_url", "version_hero_cta_primary_label", "version_hero_cta_primary_url", "version_hero_cta_secondary_label", "version_hero_cta_secondary_url", "version_hero_image_id", "version_hero_layout", "version_services_bg_style", "version_custom_solution_cta_label", "version_custom_solution_cta_url", "version_testimonials_bg_style", "version_testimonials_bg_color", "version_contact_email", "version_contact_phone", "version_contact_location", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_theme_v\`;`)
  await db.run(sql`DROP TABLE \`_theme_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__theme_v\` RENAME TO \`_theme_v\`;`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_logo_idx\` ON \`_theme_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_favicon_idx\` ON \`_theme_v\` (\`version_favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_hero_image_idx\` ON \`_theme_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_created_at_idx\` ON \`_theme_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_updated_at_idx\` ON \`_theme_v\` (\`updated_at\`);`)
}
