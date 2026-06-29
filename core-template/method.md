# The method — how feezify reads a day

This is the judgment feezify encodes, in plain language. It is open on purpose: the
method is the point, not a secret. (The exact constants are calibrated per athlete and
may evolve.)

## Two readings, crossed

**Objective — your form (TSB).** From your activities we rebuild a daily training load
(TSS), preferring power, then heart-rate, then session-effort (RPE) — always recomputed
from raw when we can, so the series is consistent. From that we track CTL (fitness, a slow
~42-day average), ATL (fatigue, a fast ~7-day average), and **TSB = CTL − ATL of
yesterday** (form). Bands: above +15 *fresh*; +5 to −10 *optimal*; −10 to −30 *productive
load*; below −30 *overreaching*.

**Subjective — your readiness.** From your daily journal (sleep, fatigue, motivation,
mood, stress, appetite, thirst) we read a readiness score. Appetite and thirst are read as
**deviation from your own normal**, in either direction — not "more is better".

## The crossing rule

The **subjective gates the objective**: when how you feel and what the numbers say
disagree, how you feel wins.

- **Injury or illness → red.** Always.
- **Low readiness is never green**, even on fresh legs.
- **High readiness + non-negative form → green.**
- **High readiness + deeply negative form → amber** — unless you're knowingly in a build
  block, where that load is the plan.
- **A rest day** reframes a low score as expected, not alarming.

feezify reads; **you decide.**

## How to write a journal day

Create `journal/YYYY-MM-DD.md`. Front-matter holds the structured markers; the body is
your own words — the part a spreadsheet can't read and the copilot reads most.

```markdown
---
intent: training        # training | competition | rest
blessure: false         # any injury? true/false
maladie: false          # any illness? true/false
hrv: 65                 # optional
poulsRepos: 48          # optional resting HR
poids: 72.5             # optional weight (trend only, never a verdict)
markers:                # each 1–5, 5 = best (faim/soif: your normal, deviation matters)
  sommeil: 4
  recuperation: 4       # how recovered the body feels
  lassitude: 4          # motivation
  humeur: 4             # mood
  stress: 4             # 5 = relaxed
  faim: 3               # appetite vs your normal
  soif: 3               # thirst vs your normal
---

A few honest sentences: how you slept, how the legs felt, any niggle, what's going
on in life. This is the memory the copilot reads across days.
```
