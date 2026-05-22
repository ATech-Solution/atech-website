import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-sqlite'

// No-op: all schema changes captured in this auto-generated migration were
// already applied by 20260521_060000_multilanguage_locale_fields (manually
// authored). Re-running the CREATE TABLE / DROP COLUMN statements here would
// fail with "table already exists" / "no such column" errors.
export async function up({ db: _db, payload: _p, req: _r }: MigrateUpArgs): Promise<void> {}

export async function down({ db: _db, payload: _p, req: _r }: MigrateDownArgs): Promise<void> {}
