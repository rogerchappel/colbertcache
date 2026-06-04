# colbertcache

Tiny, fussy, useful fixture mirrors for retrieval demos.

colbertcache keeps local RAG / ColBERT-style demo datasets honest: manifests, checksums, provenance, inventory verification, and generated retrieval config — no hidden downloads, no telemetry, no magic.

## Install

```bash
npm install -g colbertcache
```

For this repo:

```bash
npm install
npm run smoke
node bin/colbertcache.js --help
```

## Quickstart

```bash
colbertcache verify fixtures/sample --strict
colbertcache inspect fixtures/sample --format markdown --output out/report.md
colbertcache config fixtures/sample --output out/retrieval-config.json --name local-demo
```

A fixture mirror is just a directory with `colbertcache.manifest.json`, local files, checksums, and provenance notes.

## Commands

- `inspect <dataset>`: summarize manifest, files, provenance, and verification.
- `verify <dataset>`: check file inventory, byte counts, and SHA-256 hashes.
- `config <dataset>`: generate deterministic local retrieval-demo config.
- `init <dataset>`: create a starter fixture mirror skeleton.

## Safety boundaries

colbertcache is local-first by design. It does not fetch remote datasets, scrape credentials, phone home, or publish artifacts. If your fixture came from somewhere else, write that down in provenance and respect the upstream license.

## Attribution

This project is a fresh OSS concept inspired by the existence of ColBERT-style demo repositories, including `vincentkoc/Colbertv2-Wiki17-Abstracts-Image`. It does not copy that implementation or data.

## Contributing

Please keep contributions small and reviewable. Fixture PRs must include provenance, license notes, and local verification output. See `CONTRIBUTING.md` and `docs/ORCHESTRATION.md`.

## Verify

Run local verification before opening a PR or publishing:

```bash
npm test
npm run release:check
```

`release:check` runs tests, build steps, smoke verification, and a dry-run `npm pack` to ensure everything ships cleanly.
