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
colbertcache verify fixtures/sample --strict --json --output out/verify.json
colbertcache inspect fixtures/sample --format markdown --output out/report.md
colbertcache config fixtures/sample --output out/retrieval-config.json --name local-demo
```

A fixture mirror is just a directory with `colbertcache.manifest.json`, local files, checksums, and provenance notes.

See [examples/basic-usage.md](examples/basic-usage.md) for the same flow with representative CLI output.

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

## Verification

Run the release-readiness checks before publishing or cutting a PR:

```bash
npm run lint
npm run check
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

`npm run lint` is an alias for the repository static check so contributors can
use the common npm workflow without guessing the project-specific command.
Use `npm run package:smoke` to confirm the published tarball includes the CLI,
sample fixture mirror, example walkthrough, manifest/provenance docs, support
docs, executable bin metadata, and runnable package contents.
