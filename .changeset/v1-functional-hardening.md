---
"feezify": minor
---

v1 functional hardening — the read is now honest and consent is enforced end-to-end.

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
