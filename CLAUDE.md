# CLAUDE.md

Operating instructions: read [`AGENTS.md`](AGENTS.md).

Key rule: the **domain (`src/domain/`) is read-only** (the IP — change only with founder
authorization, TDD, and it stays pure); **adapters (`src/adapters/`) are the editable
extension surface**. Full hexagon law + invariants in `AGENTS.md`.
