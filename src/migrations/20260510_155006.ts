import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_blocks_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`heading\` text DEFAULT 'ATech Solution',
  	\`body\` text DEFAULT 'We build robust, scalable, and intelligent software solutions for startups and enterprises. Elevate your technological capabilities with our expert engineering teams.',
  	\`description\` text DEFAULT 'We are a leading technology company specializing in custom software development, quality assurance, and IT consulting services for businesses of all sizes.',
  	\`subheading\` text DEFAULT 'Comprehensive technology solutions tailored to your business needs.',
  	\`custom_solution_heading\` text DEFAULT 'Need Custom Solution?',
  	\`custom_solution_body\` text DEFAULT 'Let''''s discuss your specific requirements and create a tailored solution.',
  	\`contact_subheading\` text DEFAULT 'Ready to start your next project? Let''''s discuss how we can help.',
  	\`form_heading\` text DEFAULT 'Send us a Message',
  	\`submit_label\` text DEFAULT 'Send Message',
  	\`info_heading\` text DEFAULT 'Contact Information',
  	\`about_hero_heading\` text,
  	\`about_hero_subheading\` text,
  	\`about_company_heading\` text,
  	\`body1\` text,
  	\`body2\` text,
  	\`mission_heading\` text,
  	\`mission_body\` text,
  	\`vision_heading\` text,
  	\`vision_body\` text,
  	\`values_heading\` text,
  	\`leadership_heading\` text,
  	\`leadership_subheading\` text,
  	\`faq_heading\` text,
  	\`faq_subheading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_blocks_locales\`("title", "subtitle", "heading", "body", "description", "subheading", "custom_solution_heading", "custom_solution_body", "contact_subheading", "form_heading", "submit_label", "info_heading", "about_hero_heading", "about_hero_subheading", "about_company_heading", "body1", "body2", "mission_heading", "mission_body", "vision_heading", "vision_body", "values_heading", "leadership_heading", "leadership_subheading", "faq_heading", "faq_subheading", "id", "_locale", "_parent_id") SELECT "title", "subtitle", "heading", "body", "description", "subheading", "custom_solution_heading", "custom_solution_body", "contact_subheading", "form_heading", "submit_label", "info_heading", "about_hero_heading", "about_hero_subheading", "about_company_heading", "body1", "body2", "mission_heading", "mission_body", "vision_heading", "vision_body", "values_heading", "leadership_heading", "leadership_subheading", "faq_heading", "faq_subheading", "id", "_locale", "_parent_id" FROM \`blocks_locales\`;`)
  await db.run(sql`DROP TABLE \`blocks_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_blocks_locales\` RENAME TO \`blocks_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_locales_locale_parent_id_unique\` ON \`blocks_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_blocks_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`heading\` text DEFAULT 'ATech Solution Your Technology Partner',
  	\`body\` text DEFAULT 'We build robust, scalable, and intelligent software solutions for startups and enterprises. Elevate your technological capabilities with our expert engineering teams.',
  	\`description\` text DEFAULT 'We are a leading technology company specializing in custom software development, quality assurance, and IT consulting services for businesses of all sizes.',
  	\`subheading\` text DEFAULT 'Comprehensive technology solutions tailored to your business needs.',
  	\`custom_solution_heading\` text DEFAULT 'Need Custom Solution?',
  	\`custom_solution_body\` text DEFAULT 'Let''''s discuss your specific requirements and create a tailored solution.',
  	\`contact_subheading\` text DEFAULT 'Ready to start your next project? Let''''s discuss how we can help.',
  	\`form_heading\` text DEFAULT 'Send us a Message',
  	\`submit_label\` text DEFAULT 'Send Message',
  	\`info_heading\` text DEFAULT 'Contact Information',
  	\`about_hero_heading\` text,
  	\`about_hero_subheading\` text,
  	\`about_company_heading\` text,
  	\`body1\` text,
  	\`body2\` text,
  	\`mission_heading\` text,
  	\`mission_body\` text,
  	\`vision_heading\` text,
  	\`vision_body\` text,
  	\`values_heading\` text,
  	\`leadership_heading\` text,
  	\`leadership_subheading\` text,
  	\`faq_heading\` text,
  	\`faq_subheading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_blocks_locales\`("title", "subtitle", "heading", "body", "description", "subheading", "custom_solution_heading", "custom_solution_body", "contact_subheading", "form_heading", "submit_label", "info_heading", "about_hero_heading", "about_hero_subheading", "about_company_heading", "body1", "body2", "mission_heading", "mission_body", "vision_heading", "vision_body", "values_heading", "leadership_heading", "leadership_subheading", "faq_heading", "faq_subheading", "id", "_locale", "_parent_id") SELECT "title", "subtitle", "heading", "body", "description", "subheading", "custom_solution_heading", "custom_solution_body", "contact_subheading", "form_heading", "submit_label", "info_heading", "about_hero_heading", "about_hero_subheading", "about_company_heading", "body1", "body2", "mission_heading", "mission_body", "vision_heading", "vision_body", "values_heading", "leadership_heading", "leadership_subheading", "faq_heading", "faq_subheading", "id", "_locale", "_parent_id" FROM \`blocks_locales\`;`)
  await db.run(sql`DROP TABLE \`blocks_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_blocks_locales\` RENAME TO \`blocks_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_locales_locale_parent_id_unique\` ON \`blocks_locales\` (\`_locale\`,\`_parent_id\`);`)
}
