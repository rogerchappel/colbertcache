import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('package tarball includes the release candidate surface', () => {
  const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    encoding: 'utf8'
  });
  const [pack] = JSON.parse(output);
  const packedFiles = new Set(pack.files.map((file) => file.path));

  for (const expected of [
    'package.json',
    'bin/colbertcache.js',
    'src/index.js',
    'fixtures/sample/colbertcache.manifest.json',
    'examples/basic-usage.md',
    'docs/manifest-format.md',
    'docs/provenance-and-licensing.md',
    'README.md',
    'LICENSE',
    'SECURITY.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md'
  ]) {
    assert.equal(packedFiles.has(expected), true, `${expected} should be packed`);
  }
});

test('declared CLI bin is executable and has a Node shebang', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    encoding: 'utf8'
  });
  const [pack] = JSON.parse(output);
  const packedFileByPath = new Map(pack.files.map((file) => [file.path, file]));

  for (const binPath of Object.values(packageJson.bin ?? {})) {
    const normalized = binPath.replace(/^.\//, '');
    const packed = packedFileByPath.get(normalized);
    assert.ok(packed, `${normalized} should be packed`);
    assert.equal((packed.mode & 0o111) !== 0, true, `${normalized} should be executable`);
    assert.equal(
      readFileSync(normalized, 'utf8').startsWith('#!/usr/bin/env node'),
      true,
      `${normalized} should have a Node shebang`
    );
  }
});
