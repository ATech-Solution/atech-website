import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

async function addColumnIfMissing(db: MigrateUpArgs['db'], table: string, column: string, definition: string) {
  const rows = await db.all(sql.raw(`SELECT name FROM pragma_table_info('${table}') WHERE name='${column}'`))
  if (rows.length === 0) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` ${definition}`))
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Non-localized fields → blocks table
  await addColumnIfMissing(db, 'blocks', 'portfolio_hero_badge',                'text')
  await addColumnIfMissing(db, 'blocks', 'portfolio_hero_cta_primary_label',    'text')
  await addColumnIfMissing(db, 'blocks', 'portfolio_hero_cta_primary_url',      'text')
  await addColumnIfMissing(db, 'blocks', 'portfolio_hero_cta_secondary_label',  'text')
  await addColumnIfMissing(db, 'blocks', 'portfolio_hero_cta_secondary_url',    'text')

  // Localized fields → blocks_locales table
  await addColumnIfMissing(db, 'blocks_locales', 'portfolio_hero_heading',     'text')
  await addColumnIfMissing(db, 'blocks_locales', 'portfolio_hero_subheading',  'text')
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No-op
}
