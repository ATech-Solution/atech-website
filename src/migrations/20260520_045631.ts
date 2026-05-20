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
  // Find every pages_locales row whose excerpt is non-empty plain text
  // (i.e. does NOT start with '{', which would indicate it's already JSON).
  const rows = await db.all<{ id: number; excerpt: string }>(
    sql`SELECT id, excerpt FROM pages_locales WHERE excerpt IS NOT NULL AND excerpt != '' AND substr(excerpt,1,1) != '{'`
  )

  for (const row of rows) {
    await db.run(
      sql`UPDATE pages_locales SET excerpt = ${wrapText(row.excerpt)} WHERE id = ${row.id}`
    )
    payload.logger.info(`[migrate] Converted plain-text excerpt for pages_locales id=${row.id}`)
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
