import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`chatbot_leads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`question\` text,
  	\`conversation_path\` text,
  	\`page\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_leads_updated_at_idx\` ON \`chatbot_leads\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_leads_created_at_idx\` ON \`chatbot_leads\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`event_type\` text NOT NULL,
  	\`node_label\` text,
  	\`conversation_path\` text,
  	\`page\` text,
  	\`session_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_events_updated_at_idx\` ON \`chatbot_events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_events_created_at_idx\` ON \`chatbot_events\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_settings_nodes_children_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`answer\` text,
  	\`show_contact_form\` integer DEFAULT false,
  	\`show_whatsapp\` integer DEFAULT true,
  	\`whatsapp_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chatbot_settings_nodes_children\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_settings_nodes_children_children_order_idx\` ON \`chatbot_settings_nodes_children_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_settings_nodes_children_children_parent_id_idx\` ON \`chatbot_settings_nodes_children_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_settings_nodes_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`answer\` text,
  	\`show_contact_form\` integer DEFAULT false,
  	\`show_whatsapp\` integer DEFAULT true,
  	\`whatsapp_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chatbot_settings_nodes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_settings_nodes_children_order_idx\` ON \`chatbot_settings_nodes_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_settings_nodes_children_parent_id_idx\` ON \`chatbot_settings_nodes_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_settings_nodes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`answer\` text,
  	\`show_contact_form\` integer DEFAULT false,
  	\`show_whatsapp\` integer DEFAULT true,
  	\`whatsapp_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chatbot_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_settings_nodes_order_idx\` ON \`chatbot_settings_nodes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_settings_nodes_parent_id_idx\` ON \`chatbot_settings_nodes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_settings_page_whitelist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`path\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chatbot_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_settings_page_whitelist_order_idx\` ON \`chatbot_settings_page_whitelist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_settings_page_whitelist_parent_id_idx\` ON \`chatbot_settings_page_whitelist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`active\` integer DEFAULT true,
  	\`bot_name\` text DEFAULT 'ATech Assistant',
  	\`greeting_message\` text DEFAULT 'Hello, what can I help you with? Please enter a number of the following options:',
  	\`default_whatsapp_url\` text DEFAULT 'https://wa.me/85297496042',
  	\`contact_form_title\` text DEFAULT 'Please leave your name and email. Our team will contact you shortly.',
  	\`notify_email\` text,
  	\`show_on_all_pages\` integer DEFAULT true,
  	\`availability_enabled\` integer DEFAULT false,
  	\`availability_start\` numeric DEFAULT 9,
  	\`availability_end\` numeric DEFAULT 17,
  	\`availability_message\` text DEFAULT 'We''''re currently offline (Mon–Fri, 9am–5pm HKT). Leave a message or reach us on WhatsApp.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`chatbot_leads_id\` integer REFERENCES chatbot_leads(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`chatbot_events_id\` integer REFERENCES chatbot_events(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chatbot_leads_id_idx\` ON \`payload_locked_documents_rels\` (\`chatbot_leads_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chatbot_events_id_idx\` ON \`payload_locked_documents_rels\` (\`chatbot_events_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`chatbot_leads\`;`)
  await db.run(sql`DROP TABLE \`chatbot_events\`;`)
  await db.run(sql`DROP TABLE \`chatbot_settings_nodes_children_children\`;`)
  await db.run(sql`DROP TABLE \`chatbot_settings_nodes_children\`;`)
  await db.run(sql`DROP TABLE \`chatbot_settings_nodes\`;`)
  await db.run(sql`DROP TABLE \`chatbot_settings_page_whitelist\`;`)
  await db.run(sql`DROP TABLE \`chatbot_settings\`;`)
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
  	\`audit_logs_id\` integer,
  	\`security_events_id\` integer,
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
  	FOREIGN KEY (\`audit_logs_id\`) REFERENCES \`audit_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`security_events_id\`) REFERENCES \`security_events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "portfolio_id", "portfolio_categories_id", "faq_categories_id", "faqs_id", "testimonials_id", "job_vacancies_id", "media_id", "plugins_id", "blocks_id", "audit_logs_id", "security_events_id", "forms_id", "form_submissions_id", "redirects_id", "search_id") SELECT "id", "order", "parent_id", "path", "users_id", "pages_id", "posts_id", "categories_id", "portfolio_id", "portfolio_categories_id", "faq_categories_id", "faqs_id", "testimonials_id", "job_vacancies_id", "media_id", "plugins_id", "blocks_id", "audit_logs_id", "security_events_id", "forms_id", "form_submissions_id", "redirects_id", "search_id" FROM \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_audit_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`audit_logs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_security_events_id_idx\` ON \`payload_locked_documents_rels\` (\`security_events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
}
