# The method — how feezify reads a day

← [Back to docs index](README.md)

This is the judgment feezify encodes, in plain language. It's **open on purpose**: the
method is the point, not a secret. The numbers and the light are **deterministic** —
computed by a fully unit-tested engine, not guessed by the AI.

> This page mirrors the canonical
> [`src/adapters/claude-skill/method.md`](../src/adapters/claude-skill/method.md), which
> wins in case of conflict. The exact constants are calibrated per athlete and may evolve.

## Two readings, crossed

feezify reads two things and crosses them.

### Objective — your form (TSB)

From your activities it rebuilds a daily training load (**TSS**), preferring power, then
heart-rate, then session-effort (RPE) — always recomputed from raw when possible, so the
series stays consistent. (Strava's own "relative effort" is flagged incompatible and
recomputed.) From that load it tracks:

- **CTL** (fitness) — a slow ~42-day exponential average of load.
- **ATL** (fatigue) — a fast ~7-day exponential average of load.
- **TSB = CTL − ATL** of yesterday (**form**).

**TSB bands:**

| TSB | Meaning |
|---|---|
| above **+15** | *fresh* |
| **+5 to −10** | *optimal* |
| **−10 to −30** | *productive load* |
| below **−30** | *overreaching* |

### Subjective — your readiness

From your daily journal (sleep, fatigue, motivation, mood, stress, appetite, thirst) it
reads a **readiness score**. Appetite and thirst are read as **deviation from your own
normal**, in either direction — not "more is better".

If you wrote **no** journal entry for a day, the score is a **neutral default**, and
feezify says so plainly — it never presents an unmeasured score as measured.

## The crossing rule (the wedge)

The **subjective gates the objective.** This is the most evidence-backed part of the whole
system: when how you feel and what the numbers say disagree, **how you feel wins.**

- **Injury or illness → red.** Always. No number overrides it.
- **Low readiness is never green**, even on fresh legs.
- **High readiness + non-negative form → green.**
- **High readiness + deeply negative form → amber** (assume hidden fatigue) — *unless*
  you're knowingly inside a build block, where that load is the plan.
- **A rest day** reframes a low score as expected, not alarming.

The "why" is always the lowest-scoring markers and what your **own words** say is driving
them.

## Why deterministic + AI, together

- The **engine** computes the numbers and the light. It's pure, testable, and
  reproducible — the same inputs always give the same read. The AI is instructed **not** to
  recompute or override it.
- The **AI** reads your *narrative* journal across days — the patterns a spreadsheet can't
  see — and writes the read in plain, honest language, tracing every claim back to a
  journal day.

That split is deliberate: math you can trust, judgment that stays human-readable.

## The one-line summary

> **Load gives your form. Your journal gives your readiness. How you feel gates the
> numbers. feezify reads; you decide.**

---

Back to → [Daily use](daily-use.md) · [Docs index](README.md)
