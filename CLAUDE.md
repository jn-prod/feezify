<!--
Shim Claude Code. Everything operational lives in AGENTS.md (neutral, read by Codex / Cursor / etc.).
Claude Code does NOT read AGENTS.md natively — this @ import is what loads it. Do not remove it.
-->
@AGENTS.md

## Claude Code — feezify
Key rule: the **domain (`src/domain/`) is read-only** (the IP — change only with founder
authorization, TDD, and it stays pure); **adapters (`src/adapters/`) are the editable
extension surface**. Full hexagon law + invariants in `AGENTS.md`.
