# Basic Usage

```bash
colbertcache verify fixtures/sample --strict
colbertcache inspect fixtures/sample --format markdown --output out/report.md
colbertcache config fixtures/sample --output out/retrieval-config.json --name local-demo
```

Use the generated config as a stable input to a local retrieval demo. Verify before indexing.
