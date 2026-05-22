import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// This migration is superseded by 20260522_130000_localize_layout_builder which
// already moved layout_builder to the locales tables. No-op to avoid duplicate column errors.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const pagesLocalesCols = await db.all(sql`PRAGMA table_info(\`pages_locales\`)`)
  const hasLayoutBuilder = (pagesLocalesCols as Array<{ name: string }>).some(c => c.name === 'layout_builder')
  if (!hasLayoutBuilder) {
    await db.run(sql`ALTER TABLE \`pages_locales\` ADD \`layout_builder\` text DEFAULT '[]';`)
  }

  const pagesVLocalesCols = await db.all(sql`PRAGMA table_info(\`_pages_v_locales\`)`)
  const hasVersionLayoutBuilder = (pagesVLocalesCols as Array<{ name: string }>).some(c => c.name === 'version_layout_builder')
  if (!hasVersionLayoutBuilder) {
    await db.run(sql`ALTER TABLE \`_pages_v_locales\` ADD \`version_layout_builder\` text DEFAULT '[]';`)
  }

  const pagesCols = await db.all(sql`PRAGMA table_info(\`pages\`)`)
  const pagesHasLayoutBuilder = (pagesCols as Array<{ name: string }>).some(c => c.name === 'layout_builder')
  if (pagesHasLayoutBuilder) {
    await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`layout_builder\`;`)
  }

  const pagesVCols = await db.all(sql`PRAGMA table_info(\`_pages_v\`)`)
  const pagesVHasVersionLayoutBuilder = (pagesVCols as Array<{ name: string }>).some(c => c.name === 'version_layout_builder')
  if (pagesVHasVersionLayoutBuilder) {
    await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_layout_builder\`;`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const pagesCols = await db.all(sql`PRAGMA table_info(\`pages\`)`)
  const pagesHasLayoutBuilder = (pagesCols as Array<{ name: string }>).some(c => c.name === 'layout_builder')
  if (!pagesHasLayoutBuilder) {
    await db.run(sql`ALTER TABLE \`pages\` ADD \`layout_builder\` text DEFAULT '[]';`)
  }

  const pagesVCols = await db.all(sql`PRAGMA table_info(\`_pages_v\`)`)
  const pagesVHasVersionLayoutBuilder = (pagesVCols as Array<{ name: string }>).some(c => c.name === 'version_layout_builder')
  if (!pagesVHasVersionLayoutBuilder) {
    await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_layout_builder\` text DEFAULT '[]';`)
  }

  const pagesLocalesCols = await db.all(sql`PRAGMA table_info(\`pages_locales\`)`)
  const hasLayoutBuilder = (pagesLocalesCols as Array<{ name: string }>).some(c => c.name === 'layout_builder')
  if (hasLayoutBuilder) {
    await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`layout_builder\`;`)
  }

  const pagesVLocalesCols = await db.all(sql`PRAGMA table_info(\`_pages_v_locales\`)`)
  const hasVersionLayoutBuilder = (pagesVLocalesCols as Array<{ name: string }>).some(c => c.name === 'version_layout_builder')
  if (hasVersionLayoutBuilder) {
    await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_layout_builder\`;`)
  }
}
