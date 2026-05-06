import path from 'node:path';
import { fileSize, listFiles, sha256File } from './fs-utils.js';
import { loadManifest, MANIFEST_FILE, manifestFileSet } from './manifest.js';

export async function verifyDataset(datasetDir, options = {}) {
  const loaded = await loadManifest(datasetDir);
  const { root, manifest } = loaded;
  const expected = manifestFileSet(manifest);
  const actualFiles = (await listFiles(root)).filter((file) => file !== MANIFEST_FILE);
  const actual = new Set(actualFiles);
  const fileResults = [];

  for (const entry of manifest.files) {
    const absolute = path.join(root, entry.path);
    const exists = actual.has(entry.path);
    let bytes = null;
    let sha256 = null;
    let ok = false;
    let reason = exists ? undefined : 'missing';
    if (exists) {
      bytes = await fileSize(absolute);
      sha256 = await sha256File(absolute);
      ok = bytes === entry.bytes && sha256 === entry.sha256;
      if (!ok) reason = bytes !== entry.bytes ? 'bytes-mismatch' : 'sha256-mismatch';
    }
    fileResults.push({ path: entry.path, expectedBytes: entry.bytes, bytes, expectedSha256: entry.sha256, sha256, ok, reason });
  }

  const extras = actualFiles.filter((file) => !expected.has(file));
  const strictOk = options.strict ? extras.length === 0 : true;
  const ok = fileResults.every((file) => file.ok) && strictOk;
  return {
    ok,
    strict: Boolean(options.strict),
    dataset: manifest.name,
    version: manifest.version,
    checkedAt: new Date().toISOString(),
    files: fileResults,
    extras,
    summary: {
      expectedFiles: manifest.files.length,
      verifiedFiles: fileResults.filter((file) => file.ok).length,
      missingFiles: fileResults.filter((file) => file.reason === 'missing').length,
      extraFiles: extras.length
    }
  };
}
