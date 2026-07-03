---
"feezify": minor
---

The no-terminal path — feezify installs in 3 steps, for athletes, not just developers.

- **Official Strava MCP connector as the default source**: both skills now prefer the
  host's Strava connector (OAuth, no API keys) and write the local cache; the cache
  contract is documented once in `core-template/templates/activities-cache.md`. The shared
  mapping tolerates the connector's `start_date` (UTC) shape.
- **Self-contained skill zip**: `pnpm package:skill` builds
  `packaging/feezify-skill-<version>.zip` — a claude.ai-uploadable skill with the bundled
  engine (no dependencies, no install), the core template, and the open method. New
  `claude-skill-zip` envelope creates the athlete's core on first run, conversationally.
- **Two-path onboarding** (EN + FR): "A. No terminal — 3 steps" (connector + zip + ask) and
  "B. Developer path" (the original flow). READMEs updated; waitlist now points at
  `/feezify.html`.
