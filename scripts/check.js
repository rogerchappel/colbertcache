import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const files = [
  'bin/colbertcache.js',
  'src/cli.js',
  'src/config.js',
  'src/errors.js',
  'src/fs-utils.js',
  'src/index.js',
  'src/init.js',
  'src/inspect.js',
  'src/manifest.js',
  'src/verify.js',
  'tests/cli.test.js',
  'tests/manifest.test.js'
];

let failed = false;
for (const file of files) {
  if (!existsSync(file)) {
    console.error(`missing ${file}`);
    failed = true;
    continue;
  }
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
