# AGENTS.md

Operating manifest for AI agents (and humans) working on **feezify**.
Read natively by Claude Code, Codex, Gemini CLI, Copilot, Cursor, etc.

feezify is a training **copilot**, AI-native: a skill + a portable markdown core, zero infra.
Design doc: the hexagonal architecture spec (kept in the governance repo). The method is open
(`src/adapters/claude-skill/method.md`).

---

## The hexagon law (most important rule)

Dependencies point **inward**: `adapters → app → ports → domain`. The domain imports nothing
from `app/` or `adapters/`. Translate at the edges; decide in the center.

| Layer | Path | Editability | Rule |
|-------|------|-------------|------|
| **Domain** | `src/domain/` | **READ-ONLY by default** | The wedge / the IP. Pure, no I/O, no provider names. Do **not** edit to make an adapter work. |
| **Ports** | `src/ports/` | **Contract — change rarely** | Interfaces both sides depend on. A change here ripples to every adapter; change deliberately. |
| **Adapters** | `src/adapters/` | **Editable — the extension surface** | New providers and new skill surfaces live here. Adapters translate to/from domain entities; they never embed domain logic. |
| **App** | `src/app/` | **Editable** | Composition root (wiring). Edit to wire new adapters. |
| **Bin** | `src/bin/` | **Editable** | CLI entry that the skills invoke. |
| **Core template** | `core-template/` | **Editable** | The user's portable markdown core (profil, objectifs, journal, memory). |

### Why the domain is read-only

`src/domain/` holds the calculations (TSS fallback, EWMA CTL/ATL/TSB, the subjective score)
and **the crossing rule** (`reading.ts` — subjective gates objective). That judgment is the
product. It is fully unit-tested and provider-agnostic. **Changing it is a deliberate,
gated act**, not a casual edit:

1. It requires **explicit founder authorization** (it's the IP).
2. It is **TDD only**: write the failing test first, then the minimal change.
3. It **stays pure**: no imports from `app/`/`adapters/`, no I/O, no provider names, no
   network. If you reach for a provider name inside the domain, stop — that's an adapter.

Want a new provider, a new surface (Claude / OpenClaw / Garmin / GPT Action), a different
file format? **Add an adapter.** That's free and expected. Don't touch the domain.

### Calibration constants are founder-owned

The score thresholds (45 / 60 / 80), the TSB bands, the per-athlete threshold and FTP, the
`faimNormal`/`soifNormal` baselines — these are **calibrated by the founder against real
data**, not invented by an agent. Treat current values as defaults pending calibration.

---

## Two memory surfaces (don't conflate them)

feezify has two distinct memories in the athlete's portable core:

| Surface | Path | Owner | Role |
|---------|------|-------|------|
| **Daily log** | `journal/YYYY-MM-DD.md` | **The athlete** (user) | Raw input — markers + narrative. Immutable source. The copilot reads it, never rewrites it. |
| **Coach memory** | `memory/` | **The AI coach** (the model) | The copilot's *own* compiled memory of the athlete. It reads it first, then files learnings back. |

This is **Karpathy's LLM Wiki** pattern (*stop re-deriving, start compiling*): the journal
is the immutable `raw/` layer; the memory is the LLM-maintained, interlinked knowledge layer;
`memory/index.md` is the schema + catalog. Three operations:

- **Query** (read-first): the skill reads `memory/` before writing the day's read.
- **Ingest** (update-after): durable learnings are filed into `athlete.md` / `patterns/` /
  `history/` / `log.md`, each with **provenance** (`sources:` → a `journal/<date>.md`).
- **Lint** (periodic): reconcile contradictions, drop stale claims, fix orphans.

Rules: the coach memory is **maintained by the skill (the LLM)**, not by the deterministic
domain — it stays out of `src/domain/` (zero-IO purity holds). Every memory claim traces to a
journal entry; **no source, no claim**. The memory is the v1 form of the "world model / état
courant"; deeper automation (auto-lint, reconciliation against the deterministic recompute)
is beta. `core-template/memory/` ships the starter structure.

---

## Invariants (never break — they're also public-facing)

- **L212-1 (French sport law):** output is an **educational read**, never a prescription
  (no target watts/paces/HR/durations/TSS). Naming is **copilot / assistant — never "coach"
  / "trainer" / "entraîneur"** in any public text. The athlete decides.
- **YMYL:** weight is a **trend, never a diagnosis** (no BMI/body-fat verdicts). No
  prescriptive nutrition.
- **Privacy:** **no PII** in the repo (no real addresses, no ID numbers, no personal
  emails; no precise GPS spots in fixtures). Run the audit before committing (below).
- **Provenance first-class:** every `Metric` carries `{ value, provenance, incompatible }`.
  Prefer recomputing load from raw; if you take an incompatible provider value, flag it.
- **EN-first + `/fr`:** all readable public artifacts (README, `SKILL.md`, `method.md`,
  public comments) in **English**; translations under `/fr`. Code and identifiers English.
- **Zero infra:** no server, no telemetry, no network calls outside an injected fetch.
  Everything runs on the user's machine.
- **License:** Apache-2.0. The moat is the method, the voice, and distribution — not the code.

---

## TDD discipline

- Every domain change: **failing test first**, then minimal implementation, then green.
- Adapters are tested with **injected fakes** (e.g. `StravaMcpDataSource(fetch)`), never a
  live network. Fixtures live in `test/fixtures/` and contain **no PII**.
- Run before every commit:
  ```bash
  npx tsc --noEmit && npx vitest run
  ```

---

## Git — protected window (§22, same rules as corp-ai)

This repo follows the **same protected-hours rule as corp-ai** (SYSTEM.md §22), enforced by
husky:

- `.husky/pre-commit` blocks commits **Mon–Fri 08:00–12:30 & 14:00–20:00 Europe/Paris**.
- `.husky/pre-push` delegates to the shared corp-ai gate (§22 + privacy denylist + PII
  anonymize): `$HOME/corp-ai/tools/scripts/pre-push-gate.sh`.

Always check `TZ=Europe/Paris date` before a commit/push. Safe windows: weekends, ≥20:00,
06:00–07:59, lunch 12:30–13:59. Founder bypass (with risk mention): `git commit --no-verify`.

Privacy audit before committing — generic patterns (no PII inlined here on purpose; the
shared corp-ai gate holds the real denylist of names/places/IDs and enforces it on push):
```bash
# personal emails (allow none) and any leftover legacy contact strings
grep -rinE "[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}" . \
  --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist
```
Expected: no matches. The legacy SaaS PII (founder address, CNIL number, personal name) was
scrubbed at the AI-native baseline and must never return.

---

## Conventions

- Branch: feature work off `ai-native` (not `master`).
- Commits: conventional (`feat(domain): …`, `feat(adapter): …`, `docs: …`, `chore: …`).
- Dates: absolute `YYYY-MM-DD`.
- Keep files focused: one responsibility each; split when a file grows unwieldy.
