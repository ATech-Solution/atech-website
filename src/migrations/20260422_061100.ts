import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`settings_access_control_can_read\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`settings_access_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_access_control_can_read_order_idx\` ON \`settings_access_control_can_read\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`settings_access_control_can_read_parent_idx\` ON \`settings_access_control_can_read\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_access_control_can_create\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`settings_access_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_access_control_can_create_order_idx\` ON \`settings_access_control_can_create\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`settings_access_control_can_create_parent_idx\` ON \`settings_access_control_can_create\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_access_control_can_update\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`settings_access_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_access_control_can_update_order_idx\` ON \`settings_access_control_can_update\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`settings_access_control_can_update_parent_idx\` ON \`settings_access_control_can_update\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_access_control_can_delete\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`settings_access_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_access_control_can_delete_order_idx\` ON \`settings_access_control_can_delete\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`settings_access_control_can_delete_parent_idx\` ON \`settings_access_control_can_delete\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_access_control\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`collection\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_access_control_order_idx\` ON \`settings_access_control\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_access_control_parent_id_idx\` ON \`settings_access_control\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_version_access_control_can_read\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_settings_v_version_access_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_can_read_order_idx\` ON \`_settings_v_version_access_control_can_read\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_can_read_parent_idx\` ON \`_settings_v_version_access_control_can_read\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_version_access_control_can_create\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_settings_v_version_access_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_can_create_order_idx\` ON \`_settings_v_version_access_control_can_create\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_can_create_parent_idx\` ON \`_settings_v_version_access_control_can_create\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_version_access_control_can_update\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_settings_v_version_access_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_can_update_order_idx\` ON \`_settings_v_version_access_control_can_update\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_can_update_parent_idx\` ON \`_settings_v_version_access_control_can_update\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_version_access_control_can_delete\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_settings_v_version_access_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_can_delete_order_idx\` ON \`_settings_v_version_access_control_can_delete\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_can_delete_parent_idx\` ON \`_settings_v_version_access_control_can_delete\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_version_access_control\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`collection\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_order_idx\` ON \`_settings_v_version_access_control\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_version_access_control_parent_id_idx\` ON \`_settings_v_version_access_control\` (\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_blocks\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`block_type\` text NOT NULL,
  	\`category\` text DEFAULT 'basic' NOT NULL,
  	\`image_id\` integer,
  	\`video_url\` text,
  	\`button_label\` text,
  	\`button_url\` text,
  	\`html_content\` text,
  	\`map_embed_url\` text,
  	\`icon_name\` text,
  	\`columns\` text DEFAULT '3',
  	\`alert_type\` text DEFAULT 'info',
  	\`badge\` text DEFAULT 'Welcome to ATech Solutions',
  	\`cta_primary_label\` text DEFAULT 'Explore Services',
  	\`cta_primary_url\` text DEFAULT '/services',
  	\`cta_secondary_label\` text DEFAULT 'Client Testimonials',
  	\`cta_secondary_url\` text DEFAULT '/testimonials',
  	\`hero_image_id\` integer,
  	\`custom_solution_cta_label\` text DEFAULT 'Chat with us',
  	\`custom_solution_cta_url\` text DEFAULT '/contact',
  	\`contact_email\` text DEFAULT 'hello@atech.software',
  	\`contact_phone\` text DEFAULT '+852 1234 5678',
  	\`contact_location\` text DEFAULT 'Hong Kong',
  	\`badge_icon_id\` integer,
  	\`about_hero_video_url\` text,
  	\`company_image_id\` integer,
  	\`mission_icon_id\` integer,
  	\`vision_icon_id\` integer,
  	\`badge_icon_src\` text,
  	\`text_align\` text DEFAULT 'left',
  	\`font_family\` text,
  	\`font_size\` text,
  	\`font_weight\` text,
  	\`line_height\` text,
  	\`letter_spacing\` text,
  	\`paragraph_spacing\` text,
  	\`text_shadow_x\` text,
  	\`text_shadow_y\` text,
  	\`text_shadow_blur\` text,
  	\`text_shadow_color\` text,
  	\`text_color_normal\` text,
  	\`text_color_hover\` text,
  	\`link_color_normal\` text,
  	\`link_color_hover\` text,
  	\`background_color\` text,
  	\`border_radius\` text,
  	\`custom_c_s_s\` text,
  	\`padding_top\` text,
  	\`padding_right\` text,
  	\`padding_bottom\` text,
  	\`padding_left\` text,
  	\`margin_top\` text,
  	\`margin_right\` text,
  	\`margin_bottom\` text,
  	\`margin_left\` text,
  	\`width\` text,
  	\`position\` text DEFAULT 'relative',
  	\`z_index\` numeric,
  	\`css_class_name\` text,
  	\`html_id\` text,
  	\`hide_on_mobile\` integer DEFAULT false,
  	\`hide_on_tablet\` integer DEFAULT false,
  	\`hide_on_desktop\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`badge_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`company_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`mission_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`vision_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_blocks\`("id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "badge", "cta_primary_label", "cta_primary_url", "cta_secondary_label", "cta_secondary_url", "hero_image_id", "custom_solution_cta_label", "custom_solution_cta_url", "contact_email", "contact_phone", "contact_location", "badge_icon_id", "about_hero_video_url", "company_image_id", "mission_icon_id", "vision_icon_id", "badge_icon_src", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at") SELECT "id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "badge", "cta_primary_label", "cta_primary_url", "cta_secondary_label", "cta_secondary_url", "hero_image_id", "custom_solution_cta_label", "custom_solution_cta_url", "contact_email", "contact_phone", "contact_location", "badge_icon_id", "about_hero_video_url", "company_image_id", "mission_icon_id", "vision_icon_id", "badge_icon_src", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at" FROM \`blocks\`;`)
  await db.run(sql`DROP TABLE \`blocks\`;`)
  await db.run(sql`ALTER TABLE \`__new_blocks\` RENAME TO \`blocks\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`blocks_image_idx\` ON \`blocks\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_hero_image_idx\` ON \`blocks\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_badge_icon_idx\` ON \`blocks\` (\`badge_icon_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_company_image_idx\` ON \`blocks\` (\`company_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_mission_icon_idx\` ON \`blocks\` (\`mission_icon_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_vision_icon_idx\` ON \`blocks\` (\`vision_icon_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_updated_at_idx\` ON \`blocks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blocks_created_at_idx\` ON \`blocks\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_blocks_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`heading\` text DEFAULT 'Build Software That Scales Your Business Forward',
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
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_locales_locale_parent_id_unique\` ON \`blocks_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`_verified\` integer;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`_verificationtoken\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`maintenance_mode\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`maintenance_title\` text DEFAULT 'Under Construction.';`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`maintenance_message\` text DEFAULT 'We''''re rebuilding something great. Our systems are temporarily offline while we upgrade — we''''ll be back shortly.';`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`maintenance_status_label\` text DEFAULT 'System upgrade in progress';`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`maintenance_estimate\` text DEFAULT 'Soon';`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`smtp_enabled\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`smtp_host\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`smtp_port\` numeric DEFAULT 465;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`smtp_secure\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`smtp_user\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`smtp_password\` text;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_maintenance_mode\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_maintenance_title\` text DEFAULT 'Under Construction.';`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_maintenance_message\` text DEFAULT 'We''''re rebuilding something great. Our systems are temporarily offline while we upgrade — we''''ll be back shortly.';`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_maintenance_status_label\` text DEFAULT 'System upgrade in progress';`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_maintenance_estimate\` text DEFAULT 'Soon';`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_smtp_enabled\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_smtp_host\` text;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_smtp_port\` numeric DEFAULT 465;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_smtp_secure\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_smtp_user\` text;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` ADD \`version_smtp_password\` text;`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`color_preset\` text DEFAULT 'dark-default';`)
  await db.run(sql`ALTER TABLE \`theme\` ADD \`preset_preview_note\` text;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_color_preset\` text DEFAULT 'dark-default';`)
  await db.run(sql`ALTER TABLE \`_theme_v\` ADD \`version_preset_preview_note\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`settings_access_control_can_read\`;`)
  await db.run(sql`DROP TABLE \`settings_access_control_can_create\`;`)
  await db.run(sql`DROP TABLE \`settings_access_control_can_update\`;`)
  await db.run(sql`DROP TABLE \`settings_access_control_can_delete\`;`)
  await db.run(sql`DROP TABLE \`settings_access_control\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_version_access_control_can_read\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_version_access_control_can_create\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_version_access_control_can_update\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_version_access_control_can_delete\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_version_access_control\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_blocks\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`block_type\` text NOT NULL,
  	\`category\` text DEFAULT 'basic' NOT NULL,
  	\`image_id\` integer,
  	\`video_url\` text,
  	\`button_label\` text,
  	\`button_url\` text,
  	\`html_content\` text,
  	\`map_embed_url\` text,
  	\`icon_name\` text,
  	\`columns\` text DEFAULT '3',
  	\`alert_type\` text DEFAULT 'info',
  	\`badge\` text,
  	\`cta_primary_label\` text,
  	\`cta_primary_url\` text,
  	\`cta_secondary_label\` text,
  	\`cta_secondary_url\` text,
  	\`hero_image_id\` integer,
  	\`custom_solution_cta_label\` text,
  	\`custom_solution_cta_url\` text,
  	\`contact_email\` text,
  	\`contact_phone\` text,
  	\`contact_location\` text,
  	\`badge_icon_id\` integer,
  	\`about_hero_video_url\` text,
  	\`company_image_id\` integer,
  	\`mission_icon_id\` integer,
  	\`vision_icon_id\` integer,
  	\`badge_icon_src\` text,
  	\`text_align\` text DEFAULT 'left',
  	\`font_family\` text,
  	\`font_size\` text,
  	\`font_weight\` text,
  	\`line_height\` text,
  	\`letter_spacing\` text,
  	\`paragraph_spacing\` text,
  	\`text_shadow_x\` text,
  	\`text_shadow_y\` text,
  	\`text_shadow_blur\` text,
  	\`text_shadow_color\` text,
  	\`text_color_normal\` text,
  	\`text_color_hover\` text,
  	\`link_color_normal\` text,
  	\`link_color_hover\` text,
  	\`background_color\` text,
  	\`border_radius\` text,
  	\`custom_c_s_s\` text,
  	\`padding_top\` text,
  	\`padding_right\` text,
  	\`padding_bottom\` text,
  	\`padding_left\` text,
  	\`margin_top\` text,
  	\`margin_right\` text,
  	\`margin_bottom\` text,
  	\`margin_left\` text,
  	\`width\` text,
  	\`position\` text DEFAULT 'relative',
  	\`z_index\` numeric,
  	\`css_class_name\` text,
  	\`html_id\` text,
  	\`hide_on_mobile\` integer DEFAULT false,
  	\`hide_on_tablet\` integer DEFAULT false,
  	\`hide_on_desktop\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`badge_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`company_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`mission_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`vision_icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_blocks\`("id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "badge", "cta_primary_label", "cta_primary_url", "cta_secondary_label", "cta_secondary_url", "hero_image_id", "custom_solution_cta_label", "custom_solution_cta_url", "contact_email", "contact_phone", "contact_location", "badge_icon_id", "about_hero_video_url", "company_image_id", "mission_icon_id", "vision_icon_id", "badge_icon_src", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at") SELECT "id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "badge", "cta_primary_label", "cta_primary_url", "cta_secondary_label", "cta_secondary_url", "hero_image_id", "custom_solution_cta_label", "custom_solution_cta_url", "contact_email", "contact_phone", "contact_location", "badge_icon_id", "about_hero_video_url", "company_image_id", "mission_icon_id", "vision_icon_id", "badge_icon_src", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at" FROM \`blocks\`;`)
  await db.run(sql`DROP TABLE \`blocks\`;`)
  await db.run(sql`ALTER TABLE \`__new_blocks\` RENAME TO \`blocks\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`blocks_image_idx\` ON \`blocks\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_hero_image_idx\` ON \`blocks\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_badge_icon_idx\` ON \`blocks\` (\`badge_icon_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_company_image_idx\` ON \`blocks\` (\`company_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_mission_icon_idx\` ON \`blocks\` (\`mission_icon_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_vision_icon_idx\` ON \`blocks\` (\`vision_icon_id\`);`)
  await db.run(sql`CREATE INDEX \`blocks_updated_at_idx\` ON \`blocks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blocks_created_at_idx\` ON \`blocks\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_blocks_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`heading\` text,
  	\`body\` text,
  	\`description\` text,
  	\`subheading\` text,
  	\`custom_solution_heading\` text,
  	\`custom_solution_body\` text,
  	\`contact_subheading\` text,
  	\`form_heading\` text,
  	\`submit_label\` text,
  	\`info_heading\` text,
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
  await db.run(sql`CREATE UNIQUE INDEX \`blocks_locales_locale_parent_id_unique\` ON \`blocks_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`_verified\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`_verificationtoken\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`maintenance_mode\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`maintenance_title\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`maintenance_message\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`maintenance_status_label\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`maintenance_estimate\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`smtp_enabled\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`smtp_host\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`smtp_port\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`smtp_secure\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`smtp_user\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`smtp_password\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_maintenance_mode\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_maintenance_title\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_maintenance_message\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_maintenance_status_label\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_maintenance_estimate\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_smtp_enabled\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_smtp_host\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_smtp_port\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_smtp_secure\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_smtp_user\`;`)
  await db.run(sql`ALTER TABLE \`_settings_v\` DROP COLUMN \`version_smtp_password\`;`)
  await db.run(sql`ALTER TABLE \`theme\` DROP COLUMN \`color_preset\`;`)
  await db.run(sql`ALTER TABLE \`theme\` DROP COLUMN \`preset_preview_note\`;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` DROP COLUMN \`version_color_preset\`;`)
  await db.run(sql`ALTER TABLE \`_theme_v\` DROP COLUMN \`version_preset_preview_note\`;`)
}
