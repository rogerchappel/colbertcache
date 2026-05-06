import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { writeJson } from './fs-utils.js';
import { MANIFEST_FILE } from './manifest.js';

export async function initDataset(targetDir, options = {}) {
  const root = path.resolve(targetDir);
  await mkdir(path.join(root, 'docs'), { recursive: true });
  await mkdir(path.join(root, 'queries'), { recursive: true });
  const manifest = {
    schemaVersion: 1,
    name: options.name || path.basename(root),
    version: '0.1.0',
    description: 'Local retrieval fixture mirror. Replace sample values and run colbertcache verify.',
    license: 'REPLACE-ME',
    provenance: {
      summary: 'Describe where this fixture came from and what was transformed.',
      source: 'local',
      transformedBy: 'colbertcache init'
    },
    retrieval: { tokenizer: 'whitespace-lowercase', topK: 3 },
    files: []
  };
  await writeJson(path.join(root, MANIFEST_FILE), manifest);
  await writeFile(path.join(root, 'PROVENANCE.md'), '# Provenance\n\nDescribe source, license, and allowed demo use.\n', 'utf8');
  return { root, manifestPath: path.join(root, MANIFEST_FILE) };
}
