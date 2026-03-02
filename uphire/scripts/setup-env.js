#!/usr/bin/env node

/**
 * Setup .env from env.example
 * Copies env.example to .env only if .env does not exist.
 * Run: npm run setup:env
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const envExamplePath = path.join(root, 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✓ .env already exists. No changes made.');
  process.exit(0);
}

if (!fs.existsSync(envExamplePath)) {
  console.error('✗ env.example not found.');
  process.exit(1);
}

fs.copyFileSync(envExamplePath, envPath);
console.log('✓ Created .env from env.example');
console.log('  Next: Edit .env and add your API keys. See LAUNCH_BRIEF.md');
