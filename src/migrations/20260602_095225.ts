import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`performance_settings_image_formats\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`performance_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`performance_settings_image_formats_order_idx\` ON \`performance_settings_image_formats\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`performance_settings_image_formats_parent_idx\` ON \`performance_settings_image_formats\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`performance_settings_indexed_collections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`performance_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`performance_settings_indexed_collections_order_idx\` ON \`performance_settings_indexed_collections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`performance_settings_indexed_collections_parent_id_idx\` ON \`performance_settings_indexed_collections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`performance_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`plugin_enabled\` integer DEFAULT true,
  	\`image_optimization_enabled\` integer DEFAULT true,
  	\`image_device_sizes\` text DEFAULT '360,640,750,828,1080,1200,1920',
  	\`cache_headers_enabled\` integer DEFAULT true,
  	\`html_cache_ttl\` numeric DEFAULT 60,
  	\`stale_while_revalidate\` numeric DEFAULT 600,
  	\`streaming_enabled\` integer DEFAULT true,
  	\`skeleton_rows\` numeric DEFAULT 3,
  	\`query_cache_enabled\` integer DEFAULT true,
  	\`query_cache_ttl\` numeric DEFAULT 60,
  	\`query_cache_tags\` text DEFAULT 'perf',
  	\`sqlite_indexes_enabled\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`performance_settings_image_formats\`;`)
  await db.run(sql`DROP TABLE \`performance_settings_indexed_collections\`;`)
  await db.run(sql`DROP TABLE \`performance_settings\`;`)
}
