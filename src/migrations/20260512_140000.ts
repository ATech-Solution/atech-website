import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create the portfolio_stats array join table for the portfolio-statistics block
  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS blocks_portfolio_stats (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      _order      INTEGER NOT NULL,
      _parent_id  INTEGER NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
      stat_value  TEXT
    )
  `))
  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS blocks_portfolio_stats_locales (
      stat_label  TEXT,
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      _locale     TEXT    NOT NULL,
      _parent_id  INTEGER NOT NULL REFERENCES blocks_portfolio_stats(id) ON DELETE CASCADE,
      UNIQUE (_locale, _parent_id)
    )
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql.raw(`DROP TABLE IF EXISTS blocks_portfolio_stats_locales`))
  await db.run(sql.raw(`DROP TABLE IF EXISTS blocks_portfolio_stats`))
}
