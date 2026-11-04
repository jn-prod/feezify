---
"feezify": patch
---

Restore `pnpm package:skill`: the staging module was never committed, because `.gitignore`
also matched `src/packaging/`.
