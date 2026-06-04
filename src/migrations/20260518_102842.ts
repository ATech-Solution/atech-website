import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`navigation_footer_copyright_menu\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_copyright_menu_order_idx\` ON \`navigation_footer_copyright_menu\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_copyright_menu_parent_id_idx\` ON \`navigation_footer_copyright_menu\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_copyright_menu\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_copyright_menu_order_idx\` ON \`_navigation_v_version_footer_copyright_menu\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_copyright_menu_parent_id_idx\` ON \`_navigation_v_version_footer_copyright_menu\` (\`_parent_id\`);`)
  await db.run(sql`DROP TABLE \`theme_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`theme_footer_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`theme_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`theme_footer_columns_locales\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_footer_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`_theme_v_version_footer_columns_locales\`;`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`get_started_title\` text DEFAULT 'Get Started';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`get_started_desc\` text DEFAULT 'Ready to transform your business with technology?';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`get_started_button_label\` text DEFAULT 'Send us a Message';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`get_started_button_url\` text DEFAULT '/static/contact';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_get_started_title\` text DEFAULT 'Get Started';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_get_started_desc\` text DEFAULT 'Ready to transform your business with technology?';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_get_started_button_label\` text DEFAULT 'Send us a Message';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_get_started_button_url\` text DEFAULT '/static/contact';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
  await db.run(sql`DROP TABLE \`navigation_footer_copyright_menu\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_copyright_menu\`;`)
  await db.run(sql`ALTER TABLE \`theme\` DROP COLUMN \`get_started_title\`;`)
  await db.run(sql`ALTER TABLE \`theme\` DROP COLUMN \`get_started_desc\`;`)
  await db.run(sql`ALTER TABLE \`theme\` DROP COLUMN \`get_started_button_label\`;`)
  await db.run(sql`ALTER TABLE \`theme\` DROP COLUMN \`get_started_button_url\`;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` DROP COLUMN \`version_get_started_title\`;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` DROP COLUMN \`version_get_started_desc\`;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` DROP COLUMN \`version_get_started_button_label\`;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` DROP COLUMN \`version_get_started_button_url\`;`)
}
