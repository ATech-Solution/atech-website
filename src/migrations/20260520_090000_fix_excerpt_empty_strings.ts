import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// The earlier migration 20260520_045631 was originally deployed as an empty stub
// and was already recorded in payload_migrations before the real body was added,
// so it was skipped on UAT. This migration re-applies the fix as a new migration.

const wrapText = (text: string) =>
  JSON.stringify({
    root: {
      children: [
        {
          children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
          direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1,
        },
      ],
      direction: 'ltr', format: '', indent: 0, type: 'root', version: 1,
    },
  })

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Step 1: NULL empty-string excerpts — empty string is NOT valid Lexical JSON
  await db.run(sql`UPDATE pages_locales SET excerpt = NULL WHERE excerpt = ''`)
  await db.run(sql`UPDATE _pages_v_locales SET version_excerpt = NULL WHERE version_excerpt = ''`)
  payload.logger.info('[migrate] Cleared empty-string excerpts in pages_locales and _pages_v_locales')

  // Step 2: Wrap remaining plain-text (non-JSON) excerpts in a Lexical paragraph envelope
  const rows = await db.all<{ id: number; excerpt: string }>(
    sql`SELECT id, excerpt FROM pages_locales WHERE excerpt IS NOT NULL AND excerpt != '' AND substr(excerpt,1,1) != '{'`
  )
  for (const row of rows) {
    await db.run(
      sql`UPDATE pages_locales SET excerpt = ${wrapText(row.excerpt)} WHERE id = ${row.id}`
    )
    payload.logger.info(`[migrate] Converted plain-text excerpt for pages_locales id=${row.id}`)
  }

  // Step 3: Same for version table
  const vrows = await db.all<{ id: number; version_excerpt: string }>(
    sql`SELECT id, version_excerpt FROM _pages_v_locales WHERE version_excerpt IS NOT NULL AND version_excerpt != '' AND substr(version_excerpt,1,1) != '{'`
  )
  for (const row of vrows) {
    await db.run(
      sql`UPDATE _pages_v_locales SET version_excerpt = ${wrapText(row.version_excerpt)} WHERE id = ${row.id}`
    )
    payload.logger.info(`[migrate] Converted plain-text version_excerpt for _pages_v_locales id=${row.id}`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No-op: cannot safely reverse NULL → original empty string
}
