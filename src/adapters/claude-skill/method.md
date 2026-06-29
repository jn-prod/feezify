# The method — how feezify reads a day

This is the judgment feezify encodes, in plain language. It is open on purpose: the
method is the point, not a secret. (The exact constants are calibrated per athlete and
may evolve.)

## Two readings, crossed

**Objective — your form (TSB).** From your activities we rebuild a daily training load
(TSS), preferring power, then heart-rate, then session-effort (RPE) — always recomputed
from raw when we can, so the series is consistent. From that we track:

- **CTL** (fitness) — a slow ~42-day exponential average of load.
- **ATL** (fatigue) — a fast ~7-day exponential average.
- **TSB = CTL − ATL of yesterday** (form). Bands: above +15 *fresh*; +5 to −10
  *optimal*; −10 to −30 *productive load*; below −30 *overreaching*.

**Subjective — your readiness.** From your daily journal (sleep, fatigue, motivation,
mood, stress, appetite, thirst) we read a readiness score. Appetite and thirst are read
as **deviation from your own normal**, in either direction — not "more is better".

## The crossing rule (the wedge)

The **subjective gates the objective**. This is the most evidence-backed part: when how
you feel and what the numbers say disagree, how you feel wins.

- **Injury or illness → red.** Always. No number overrides it.
- **Low readiness is never green**, even on fresh legs.
- **High readiness + non-negative form → green.**
- **High readiness + deeply negative form → amber** (assume hidden fatigue) — *unless*
  you're knowingly inside a build block, where that load is the plan.
- **A rest day** reframes a low score as expected, not alarming.

The "why" is always the lowest-scoring markers and what your own words say is driving
them. feezify reads; **you decide.**
