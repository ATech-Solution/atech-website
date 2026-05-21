import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Rename chatbot depth-3 table: children → sub_children
  // Needed because Payload/Drizzle disallows two sibling relations named "children"
  // in the same parent table (chatbot_settings_nodes_children).
  await db.run(sql`ALTER TABLE \`chatbot_settings_nodes_children_children\` RENAME TO \`chatbot_settings_nodes_children_sub_children\`;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`chatbot_settings_nodes_children_sub_children\` RENAME TO \`chatbot_settings_nodes_children_children\`;`)
}
