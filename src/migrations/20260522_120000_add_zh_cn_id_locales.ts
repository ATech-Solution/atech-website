import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add Simplified Chinese (zh-cn) and Indonesian (id) to language_settings_active_locales.
  // These are data-only changes — no schema changes needed.

  try {
    // Get the parent_id of the language-settings global
    const rows = await db.all(sql`SELECT _parent_id FROM language_settings_active_locales LIMIT 1`)
    const parentId = (rows[0] as any)?._parent_id ?? 1

    const existing = await db.all(sql`SELECT code FROM language_settings_active_locales`)
    const existingCodes = new Set((existing as any[]).map((r) => r.code))

    if (!existingCodes.has('zh-cn')) {
      const maxOrder = await db.get(sql`SELECT MAX(_order) as m FROM language_settings_active_locales`)
      const nextOrder = ((maxOrder as any)?.m ?? 2) + 1
      const id = Math.random().toString(16).slice(2).padEnd(32, '0').toUpperCase()
      await db.run(sql`
        INSERT INTO language_settings_active_locales (_order, _parent_id, id, code, label, enabled)
        VALUES (${nextOrder}, ${parentId}, ${id}, 'zh-cn', 'Simplified Chinese', 1)
      `)
    }

    if (!existingCodes.has('id')) {
      const maxOrder = await db.get(sql`SELECT MAX(_order) as m FROM language_settings_active_locales`)
      const nextOrder = ((maxOrder as any)?.m ?? 3) + 1
      const id = Math.random().toString(16).slice(2).padEnd(32, '0').toUpperCase()
      await db.run(sql`
        INSERT INTO language_settings_active_locales (_order, _parent_id, id, code, label, enabled)
        VALUES (${nextOrder}, ${parentId}, ${id}, 'id', 'Indonesian', 1)
      `)
    }
  } catch (err) {
    console.warn('[migration] add_zh_cn_id_locales:', (err as Error).message)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  try {
    await db.run(sql`DELETE FROM language_settings_active_locales WHERE code IN ('zh-cn', 'id')`)
  } catch {
    // ignore
  }
}
