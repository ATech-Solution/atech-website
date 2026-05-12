import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Tables faq_categories / faqs were already created by migration 20260512_150000.
// This migration only adds the faq_* columns to blocks and wires
// payload_locked_documents_rels for the two new collections.

async function addColumnIfMissing(
  db: MigrateUpArgs['db'],
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  const info = await db.all(sql.raw(`PRAGMA table_info(\`${table}\`)`)) as any[]
  if (!info.some((r: any) => r.name === column)) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` ${definition}`))
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── new faq_* columns on blocks ──────────────────────────────────────────
  await addColumnIfMissing(db, 'blocks', 'faq_content_source', `text DEFAULT 'manual'`)
  await addColumnIfMissing(db, 'blocks', 'faq_category_slug',  `text`)
  await addColumnIfMissing(db, 'blocks', 'faq_limit',          `numeric DEFAULT 20`)
  await addColumnIfMissing(db, 'blocks', 'faq_back_label',     `text`)
  await addColumnIfMissing(db, 'blocks', 'faq_back_url',       `text`)

  // ── payload_locked_documents_rels ────────────────────────────────────────
  await addColumnIfMissing(
    db,
    'payload_locked_documents_rels',
    'faq_categories_id',
    `integer REFERENCES faq_categories(id)`,
  )
  await addColumnIfMissing(
    db,
    'payload_locked_documents_rels',
    'faqs_id',
    `integer REFERENCES faqs(id)`,
  )

  // indexes (IF NOT EXISTS is safe to re-run)
  await db.run(sql.raw(
    `CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_faq_categories_id_idx\`
     ON \`payload_locked_documents_rels\` (\`faq_categories_id\`)`,
  ))
  await db.run(sql.raw(
    `CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_faqs_id_idx\`
     ON \`payload_locked_documents_rels\` (\`faqs_id\`)`,
  ))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // No-op — column drops require full table recreation in SQLite
}
