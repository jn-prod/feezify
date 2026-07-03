# feezify — premiers pas

Bienvenue. feezify est un **copilote** d'entraînement qui tourne sur ta propre IA. Deux
portes d'entrée — choisis la tienne :

- **[A. Sans terminal](#a-sans-terminal--3-gestes-claude)** — 3 gestes, rien à installer.
  Pour les athlètes : Claude + le connecteur Strava officiel + le zip de la skill.
- **[B. Parcours développeur](#b-parcours-développeur-terminal)** — clone, build, `.env`,
  tes propres tokens. Pour les builders et les utilisateurs OpenClaw.

🇬🇧 English version: [`../onboarding.md`](../onboarding.md)

---

## A. Sans terminal — 3 gestes (Claude)

Fonctionne avec Claude sur le web et, au mieux, **Claude Cowork** (desktop) — Cowork garde
tes données dans un dossier à toi, donc ton journal et la mémoire du copilote persistent.

- [ ] **1. Connecte Strava** *(optionnel mais recommandé ; abonnés Strava)* — dans Claude :
  Customize → **Connectors** → ajouter **Strava** → autoriser (OAuth). Lecture seule,
  révocable à tout moment depuis tes réglages Strava. Aucune clé API à manipuler.
- [ ] **2. Installe la skill** — télécharge **`feezify-skill-<version>.zip`** depuis la
  [dernière release](https://github.com/jn-prod/feezify/releases/latest), puis dans Claude :
  Settings → Capabilities → **Skills** → **Upload skill** (l'exécution de code doit être
  activée).
- [ ] **3. Demande ta lecture** — dis *« comment je vais aujourd'hui ? »*. Au premier run le
  copilote crée ton **cœur** (un dossier de markdown qui t'appartient — profil, journal, sa
  propre mémoire de toi) et te configure en conversation : tes valeurs de base, qui tu es,
  ton consentement Strava, ta première entrée de journal.

C'est tout. Au quotidien : quelques lignes honnêtes dans ton journal, puis demande ta lecture.

> Dans Cowork, donne un dossier à Claude (ex. `Documents/feezify`) pour que ton cœur
> persiste. Dans un simple chat web sans accès fichiers, le copilote te le dira et proposera
> une lecture valable pour la session seulement.

## B. Parcours développeur (terminal)

> **Règle de sécurité (non négociable) :** les tokens d'adaptateurs vivent **uniquement dans
> `.env`** (gitignoré). N'écris jamais un vrai token ailleurs. Voir
> [`AGENTS.md → Secrets`](../AGENTS.md).

- [ ] **Installer & builder** — `pnpm install && pnpm build`
- [ ] **Créer ton cœur portable** — `cp -r core-template ~/my-feezify-core` (tes données, privées)
- [ ] **Remplir `profil.md`** — tes bases physiologiques (FC max, seuil, FTP, faim/soif normales)
- [ ] **Remplir `user.md`** — qui tu es (nom, sport principal, niveau, objectif du moment)
- [ ] **Choisir tes connecteurs dans `config.yml`** — chacun reste off tant que tu n'as pas opté (consentement)
- [ ] **Créer `.env` + tokens** — `cp .env.example .env`, ajouter tes clés Strava (<https://www.strava.com/settings/api>), vérifier `git check-ignore .env`
- [ ] **Première lecture** — `node --env-file=.env dist/lecture.js ~/my-feezify-core <YYYY-MM-DD>` — Strava n'est interrogé que si le token **et** `connectors.strava: true` sont présents ; sinon lecture du cache optionnel `<core>/activities.json` (format : [`activities-cache.md`](../core-template/templates/activities-cache.md))
- [ ] **Brancher la skill à ton IA** — `src/adapters/claude-skill/SKILL.md` (Claude) ou `src/adapters/openclaw-skill/SKILL.md` (OpenClaw)
- [ ] **Première entrée de journal** — copier `templates/journal-day.md` vers `journal/YYYY-MM-DD.md`
- [ ] **Première « lecture du jour »** — demande à ton IA comment tu vas aujourd'hui

## Au quotidien

1. Une entrée de journal (marqueurs + quelques phrases honnêtes).
2. Demande ta lecture : **vert / orange / rouge** et *pourquoi* — jamais de prescription.

## Pour aller plus loin

- **Connecteurs** — activables/désactivables à tout moment dans `config.yml` (consentement).
- **Mémoire du copilote** — il compile sa propre mémoire de toi dans `memory/`, chaque
  affirmation tracée jusqu'à un jour de journal.
- **Soutien** — feezify est gratuit et open source. S'il t'aide, tu peux soutenir le projet
  sur Tipeee → <https://www.tipeee.com/byNicolasJD> (voir [`author.md`](author.md)). Opt-out :
  `support.remind: false` dans `config.yml`.
