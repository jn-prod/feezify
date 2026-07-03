# Privacy & consent

← [Back to docs index](README.md)

feezify is **local-first by design.** Your data is the product's argument, not its
inventory. This page is the honest, complete account of what happens to your data.

## The short version

- Your data lives in **your core folder**, on **your machine** (or a folder you own in
  Cowork). feezify keeps it nowhere else.
- There is **no server, no account, no telemetry.** Nothing phones home.
- A connector (like Strava) stays **off until you explicitly turn it on** — that's
  consent, and it's revocable anytime.
- Tokens (developer path) live **only in `.env`**, which is git-ignored and never
  committed.

## Where your data lives

Everything is in your **core** — a folder of markdown you own (`profil.md`, `user.md`,
`journal/`, `memory/`, `config.yml`…). See [daily use](daily-use.md#your-core-explained).

- **No-terminal path:** in Cowork, point Claude at a folder you keep (e.g.
  `Documents/feezify`) and it persists there. In a plain web chat without file access, the
  core is session-only — the copilot tells you and offers to hand you a zip to keep.
- **Developer path:** wherever you copied it (`~/my-feezify-core`). It's plain markdown you
  can read, edit, back up, or delete with normal tools.

## Consent: connectors are opt-in

A **connector** lets feezify exchange your data with a third party (today: Strava, to read
your training load). The rule, enforced in code:

> A connector stays **OFF** until you explicitly allow it. Default `false`. The copilot
> must **not** use a connector unless it's `true` in your `config.yml`.

```yaml
# config.yml
connectors:
  strava: false      # set to true only when you want feezify to read your Strava data
```

**Strava is only queried when *both* conditions hold:**

1. `connectors.strava: true` in `config.yml` (your consent), **and**
2. a Strava credential is available — the official connector (no-terminal path) *or* a
   token in `.env` (developer path).

If either is missing, feezify doesn't touch Strava. It reads an optional local
`activities.json` cache if present, or works from your journal alone. **No Strava at all is
a fully supported mode.**

## The official Strava connector (no-terminal path)

In the no-terminal path, authorization is handled by **Claude's official Strava
connector** via OAuth:

- **Read-only** access to your activities.
- **No API keys or tokens** for you to handle or store.
- **Revocable anytime** from your Strava settings (Settings → My Apps) — revoking cuts
  feezify off immediately.

## Tokens (developer path)

If you use your own Strava API application, its secrets are **credentials** and get the
strictest handling:

- They live **only in `.env`**, which is **git-ignored**. Verify with
  `git check-ignore .env` (must print `.env`).
- **Never** write a real token into any other file — not a note, not a config, not a
  commit. This is non-negotiable; see [`AGENTS.md → Secrets`](../AGENTS.md).
- Before committing, confirm nothing leaked:

  ```bash
  git grep -nE '(CLIENT_SECRET|ACCESS_TOKEN|REFRESH_TOKEN|_API_KEY)[[:space:]]*[:=][[:space:]]*[A-Za-z0-9._-]{12,}' -- ':!.env.example'
  ```

  Expected: no matches. (A pre-commit hook also scans, but check first.) If a token shows
  up, move it into `.env` and remove it from the file.

## Your two memories

- **`journal/`** — *your* daily log. Raw and immutable; feezify reads it but never
  rewrites it.
- **`memory/`** — the copilot's *own* compiled memory of you. It writes and maintains this,
  and every claim in it is traced back to a specific journal day (provenance rule: no
  source, no claim). Both live in your core, on your machine.

## Revoking / deleting everything

- **Stop a connector:** set it back to `false` in `config.yml` (and revoke from Strava's
  side if you used the official connector).
- **Delete your data:** it's a folder of files — delete the core folder. Nothing else
  exists anywhere.
- **Remove the skill:** uninstall it from your AI (in Claude: Settings → Skills).

## In one sentence

> Your training data stays yours, on your machine; feezify only ever touches a third party
> after you've explicitly said yes, and you can undo that in one line.

---

Back to → [Docs index](README.md) · [FAQ](faq.md)
