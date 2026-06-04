import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Migration 20260512_110000 cleaned posts_rels WHERE path='relatedPosts' but missed
// _posts_v_rels WHERE path='version.relatedPosts'. Those rows are orphaned because
// the posts_id column (which stored the relation target) was dropped in 20260512_071741.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql.raw(`DELETE FROM _posts_v_rels WHERE path = 'version.relatedPosts'`))
  // Re-run posts_rels cleanup as a safety net for servers that missed migration 110000
  await db.run(sql.raw(`DELETE FROM posts_rels WHERE path = 'relatedPosts'`))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // No-op — orphaned rows cannot be meaningfully restored
}
