# FAQ & troubleshooting

← [Back to docs index](README.md)

## General

**Do I need to be a developer?**
No. The [no-terminal path](install.md#a--no-terminal-3-steps) is three steps: connect
Strava, upload the skill zip in Claude, ask "how am I today?". No code, no keys.

**Do I need Strava?**
No. Strava gives feezify the objective half (your training load). Without it, feezify
still works from your journal alone — you just won't get a TSB. You can add Strava later
anytime.

**Is it free?**
Yes — free and open source ([Apache-2.0](../LICENSE)), built in public. If it helps you,
you can support the work on Tipeee → <https://www.tipeee.com/byNicolasJD>.

**Will it tell me what workout to do?**
No, by design. feezify is a *copilot*, not a coach: it reads your day (green/amber/red and
why) and **you decide**. It never prescribes workouts, paces, watts, or durations, and
never gives medical advice. See [what is feezify?](what-is-feezify.md).

**Does it send my data anywhere?**
No. It's local-first — no server, no account, no telemetry. It only touches a third party
(Strava) after you explicitly consent, and that's revocable. See
[privacy & consent](privacy-and-consent.md).

## No-terminal path (Claude)

**The skill won't run / nothing happens when I ask.**
Make sure **code execution is enabled** for the skill (Settings → Capabilities → Skills).
The skill runs a tiny bundled Node engine to compute your numbers.

**Where do I get the skill zip?**
From the [latest release](https://github.com/jn-prod/feezify/releases/latest) —
`feezify-skill-<version>.zip`. Upload it in Claude: Settings → Capabilities → Skills →
Upload skill.

**My journal/memory disappears between chats.**
A plain web chat has no persistent files. Use **Claude Cowork** and give it a folder you
own (e.g. `Documents/feezify`) so your core persists. The copilot will warn you when it's
in a session-only context and can hand you a zip to keep.

**The Strava connector isn't available to me.**
The official connector is currently limited to **Strava subscribers**. If you can't use
it, either skip Strava (journal-only mode works) or use the
[developer path](install.md#b--developer-path) with your own API tokens.

## Developer path

**`git check-ignore .env` prints nothing.**
Then `.env` is **not** ignored — stop and fix your `.gitignore` before adding any real
token. It must print `.env`. Never commit a token.

**Strava isn't being read even though I set a token.**
Strava is queried only when **both** the token is in `.env` **and**
`connectors.strava: true` in your `config.yml`. Check the consent flag — it's `false` by
default. See [privacy & consent](privacy-and-consent.md#consent-connectors-are-opt-in).

**The read shows a form number but the score looks off / neutral.**
If you wrote no journal entry for that date, the readiness score is a **neutral default**
(feezify says so plainly). Add a `journal/YYYY-MM-DD.md` entry for a real read.

**How do I run a read manually?**

```bash
node --env-file=.env dist/lecture.js ~/my-feezify-core 2026-06-29
```

(Omit `--env-file=.env` if you have no `.env` yet.) It prints JSON: `light`, `tsb` +
`tsbProvenance`, `score` + `scoreProvenance`, `reason`, `vigilance`, and
`recentNarrative`.

**How do I rebuild the distributable skill zip?**

```bash
pnpm package:skill
```

Output: `packaging/feezify-skill-<version>.zip` (git-ignored build artifact).

**Tests / typecheck?**

```bash
pnpm test        # unit tests (the domain math is fully covered)
pnpm typecheck   # tsc --noEmit
```

## Understanding the read

**What do green / amber / red mean?**
Green = go; amber = caution (likely hidden fatigue); red = back off (always red for injury
or illness). Full rule in [the method](the-method.md#the-crossing-rule-the-wedge).

**What's TSB?**
Your *form* — fitness minus fatigue (`CTL − ATL`). Bands and details in
[the method](the-method.md#objective--your-form-tsb).

**Why did feeling override the numbers?**
Because that's the core rule: **the subjective gates the objective.** Low readiness is
never green; injury/illness is always red — no number overrides how you actually feel.

## Still stuck?

Open an issue on the repo with what you expected and what you saw — **feedback is welcome**
(this is an early beta). See [`author.md`](../author.md) for who's behind it.

---

Back to → [Docs index](README.md)
