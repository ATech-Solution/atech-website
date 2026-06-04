import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── job_vacancies ──────────────────────────────────────────────────────────
  // Table may already exist if Payload auto-created it; IF NOT EXISTS is safe.
  try {
    await db.run(sql`CREATE TABLE IF NOT EXISTS \`job_vacancies\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`title\` text NOT NULL,
      \`position_type\` text DEFAULT 'full-time',
      \`category\` text,
      \`location\` text,
      \`excerpt\` text,
      \`description\` text,
      \`apply_label\` text DEFAULT 'Apply Now',
      \`apply_url\` text,
      \`status\` text DEFAULT 'active',
      \`order\` numeric DEFAULT 0,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    )`)
  } catch {}

  // Ensure all columns exist (table may have been auto-created with fewer columns)
  const mainCols: string[] = [
    "`title` text NOT NULL",
    "`position_type` text DEFAULT 'full-time'",
    '`category` text',
    '`location` text',
    '`excerpt` text',
    '`description` text',
    "`apply_label` text DEFAULT 'Apply Now'",
    '`apply_url` text',
    "`status` text DEFAULT 'active'",
    '`order` numeric DEFAULT 0',
    "`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))",
    "`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))",
  ]
  for (const col of mainCols) {
    try { await db.run(sql.raw(`ALTER TABLE \`job_vacancies\` ADD COLUMN ${col}`)) } catch {}
  }

  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`job_vacancies_updated_at_idx\` ON \`job_vacancies\` (\`updated_at\`)`) } catch {}
  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`job_vacancies_created_at_idx\` ON \`job_vacancies\` (\`created_at\`)`) } catch {}

  // ── _job_vacancies_v (drafts) ──────────────────────────────────────────────
  try {
    await db.run(sql`CREATE TABLE IF NOT EXISTS \`_job_vacancies_v\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`parent_id\` integer,
      \`version_title\` text,
      \`version_position_type\` text DEFAULT 'full-time',
      \`version_category\` text,
      \`version_location\` text,
      \`version_excerpt\` text,
      \`version_description\` text,
      \`version_apply_label\` text DEFAULT 'Apply Now',
      \`version_apply_url\` text,
      \`version_status\` text DEFAULT 'active',
      \`version_order\` numeric DEFAULT 0,
      \`version_updated_at\` text,
      \`version_created_at\` text,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`latest\` integer,
      \`autosave\` integer,
      FOREIGN KEY (\`parent_id\`) REFERENCES \`job_vacancies\`(\`id\`) ON UPDATE no action ON DELETE set null
    )`)
  } catch {}

  // Ensure all version columns exist (table may have been auto-created without them)
  const vCols: string[] = [
    '`parent_id` integer',
    '`version_title` text',
    "`version_position_type` text DEFAULT 'full-time'",
    '`version_category` text',
    '`version_location` text',
    '`version_excerpt` text',
    '`version_description` text',
    "`version_apply_label` text DEFAULT 'Apply Now'",
    '`version_apply_url` text',
    "`version_status` text DEFAULT 'active'",
    '`version_order` numeric DEFAULT 0',
    '`version_updated_at` text',
    '`version_created_at` text',
    "`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))",
    "`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))",
    '`latest` integer',
    '`autosave` integer',
  ]
  for (const col of vCols) {
    try { await db.run(sql.raw(`ALTER TABLE \`_job_vacancies_v\` ADD COLUMN ${col}`)) } catch {}
  }

  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`_job_vacancies_v_parent_idx\` ON \`_job_vacancies_v\` (\`parent_id\`)`) } catch {}
  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`_job_vacancies_v_version_updated_at_idx\` ON \`_job_vacancies_v\` (\`version_updated_at\`)`) } catch {}
  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`_job_vacancies_v_created_at_idx\` ON \`_job_vacancies_v\` (\`created_at\`)`) } catch {}
  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`_job_vacancies_v_updated_at_idx\` ON \`_job_vacancies_v\` (\`updated_at\`)`) } catch {}
  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`_job_vacancies_v_latest_idx\` ON \`_job_vacancies_v\` (\`latest\`)`) } catch {}
  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`_job_vacancies_v_autosave_idx\` ON \`_job_vacancies_v\` (\`autosave\`)`) } catch {}
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  try { await db.run(sql`DROP TABLE IF EXISTS \`_job_vacancies_v\``) } catch {}
  try { await db.run(sql`DROP TABLE IF EXISTS \`job_vacancies\``) } catch {}
}
