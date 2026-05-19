import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_two_factor_backup_codes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`code\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_two_factor_backup_codes_order_idx\` ON \`users_two_factor_backup_codes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_two_factor_backup_codes_parent_id_idx\` ON \`users_two_factor_backup_codes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`audit_logs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`action\` text NOT NULL,
  	\`collection\` text,
  	\`document_id\` text,
  	\`user_id\` integer,
  	\`ip\` text,
  	\`user_agent\` text,
  	\`details\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`audit_logs_user_idx\` ON \`audit_logs\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`audit_logs_updated_at_idx\` ON \`audit_logs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`audit_logs_created_at_idx\` ON \`audit_logs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`security_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`event_type\` text NOT NULL,
  	\`ip\` text,
  	\`user_id\` text,
  	\`endpoint\` text,
  	\`count\` numeric DEFAULT 1,
  	\`expires_at\` text,
  	\`resolved\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`security_events_ip_idx\` ON \`security_events\` (\`ip\`);`)
  await db.run(sql`CREATE INDEX \`security_events_updated_at_idx\` ON \`security_events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`security_events_created_at_idx\` ON \`security_events\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`settings_ip_blocklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ip\` text,
  	\`reason\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_ip_blocklist_order_idx\` ON \`settings_ip_blocklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_ip_blocklist_parent_id_idx\` ON \`settings_ip_blocklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_ip_allowlist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ip\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_ip_allowlist_order_idx\` ON \`settings_ip_allowlist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_ip_allowlist_parent_id_idx\` ON \`settings_ip_allowlist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_version_ip_blocklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ip\` text,
  	\`reason\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_version_ip_blocklist_order_idx\` ON \`_settings_v_version_ip_blocklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_version_ip_blocklist_parent_id_idx\` ON \`_settings_v_version_ip_blocklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_version_ip_allowlist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ip\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_version_ip_allowlist_order_idx\` ON \`_settings_v_version_ip_allowlist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_version_ip_allowlist_parent_id_idx\` ON \`_settings_v_version_ip_allowlist\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`two_factor_enabled\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`two_factor_secret\` text;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`audit_logs_id\` integer REFERENCES audit_logs(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`security_events_id\` integer REFERENCES security_events(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_audit_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`audit_logs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_security_events_id_idx\` ON \`payload_locked_documents_rels\` (\`security_events_id\`);`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`login_max_attempts\` numeric DEFAULT 5;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`login_lockout_minutes\` numeric DEFAULT 15;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`require_two_factor\` text DEFAULT 'disabled';`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`ip_filter_enabled\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`api_rate_limit_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`api_rate_limit_max\` numeric DEFAULT 60;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`csp_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`csp_report_only\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`hsts_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_login_max_attempts\` numeric DEFAULT 5;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_login_lockout_minutes\` numeric DEFAULT 15;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_require_two_factor\` text DEFAULT 'disabled';`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_ip_filter_enabled\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_api_rate_limit_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_api_rate_limit_max\` numeric DEFAULT 60;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_csp_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_csp_report_only\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_hsts_enabled\` integer DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_two_factor_backup_codes\`;`)
  await db.run(sql`DROP TABLE \`audit_logs\`;`)
  await db.run(sql`DROP TABLE \`security_events\`;`)
  await db.run(sql`DROP TABLE \`settings_ip_blocklist\`;`)
  await db.run(sql`DROP TABLE \`settings_ip_allowlist\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_version_ip_blocklist\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_version_ip_allowlist\`;`)
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
  	\`job_vacancies_id\` integer,
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
  	FOREIGN KEY (\`job_vacancies_id\`) REFERENCES \`job_vacancies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`plugins_id\`) REFERENCES \`plugins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blocks_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "portfolio_id", "portfolio_categories_id", "faq_categories_id", "faqs_id", "testimonials_id", "job_vacancies_id", "media_id", "plugins_id", "blocks_id", "forms_id", "form_submissions_id", "redirects_id", "search_id") SELECT "id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "portfolio_id", "portfolio_categories_id", "faq_categories_id", "faqs_id", "testimonials_id", "job_vacancies_id", "media_id", "plugins_id", "blocks_id", "forms_id", "form_submissions_id", "redirects_id", "search_id" FROM \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_job_vacancies_id_idx\` ON \`payload_locked_documents_rels\` (\`job_vacancies_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_plugins_id_idx\` ON \`payload_locked_documents_rels\` (\`plugins_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blocks_id_idx\` ON \`payload_locked_documents_rels\` (\`blocks_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`two_factor_enabled\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`two_factor_secret\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`login_max_attempts\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`login_lockout_minutes\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`require_two_factor\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`ip_filter_enabled\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`api_rate_limit_enabled\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`api_rate_limit_max\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`csp_enabled\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`csp_report_only\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`hsts_enabled\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_login_max_attempts\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_login_lockout_minutes\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_require_two_factor\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_ip_filter_enabled\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_api_rate_limit_enabled\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_api_rate_limit_max\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_csp_enabled\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_csp_report_only\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_hsts_enabled\`;`)
}
