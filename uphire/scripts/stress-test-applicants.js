/**
 * Stress test script: Bulk insert QlikView-style candidates into Supabase
 * Usage: node scripts/stress-test-applicants.js [count] [batchSize]
 * Example: node scripts/stress-test-applicants.js 500 50
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const count = parseInt(process.argv[2] || '100', 10);
const batchSize = parseInt(process.argv[3] || '25', 10);

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const qlikViewSkills = [
  'QlikView', 'Qlik Sense', 'ETL', 'Set Analysis', 'SQL', 'Data Modeling',
  'Data Visualization', 'Data Warehouse', 'BI', 'Dashboard Design',
  'Scripting', 'Data Load', 'Expressions', 'Aggregation'
];

const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Daniel', 'Sophie', 'Thomas', 'Charlotte'];
const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Wilson', 'Johnson', 'Davis', 'Clark', 'Lewis'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCandidate(index, roleId) {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  return {
    role_id: roleId,
    name: `${firstName} ${lastName} ${index}`,
    email: `qlikview.candidate.${index}@stress-test.local`,
    phone: index % 3 === 0 ? `+44 7${String(index).padStart(9, '0')}` : null,
    status: 'new',
  };
}

async function main() {
  console.log(`Stress test: inserting ${count} QlikView candidates (batch size ${batchSize})...`);

  const { data: roles } = await supabase.from('roles').select('id').or('title.ilike.%qlikview%,title.ilike.%Qlik%').limit(1);
  let roleId = roles?.[0]?.id;
  if (!roleId) {
    const { data: anyRole } = await supabase.from('roles').select('id').limit(1);
    roleId = anyRole?.[0]?.id;
  }
  if (!roleId) {
    console.error('No roles found. Create a role in the app first.');
    process.exit(1);
  }
  console.log(`Using role ${roleId}`);

  const start = Date.now();
  let inserted = 0;
  for (let i = 0; i < count; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, count); j++) {
      batch.push(generateCandidate(j, roleId));
    }
    const { error } = await supabase.from('candidates').insert(batch);
    if (error) {
      console.error(`Batch ${i}-${i + batch.length} failed:`, error.message);
      break;
    }
    inserted += batch.length;
    process.stdout.write(`\rInserted ${inserted}/${count}`);
  }
  const elapsed = (Date.now() - start) / 1000;
  console.log(`\nDone. ${inserted} candidates in ${elapsed.toFixed(2)}s (${(inserted / elapsed).toFixed(1)}/s)`);
}

main().catch(console.error);
