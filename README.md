# feezify

> 🚧 **feezify 2.0 — beta coming soon.** The AI-native rewrite of my old training SaaS.
> Want it in early access? **[Join the waitlist →](https://www.nicolasjouanno.com/entrainement-vtt.html)**

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
- **Adapters** (`src/adapters`) — `strava-mcp` and `strava-rest` (two ways into Strava — via
  an MCP host or the public REST API; either way, relative-effort is flagged incompatible and
  load is recomputed from raw, mapping shared in `strava-shared`), `markdown-repo` (your core),
  and two driving adapters over the *same* engine: `claude-skill` and `openclaw-skill`
  (`SKILL.md` each — they turn the deterministic skeleton into the day's read). Adding a
  provider or a surface is near-free: same bin, same domain, different adapter.

The numbers and the light are **deterministic**; the AI reads your **narrative journal**
across days for the patterns a spreadsheet can't see, and writes the read.

**Two memories.** Your `journal/` is *your* daily log (you write it). The copilot also keeps
its *own* memory of you in `memory/` — a compiled, interlinked model it reads first and updates
after each session (Karpathy's LLM Wiki pattern: *stop re-deriving, start compiling*). Over
time it stops re-reading months of journal and reads what it already learned about you, every
claim traced back to a journal day.

## The method, briefly

Load gives **TSB** (form); your journal gives **readiness**. The **subjective gates the
objective** — injury/illness is always red, low readiness is never green, fresh legs never
override a body saying no. Full version: [`method.md`](src/adapters/claude-skill/method.md).
It's open on purpose: the method is the point, not a secret.

## Install / run

Full first run — install, build, your private core, and the `.env` with adapter tokens —
is in **[`onboarding.md`](onboarding.md)**. In short:

```bash
pnpm install && pnpm build
cp -r core-template ~/my-feezify-core   # your private core (profil, objectifs, journal, memory)
cp .env.example .env                    # then add your Strava tokens (see onboarding.md)
node dist/lecture.js ~/my-feezify-core 2026-06-29
```

Then point your AI at the skill — it ships as both a **Claude skill**
(`src/adapters/claude-skill/SKILL.md`) and an **OpenClaw skill**
(`src/adapters/openclaw-skill/SKILL.md`), same engine.

> **Adapter tokens go only in `.env`** (git-ignored) — never in any other file. See
> `onboarding.md` and `AGENTS.md → Secrets`.

## Using it day to day

1. Tell it who you are: fill **[`core-template/user.md`](core-template/user.md)** in your
   core (name, main sport, level, profile, what you're chasing) — read as context, never a
   diagnosis.
2. Choose your connectors: in **[`core-template/config.yml`](core-template/config.yml)**, a
   connector (e.g. `strava`) stays **off** until you set it `true` — the copilot only
   exchanges your data with a third party once you've **explicitly opted in** (consent).
3. Add a journal entry: copy `templates/journal-day.md` to `journal/YYYY-MM-DD.md` and fill
   it in — markers (sleep, fatigue, motivation, mood, stress, appetite, thirst) plus a few
   honest sentences (how the legs felt, any niggle, what's going on in life).
4. Ask your AI how you are today. It reads its memory (`memory/`) and your journal, runs the
   deterministic read, and tells you **green / amber / red** and *why* — it never prescribes.

## Author & support

Built by Nicolas Jouanno — see **[`author.md`](author.md)** (who I am, my training articles,
and how to support the project on Tipeee).

## Status

This is an early build — **beta, feedback welcome**. Open an issue with what reads true and
what doesn't. The next steps are evaluation harnesses for the skill and a world-model layer
for current state.

## License

[Apache-2.0](LICENSE). The moat is the method, the voice, and distribution — not the code.
