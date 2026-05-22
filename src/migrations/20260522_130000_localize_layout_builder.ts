import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Move pages.layout_builder → pages_locales (localized column)
// Move _pages_v.version_layout_builder → _pages_v_locales (localized column)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)

  // ── 1. pages_locales: add layout_builder column ───────────────────────────
  await db.run(sql`ALTER TABLE \`pages_locales\` ADD COLUMN \`layout_builder\` text DEFAULT '[]';`)

  // Copy English layout_builder content from pages → pages_locales
  await db.run(sql`
    UPDATE \`pages_locales\`
    SET \`layout_builder\` = (
      SELECT \`layout_builder\` FROM \`pages\`
      WHERE \`pages\`.\`id\` = \`pages_locales\`.\`_parent_id\`
    )
    WHERE \`_locale\` = 'en';
  `)

  // Drop the shared column from pages
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`layout_builder\`;`)

  // ── 2. _pages_v_locales: add version_layout_builder column ───────────────
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` ADD COLUMN \`version_layout_builder\` text DEFAULT '[]';`)

  // Copy English version_layout_builder content from _pages_v → _pages_v_locales
  await db.run(sql`
    UPDATE \`_pages_v_locales\`
    SET \`version_layout_builder\` = (
      SELECT \`version_layout_builder\` FROM \`_pages_v\`
      WHERE \`_pages_v\`.\`id\` = \`_pages_v_locales\`.\`_parent_id\`
    )
    WHERE \`_locale\` = 'en';
  `)

  // Drop the shared column from _pages_v
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_layout_builder\`;`)

  await db.run(sql`PRAGMA foreign_keys=ON;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)

  // Restore pages.layout_builder
  await db.run(sql`ALTER TABLE \`pages\` ADD COLUMN \`layout_builder\` text DEFAULT '[]';`)
  await db.run(sql`
    UPDATE \`pages\`
    SET \`layout_builder\` = (
      SELECT \`layout_builder\` FROM \`pages_locales\`
      WHERE \`_parent_id\` = \`pages\`.\`id\` AND \`_locale\` = 'en'
      LIMIT 1
    );
  `)
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`layout_builder\`;`)

  // Restore _pages_v.version_layout_builder
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD COLUMN \`version_layout_builder\` text DEFAULT '[]';`)
  await db.run(sql`
    UPDATE \`_pages_v\`
    SET \`version_layout_builder\` = (
      SELECT \`version_layout_builder\` FROM \`_pages_v_locales\`
      WHERE \`_parent_id\` = \`_pages_v\`.\`id\` AND \`_locale\` = 'en'
      LIMIT 1
    );
  `)
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_layout_builder\`;`)

  await db.run(sql`PRAGMA foreign_keys=ON;`)
}
