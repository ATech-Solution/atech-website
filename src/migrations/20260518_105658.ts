import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`job_vacancies\` (
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
  await db.run(sql`CREATE INDEX \`job_vacancies_updated_at_idx\` ON \`job_vacancies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`job_vacancies_created_at_idx\` ON \`job_vacancies\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`job_vacancies__status_idx\` ON \`job_vacancies\` (\`_status\`);`)
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
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`job_vacancies_id\` integer REFERENCES job_vacancies(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_job_vacancies_id_idx\` ON \`payload_locked_documents_rels\` (\`job_vacancies_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`job_vacancies\`;`)
  await db.run(sql`DROP TABLE \`_job_vacancies_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`categories_id\` integer,
  	\`portfolio_id\` integer,
  	\`portfolio_categories_id\` integer,
  	\`faq_categories_id\` integer,
  	\`faqs_id\` integer,
  	\`testimonials_id\` integer,
  	\`media_id\` integer,
  	\`plugins_id\` integer,
  	\`blocks_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`redirects_id\` integer,
  	\`search_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`portfolio_id\`) REFERENCES \`portfolio\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`portfolio_categories_id\`) REFERENCES \`portfolio_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faq_categories_id\`) REFERENCES \`faq_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`plugins_id\`) REFERENCES \`plugins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blocks_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "portfolio_id", "portfolio_categories_id", "faq_categories_id", "faqs_id", "testimonials_id", "media_id", "plugins_id", "blocks_id", "forms_id", "form_submissions_id", "redirects_id", "search_id") SELECT "id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "portfolio_id", "portfolio_categories_id", "faq_categories_id", "faqs_id", "testimonials_id", "media_id", "plugins_id", "blocks_id", "forms_id", "form_submissions_id", "redirects_id", "search_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_portfolio_id_idx\` ON \`payload_locked_documents_rels\` (\`portfolio_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_portfolio_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`portfolio_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faq_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`faq_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_plugins_id_idx\` ON \`payload_locked_documents_rels\` (\`plugins_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blocks_id_idx\` ON \`payload_locked_documents_rels\` (\`blocks_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
}
