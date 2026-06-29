# Initialize feezify (first run)

Run this once to get a working local copilot: install, build, set up your portable core,
and create a `.env` with your adapter tokens.

> **Security rule (non-negotiable):** adapter tokens live **only in `.env`**, which is
> git-ignored. **Never** write a real token into any other file — code, fixtures, configs,
> docs, the markdown core, or the coach memory. See `AGENTS.md → Secrets`.

## Steps

1. **Install & build**
   ```bash
   pnpm install
   pnpm build
   ```

2. **Create your portable core** (your data; keep it private)
   ```bash
   cp -r core-template ~/my-feezify-core
   ```
   Then fill `~/my-feezify-core/profil.md` with your baselines (max HR, threshold, FTP,
   appetite/thirst normals).

3. **Create `.env` and add your adapter tokens**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in:
   - `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET` — from <https://www.strava.com/settings/api>
   - `STRAVA_ACCESS_TOKEN`, `STRAVA_REFRESH_TOKEN`

   Then confirm `.env` is ignored (must print `.env`):
   ```bash
   git check-ignore .env
   ```

4. **Run a read**
   ```bash
   node dist/lecture.js ~/my-feezify-core 2026-06-29
   ```

5. **Point your AI at the skill** — `src/adapters/claude-skill/SKILL.md` (Claude) or
   `src/adapters/openclaw-skill/SKILL.md` (OpenClaw). Then add a daily entry in
   `~/my-feezify-core/journal/` — copy the template
   `~/my-feezify-core/templates/journal-day.md` to `journal/YYYY-MM-DD.md` — and ask your AI
   how you are today.

## Before any commit

Verify no token leaked into a tracked file (the pre-commit hook also scans, but check first):

```bash
git grep -nE '(CLIENT_SECRET|ACCESS_TOKEN|REFRESH_TOKEN|_API_KEY)[[:space:]]*[:=][[:space:]]*[A-Za-z0-9._-]{12,}' -- ':!.env.example'
```

Expected: no matches. If a token shows up, move it into `.env` and remove it from the file.
