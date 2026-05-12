import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-sqlite'

// Columns already added by 20260512_120000 with addColumnIfMissing guards.
// This auto-generated stub is intentionally a no-op to avoid duplicate column errors.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {}
