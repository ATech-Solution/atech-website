import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// ── Helper: add a column only when it doesn't already exist ────────────────
async function addColumnIfMissing(
  db: MigrateUpArgs['db'],
  table: string,
  column: string,
  definition: string,
) {
  const rows = await db.all(sql`PRAGMA table_info(${sql.raw(table)})`)
  if (!(rows as any[]).find((r: any) => r.name === column)) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` ${definition};`))
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ── New navigation tables (idempotent) ─────────────────────────────────────
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`navigation_menu_items_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`description\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_menu_items_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_menu_items_columns_links_order_idx\` ON \`navigation_menu_items_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_menu_items_columns_links_parent_id_idx\` ON \`navigation_menu_items_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`navigation_menu_items_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`column_title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_menu_items_columns_order_idx\` ON \`navigation_menu_items_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_menu_items_columns_parent_id_idx\` ON \`navigation_menu_items_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`navigation_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_footer_columns_links_order_idx\` ON \`navigation_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_footer_columns_links_parent_id_idx\` ON \`navigation_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`navigation_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_footer_columns_order_idx\` ON \`navigation_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_footer_columns_parent_id_idx\` ON \`navigation_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_navigation_v_version_menu_items_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`description\` text,
  	\`icon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_menu_items_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_menu_items_columns_links_order_idx\` ON \`_navigation_v_version_menu_items_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_menu_items_columns_links_parent_id_idx\` ON \`_navigation_v_version_menu_items_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_navigation_v_version_menu_items_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`column_title\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_menu_items_columns_order_idx\` ON \`_navigation_v_version_menu_items_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_menu_items_columns_parent_id_idx\` ON \`_navigation_v_version_menu_items_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_navigation_v_version_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_footer_columns_links_order_idx\` ON \`_navigation_v_version_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_footer_columns_links_parent_id_idx\` ON \`_navigation_v_version_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_navigation_v_version_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_footer_columns_order_idx\` ON \`_navigation_v_version_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_footer_columns_parent_id_idx\` ON \`_navigation_v_version_footer_columns\` (\`_parent_id\`);`)

  // ── Rebuild media table only if `credit` column still exists ──────────────
  const mediaCols = await db.all(sql`PRAGMA table_info(media)`)
  const hasCreditCol = (mediaCols as any[]).some((r: any) => r.name === 'credit')
  if (hasCreditCol) {
    await db.run(sql`PRAGMA foreign_keys=OFF;`)
    await db.run(sql`CREATE TABLE \`__new_media\` (
    	\`id\` integer PRIMARY KEY NOT NULL,
    	\`alt\` text,
    	\`caption\` text,
    	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    	\`url\` text,
    	\`thumbnail_u_r_l\` text,
    	\`filename\` text,
    	\`mime_type\` text,
    	\`filesize\` numeric,
    	\`width\` numeric,
    	\`height\` numeric,
    	\`focal_x\` numeric,
    	\`focal_y\` numeric,
    	\`sizes_thumbnail_url\` text,
    	\`sizes_thumbnail_width\` numeric,
    	\`sizes_thumbnail_height\` numeric,
    	\`sizes_thumbnail_mime_type\` text,
    	\`sizes_thumbnail_filesize\` numeric,
    	\`sizes_thumbnail_filename\` text,
    	\`sizes_card_url\` text,
    	\`sizes_card_width\` numeric,
    	\`sizes_card_height\` numeric,
    	\`sizes_card_mime_type\` text,
    	\`sizes_card_filesize\` numeric,
    	\`sizes_card_filename\` text,
    	\`sizes_hero_url\` text,
    	\`sizes_hero_width\` numeric,
    	\`sizes_hero_height\` numeric,
    	\`sizes_hero_mime_type\` text,
    	\`sizes_hero_filesize\` numeric,
    	\`sizes_hero_filename\` text,
    	\`sizes_og_url\` text,
    	\`sizes_og_width\` numeric,
    	\`sizes_og_height\` numeric,
    	\`sizes_og_mime_type\` text,
    	\`sizes_og_filesize\` numeric,
    	\`sizes_og_filename\` text
    );
    `)
    await db.run(sql`INSERT INTO \`__new_media\`("id", "alt", "caption", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y", "sizes_thumbnail_url", "sizes_thumbnail_width", "sizes_thumbnail_height", "sizes_thumbnail_mime_type", "sizes_thumbnail_filesize", "sizes_thumbnail_filename", "sizes_card_url", "sizes_card_width", "sizes_card_height", "sizes_card_mime_type", "sizes_card_filesize", "sizes_card_filename", "sizes_hero_url", "sizes_hero_width", "sizes_hero_height", "sizes_hero_mime_type", "sizes_hero_filesize", "sizes_hero_filename", "sizes_og_url", "sizes_og_width", "sizes_og_height", "sizes_og_mime_type", "sizes_og_filesize", "sizes_og_filename") SELECT "id", "alt", "caption", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y", "sizes_thumbnail_url", "sizes_thumbnail_width", "sizes_thumbnail_height", "sizes_thumbnail_mime_type", "sizes_thumbnail_filesize", "sizes_thumbnail_filename", "sizes_card_url", "sizes_card_width", "sizes_card_height", "sizes_card_mime_type", "sizes_card_filesize", "sizes_card_filename", "sizes_hero_url", "sizes_hero_width", "sizes_hero_height", "sizes_hero_mime_type", "sizes_hero_filesize", "sizes_hero_filename", "sizes_og_url", "sizes_og_width", "sizes_og_height", "sizes_og_mime_type", "sizes_og_filesize", "sizes_og_filename") FROM \`media\`;`)
    await db.run(sql`DROP TABLE \`media\`;`)
    await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
    await db.run(sql`PRAGMA foreign_keys=ON;`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
    await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`media_filename_idx\` ON \`media\` (\`filename\`);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`)
  }

  // ── ALTER TABLE — add columns only when missing ────────────────────────────
  await addColumnIfMissing(db, 'pages',           'page_type',         "text DEFAULT 'other'")
  await addColumnIfMissing(db, 'pages_locales',   'excerpt',           'text')
  await addColumnIfMissing(db, '_pages_v',        'version_page_type', "text DEFAULT 'other'")
  await addColumnIfMissing(db, '_pages_v_locales','version_excerpt',   'text')

  await addColumnIfMissing(db, 'navigation_menu_items', 'mega_menu',           'integer DEFAULT false')
  await addColumnIfMissing(db, 'navigation_menu_items', 'featured_title',      'text')
  await addColumnIfMissing(db, 'navigation_menu_items', 'featured_description','text')
  await addColumnIfMissing(db, 'navigation_menu_items', 'featured_url',        'text')
  await addColumnIfMissing(db, 'navigation_menu_items', 'featured_cta',        "text DEFAULT 'Learn More'")
  await addColumnIfMissing(db, 'navigation_menu_items', 'featured_image_id',   'integer REFERENCES media(id)')

  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_menu_items_featured_featured_image_idx\` ON \`navigation_menu_items\` (\`featured_image_id\`);`)

  await addColumnIfMissing(db, 'navigation', 'cta_label', "text DEFAULT 'Get a Quote'")
  await addColumnIfMissing(db, 'navigation', 'cta_url',   "text DEFAULT '/contact'")

  await addColumnIfMissing(db, '_navigation_v_version_menu_items', 'mega_menu',           'integer DEFAULT false')
  await addColumnIfMissing(db, '_navigation_v_version_menu_items', 'featured_title',      'text')
  await addColumnIfMissing(db, '_navigation_v_version_menu_items', 'featured_description','text')
  await addColumnIfMissing(db, '_navigation_v_version_menu_items', 'featured_url',        'text')
  await addColumnIfMissing(db, '_navigation_v_version_menu_items', 'featured_cta',        "text DEFAULT 'Learn More'")
  await addColumnIfMissing(db, '_navigation_v_version_menu_items', 'featured_image_id',   'integer REFERENCES media(id)')

  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_menu_items_featured_featured_image_idx\` ON \`_navigation_v_version_menu_items\` (\`featured_image_id\`);`)

  await addColumnIfMissing(db, '_navigation_v', 'version_cta_label', "text DEFAULT 'Get a Quote'")
  await addColumnIfMissing(db, '_navigation_v', 'version_cta_url',   "text DEFAULT '/contact'")
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`navigation_menu_items_columns_links\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`navigation_menu_items_columns\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`navigation_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`navigation_footer_columns\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_navigation_v_version_menu_items_columns_links\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_navigation_v_version_menu_items_columns\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_navigation_v_version_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_navigation_v_version_footer_columns\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_navigation_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`open_in_new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_navigation_menu_items\`("_order", "_parent_id", "id", "label", "url", "open_in_new_tab") SELECT "_order", "_parent_id", "id", "label", "url", "open_in_new_tab" FROM \`navigation_menu_items\`;`)
  await db.run(sql`DROP TABLE \`navigation_menu_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_navigation_menu_items\` RENAME TO \`navigation_menu_items\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`navigation_menu_items_order_idx\` ON \`navigation_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_menu_items_parent_id_idx\` ON \`navigation_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__navigation_v_version_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`open_in_new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__navigation_v_version_menu_items\`("_order", "_parent_id", "id", "label", "url", "open_in_new_tab", "_uuid") SELECT "_order", "_parent_id", "id", "label", "url", "open_in_new_tab", "_uuid" FROM \`_navigation_v_version_menu_items\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_menu_items\`;`)
  await db.run(sql`ALTER TABLE \`__new__navigation_v_version_menu_items\` RENAME TO \`_navigation_v_version_menu_items\`;`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_menu_items_order_idx\` ON \`_navigation_v_version_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_menu_items_parent_id_idx\` ON \`_navigation_v_version_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`credit\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_hero_url\` text,
  	\`sizes_hero_width\` numeric,
  	\`sizes_hero_height\` numeric,
  	\`sizes_hero_mime_type\` text,
  	\`sizes_hero_filesize\` numeric,
  	\`sizes_hero_filename\` text,
  	\`sizes_og_url\` text,
  	\`sizes_og_width\` numeric,
  	\`sizes_og_height\` numeric,
  	\`sizes_og_mime_type\` text,
  	\`sizes_og_filesize\` numeric,
  	\`sizes_og_filename\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_media\`("id", "alt", "caption", "credit", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y", "sizes_thumbnail_url", "sizes_thumbnail_width", "sizes_thumbnail_height", "sizes_thumbnail_mime_type", "sizes_thumbnail_filesize", "sizes_thumbnail_filename", "sizes_card_url", "sizes_card_width", "sizes_card_height", "sizes_card_mime_type", "sizes_card_filesize", "sizes_card_filename", "sizes_hero_url", "sizes_hero_width", "sizes_hero_height", "sizes_hero_mime_type", "sizes_hero_filesize", "sizes_hero_filename", "sizes_og_url", "sizes_og_width", "sizes_og_height", "sizes_og_mime_type", "sizes_og_filesize", "sizes_og_filename") SELECT "id", "alt", "caption", "credit", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y", "sizes_thumbnail_url", "sizes_thumbnail_width", "sizes_thumbnail_height", "sizes_thumbnail_mime_type", "sizes_thumbnail_filesize", "sizes_thumbnail_filename", "sizes_card_url", "sizes_card_width", "sizes_card_height", "sizes_card_mime_type", "sizes_card_filesize", "sizes_card_filename", "sizes_hero_url", "sizes_hero_width", "sizes_hero_height", "sizes_hero_mime_type", "sizes_hero_filesize", "sizes_hero_filename", "sizes_og_url", "sizes_og_width", "sizes_og_height", "sizes_og_mime_type", "sizes_og_filesize", "sizes_og_filename") FROM \`media\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`page_type\`;`)
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`excerpt\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_page_type\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_excerpt\`;`)
  await db.run(sql`ALTER TABLE \`navigation\` DROP COLUMN \`cta_label\`;`)
  await db.run(sql`ALTER TABLE \`navigation\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_navigation_v\` DROP COLUMN \`version_cta_label\`;`)
  await db.run(sql`ALTER TABLE \`_navigation_v\` DROP COLUMN \`version_cta_url\`;`)
}
