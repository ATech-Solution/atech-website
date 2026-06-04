import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-sqlite'

// No-op: superseded by auto-generated migration 20260512_151704 which
// creates faq_categories, faqs tables and adds faq_* columns to blocks.
export async function up(_args: MigrateUpArgs): Promise<void> {}
export async function down(_args: MigrateDownArgs): Promise<void> {}
