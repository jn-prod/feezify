# feezify

**A training copilot, gone AI-native.** A skill + a portable markdown core. Zero infra.

feezify reads your day: your objective form (training load) crossed with how you actually
feel and what your own journal remembers — then tells you, in plain words, whether today
is **green, amber, or red**, and *why*. It does not prescribe workouts. You decide; it
helps you read yourself more clearly.

🇫🇷 Version française : [`/fr/README.md`](fr/README.md) · The method, in the open:
[`method.md`](src/adapters/claude-skill/method.md)

## What this used to be

feezify was a hosted SaaS — a Node/Express/Mongo app with accounts, a database, a server,
a frontend, deploys. Most of it was plumbing. The *actual* value was a small thing buried
inside: a way of **crossing objective training load with subjective readiness**, and a
judgment about when how-you-feel should override what-the-numbers-say.

When AI agents arrived, ~90% of that app became dead weight. The method didn't.

## What it is now

feezify is rebuilt **AI-native**: it installs on *your own* AI as a **skill**, reads a
folder of **markdown** you own, and runs entirely **on your machine** — no server, no
account, no telemetry. The AI is the surface; the skill is the component; your markdown is
the state; the conversation is the interaction. (That migration — and the "AI-native
frontend" idea behind it — is the subject of the companion article.)

The v1 ships **one skill**: the **read of the day**.

## How it works (the design)

Hexagonal — ports & adapters — so the method stays pure and every provider is replaceable:

- **Domain** (`src/domain`) — entities, the load math (TSS → CTL/ATL/TSB as proper
  exponential averages), the readiness score, and **the crossing rule**. No I/O, no
  provider names. This is the wedge, and it's fully unit-tested.
- **Ports** (`src/ports`) — `DataSource` (activities in), `Repository` (your markdown
  core), `LectureDuJour` (the read out).
- **Adapters** (`src/adapters`) — `strava-mcp` (one provider, not special — relative-effort
  is flagged incompatible and load is recomputed from raw), `markdown-repo` (your core),
  and two driving adapters over the *same* engine: `claude-skill` and `openclaw-skill`
  (`SKILL.md` each — they turn the deterministic skeleton into the day's read). Adding a
  surface is near-free: same bin, same domain, different manifest.

The numbers and the light are **deterministic**; the AI reads your **narrative journal**
across days for the patterns a spreadsheet can't see, and writes the read.

## The method, briefly

Load gives **TSB** (form); your journal gives **readiness**. The **subjective gates the
objective** — injury/illness is always red, low readiness is never green, fresh legs never
override a body saying no. Full version: [`method.md`](src/adapters/claude-skill/method.md).
It's open on purpose: the method is the point, not a secret.

## Install / run

```bash
npm install
npm run build
cp -r core-template ~/my-feezify-core      # your portable core (profil, objectifs, journal)
feezify-lecture ~/my-feezify-core 2026-06-29
```

Then point your AI at the skill — it ships as both a **Claude skill**
(`src/adapters/claude-skill/SKILL.md`) and an **OpenClaw skill**
(`src/adapters/openclaw-skill/SKILL.md`), same engine. Fill `profil.md` with your
baselines, drop a daily entry in `journal/`, and ask your AI how you are today.

## Status

This is an early build — **beta, feedback welcome**. Open an issue with what reads true and
what doesn't. The next steps are evaluation harnesses for the skill and a world-model layer
for current state.

## License

[Apache-2.0](LICENSE). The moat is the method, the voice, and distribution — not the code.
