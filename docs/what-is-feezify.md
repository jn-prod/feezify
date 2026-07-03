# What is feezify?

← [Back to docs index](README.md)

feezify is a training **copilot** — not a coach. It helps you *read* your own day. Every
morning (or whenever you ask), it looks at two things and crosses them:

- **How much you've trained** — your objective *form*, rebuilt from your activities.
- **How you actually feel** — from a few honest lines you write in a journal.

Then it tells you, in plain language, whether today is **green, amber, or red**, and
*why*. That's it. **You decide** what to do with it.

## What it does

- Reads your training load and turns it into **form** (a number called TSB — see
  [the method](the-method.md)).
- Reads your **journal** (sleep, fatigue, motivation, mood, stress, appetite, thirst, and
  a few sentences) into a **readiness** score.
- **Crosses** the two with a clear rule — *how you feel gates what the numbers say* — and
  gives you a light plus the reason behind it.
- Keeps its **own memory of you** over time, so it reads patterns a single day can't show
  — every claim traced back to a journal entry.

## What it does *not* do

- It **never prescribes** a workout, pace, wattage, or duration.
- It **never calls itself a coach or trainer**, and never gives medical advice.
- It doesn't decide for you. It illuminates; you choose.
- It doesn't run in the cloud, keep an account, or send telemetry. See
  [privacy & consent](privacy-and-consent.md).

This isn't a limitation to route around — it's the design. feezify makes you a better
reader of your own body; it doesn't outsource the judgment.

## Where it came from

feezify used to be a hosted SaaS — a Node/Express/Mongo app with accounts, a database, a
server, a frontend, deploys. Most of that was plumbing. The *actual* value was one small
thing buried inside: a way of **crossing objective training load with subjective
readiness**, and a judgment about when how-you-feel should override what-the-numbers-say.

When AI agents arrived, roughly 90% of that app became dead weight. The method didn't. So
feezify was rebuilt **AI-native**.

## The AI-native remap

The old web app and the new agent map tier for tier. The browser was the last interface
shift; the LLM/chatbot is the next one. You don't plug the old app into it — you rebuild
the engine one layer down, as an **agent**, and the database becomes a **memory**:

| Classic web app | The tier | AI-native feezify |
|---|---|---|
| Browser / frontend | the **interface** | **the LLM / the chatbot** (Claude, OpenClaw…) |
| Server / backend | the **application engine** | **the agent** — a pure method core + adapters to third-party apps |
| Database | the **persistence** | **a second-brain memory** — your journal + the copilot's own compiled memory of you |

You don't open feezify's app. You install feezify's *agent* on your own AI.

## Who it's for

- **Athletes** who train seriously enough to want to read their form honestly — and who'd
  rather own their data than feed another platform.
- **Builders / OpenClaw users** who want a clean, hexagonal, fully-tested example of an
  AI-native rewrite they can extend.

Ready? → [Install feezify](install.md)
