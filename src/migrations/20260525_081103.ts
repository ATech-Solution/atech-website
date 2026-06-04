import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`forms_blocks_step_separator\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`step_label\` text NOT NULL,
  	\`step_description\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_step_separator_order_idx\` ON \`forms_blocks_step_separator\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_step_separator_parent_id_idx\` ON \`forms_blocks_step_separator\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_step_separator_path_idx\` ON \`forms_blocks_step_separator\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_scale\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`required\` integer DEFAULT true,
  	\`scale_min\` numeric DEFAULT 0,
  	\`scale_max\` numeric DEFAULT 10,
  	\`min_label\` text DEFAULT 'Not at all',
  	\`max_label\` text DEFAULT 'Extremely likely',
  	\`score_weight\` numeric DEFAULT 1,
  	\`width\` numeric DEFAULT 100,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_scale_order_idx\` ON \`forms_blocks_scale\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_scale_parent_id_idx\` ON \`forms_blocks_scale\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_scale_path_idx\` ON \`forms_blocks_scale\` (\`_path\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`forms_blocks_step_separator\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_scale\`;`)
}
