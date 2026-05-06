# Orchestration

colbertcache is intentionally local-first. Agents and maintainers should follow this sequence:

1. Create or update fixtures in a branch.
2. Record source, license, transformations, and allowed demo use in `PROVENANCE.md`.
3. Update `colbertcache.manifest.json` with exact bytes and SHA-256 checksums.
4. Run `npm test`, `npm run check`, `npm run build`, `npm run smoke`, and `bash scripts/validate.sh`.
5. Open a PR that links to the task or issue and includes generated verification output.

No task should land in review without a PR link, a provenance note, and local verification results.
