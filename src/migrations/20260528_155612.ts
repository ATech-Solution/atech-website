import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Table may already exist from 20260528_130000_add_quote_requests
  try {
    await db.run(sql`CREATE TABLE \`quote_requests\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`first_name\` text NOT NULL,
    \`last_name\` text,
    \`email\` text NOT NULL,
    \`phone\` text,
    \`company\` text,
    \`service_type\` text,
    \`service_selected\` text,
    \`development_time\` text,
    \`items_count\` numeric,
    \`calculated_cost\` numeric,
    \`maintenance_fee\` numeric,
    \`project_details\` text NOT NULL,
    \`status\` text DEFAULT 'new',
    \`notes\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  )`)
  } catch {}

  try { await db.run(sql`CREATE INDEX \`quote_requests_updated_at_idx\` ON \`quote_requests\` (\`updated_at\`)`) } catch {}
  try { await db.run(sql`CREATE INDEX \`quote_requests_created_at_idx\` ON \`quote_requests\` (\`created_at\`)`) } catch {}

  // Wire into Payload's locking system — needed for admin UI document locking
  try { await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`quote_requests_id\` integer REFERENCES quote_requests(id)`) } catch {}
  try { await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_quote_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`quote_requests_id\`)`) } catch {}
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  try { await db.run(sql`DROP TABLE IF EXISTS \`quote_requests\``) } catch {}
}
