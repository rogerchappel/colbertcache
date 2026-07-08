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

## File paths

Each `files[].path` value must be a forward-slash relative path that resolves
inside the fixture mirror directory. Absolute paths, Windows drive paths,
backslashes, `..` traversal, and paths that change when normalized are rejected.

Good:

```json
{ "path": "docs/wiki-abstracts.txt" }
```

Rejected:

```json
{ "path": "../wiki-abstracts.txt" }
{ "path": "/tmp/wiki-abstracts.txt" }
{ "path": "docs/../wiki-abstracts.txt" }
```
