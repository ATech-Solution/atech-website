import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Remove orphaned relatedPosts rows left in posts_rels after the posts_id column
  // was dropped in migration 20260512_071741. These rows have path='relatedPosts'
  // and categories_id=NULL, causing Payload to error when loading a post in admin.
  await db.run(sql.raw(`DELETE FROM posts_rels WHERE path = 'relatedPosts'`))
  await db.run(sql.raw(`DELETE FROM _posts_v_rels WHERE path = 'relatedPosts'`))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // No-op — orphaned rows cannot be meaningfully restored
}
