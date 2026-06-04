import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add featured flag to posts table
  try {
    await db.run(sql.raw('ALTER TABLE `posts` ADD COLUMN `featured` integer DEFAULT 0'))
  } catch {}

  // Add to versions table too (Posts has versioning enabled)
  try {
    await db.run(sql.raw('ALTER TABLE `_posts_v` ADD COLUMN `version_featured` integer DEFAULT 0'))
  } catch {}
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // SQLite does not support DROP COLUMN in older versions; recreating the table
  // is the safe approach. In practice just leave the column — it causes no harm.
}
