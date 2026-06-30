---
"feezify": major
---

feezify 2.0 — the AI-native rewrite. The old hosted SaaS (1.x) is gone; feezify is now a
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
