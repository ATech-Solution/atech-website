import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_job_vacancies_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_job_vacancies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`position_type\` text DEFAULT 'full-time' NOT NULL,
  	\`category\` text,
  	\`location\` text,
  	\`excerpt\` text,
  	\`description\` text,
  	\`apply_label\` text DEFAULT 'Apply Now',
  	\`apply_url\` text,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_job_vacancies\`("id", "title", "position_type", "category", "location", "excerpt", "description", "apply_label", "apply_url", "status", "order", "updated_at", "created_at") SELECT "id", "title", "position_type", "category", "location", "excerpt", "description", "apply_label", "apply_url", "status", "order", "updated_at", "created_at" FROM \`job_vacancies\`;`)
  await db.run(sql`DROP TABLE \`job_vacancies\`;`)
  await db.run(sql`ALTER TABLE \`__new_job_vacancies\` RENAME TO \`job_vacancies\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`job_vacancies_updated_at_idx\` ON \`job_vacancies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`job_vacancies_created_at_idx\` ON \`job_vacancies\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_job_vacancies_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_position_type\` text DEFAULT 'full-time',
  	\`version_category\` text,
  	\`version_location\` text,
  	\`version_excerpt\` text,
  	\`version_description\` text,
  	\`version_apply_label\` text DEFAULT 'Apply Now',
  	\`version_apply_url\` text,
  	\`version_status\` text DEFAULT 'active',
  	\`version_order\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`job_vacancies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_job_vacancies_v_parent_idx\` ON \`_job_vacancies_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_job_vacancies_v_version_version_updated_at_idx\` ON \`_job_vacancies_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_vacancies_v_version_version_created_at_idx\` ON \`_job_vacancies_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_vacancies_v_version_version__status_idx\` ON \`_job_vacancies_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_job_vacancies_v_created_at_idx\` ON \`_job_vacancies_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_vacancies_v_updated_at_idx\` ON \`_job_vacancies_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_vacancies_v_snapshot_idx\` ON \`_job_vacancies_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_job_vacancies_v_published_locale_idx\` ON \`_job_vacancies_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_job_vacancies_v_latest_idx\` ON \`_job_vacancies_v\` (\`latest\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_job_vacancies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`position_type\` text DEFAULT 'full-time',
  	\`category\` text,
  	\`location\` text,
  	\`excerpt\` text,
  	\`description\` text,
  	\`apply_label\` text DEFAULT 'Apply Now',
  	\`apply_url\` text,
  	\`status\` text DEFAULT 'active',
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`INSERT INTO \`__new_job_vacancies\`("id", "title", "position_type", "category", "location", "excerpt", "description", "apply_label", "apply_url", "status", "order", "updated_at", "created_at", "_status") SELECT "id", "title", "position_type", "category", "location", "excerpt", "description", "apply_label", "apply_url", "status", "order", "updated_at", "created_at", "_status" FROM \`job_vacancies\`;`)
  await db.run(sql`DROP TABLE \`job_vacancies\`;`)
  await db.run(sql`ALTER TABLE \`__new_job_vacancies\` RENAME TO \`job_vacancies\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`job_vacancies_updated_at_idx\` ON \`job_vacancies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`job_vacancies_created_at_idx\` ON \`job_vacancies\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`job_vacancies__status_idx\` ON \`job_vacancies\` (\`_status\`);`)
}
