import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

async function addColumnIfMissing(db: MigrateUpArgs['db'], table: string, column: string, definition: string) {
  const rows = await db.all(sql.raw(`SELECT name FROM pragma_table_info('${table}') WHERE name='${column}'`))
  if (rows.length === 0) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` ${definition}`))
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Columns covered by 20260512_053928 — guard again to be safe
  await addColumnIfMissing(db, 'pages',    'article_detail_template',         'integer DEFAULT false')
  await addColumnIfMissing(db, '_pages_v', 'version_article_detail_template', 'integer DEFAULT false')
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No-op
}
