# Basic Usage

Verify the sample fixture before using it as retrieval-demo input:

```bash
colbertcache verify fixtures/sample --strict
```

Expected output:

```text
PASS colbertcache-sample: 3/3 files verified, 0 extras
```

Write the same verification report as JSON for CI artifacts or release notes:

```bash
colbertcache verify fixtures/sample --strict --json --output out/verify.json
```

Generate a Markdown inventory for human review:

```bash
colbertcache inspect fixtures/sample --format markdown --output out/report.md
```

Generate deterministic config for a local retrieval demo:

```bash
colbertcache config fixtures/sample --output out/retrieval-config.json --name local-demo
```

Use the generated config as a stable input to a local retrieval demo. Verify before indexing.
