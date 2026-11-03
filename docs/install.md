# Installing feezify

← [Back to docs index](README.md)

Two ways in were planned. **Only the developer path works today.** I stopped developing
feezify in September 2026.

- **[A — No terminal (3 steps)](#a--no-terminal-3-steps)** — not available: the skill zip
  was never published. Kept as a record of the intended path.
- **[B — Developer path](#b--developer-path)** — clone the repo, build it, use your own
  tokens. For builders and OpenClaw users. **Start here.**

---

## A — No terminal (3 steps)

Works with **Claude** on the web and, best, **Claude Cowork** (desktop). Cowork can keep
your data in a folder you own, so your journal and the copilot's memory persist between
conversations.

### Step 1 — Connect Strava *(optional but recommended)*

> Requires a Strava account. The official connector is currently available to **Strava
> subscribers**. No Strava is fine — feezify still works from your journal alone (you just
> won't get the objective training-load half).

In Claude: **Customize → Connectors → add Strava → authorize (OAuth)**.

- It's **read-only** and **revocable anytime** from your Strava settings.
- No API keys, no tokens, nothing to copy-paste. Claude handles the authorization.

### Step 2 — Install the skill

1. Get **`feezify-skill-<version>.zip`** (never published: this step can't be done today).
2. In Claude: **Settings → Capabilities → Skills → Upload skill**.
3. Make sure **code execution is enabled** (the skill runs a tiny bundled Node engine to
   compute your numbers deterministically).

The zip is **self-contained** — the engine, the core template, and the open method all
ship inside it. Nothing else to install.

### Step 3 — Ask for your read

Say: **"how am I today?"**

On the **first run**, the copilot creates your **core** (a folder of markdown you own —
profile, journal, its own memory of you) and sets you up conversationally: your baselines,
who you are, your consent for Strava, your first journal entry. It walks you through it one
question at a time, like a friendly onboarding.

**That's it.** Day to day: write a few honest lines in your journal, then ask for the read.

> **In Cowork**, give Claude a folder (e.g. `Documents/feezify`) so your core persists. In
> a plain web chat without file access, the copilot will say so and offer a session-only
> read.

---

## B — Developer path

> **Security rule (non-negotiable):** adapter tokens live **only in `.env`**
> (git-ignored). Never write a real token into any other file. See
> [`AGENTS.md → Secrets`](../AGENTS.md) and [privacy & consent](privacy-and-consent.md).

### Prerequisites

- **Node.js** (recent LTS) and **pnpm**.
- A **Strava API application** if you want automatic training load —
  <https://www.strava.com/settings/api> (gives you a client id, secret, and tokens).

### Steps

```bash
# 1. Install & build
pnpm install && pnpm build

# 2. Create your portable core (your data, kept private)
cp -r core-template ~/my-feezify-core

# 3. Set up tokens (optional — only if you want Strava)
cp .env.example .env          # then add your Strava keys
git check-ignore .env         # must print ".env" — proves it's git-ignored

# 4. First read
node --env-file=.env dist/lecture.js ~/my-feezify-core 2026-06-29
```

Then fill your core:

- **`profil.md`** — physiological baselines (max HR, threshold, FTP if you have a power
  meter, your normal appetite/thirst).
- **`user.md`** — who you are (name, main sport, level, what you're chasing). Context,
  never a diagnosis.
- **`config.yml`** — set `connectors.strava: true` **only if** you want feezify to read
  your Strava data (consent — off by default).

> **When is Strava actually queried?** Only when **both** the token is set in `.env`
> **and** `connectors.strava: true` in `config.yml`. Otherwise the engine reads an
> optional `<core>/activities.json` cache (shape:
> [`core-template/templates/activities-cache.md`](../core-template/templates/activities-cache.md)),
> or works from the journal alone.

### Connect the skill to your AI

Point your AI at the right `SKILL.md`:

- **Claude** → [`src/adapters/claude-skill/SKILL.md`](../src/adapters/claude-skill/SKILL.md)
- **OpenClaw** → [`src/adapters/openclaw-skill/SKILL.md`](../src/adapters/openclaw-skill/SKILL.md)

Same engine, different envelope.

### Full checklist

The step-by-step, tick-as-you-go version lives in [`onboarding.md`](../onboarding.md)
(🇫🇷 [`fr/onboarding.md`](../fr/onboarding.md)). Onboarding is done when every box is
checked.

---

Next → [Daily use](daily-use.md)
