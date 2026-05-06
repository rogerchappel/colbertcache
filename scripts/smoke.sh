#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"
rm -rf out/smoke
mkdir -p out/smoke
node bin/colbertcache.js verify fixtures/sample --strict
node bin/colbertcache.js inspect fixtures/sample --format markdown --output out/smoke/report.md --strict
node bin/colbertcache.js config fixtures/sample --output out/smoke/retrieval-config.json --name sample-smoke
node -e "const fs=require('node:fs'); const cfg=JSON.parse(fs.readFileSync('out/smoke/retrieval-config.json','utf8')); if (cfg.documents.length !== 2) throw new Error('expected 2 docs');"
echo "Smoke passed: report and retrieval config generated in out/smoke"
