import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // username is nullable (requireUsername: false) so existing users are never blocked.
  // Skip gracefully if already applied by Payload's dev auto-migration.
  try {
    await db.run(sql`ALTER TABLE \`users\` ADD \`username\` text;`)
  } catch (e: any) {
    if (!String(e?.message).includes('duplicate column name')) throw e
  }
  try {
    await db.run(sql`CREATE UNIQUE INDEX \`users_username_idx\` ON \`users\` (\`username\`);`)
  } catch (e: any) {
    if (!String(e?.message).includes('already exists')) throw e
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`users_username_idx\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`username\`;`)
}
