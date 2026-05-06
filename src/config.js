import path from 'node:path';
import { inspectDataset } from './inspect.js';

export async function generateRetrievalConfig(datasetDir, options = {}) {
  const report = await inspectDataset(datasetDir, { strict: true });
  const datasetRoot = path.resolve(datasetDir);
  return {
    generatedBy: 'colbertcache',
    generatedAt: new Date().toISOString(),
    demoName: options.name || `${report.dataset.name}-retrieval-demo`,
    dataset: report.dataset,
    sourceRoot: datasetRoot,
    documents: report.files
      .filter((file) => file.role === 'document')
      .map((file) => ({ id: file.path, path: path.join(datasetRoot, file.path), mediaType: file.mediaType, sha256: file.sha256 })),
    queries: report.files
      .filter((file) => file.role === 'queries')
      .map((file) => ({ id: file.path, path: path.join(datasetRoot, file.path), mediaType: file.mediaType })),
    recommendedDefaults: {
      tokenizer: report.retrieval.tokenizer || 'whitespace-lowercase',
      topK: report.retrieval.topK || 3,
      notes: 'No network access is required. Use local paths and verify checksums before indexing.'
    },
    provenance: report.provenance
  };
}
