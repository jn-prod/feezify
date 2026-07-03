# feezify

> 🚧 **feezify 2.0 — beta bientôt.** La réécriture IA-native de mon ancien SaaS d'entraînement.
> Tu le veux en avant-première ? **[Rejoins la liste d'attente →](https://www.nicolasjouanno.com/feezify.html)**

**Un copilote d'entraînement, passé en IA-native.** Une skill + un cœur markdown portable.
Zéro infra.

feezify lit ta journée : ta forme objective (charge d'entraînement) croisée avec ton
ressenti réel et ce que ton propre journal a en mémoire — puis il te dit, en clair, si la
journée est **verte, orange ou rouge**, et *pourquoi*. Il ne prescrit pas de séances. C'est
toi qui décides ; lui t'aide à te lire plus clairement.

🇬🇧 English version: [`/README.md`](../README.md) · La méthode, à découvert :
[`/fr/method.md`](method.md)

## Ce que c'était avant

feezify était un SaaS hébergé — une app Node/Express/Mongo avec comptes, base de données,
serveur, frontend, déploiements. L'essentiel n'était que de la tuyauterie. La *vraie* valeur
était une petite chose enfouie dedans : une manière de **croiser la charge objective avec la
disponibilité subjective**, et un jugement sur le moment où le ressenti doit l'emporter sur
les chiffres.

Quand les agents IA sont arrivés, ~90 % de cette app est devenue du poids mort. Pas la
méthode.

## Ce que c'est maintenant

feezify est reconstruit **IA-native** : il s'installe sur *ta propre* IA sous forme de
**skill**, lit un dossier de **markdown** qui t'appartient, et tourne entièrement **sur ta
machine** — pas de serveur, pas de compte, pas de télémétrie.

Le design est le remap IA-native de l'app web classique, étage par étage. Le navigateur a
été la dernière rupture d'interface — une fois imposé, on a rebâti tous les moteurs
applicatifs pour lui. Le LLM/chatbot est la suivante. Mais on ne rebranche pas l'ancienne
app dessus : on rebâtit le moteur un étage plus bas, en **agent**, et la base de données
devient une **mémoire** :

| App web classique | L'étage | App IA-native |
|---|---|---|
| Navigateur / frontend | l'**interface** | **le LLM / le chatbot** |
| Serveur / backend | le **moteur applicatif** | **l'agent** — cœur hexagonal (la méthode) + adaptateurs vers les applications tierces |
| Base de données | la **persistance** | **une mémoire second-cerveau** — ton log + un wiki d'agent qui le compresse |

Tu n'ouvres pas mon app ; tu installes mon agent sur ta propre IA. (Cette migration fait
l'objet de l'article compagnon.)

La v1 livre **une seule skill** : la **lecture du jour**.

## Comment ça marche (le design)

Hexagonal — ports & adaptateurs — pour que la méthode reste pure et que chaque provider soit
remplaçable :

- **Domaine** (`src/domain`) — entités, le calcul de charge (TSS → CTL/ATL/TSB en vraies
  moyennes exponentielles), le score de disponibilité, et **la règle de croisement**. Aucune
  I/O, aucun nom de provider. C'est le wedge, entièrement testé.
- **Ports** (`src/ports`) — `DataSource` (les activités), `Repository` (ton cœur markdown),
  `LectureDuJour` (la lecture en sortie).
- **Adaptateurs** (`src/adapters`) — `strava-mcp` et `strava-rest` (deux entrées vers Strava —
  via un hôte MCP ou l'API REST publique ; dans les deux cas le « relative effort » est marqué
  incompatible et la charge recalculée depuis le brut, mapping partagé dans `strava-shared`),
  `markdown-repo` (ton cœur), et deux adaptateurs pilotes sur le *même* moteur : `claude-skill`
  et `openclaw-skill` (un `SKILL.md` chacun — ils transforment le squelette déterministe en
  lecture du jour). Ajouter un provider ou une surface est quasi gratuit : même bin, même
  domaine, adaptateur différent.

Les chiffres et la couleur sont **déterministes** ; l'IA lit ton **journal narratif** sur la
durée pour les patterns qu'un tableur ne voit pas, et écrit la lecture.

**Deux mémoires.** Ton `journal/` est *ton* carnet (c'est toi qui l'écris). Le copilote tient
aussi *sa propre* mémoire de toi dans `memory/` — un modèle compilé et maillé qu'il lit d'abord
et met à jour après chaque session (pattern LLM Wiki de Karpathy : *stop re-deriving, start
compiling*). Avec le temps il cesse de relire des mois de journal et lit ce qu'il a déjà appris
de toi, chaque affirmation tracée jusqu'à un jour de journal.

## La méthode, en bref

La charge donne le **TSB** (forme) ; ton journal donne la **disponibilité**. Le **subjectif
arbitre l'objectif** — blessure/maladie toujours rouge, une faible disponibilité jamais
verte, des jambes fraîches ne passent jamais avant un corps qui dit non. Version complète :
[`/fr/method.md`](method.md). Ouverte volontairement : la méthode est le sujet, pas un
secret.

## Installer / lancer

Deux portes d'entrée — détails dans **[`fr/onboarding.md`](onboarding.md)** :

**A. Sans terminal (3 gestes)** — pour les athlètes sur Claude :
1. Connecte le **connecteur Strava officiel** dans Claude (Connectors → Strava → OAuth).
2. Télécharge **`feezify-skill-<version>.zip`** depuis la
   [dernière release](https://github.com/jn-prod/feezify/releases/latest) et uploade-le dans
   Claude → Settings → Skills.
3. Demande *« comment je vais aujourd'hui ? »* — le copilote crée ton cœur et te configure
   en conversation.

**B. Parcours développeur** — clone et build :

```bash
pnpm install && pnpm build
cp -r core-template ~/my-feezify-core   # ton cœur privé (profil, objectifs, journal, memory)
cp .env.example .env                    # puis ajoute tes tokens Strava (voir onboarding.md)
node dist/lecture.js ~/my-feezify-core 2026-06-29
```

Puis pointe ton IA vers la skill — **skill Claude** (`src/adapters/claude-skill/SKILL.md`),
**skill OpenClaw** (`src/adapters/openclaw-skill/SKILL.md`), et la surface zip autoportante
(`src/adapters/claude-skill-zip/SKILL.md`) — même moteur, trois enveloppes.

> **Les tokens des adaptateurs vont uniquement dans `.env`** (gitignoré) — jamais dans un
> autre fichier. Voir `onboarding.md` et `AGENTS.md → Secrets`. Le parcours sans terminal ne
> touche jamais un token : le connecteur officiel Strava gère l'auth en OAuth.

## Au quotidien

1. Dis-lui qui tu es : remplis **[`core-template/user.md`](../core-template/user.md)** dans ton
   cœur (nom, sport principal, niveau, profil, objectif du moment) — lu comme contexte, jamais
   un diagnostic.
2. Choisis tes connecteurs : dans **[`core-template/config.yml`](../core-template/config.yml)**, un
   connecteur (ex. `strava`) reste **off** tant que tu ne l'as pas mis à `true` — le copilote
   n'échange tes données avec un tiers qu'après ton **opt-in explicite** (consentement).
3. Ajoute une entrée de journal : copie `templates/journal-day.md` vers `journal/YYYY-MM-DD.md`
   et remplis-la — les marqueurs (sommeil, fatigue, motivation, humeur, stress, faim, soif) +
   quelques phrases honnêtes (sensations des jambes, gêne éventuelle, vie extra-sportive).
4. Demande à ton IA comment tu vas aujourd'hui. Elle lit sa mémoire (`memory/`) et ton
   journal, lance la lecture déterministe, et te dit **vert / orange / rouge** et *pourquoi* —
   sans jamais prescrire.

## Auteur & soutien

Construit par Nicolas Jouanno — voir **[`fr/author.md`](author.md)** (qui je suis, mes articles
d'entraînement, et comment soutenir le projet sur Tipeee).

## Statut

Build précoce — **beta, retours bienvenus**. Ouvre une issue avec ce qui sonne juste et ce
qui ne va pas. Les prochaines étapes : des harnais d'évaluation pour la skill et une couche
world-model pour l'état courant.

## Licence

[Apache-2.0](../LICENSE). Le moat, c'est la méthode, la voix et la distribution — pas le code.
