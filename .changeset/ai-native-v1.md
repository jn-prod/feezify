---
"feezify": minor
---

AI-native rewrite (v1): a training **copilot** as a skill + a portable markdown core, zero infra.

- Hexagonal design. Pure domain (the wedge): TSS fallback (power > hrTSS > RPE-TSS), EWMA
  CTL/ATL/TSB (TSB from yesterday), subjective readiness (faim/soif as deviation), and the
  crossing rule — the subjective gates the objective.
- Adapters: `strava-mcp` (provenance-flagged), `markdown-repo`, and two driving skills
  (`claude-skill` + `openclaw-skill`) over one `feezify-lecture` CLI.
- Coach `memory/` (Karpathy LLM-Wiki pattern, read-first/update-after), open `method.md`,
  EN-first docs + `/fr`.
- Tooling: pnpm + Changesets; husky enforcing the protected-hours git window.
