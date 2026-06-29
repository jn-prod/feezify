# Coach memory — index

This `memory/` is the **AI coach's own memory** — maintained by the copilot, for the copilot.
It is **not** your daily log. Two distinct surfaces:

- **`journal/`** = *your* daily log (you write it: markers + narrative). The **raw source**,
  immutable. The copilot reads it but does not rewrite it.
- **`memory/`** = the *coach's* compiled understanding of you, built over time. The copilot
  writes and maintains it; you rarely touch it directly.

Pattern: **Karpathy's LLM Wiki** — *stop re-deriving, start compiling.* Instead of
re-reading months of journal every session (RAG-style: retrieve and forget), the copilot
reads its own compiled memory first, then files new durable learnings back.

## The three operations

- **Query** (read-first): before writing the day's read, the copilot reads this index and
  the relevant pages — the accumulated model of you.
- **Ingest** (update-after): durable new learnings from today are filed into the right page
  (athlete model, a pattern, history), with **provenance** back to the journal day.
- **Lint** (periodic): the copilot audits for contradictions, stale claims, orphaned pages.

## Provenance rule

Every page carries YAML front-matter listing its sources, anchored to journal days:

```yaml
---
updated: 2026-06-29
sources:
  - journal/2026-06-29.md
  - journal/2026-06-22.md
---
```

Every claim must trace back to a journal entry (or a reading). No source, no claim.

## Pages

| Page | What it holds |
|------|---------------|
| [athlete.md](athlete.md) | The model of you: learned thresholds, sports the body responds to, baselines, tendencies. |
| [log.md](log.md) | Chronological coaching observations (newest first). |
| `patterns/` | One page per recurring pattern (e.g. poor sleep before key sessions, a recurring niggle). |
| `history/` | Injuries/illnesses, training-block timeline, objective outcomes. |

_(Keep this index current. Beyond ~100–150 pages, split into sub-indexes per folder.)_
