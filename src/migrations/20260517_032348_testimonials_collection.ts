import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Tables were already created by Payload dev-mode push — this migration is a no-op.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Ensure the testimonials table exists (dev mode may have already created it)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`testimonials\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`avatar_id\` integer,
    \`client_name\` text NOT NULL,
    \`client_role\` text,
    \`client_company\` text,
    \`rating\` numeric DEFAULT 5,
    \`order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  )`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`testimonials_locales\` (
    \`quote\` text NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  )`)

  // Add new columns to blocks if they don't exist (SQLite requires try/catch per column)
  const addIfMissing = async (stmt: string) => {
    try { await db.run(sql.raw(stmt) as any) } catch { /* already exists */ }
  }
  await addIfMissing(`ALTER TABLE \`blocks\` ADD COLUMN \`testimonials_content_source\` text DEFAULT 'manual'`)
  await addIfMissing(`ALTER TABLE \`blocks\` ADD COLUMN \`testimonials_limit\` numeric DEFAULT 9`)
  await addIfMissing(`ALTER TABLE \`blocks\` ADD COLUMN \`enable_carousel\` integer DEFAULT false`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`testimonials_locales\``)
  await db.run(sql`DROP TABLE IF EXISTS \`testimonials\``)
}
