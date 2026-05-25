import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`forms_scoring_field_weights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field_name\` text NOT NULL,
  	\`match_value\` text NOT NULL,
  	\`points\` numeric DEFAULT 10,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_scoring_field_weights_order_idx\` ON \`forms_scoring_field_weights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_scoring_field_weights_parent_id_idx\` ON \`forms_scoring_field_weights\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`form_ref_id\` integer REFERENCES forms(id);`)
  await db.run(sql`ALTER TABLE \`blocks\` ADD \`form_submit_label\` text;`)
  await db.run(sql`CREATE INDEX \`blocks_form_ref_idx\` ON \`blocks\` (\`form_ref_id\`);`)
  await db.run(sql`ALTER TABLE \`forms\` ADD \`scoring_enabled\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`forms\` ADD \`scoring_completeness_weight\` numeric DEFAULT 10;`)
  await db.run(sql`ALTER TABLE \`form_submissions\` ADD \`status\` text DEFAULT 'new';`)
  await db.run(sql`ALTER TABLE \`form_submissions\` ADD \`status_updated_at\` text;`)
  await db.run(sql`ALTER TABLE \`form_submissions\` ADD \`score\` numeric;`)
  await db.run(sql`ALTER TABLE \`form_submissions\` ADD \`score_breakdown\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`forms_scoring_field_weights\`;`)
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
  	\`badge\` text DEFAULT '',
  	\`cta_primary_label\` text DEFAULT 'Explore Services',
  	\`cta_primary_url\` text DEFAULT '/services',
  	\`cta_secondary_label\` text DEFAULT 'Client Testimonials',
  	\`cta_secondary_url\` text DEFAULT '/testimonials',
  	\`hero_image_id\` integer,
  	\`custom_solution_cta_label\` text DEFAULT 'Send us a Message',
  	\`custom_solution_cta_url\` text DEFAULT '/static/contact',
  	\`testimonials_content_source\` text DEFAULT 'manual',
  	\`testimonials_limit\` numeric DEFAULT 9,
  	\`enable_carousel\` integer DEFAULT false,
  	\`contact_email\` text DEFAULT 'hello@atech.software',
  	\`contact_phone\` text DEFAULT '+852 1234 5678',
  	\`contact_location\` text DEFAULT 'Hong Kong',
  	\`badge_icon_id\` integer,
  	\`about_hero_video_url\` text,
  	\`company_image_id\` integer,
  	\`mission_icon_id\` integer,
  	\`vision_icon_id\` integer,
  	\`faq_content_source\` text DEFAULT 'manual',
  	\`faq_category_slug\` text,
  	\`faq_limit\` numeric DEFAULT 20,
  	\`faq_back_label\` text,
  	\`faq_back_url\` text,
  	\`badge_icon_src\` text,
  	\`show_category_filter\` text DEFAULT 'yes',
  	\`project_content_source\` text DEFAULT 'manual',
  	\`project_limit\` numeric DEFAULT 9,
  	\`project_category\` text,
  	\`project_order_by\` text DEFAULT 'publishedAt_desc',
  	\`back_label\` text,
  	\`back_url\` text,
  	\`pd_client\` text,
  	\`pd_duration\` text,
  	\`pd_year\` text,
  	\`pd_team_size\` text,
  	\`pd_caption\` text,
  	\`pd_metrics_title\` text,
  	\`portfolio_hero_badge\` text DEFAULT 'Our Work',
  	\`portfolio_hero_cta_primary_label\` text DEFAULT 'View Projects',
  	\`portfolio_hero_cta_primary_url\` text DEFAULT '#projects',
  	\`portfolio_hero_cta_secondary_label\` text DEFAULT 'Start Your Project',
  	\`portfolio_hero_cta_secondary_url\` text DEFAULT '/static/contact',
  	\`feat_content_source\` text DEFAULT 'manual',
  	\`feat_post_slug\` text,
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
  await db.run(sql`INSERT INTO \`__new_blocks\`("id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "badge", "cta_primary_label", "cta_primary_url", "cta_secondary_label", "cta_secondary_url", "hero_image_id", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_content_source", "testimonials_limit", "enable_carousel", "contact_email", "contact_phone", "contact_location", "badge_icon_id", "about_hero_video_url", "company_image_id", "mission_icon_id", "vision_icon_id", "faq_content_source", "faq_category_slug", "faq_limit", "faq_back_label", "faq_back_url", "badge_icon_src", "show_category_filter", "project_content_source", "project_limit", "project_category", "project_order_by", "back_label", "back_url", "pd_client", "pd_duration", "pd_year", "pd_team_size", "pd_caption", "pd_metrics_title", "portfolio_hero_badge", "portfolio_hero_cta_primary_label", "portfolio_hero_cta_primary_url", "portfolio_hero_cta_secondary_label", "portfolio_hero_cta_secondary_url", "feat_content_source", "feat_post_slug", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at") SELECT "id", "name", "block_type", "category", "image_id", "video_url", "button_label", "button_url", "html_content", "map_embed_url", "icon_name", "columns", "alert_type", "badge", "cta_primary_label", "cta_primary_url", "cta_secondary_label", "cta_secondary_url", "hero_image_id", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_content_source", "testimonials_limit", "enable_carousel", "contact_email", "contact_phone", "contact_location", "badge_icon_id", "about_hero_video_url", "company_image_id", "mission_icon_id", "vision_icon_id", "faq_content_source", "faq_category_slug", "faq_limit", "faq_back_label", "faq_back_url", "badge_icon_src", "show_category_filter", "project_content_source", "project_limit", "project_category", "project_order_by", "back_label", "back_url", "pd_client", "pd_duration", "pd_year", "pd_team_size", "pd_caption", "pd_metrics_title", "portfolio_hero_badge", "portfolio_hero_cta_primary_label", "portfolio_hero_cta_primary_url", "portfolio_hero_cta_secondary_label", "portfolio_hero_cta_secondary_url", "feat_content_source", "feat_post_slug", "text_align", "font_family", "font_size", "font_weight", "line_height", "letter_spacing", "paragraph_spacing", "text_shadow_x", "text_shadow_y", "text_shadow_blur", "text_shadow_color", "text_color_normal", "text_color_hover", "link_color_normal", "link_color_hover", "background_color", "border_radius", "custom_c_s_s", "padding_top", "padding_right", "padding_bottom", "padding_left", "margin_top", "margin_right", "margin_bottom", "margin_left", "width", "position", "z_index", "css_class_name", "html_id", "hide_on_mobile", "hide_on_tablet", "hide_on_desktop", "updated_at", "created_at" FROM \`blocks\`;`)
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
  await db.run(sql`ALTER TABLE \`forms\` DROP COLUMN \`scoring_enabled\`;`)
  await db.run(sql`ALTER TABLE \`forms\` DROP COLUMN \`scoring_completeness_weight\`;`)
  await db.run(sql`ALTER TABLE \`form_submissions\` DROP COLUMN \`status\`;`)
  await db.run(sql`ALTER TABLE \`form_submissions\` DROP COLUMN \`status_updated_at\`;`)
  await db.run(sql`ALTER TABLE \`form_submissions\` DROP COLUMN \`score\`;`)
  await db.run(sql`ALTER TABLE \`form_submissions\` DROP COLUMN \`score_breakdown\`;`)
}
