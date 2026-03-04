#!/usr/bin/env node

/**
 * Run Supabase migrations via direct PostgreSQL connection.
 * Requires DATABASE_URL in .env (from Supabase Dashboard → Settings → Database → Connection string).
 *
 * Run: npm run migrate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(root, '.env') });

const migrationsDir = path.join(root, 'supabase', 'migrations');
const order = [
  '001_initial_schema.sql',
  '002_support_tickets.sql',
  '003_role_flags.sql',
  '004_remove_freemium_unlimit_candidates.sql',
  '005_tenants_and_job_feeds.sql',
  '006_tenant_job_boards_and_analytics.sql',
  '007_add_shortlist_notes.sql',
  '008_ai_generated_cv_flag.sql',
  '009_storage_buckets.sql',
  '010_profile_sync.sql',
  '011_extended_roles.sql',
  '012_employee_details.sql',
  '013_user_document_templates.sql',
  '014_tenant_roles_and_job_board_schema.sql',
  '015_audit_logs.sql',
  '016_tenant_scoped_entities.sql',
  '017_storage_tenant_isolation.sql',
  '018_tenant_users_admin_policies.sql',
  '019_tenant_creation_policies.sql',
  '020_candidate_soft_delete.sql',
  '021_candidates_exclude_deleted_rls.sql',
  '022_fix_security_linter.sql',
  '023_fix_auth_rls_initplan.sql',
  '024_fix_all_supabase_lints.sql',
  '025_fix_remaining_16_lints.sql',
  '026_add_missing_fk_indexes.sql',
  '027_roles_needing_attention_and_admin_tenants.sql',
  '028_fix_handle_new_user_profile_sync.sql',
  '029_add_profiles_full_name.sql',
  '030_ensure_profiles_columns.sql',
];

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('✗ DATABASE_URL not set in .env');
    console.error('  Get it from: Supabase Dashboard → Settings → Database → Connection string (URI)');
    process.exit(1);
  }

  let pg;
  try {
    pg = await import('pg');
  } catch {
    console.error('✗ pg package not found. Run: npm install pg');
    process.exit(1);
  }

  const client = new pg.default.Client({ connectionString: dbUrl });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    for (const file of order) {
      const filePath = path.join(migrationsDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠ Skipping ${file} (not found)`);
        continue;
      }

      const sql = fs.readFileSync(filePath, 'utf8');
      process.stdout.write(`Running ${file}... `);

      try {
        await client.query(sql);
        console.log('✓');
      } catch (err) {
        if (err.message?.includes('already exists') || err.code === '42P07' || err.code === '42710') {
          console.log('(already applied)');
        } else {
          console.error('\n✗ Error:', err.message);
          process.exit(1);
        }
      }
    }

    console.log('\n✅ Migrations complete.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
