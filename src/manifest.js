import path from 'node:path';
import { ColbertCacheError } from './errors.js';
import { readJson } from './fs-utils.js';

export const MANIFEST_FILE = 'colbertcache.manifest.json';

export async function loadManifest(datasetDir) {
  const root = path.resolve(datasetDir);
  const manifestPath = path.join(root, MANIFEST_FILE);
  const manifest = await readJson(manifestPath);
  validateManifest(manifest, manifestPath);
  return { root, manifestPath, manifest };
}

export function validateManifest(manifest, source = 'manifest') {
  const problems = [];
  if (!manifest || typeof manifest !== 'object') problems.push('manifest must be an object');
  if (!manifest.name) problems.push('name is required');
  if (!manifest.version) problems.push('version is required');
  if (!manifest.license) problems.push('license is required');
  if (!manifest.provenance?.summary) problems.push('provenance.summary is required');
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) problems.push('files must be a non-empty array');
  for (const [index, file] of (manifest.files || []).entries()) {
    if (!file.path) problems.push(`files[${index}].path is required`);
    if (!file.sha256) problems.push(`files[${index}].sha256 is required`);
    if (!Number.isInteger(file.bytes)) problems.push(`files[${index}].bytes must be an integer`);
  }
  if (problems.length > 0) {
    throw new ColbertCacheError(`Invalid ${source}: ${problems.join('; ')}`, { problems });
  }
  return true;
}

export function manifestFileSet(manifest) {
  return new Set(manifest.files.map((file) => file.path));
}
