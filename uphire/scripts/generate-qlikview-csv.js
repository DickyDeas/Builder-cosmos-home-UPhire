/**
 * Generate CSV of QlikView-style candidates for UI import
 * Usage: node scripts/generate-qlikview-csv.js [count] [filename]
 * Example: node scripts/generate-qlikview-csv.js 200 qlikview_candidates.csv
 */

import { writeFileSync } from 'fs';

const count = parseInt(process.argv[2] || '200', 10);
const filename = process.argv[3] || 'qlikview_candidates.csv';

const qlikViewSkills = [
  'QlikView', 'Qlik Sense', 'ETL', 'Set Analysis', 'SQL', 'Data Modeling',
  'Data Visualization', 'Data Warehouse', 'BI', 'Dashboard Design'
];

const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Daniel', 'Sophie'];
const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Wilson', 'Johnson', 'Davis'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function escapeCsv(val) {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const header = 'name,email,phone,experience,skills,source';
const rows = [];

for (let i = 0; i < count; i++) {
  const numSkills = 4 + Math.floor(Math.random() * 4);
  const skills = [];
  const shuffled = [...qlikViewSkills].sort(() => Math.random() - 0.5);
  for (let j = 0; j < numSkills; j++) skills.push(shuffled[j]);
  rows.push([
    `${randomItem(firstNames)} ${randomItem(lastNames)} ${i}`,
    `qlikview.${i}@stress-test.local`,
    i % 3 === 0 ? `+44 7${String(i).padStart(9, '0')}` : '',
    `${2 + (i % 8)} years QlikView/BI`,
    skills.join('; '),
    'Stress Test',
  ].map(escapeCsv).join(','));
}

const csv = [header, ...rows].join('\n');
writeFileSync(filename, csv, 'utf8');
console.log(`Generated ${count} candidates → ${filename}`);
