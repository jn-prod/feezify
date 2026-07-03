# feezify — documentation

**A training copilot, gone AI-native.** feezify reads your day — your objective form
(training load) crossed with how you actually feel — and tells you, in plain words,
whether today is **green, amber, or red**, and *why*. It does not prescribe workouts.
You decide; it helps you read yourself more clearly.

It installs on *your own* AI as a **skill**, reads a folder of **markdown you own**, and
runs entirely **on your machine** — no server, no account, no telemetry.

🇫🇷 Version française : [`fr/README.md`](fr/README.md)

---

## Start here

Pick the door that fits you — you don't need to read everything.

| If you… | Read |
|---|---|
| just want to know what this is | [What is feezify?](what-is-feezify.md) |
| **don't** want to touch a terminal | [Install — no terminal (3 steps)](install.md#a--no-terminal-3-steps) |
| are a developer / OpenClaw user | [Install — developer path](install.md#b--developer-path) |
| are set up and want to use it | [Daily use](daily-use.md) |
| want to understand how it reads you | [The method](the-method.md) |
| care about your data | [Privacy & consent](privacy-and-consent.md) |
| are stuck or have a question | [FAQ & troubleshooting](faq.md) |

## The whole thing in one minute

1. **Connect Strava** (optional) so feezify can see your training load — via Claude's
   official Strava connector (no keys), or your own tokens on the developer path.
2. **Install the skill** on your AI (upload a zip in Claude, or point a dev setup at the
   `SKILL.md`).
3. **Keep a short journal** — a few honest lines a day (sleep, fatigue, mood, a niggle).
4. **Ask "how am I today?"** — feezify runs a deterministic read and answers
   **green / amber / red** and *why*. It never prescribes.

Everything below just expands those four steps.

## The documents

- **[What is feezify?](what-is-feezify.md)** — the idea, what it does and does *not* do,
  and how the old SaaS became an AI-native agent.
- **[Installation](install.md)** — both ways in: the no-terminal 3-step path for athletes,
  and the developer path (clone, build, tokens).
- **[Daily use](daily-use.md)** — your core folder explained, how to journal, how to ask
  for the read, and how to read the answer.
- **[The method](the-method.md)** — how the read is computed: training load (TSB),
  readiness, and the crossing rule. Open on purpose.
- **[Privacy & consent](privacy-and-consent.md)** — local-first, consent-gated connectors,
  where tokens live, and how to revoke everything.
- **[FAQ & troubleshooting](faq.md)** — common questions and fixes for both paths.

## Canonical sources in the repo

These docs are the reader's manual. The source of truth for each subject lives with the
code and wins in case of conflict:

- The method — [`src/adapters/claude-skill/method.md`](../src/adapters/claude-skill/method.md)
- The skills (what the AI actually does) — `src/adapters/*/SKILL.md`
- The onboarding checklists — [`onboarding.md`](../onboarding.md) · [`fr/onboarding.md`](../fr/onboarding.md)
- Agent/security rules — [`AGENTS.md`](../AGENTS.md)

## Status & license

Early build — **beta, feedback welcome**. Open an issue with what reads true and what
doesn't. Licensed [Apache-2.0](../LICENSE). Built by Nicolas Jouanno — see
[`author.md`](../author.md).
