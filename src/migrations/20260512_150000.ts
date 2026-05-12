import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── faq_categories ────────────────────────────────────────────────────────
  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS \`faq_categories\` (
      \`id\`          integer PRIMARY KEY NOT NULL,
      \`slug\`        text    NOT NULL,
      \`updated_at\`  text    DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\`  text    DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    )
  `))

  await db.run(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS \`faq_categories_slug_idx\`
      ON \`faq_categories\` (\`slug\`)
  `))

  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS \`faq_categories_locales\` (
      \`name\`        text    NOT NULL,
      \`title\`       text,
      \`id\`          integer PRIMARY KEY NOT NULL,
      \`_locale\`     text    NOT NULL,
      \`_parent_id\`  integer NOT NULL,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_categories\`(\`id\`)
        ON UPDATE no action ON DELETE cascade
    )
  `))

  await db.run(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS \`faq_categories_locales_locale_parent_id_unique\`
      ON \`faq_categories_locales\` (\`_locale\`, \`_parent_id\`)
  `))

  // ── faqs ──────────────────────────────────────────────────────────────────
  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS \`faqs\` (
      \`id\`           integer PRIMARY KEY NOT NULL,
      \`category_id\`  integer,
      \`order\`        numeric DEFAULT 0,
      \`updated_at\`   text    DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\`   text    DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      FOREIGN KEY (\`category_id\`) REFERENCES \`faq_categories\`(\`id\`)
        ON UPDATE no action ON DELETE set null
    )
  `))

  await db.run(sql.raw(`
    CREATE INDEX IF NOT EXISTS \`faqs_category_idx\`
      ON \`faqs\` (\`category_id\`)
  `))

  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS \`faqs_locales\` (
      \`question\`    text,
      \`answer\`      text,
      \`id\`          integer PRIMARY KEY NOT NULL,
      \`_locale\`     text    NOT NULL,
      \`_parent_id\`  integer NOT NULL,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`faqs\`(\`id\`)
        ON UPDATE no action ON DELETE cascade
    )
  `))

  await db.run(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS \`faqs_locales_locale_parent_id_unique\`
      ON \`faqs_locales\` (\`_locale\`, \`_parent_id\`)
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql.raw(`DROP TABLE IF EXISTS \`faqs_locales\``))
  await db.run(sql.raw(`DROP TABLE IF EXISTS \`faqs\``))
  await db.run(sql.raw(`DROP TABLE IF EXISTS \`faq_categories_locales\``))
  await db.run(sql.raw(`DROP TABLE IF EXISTS \`faq_categories\``))
}
