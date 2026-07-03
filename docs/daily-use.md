# Using feezify day to day

← [Back to docs index](README.md)

Once you're [installed](install.md), the daily loop is tiny:

1. Write a few honest lines in your **journal**.
2. Ask your AI: **"how am I today?"**
3. Read the answer — **green / amber / red**, and *why*.

Everything else below is detail you can come back to.

## Your core, explained

Your **core** is a folder of markdown that *you own*. feezify never keeps your data
anywhere else. The no-terminal path creates it for you on first run; the developer path
copies it from `core-template/`. Inside:

| File / folder | What it is | Who writes it |
|---|---|---|
| `profil.md` | Physiological baselines: max HR, threshold, FTP, your normal appetite/thirst | You (once, updated rarely) |
| `user.md` | Who you are: name, main sport, level, current goal — context, never a diagnosis | You |
| `objectifs.md` | What you're chasing right now (race, block, return from injury) | You |
| `config.yml` | Settings & **consent**: which connectors are on, support reminders | You |
| `journal/` | **Your daily log** — one `YYYY-MM-DD.md` per day. Raw, immutable | **You** |
| `memory/` | The **copilot's own memory of you** — compiled, interlinked | **The copilot** |
| `templates/` | Blank templates (journal day, activities cache) | — |
| `activities.json` | Optional cache of your Strava activities | The copilot / engine |

**Two memories, kept straight:** `journal/` is *yours* — you write it, feezify only reads
it. `memory/` is the *copilot's* — it writes and maintains it, reading it first each time
so it stops re-deriving you from scratch. Every claim in `memory/` traces back to a journal
day (no source, no claim).

## Writing a journal entry

Copy `templates/journal-day.md` to `journal/YYYY-MM-DD.md` and fill it in. (In the
no-terminal path, just tell the copilot and it'll do this with you.)

An entry has two parts:

- **Markers** — sleep, fatigue, motivation, mood, stress, appetite, thirst. Appetite and
  thirst are read as **deviation from your own normal**, in either direction — not "more
  is better".
- **A few honest sentences** — how the legs felt, any niggle or pain, what's going on in
  life (work stress, bad night, travel). This narrative is the point: it's what a
  spreadsheet can't read.

You don't have to journal every day, but the read is only as good as what you give it. A
day with **no** journal entry gets a *neutral default* readiness score — and feezify will
say so plainly rather than pretend it measured you.

## Asking for the read

Just ask your AI, in your own words:

> *"How am I today?"* · *"Should I train?"* · *"Read my form."*

Behind the scenes the copilot:

1. Reads its **memory** of you first.
2. Pulls your **activities** (if you've consented to Strava) and rebuilds your load.
3. Runs the **deterministic engine** — the numbers and the light are computed, not
   guessed, and the AI does **not** override them.
4. Reads today's **journal + your goals**, crosses it with what it already knows, and
   writes the read.

## Reading the answer

A read is one short, educational message:

- **The light** — **green** (go), **amber** (caution / hidden fatigue likely), or **red**
  (back off — always red for injury or illness).
- **Form** — your `TSB` value and what its band means (see [the method](the-method.md)).
- **Readiness** — a `score/100` and the main driver(s) behind it.
- **The why** — how the objective and subjective line up. Remember: **how you feel gates
  what the numbers say.** Fresh legs never override a body saying no.
- **A pattern** — only if your history genuinely shows one.
- **One watch-point** — a single thing to self-assess against *your own* plan.

It ends there. **feezify reads; you decide.** No workout is prescribed.

## Over time

The more you journal, the better the copilot reads you: it compiles durable learnings into
`memory/` and starts recognizing your patterns (how you respond to a build block, what a
bad-sleep week does to you) instead of re-reading months of entries every time.

## Connectors & support

- **Connectors** — enable or disable anytime in `config.yml` (that's your consent). See
  [privacy & consent](privacy-and-consent.md).
- **Support** — feezify is free and open source, built in public. If it helps you, you can
  support the work on Tipeee → <https://www.tipeee.com/byNicolasJD> (see
  [`author.md`](../author.md)). The copilot reminds you occasionally; opt out with
  `support.remind: false` in `config.yml`.

---

Want to understand the numbers? → [The method](the-method.md)
