import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const cli = ['bin/colbertcache.js'];

function run(args) {
  return spawnSync(process.execPath, [...cli, ...args], { encoding: 'utf8' });
}

test('CLI help prints commands', () => {
  const result = run(['--help']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /colbertcache inspect/);
});

test('CLI verify passes sample fixture', () => {
  const result = run(['verify', 'fixtures/sample', '--strict']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PASS colbertcache-sample/);
});

test('CLI verify writes JSON output', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'colbertcache-verify-'));
  const output = path.join(dir, 'verify.json');
  const result = run(['verify', 'fixtures/sample', '--strict', '--json', '--output', output]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
  const report = JSON.parse(await readFile(output, 'utf8'));
  assert.equal(report.ok, true);
  assert.equal(report.summary.verifiedFiles, 4);
});

test('CLI writes retrieval config', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'colbertcache-test-'));
  const output = path.join(dir, 'config.json');
  const result = run(['config', 'fixtures/sample', '--output', output, '--name', 'unit-demo']);
  assert.equal(result.status, 0, result.stderr);
  const config = JSON.parse(await readFile(output, 'utf8'));
  assert.equal(config.demoName, 'unit-demo');
  assert.equal(config.documents.length, 2);
});

test('CLI init creates skeleton manifest', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'colbertcache-init-'));
  const result = run(['init', dir, '--name', 'draft-fixture']);
  assert.equal(result.status, 0, result.stderr);
  const manifest = JSON.parse(await readFile(path.join(dir, 'colbertcache.manifest.json'), 'utf8'));
  assert.equal(manifest.name, 'draft-fixture');
});
