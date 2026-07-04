#!/usr/bin/env sh
# Rewrites documentation links that point outside /docs (repo files that don't
# ship in the site build: author.md, AGENTS.md, src/**, onboarding.md, LICENSE…)
# to their GitHub URLs. Links between docs pages stay relative — Jekyll's
# relative-links plugin converts those to the rendered pages.
# Run from site/ after copying the repo's /docs into site/docs.
set -e

GITHUB_BLOB="https://github.com/jn-prod/feezify/blob/ai-native"

for f in docs/fr/*.md; do
  sed -i -E "s|\]\(\.\./\.\./|](${GITHUB_BLOB}/|g" "$f"
done

for f in docs/*.md; do
  sed -i -E "s|\]\(\.\./|](${GITHUB_BLOB}/|g" "$f"
done
