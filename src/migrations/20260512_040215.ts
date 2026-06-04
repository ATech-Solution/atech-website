import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

async function addColumnIfMissing(db: MigrateUpArgs['db'], table: string, column: string, definition: string) {
  const rows = await db.all(sql.raw(`SELECT name FROM pragma_table_info('${table}') WHERE name='${column}'`))
  if (rows.length === 0) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` ${definition}`))
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Tables — idempotent via IF NOT EXISTS
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`blocks_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blocks_tags_order_idx\` ON \`blocks_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blocks_tags_parent_id_idx\` ON \`blocks_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`blocks_pd_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pd_metric_value\` text,
  	\`pd_metric_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blocks_pd_metrics_order_idx\` ON \`blocks_pd_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blocks_pd_metrics_parent_id_idx\` ON \`blocks_pd_metrics\` (\`_parent_id\`);`)

  // Columns — skip if already present (SQLite lacks ADD COLUMN IF NOT EXISTS)
  await addColumnIfMissing(db, 'pages',       'portfolio_detail_template',         'integer DEFAULT false')
  await addColumnIfMissing(db, '_pages_v',    'version_portfolio_detail_template', 'integer DEFAULT false')
  await addColumnIfMissing(db, 'blocks',      'back_label',     'text')
  await addColumnIfMissing(db, 'blocks',      'back_url',       'text')
  await addColumnIfMissing(db, 'blocks',      'pd_client',      'text')
  await addColumnIfMissing(db, 'blocks',      'pd_duration',    'text')
  await addColumnIfMissing(db, 'blocks',      'pd_year',        'text')
  await addColumnIfMissing(db, 'blocks',      'pd_team_size',   'text')
  await addColumnIfMissing(db, 'blocks',      'pd_caption',     'text')
  await addColumnIfMissing(db, 'blocks',      'pd_metrics_title', 'text')
  await addColumnIfMissing(db, 'blocks_locales', 'pd_title',         'text')
  await addColumnIfMissing(db, 'blocks_locales', 'pd_description',   'text')
  await addColumnIfMissing(db, 'blocks_locales', 'pd_section_title', 'text')
  await addColumnIfMissing(db, 'blocks_locales', 'pd_content',       'text')
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`blocks_tags\`;`)
  await db.run(sql`DROP TABLE \`blocks_pd_metrics\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`portfolio_detail_template\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_portfolio_detail_template\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`back_label\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`back_url\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`pd_client\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`pd_duration\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`pd_year\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`pd_team_size\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`pd_caption\`;`)
  await db.run(sql`ALTER TABLE \`blocks\` DROP COLUMN \`pd_metrics_title\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`pd_title\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`pd_description\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`pd_section_title\`;`)
  await db.run(sql`ALTER TABLE \`blocks_locales\` DROP COLUMN \`pd_content\`;`)
}
