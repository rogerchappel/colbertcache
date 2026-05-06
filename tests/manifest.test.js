import test from 'node:test';
import assert from 'node:assert/strict';
import { loadManifest, validateManifest } from '../src/manifest.js';
import { verifyDataset } from '../src/verify.js';
import { inspectDataset } from '../src/inspect.js';

test('loads sample manifest', async () => {
  const { manifest } = await loadManifest('fixtures/sample');
  assert.equal(manifest.name, 'colbertcache-sample');
  assert.equal(manifest.files.length, 4);
});

test('rejects incomplete manifests', () => {
  assert.throws(() => validateManifest({ name: 'bad' }), /Invalid manifest/);
});

test('verifies sample fixture inventory and checksums', async () => {
  const result = await verifyDataset('fixtures/sample', { strict: true });
  assert.equal(result.ok, true);
  assert.equal(result.summary.verifiedFiles, 4);
  assert.equal(result.summary.extraFiles, 0);
});

test('inspect report includes provenance and roles', async () => {
  const report = await inspectDataset('fixtures/sample', { strict: true });
  assert.match(report.provenance.summary, /Synthetic fixture/);
  assert.equal(report.files.filter((file) => file.role === 'document').length, 2);
});
