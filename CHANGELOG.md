# feezify

## 2.0.0-beta.2

### Minor Changes

- The no-terminal path — feezify installs in 3 steps, for athletes, not just developers.

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

## 2.0.0-beta.1

### Minor Changes

- d640598: Memory write-safety guard (`feezify-memory-guard check|commit`). Stamps a checksum +
  `written_at` timestamp on every `memory/*.md` page at commit time, and detects/backs up
  drift (a hand-edit, stale copy, or merge) before the skill overwrites a page it didn't
  itself last write. Informed by reading OpenClaw's `memory-wiki` and Hermes-agent's
  `memory_tool.py` (see `wiki/references/openclaw-hermes-patterns-memoire-agent-2026-07-01.md`
  in the governance repo).
- v1 functional hardening — the read is now honest and consent is enforced end-to-end.

  - **Consent enforced in the CLI**: `feezify-lecture` now reads `<coreDir>/config.yml` and
    only touches the Strava REST API when `connectors.strava: true` **and** a token is set
    (new `config` adapter). A token without consent is ignored, with a plain note.
  - **Score provenance**: `DayReading` gains `scoreProvenance` — a day with no journal entry
    reports `neutral-default (no journal entry)` instead of passing a defaulted score off as
    measured. Both skills now tell the athlete plainly and invite them to fill the entry.
  - **Runnable skill instructions**: both `SKILL.md` now give the invocation that actually
    works after `pnpm install && pnpm build` (`node --env-file=.env dist/lecture.js …`,
    global-link variant noted) for the lecture and memory-guard bins.
  - Clear one-line CLI errors (Strava API failure, malformed core) instead of stack traces.

## 2.0.0-beta.0

### Major Changes

- 4593acb: feezify 2.0 — the AI-native rewrite. The old hosted SaaS (1.x) is gone; feezify is now a
  training **copilot** that runs on your own AI: a skill + a portable markdown core, zero infra.

  - Hexagonal design. Pure domain (the wedge): TSS fallback (power > hrTSS > RPE-TSS), EWMA
    CTL/ATL/TSB (TSB from yesterday), subjective readiness (faim/soif as deviation), and the
    crossing rule — the subjective gates the objective.
  - Providers as adapters: `strava-mcp` and `strava-rest` (shared mapping, relative-effort
    flagged, load recomputed from raw); two driving skills (`claude-skill` + `openclaw-skill`)
    over one `feezify-lecture` CLI.
  - Two memories: the athlete's `journal/` and the coach `memory/` (Karpathy LLM-Wiki pattern,
    read-first/update-after, provenance-anchored).
  - Portable core: `profil.md`, `user.md`, `objectifs.md`, `config.yml` (connectors consent),
    open `method.md`, journal template. EN-first docs + `/fr`.
  - Privacy & consent: tokens only in `.env`; explicit opt-in before any third-party exchange.
  - Tooling: pnpm + Changesets; husky enforcing the protected-hours git window.
