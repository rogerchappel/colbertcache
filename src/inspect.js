import { verifyDataset } from './verify.js';
import { loadManifest } from './manifest.js';

export async function inspectDataset(datasetDir, options = {}) {
  const { root, manifest } = await loadManifest(datasetDir);
  const verification = await verifyDataset(root, { strict: options.strict });
  return {
    dataset: {
      name: manifest.name,
      version: manifest.version,
      description: manifest.description || '',
      license: manifest.license,
      homepage: manifest.homepage || null
    },
    provenance: manifest.provenance,
    retrieval: manifest.retrieval || {},
    files: manifest.files.map((file) => ({
      path: file.path,
      bytes: file.bytes,
      sha256: file.sha256,
      mediaType: file.mediaType || 'application/octet-stream',
      role: file.role || 'document',
      description: file.description || ''
    })),
    verification
  };
}

export function renderMarkdownReport(report) {
  const lines = [];
  lines.push(`# ${report.dataset.name} ${report.dataset.version}`);
  lines.push('');
  lines.push(report.dataset.description || 'No description provided.');
  lines.push('');
  lines.push(`- License: ${report.dataset.license}`);
  lines.push(`- Provenance: ${report.provenance.summary}`);
  lines.push(`- Verification: ${report.verification.ok ? 'PASS' : 'FAIL'}`);
  lines.push('');
  lines.push('## Files');
  lines.push('');
  lines.push('| Path | Role | Bytes | SHA-256 |');
  lines.push('|---|---:|---:|---|');
  for (const file of report.files) {
    lines.push(`| ${file.path} | ${file.role} | ${file.bytes} | \`${file.sha256}\` |`);
  }
  lines.push('');
  return `${lines.join('\n')}\n`;
}
