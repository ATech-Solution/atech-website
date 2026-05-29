import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  try {
    await db.run(sql`CREATE TABLE IF NOT EXISTS \`quote_requests\` (
      \`id\`                 integer PRIMARY KEY NOT NULL,
      \`first_name\`         text NOT NULL,
      \`last_name\`          text,
      \`email\`              text NOT NULL,
      \`phone\`              text,
      \`company\`            text,
      \`service_type\`       text,
      \`service_selected\`   text,
      \`development_time\`   text,
      \`items_count\`        numeric,
      \`calculated_cost\`    numeric,
      \`maintenance_fee\`    numeric,
      \`project_details\`    text NOT NULL,
      \`status\`             text DEFAULT 'new',
      \`notes\`              text,
      \`updated_at\`         text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\`         text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    )`)
  } catch {}

  // Ensure all columns exist if table was auto-created
  const cols = [
    '`first_name` text',
    '`last_name` text',
    '`email` text',
    '`phone` text',
    '`company` text',
    '`service_type` text',
    '`service_selected` text',
    '`development_time` text',
    '`items_count` numeric',
    '`calculated_cost` numeric',
    '`maintenance_fee` numeric',
    '`project_details` text',
    "`status` text DEFAULT 'new'",
    '`notes` text',
    "`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))",
    "`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))",
  ]
  for (const col of cols) {
    try { await db.run(sql.raw(`ALTER TABLE \`quote_requests\` ADD COLUMN ${col}`)) } catch {}
  }

  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`quote_requests_created_at_idx\` ON \`quote_requests\` (\`created_at\`)`) } catch {}
  try { await db.run(sql`CREATE INDEX IF NOT EXISTS \`quote_requests_status_idx\`     ON \`quote_requests\` (\`status\`)`) } catch {}
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  try { await db.run(sql`DROP TABLE IF EXISTS \`quote_requests\``) } catch {}
}
