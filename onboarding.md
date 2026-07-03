# feezify — onboarding

Welcome. feezify is a training **copilot** that runs on your own AI. Two ways in — pick
yours:

- **[A. No terminal](#a-no-terminal--3-steps-claude)** — 3 steps, nothing to install.
  For athletes: Claude + the official Strava connector + the skill zip.
- **[B. Developer path](#b-developer-path-terminal)** — clone, build, `.env`, your own
  tokens. For builders and OpenClaw users.

🇫🇷 Version française : [`fr/onboarding.md`](fr/onboarding.md)

---

## A. No terminal — 3 steps (Claude)

Works with Claude on the web and, best, **Claude Cowork** (desktop) — Cowork can keep your
data in a folder you own, so your journal and the copilot's memory persist.

- [ ] **1. Connect Strava** *(optional but recommended; Strava subscribers)* — in Claude:
  Customize → **Connectors** → add **Strava** → authorize (OAuth). Read-only, revocable
  anytime from your Strava settings. No API keys, no tokens to handle.
- [ ] **2. Install the skill** — download **`feezify-skill-<version>.zip`** from the
  [latest release](https://github.com/jn-prod/feezify/releases/latest), then in Claude:
  Settings → Capabilities → **Skills** → **Upload skill** (code execution must be enabled).
- [ ] **3. Ask for your read** — say *"how am I today?"*. On first run the copilot creates
  your **core** (a folder of markdown you own — profile, journal, its own memory of you) and
  sets you up conversationally: your baselines, who you are, your consent for Strava, your
  first journal entry.

That's it. Day to day: write a few honest lines in your journal, ask for the read.

> In Cowork, give Claude a folder (e.g. `Documents/feezify`) so your core persists. In a
> plain web chat without file access the copilot will say so and offer a session-only read.

## B. Developer path (terminal)

> **Security rule (non-negotiable):** adapter tokens live **only in `.env`** (git-ignored).
> Never write a real token into any other file. See [`AGENTS.md → Secrets`](AGENTS.md).

> **For the AI:** drive this onboarding with the user and **tick each box** (`- [x]`) as
> you verify the step is done — like a SaaS onboarding. The checklist is the progress
> tracker; keep it current. Onboarding is complete when every box is checked.

- [ ] **Install & build** — `pnpm install && pnpm build`
- [ ] **Create your portable core** — `cp -r core-template ~/my-feezify-core` (your data, kept private)
- [ ] **Fill `profil.md`** — your physiological baselines (max HR, threshold, FTP, appetite/thirst normals)
- [ ] **Fill `user.md`** — who you are (name, main sport, level, profile, current goal); context, never a diagnosis
- [ ] **Choose connectors in `config.yml`** — each stays off until you opt in (consent); set `strava: true` only if you want it
- [ ] **Create `.env` + tokens** — `cp .env.example .env`, add your Strava keys (<https://www.strava.com/settings/api>), then confirm `git check-ignore .env` prints `.env`
- [ ] **First read** — `node --env-file=.env dist/lecture.js ~/my-feezify-core <YYYY-MM-DD>` — Strava is only queried when **both** the token is set **and** `connectors.strava: true` in `config.yml` (consent); otherwise it reads an optional `<core>/activities.json` cache (shape: [`core-template/templates/activities-cache.md`](core-template/templates/activities-cache.md))
- [ ] **Connect the skill to your AI** — point it at `src/adapters/claude-skill/SKILL.md` (Claude) or `src/adapters/openclaw-skill/SKILL.md` (OpenClaw)
- [ ] **First journal entry** — copy `~/my-feezify-core/templates/journal-day.md` to `journal/YYYY-MM-DD.md` and fill it in
- [ ] **First "read of the day"** — ask your AI how you are today

When every box above is checked, you're live. 🎉

## Day to day

1. Add a journal entry — copy the template to `journal/YYYY-MM-DD.md` and fill it in (markers + a few honest sentences).
2. Ask your AI how you are today. It reads its memory (`memory/`) and your journal, runs the deterministic read, and tells you **green / amber / red** and *why* — it never prescribes.

## Going further

- **Connectors** — enable/disable anytime in `config.yml` (consent). Tokens (path B) stay in `.env`.
- **Coach memory** — over time the copilot compiles its own memory of you in `memory/`, each claim traced to a journal day.
- **Support** — feezify is free and open source, built in public. If it helps you, support the work on Tipeee → <https://www.tipeee.com/byNicolasJD> (see [`author.md`](author.md)). The copilot reminds you occasionally; opt out with `support.remind: false` in `config.yml`.

## Before any commit (path B)

Verify no token leaked into a tracked file (the pre-commit hook also scans, but check first):

```bash
git grep -nE '(CLIENT_SECRET|ACCESS_TOKEN|REFRESH_TOKEN|_API_KEY)[[:space:]]*[:=][[:space:]]*[A-Za-z0-9._-]{12,}' -- ':!.env.example'
```

Expected: no matches. If a token shows up, move it into `.env` and remove it from the file.
