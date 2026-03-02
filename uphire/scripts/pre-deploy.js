#!/usr/bin/env node

/**
 * Pre-deploy verification
 * Runs typecheck, build, and tests. Use before deploying.
 * Run: npm run pre-deploy
 */

import { spawn } from 'child_process';

function run(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', shell: true });
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`))));
  });
}

async function main() {
  console.log('🔍 Pre-deploy verification\n');
  try {
    console.log('1/3 Running typecheck...');
    await run('npm', ['run', 'typecheck']);
    console.log('   ✓ Typecheck passed\n');

    console.log('2/3 Running build...');
    await run('npm', ['run', 'build']);
    console.log('   ✓ Build passed\n');

    console.log('3/3 Running tests...');
    await run('npm', ['run', 'test']);
    console.log('   ✓ Tests passed\n');

    console.log('✅ All checks passed. Ready to deploy.');
  } catch (err) {
    console.error('\n❌ Pre-deploy failed:', err.message);
    process.exit(1);
  }
}

main();
