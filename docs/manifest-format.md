# Manifest Format

A fixture mirror is a directory containing `colbertcache.manifest.json`.
The manifest records the dataset identity, provenance, retrieval defaults, and file inventory.

Required top-level fields:

- `name`
- `version`
- `license`
- `provenance.summary`
- `files[]` with `path`, `bytes`, and `sha256`

`role` may be `document`, `queries`, `provenance`, or another project-specific value.
Only `document` and `queries` are used when generating retrieval config.
