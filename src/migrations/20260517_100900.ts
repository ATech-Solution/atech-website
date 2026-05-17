import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  await db.run(sql`CREATE TABLE \`__new_navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_title\` text DEFAULT 'ATech',
  	\`logo_id\` integer,
  	\`cta_label\` text DEFAULT 'Get a Quote',
  	\`cta_url\` text DEFAULT '/static/contact',
  	\`footer_text\` text DEFAULT '© 2026 ATech. All rights reserved.',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_navigation\`("id", "site_title", "logo_id", "cta_label", "cta_url", "footer_text", "_status", "updated_at", "created_at") SELECT "id", "site_title", "logo_id", "cta_label", "cta_url", "footer_text", "_status", "updated_at", "created_at" FROM \`navigation\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`ALTER TABLE \`__new_navigation\` RENAME TO \`navigation\`;`)
  await db.run(sql`CREATE INDEX \`navigation_logo_idx\` ON \`navigation\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation__status_idx\` ON \`navigation\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__navigation_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_site_title\` text DEFAULT 'ATech',
  	\`version_logo_id\` integer,
  	\`version_cta_label\` text DEFAULT 'Get a Quote',
  	\`version_cta_url\` text DEFAULT '/static/contact',
  	\`version_footer_text\` text DEFAULT '© 2026 ATech. All rights reserved.',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__navigation_v\`("id", "version_site_title", "version_logo_id", "version_cta_label", "version_cta_url", "version_footer_text", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "snapshot", "published_locale", "latest") SELECT "id", "version_site_title", "version_logo_id", "version_cta_label", "version_cta_url", "version_footer_text", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "snapshot", "published_locale", "latest" FROM \`_navigation_v\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__navigation_v\` RENAME TO \`_navigation_v\`;`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_version_logo_idx\` ON \`_navigation_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_version__status_idx\` ON \`_navigation_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_created_at_idx\` ON \`_navigation_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_updated_at_idx\` ON \`_navigation_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_snapshot_idx\` ON \`_navigation_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_published_locale_idx\` ON \`_navigation_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_latest_idx\` ON \`_navigation_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_theme\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'ATech',
  	\`site_tagline\` text,
  	\`logo_id\` integer,
  	\`favicon_id\` integer,
  	\`color_preset\` text DEFAULT 'dark-default',
  	\`color_scheme\` text DEFAULT 'dark',
  	\`primary_color\` text DEFAULT '#ffd369',
  	\`secondary_color\` text DEFAULT '#ffb347',
  	\`bg_color\` text DEFAULT '#292929',
  	\`surface_color\` text DEFAULT '#2f2f2f',
  	\`text_color\` text DEFAULT '#fafafa',
  	\`muted_color\` text DEFAULT '#525252',
  	\`border_color\` text DEFAULT '#383838',
  	\`testimonials_bg\` text,
  	\`preset_preview_note\` text,
  	\`heading_font\` text DEFAULT 'syne',
  	\`body_font\` text DEFAULT 'dm-sans',
  	\`hero_cta_primary_label\` text DEFAULT 'Explore Services',
  	\`hero_cta_primary_url\` text DEFAULT '/services',
  	\`hero_cta_secondary_label\` text DEFAULT 'Client Testimonials',
  	\`hero_cta_secondary_url\` text DEFAULT '/testimonials',
  	\`hero_image_id\` integer,
  	\`hero_layout\` text DEFAULT 'services-grid',
  	\`services_bg_style\` text DEFAULT 'light',
  	\`custom_solution_cta_label\` text DEFAULT 'Chat with us',
  	\`custom_solution_cta_url\` text DEFAULT '/static/contact',
  	\`testimonials_bg_style\` text DEFAULT 'yellow',
  	\`testimonials_bg_color\` text,
  	\`contact_email\` text DEFAULT 'hello@atech.software',
  	\`contact_phone\` text DEFAULT '+852 1234 5678',
  	\`contact_location\` text DEFAULT 'Central, Hong Kong',
  	\`footer_copyright\` text DEFAULT 'ATech Solutions Limited. All rights reserved.',
  	\`custom_c_s_s\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_theme\`("id", "site_name", "site_tagline", "logo_id", "favicon_id", "color_preset", "color_scheme", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "preset_preview_note", "heading_font", "body_font", "hero_cta_primary_label", "hero_cta_primary_url", "hero_cta_secondary_label", "hero_cta_secondary_url", "hero_image_id", "hero_layout", "services_bg_style", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_bg_style", "testimonials_bg_color", "contact_email", "contact_phone", "contact_location", "footer_copyright", "custom_c_s_s", "updated_at", "created_at") SELECT "id", "site_name", "site_tagline", "logo_id", "favicon_id", "color_preset", "color_scheme", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "preset_preview_note", "heading_font", "body_font", "hero_cta_primary_label", "hero_cta_primary_url", "hero_cta_secondary_label", "hero_cta_secondary_url", "hero_image_id", "hero_layout", "services_bg_style", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_bg_style", "testimonials_bg_color", "contact_email", "contact_phone", "contact_location", "footer_copyright", "custom_c_s_s", "updated_at", "created_at" FROM \`theme\`;`)
  await db.run(sql`DROP TABLE \`theme\`;`)
  await db.run(sql`ALTER TABLE \`__new_theme\` RENAME TO \`theme\`;`)
  await db.run(sql`CREATE INDEX \`theme_logo_idx\` ON \`theme\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_favicon_idx\` ON \`theme\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_hero_image_idx\` ON \`theme\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__theme_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_site_name\` text DEFAULT 'ATech',
  	\`version_site_tagline\` text,
  	\`version_logo_id\` integer,
  	\`version_favicon_id\` integer,
  	\`version_color_preset\` text DEFAULT 'dark-default',
  	\`version_color_scheme\` text DEFAULT 'dark',
  	\`version_primary_color\` text DEFAULT '#ffd369',
  	\`version_secondary_color\` text DEFAULT '#ffb347',
  	\`version_bg_color\` text DEFAULT '#292929',
  	\`version_surface_color\` text DEFAULT '#2f2f2f',
  	\`version_text_color\` text DEFAULT '#fafafa',
  	\`version_muted_color\` text DEFAULT '#525252',
  	\`version_border_color\` text DEFAULT '#383838',
  	\`version_testimonials_bg\` text,
  	\`version_preset_preview_note\` text,
  	\`version_heading_font\` text DEFAULT 'syne',
  	\`version_body_font\` text DEFAULT 'dm-sans',
  	\`version_hero_cta_primary_label\` text DEFAULT 'Explore Services',
  	\`version_hero_cta_primary_url\` text DEFAULT '/services',
  	\`version_hero_cta_secondary_label\` text DEFAULT 'Client Testimonials',
  	\`version_hero_cta_secondary_url\` text DEFAULT '/testimonials',
  	\`version_hero_image_id\` integer,
  	\`version_hero_layout\` text DEFAULT 'services-grid',
  	\`version_services_bg_style\` text DEFAULT 'light',
  	\`version_custom_solution_cta_label\` text DEFAULT 'Chat with us',
  	\`version_custom_solution_cta_url\` text DEFAULT '/static/contact',
  	\`version_testimonials_bg_style\` text DEFAULT 'yellow',
  	\`version_testimonials_bg_color\` text,
  	\`version_contact_email\` text DEFAULT 'hello@atech.software',
  	\`version_contact_phone\` text DEFAULT '+852 1234 5678',
  	\`version_contact_location\` text DEFAULT 'Central, Hong Kong',
  	\`version_footer_copyright\` text DEFAULT 'ATech Solutions Limited. All rights reserved.',
  	\`version_custom_c_s_s\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__theme_v\`("id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_color_preset", "version_color_scheme", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_preset_preview_note", "version_heading_font", "version_body_font", "version_hero_cta_primary_label", "version_hero_cta_primary_url", "version_hero_cta_secondary_label", "version_hero_cta_secondary_url", "version_hero_image_id", "version_hero_layout", "version_services_bg_style", "version_custom_solution_cta_label", "version_custom_solution_cta_url", "version_testimonials_bg_style", "version_testimonials_bg_color", "version_contact_email", "version_contact_phone", "version_contact_location", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_color_preset", "version_color_scheme", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_preset_preview_note", "version_heading_font", "version_body_font", "version_hero_cta_primary_label", "version_hero_cta_primary_url", "version_hero_cta_secondary_label", "version_hero_cta_secondary_url", "version_hero_image_id", "version_hero_layout", "version_services_bg_style", "version_custom_solution_cta_label", "version_custom_solution_cta_url", "version_testimonials_bg_style", "version_testimonials_bg_color", "version_contact_email", "version_contact_phone", "version_contact_location", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_theme_v\`;`)
  await db.run(sql`DROP TABLE \`_theme_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__theme_v\` RENAME TO \`_theme_v\`;`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_logo_idx\` ON \`_theme_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_favicon_idx\` ON \`_theme_v\` (\`version_favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_hero_image_idx\` ON \`_theme_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_created_at_idx\` ON \`_theme_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_updated_at_idx\` ON \`_theme_v\` (\`updated_at\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`is_frontpage\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_is_frontpage\` integer DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
  	\`custom_solution_cta_url\` text DEFAULT '/contact',
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
  	\`portfolio_hero_cta_secondary_url\` text DEFAULT '/contact',
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
  await db.run(sql`CREATE TABLE \`__new_navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_title\` text DEFAULT 'ATech',
  	\`logo_id\` integer,
  	\`cta_label\` text DEFAULT 'Get a Quote',
  	\`cta_url\` text DEFAULT '/contact',
  	\`footer_text\` text DEFAULT '© 2026 ATech. All rights reserved.',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_navigation\`("id", "site_title", "logo_id", "cta_label", "cta_url", "footer_text", "_status", "updated_at", "created_at") SELECT "id", "site_title", "logo_id", "cta_label", "cta_url", "footer_text", "_status", "updated_at", "created_at" FROM \`navigation\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`ALTER TABLE \`__new_navigation\` RENAME TO \`navigation\`;`)
  await db.run(sql`CREATE INDEX \`navigation_logo_idx\` ON \`navigation\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation__status_idx\` ON \`navigation\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__navigation_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_site_title\` text DEFAULT 'ATech',
  	\`version_logo_id\` integer,
  	\`version_cta_label\` text DEFAULT 'Get a Quote',
  	\`version_cta_url\` text DEFAULT '/contact',
  	\`version_footer_text\` text DEFAULT '© 2026 ATech. All rights reserved.',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__navigation_v\`("id", "version_site_title", "version_logo_id", "version_cta_label", "version_cta_url", "version_footer_text", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "snapshot", "published_locale", "latest") SELECT "id", "version_site_title", "version_logo_id", "version_cta_label", "version_cta_url", "version_footer_text", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "snapshot", "published_locale", "latest" FROM \`_navigation_v\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__navigation_v\` RENAME TO \`_navigation_v\`;`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_version_logo_idx\` ON \`_navigation_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_version__status_idx\` ON \`_navigation_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_created_at_idx\` ON \`_navigation_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_updated_at_idx\` ON \`_navigation_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_snapshot_idx\` ON \`_navigation_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_published_locale_idx\` ON \`_navigation_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_latest_idx\` ON \`_navigation_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_theme\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'ATech',
  	\`site_tagline\` text,
  	\`logo_id\` integer,
  	\`favicon_id\` integer,
  	\`color_preset\` text DEFAULT 'dark-default',
  	\`color_scheme\` text DEFAULT 'dark',
  	\`primary_color\` text DEFAULT '#ffd369',
  	\`secondary_color\` text DEFAULT '#ffb347',
  	\`bg_color\` text DEFAULT '#292929',
  	\`surface_color\` text DEFAULT '#2f2f2f',
  	\`text_color\` text DEFAULT '#fafafa',
  	\`muted_color\` text DEFAULT '#525252',
  	\`border_color\` text DEFAULT '#383838',
  	\`testimonials_bg\` text,
  	\`preset_preview_note\` text,
  	\`heading_font\` text DEFAULT 'syne',
  	\`body_font\` text DEFAULT 'dm-sans',
  	\`hero_cta_primary_label\` text DEFAULT 'Explore Services',
  	\`hero_cta_primary_url\` text DEFAULT '/services',
  	\`hero_cta_secondary_label\` text DEFAULT 'Client Testimonials',
  	\`hero_cta_secondary_url\` text DEFAULT '/testimonials',
  	\`hero_image_id\` integer,
  	\`hero_layout\` text DEFAULT 'services-grid',
  	\`services_bg_style\` text DEFAULT 'light',
  	\`custom_solution_cta_label\` text DEFAULT 'Chat with us',
  	\`custom_solution_cta_url\` text DEFAULT '/contact',
  	\`testimonials_bg_style\` text DEFAULT 'yellow',
  	\`testimonials_bg_color\` text,
  	\`contact_email\` text DEFAULT 'hello@atech.software',
  	\`contact_phone\` text DEFAULT '+852 1234 5678',
  	\`contact_location\` text DEFAULT 'Central, Hong Kong',
  	\`footer_copyright\` text DEFAULT 'ATech Solutions Limited. All rights reserved.',
  	\`custom_c_s_s\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_theme\`("id", "site_name", "site_tagline", "logo_id", "favicon_id", "color_preset", "color_scheme", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "preset_preview_note", "heading_font", "body_font", "hero_cta_primary_label", "hero_cta_primary_url", "hero_cta_secondary_label", "hero_cta_secondary_url", "hero_image_id", "hero_layout", "services_bg_style", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_bg_style", "testimonials_bg_color", "contact_email", "contact_phone", "contact_location", "footer_copyright", "custom_c_s_s", "updated_at", "created_at") SELECT "id", "site_name", "site_tagline", "logo_id", "favicon_id", "color_preset", "color_scheme", "primary_color", "secondary_color", "bg_color", "surface_color", "text_color", "muted_color", "border_color", "testimonials_bg", "preset_preview_note", "heading_font", "body_font", "hero_cta_primary_label", "hero_cta_primary_url", "hero_cta_secondary_label", "hero_cta_secondary_url", "hero_image_id", "hero_layout", "services_bg_style", "custom_solution_cta_label", "custom_solution_cta_url", "testimonials_bg_style", "testimonials_bg_color", "contact_email", "contact_phone", "contact_location", "footer_copyright", "custom_c_s_s", "updated_at", "created_at" FROM \`theme\`;`)
  await db.run(sql`DROP TABLE \`theme\`;`)
  await db.run(sql`ALTER TABLE \`__new_theme\` RENAME TO \`theme\`;`)
  await db.run(sql`CREATE INDEX \`theme_logo_idx\` ON \`theme\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_favicon_idx\` ON \`theme\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`theme_hero_image_idx\` ON \`theme\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__theme_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_site_name\` text DEFAULT 'ATech',
  	\`version_site_tagline\` text,
  	\`version_logo_id\` integer,
  	\`version_favicon_id\` integer,
  	\`version_color_preset\` text DEFAULT 'dark-default',
  	\`version_color_scheme\` text DEFAULT 'dark',
  	\`version_primary_color\` text DEFAULT '#ffd369',
  	\`version_secondary_color\` text DEFAULT '#ffb347',
  	\`version_bg_color\` text DEFAULT '#292929',
  	\`version_surface_color\` text DEFAULT '#2f2f2f',
  	\`version_text_color\` text DEFAULT '#fafafa',
  	\`version_muted_color\` text DEFAULT '#525252',
  	\`version_border_color\` text DEFAULT '#383838',
  	\`version_testimonials_bg\` text,
  	\`version_preset_preview_note\` text,
  	\`version_heading_font\` text DEFAULT 'syne',
  	\`version_body_font\` text DEFAULT 'dm-sans',
  	\`version_hero_cta_primary_label\` text DEFAULT 'Explore Services',
  	\`version_hero_cta_primary_url\` text DEFAULT '/services',
  	\`version_hero_cta_secondary_label\` text DEFAULT 'Client Testimonials',
  	\`version_hero_cta_secondary_url\` text DEFAULT '/testimonials',
  	\`version_hero_image_id\` integer,
  	\`version_hero_layout\` text DEFAULT 'services-grid',
  	\`version_services_bg_style\` text DEFAULT 'light',
  	\`version_custom_solution_cta_label\` text DEFAULT 'Chat with us',
  	\`version_custom_solution_cta_url\` text DEFAULT '/contact',
  	\`version_testimonials_bg_style\` text DEFAULT 'yellow',
  	\`version_testimonials_bg_color\` text,
  	\`version_contact_email\` text DEFAULT 'hello@atech.software',
  	\`version_contact_phone\` text DEFAULT '+852 1234 5678',
  	\`version_contact_location\` text DEFAULT 'Central, Hong Kong',
  	\`version_footer_copyright\` text DEFAULT 'ATech Solutions Limited. All rights reserved.',
  	\`version_custom_c_s_s\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__theme_v\`("id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_color_preset", "version_color_scheme", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_preset_preview_note", "version_heading_font", "version_body_font", "version_hero_cta_primary_label", "version_hero_cta_primary_url", "version_hero_cta_secondary_label", "version_hero_cta_secondary_url", "version_hero_image_id", "version_hero_layout", "version_services_bg_style", "version_custom_solution_cta_label", "version_custom_solution_cta_url", "version_testimonials_bg_style", "version_testimonials_bg_color", "version_contact_email", "version_contact_phone", "version_contact_location", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "version_site_name", "version_site_tagline", "version_logo_id", "version_favicon_id", "version_color_preset", "version_color_scheme", "version_primary_color", "version_secondary_color", "version_bg_color", "version_surface_color", "version_text_color", "version_muted_color", "version_border_color", "version_testimonials_bg", "version_preset_preview_note", "version_heading_font", "version_body_font", "version_hero_cta_primary_label", "version_hero_cta_primary_url", "version_hero_cta_secondary_label", "version_hero_cta_secondary_url", "version_hero_image_id", "version_hero_layout", "version_services_bg_style", "version_custom_solution_cta_label", "version_custom_solution_cta_url", "version_testimonials_bg_style", "version_testimonials_bg_color", "version_contact_email", "version_contact_phone", "version_contact_location", "version_footer_copyright", "version_custom_c_s_s", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_theme_v\`;`)
  await db.run(sql`DROP TABLE \`_theme_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__theme_v\` RENAME TO \`_theme_v\`;`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_logo_idx\` ON \`_theme_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_favicon_idx\` ON \`_theme_v\` (\`version_favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_version_version_hero_image_idx\` ON \`_theme_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_created_at_idx\` ON \`_theme_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_theme_v_updated_at_idx\` ON \`_theme_v\` (\`updated_at\`);`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`is_frontpage\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_is_frontpage\`;`)
}
