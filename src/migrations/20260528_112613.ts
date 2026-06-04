import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Column may already exist if 20260528_100000_add_post_featured ran first
  try { await db.run(sql`ALTER TABLE \`posts\` ADD \`featured\` integer DEFAULT false`) } catch {}
  try { await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_featured\` integer DEFAULT false`) } catch {}
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  try { await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`featured\``) } catch {}
  try { await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_featured\``) } catch {}
}
