import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// pages_locales.excerpt was a textarea (plain text). It was promoted to richText
// (JSON) in the same commit that added the AI toolbar. Any rows that still hold
// plain-text values must be wrapped in a minimal Payload Lexical JSON envelope
// so the editor doesn't crash trying to JSON.parse() the old content.

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
  // Step 1: NULL out empty-string excerpts — empty string is NOT valid Lexical JSON
  // and causes drizzle to throw "Unexpected end of JSON input" on every page fetch.
  await db.run(sql`UPDATE pages_locales SET excerpt = NULL WHERE excerpt = ''`)
  await db.run(sql`UPDATE _pages_v_locales SET version_excerpt = NULL WHERE version_excerpt = ''`)
  payload.logger.info('[migrate] Cleared empty-string excerpts in pages_locales and _pages_v_locales')

  // Step 2: Wrap remaining plain-text (non-JSON) excerpts in a Lexical paragraph envelope.
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
  // Unwrap: extract the first text node's content back to plain text
  // This is best-effort; multi-node content is joined with spaces.
  const rows = await db.all<{ id: number; excerpt: string }>(
    sql`SELECT id, excerpt FROM pages_locales WHERE excerpt IS NOT NULL AND excerpt != '' AND substr(excerpt,1,1) = '{'`
  )

  for (const row of rows) {
    try {
      const parsed = JSON.parse(row.excerpt)
      const texts: string[] = []
      for (const block of parsed?.root?.children ?? []) {
        for (const node of block?.children ?? []) {
          if (node.text) texts.push(node.text)
        }
      }
      await db.run(
        sql`UPDATE pages_locales SET excerpt = ${texts.join(' ')} WHERE id = ${row.id}`
      )
    } catch {
      // Leave as-is if JSON is malformed
    }
  }
}
