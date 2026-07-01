---
"feezify": minor
---

Memory write-safety guard (`feezify-memory-guard check|commit`). Stamps a checksum +
`written_at` timestamp on every `memory/*.md` page at commit time, and detects/backs up
drift (a hand-edit, stale copy, or merge) before the skill overwrites a page it didn't
itself last write. Informed by reading OpenClaw's `memory-wiki` and Hermes-agent's
`memory_tool.py` (see `wiki/references/openclaw-hermes-patterns-memoire-agent-2026-07-01.md`
in the governance repo).
