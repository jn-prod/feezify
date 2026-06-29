# feezify

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
machine** — pas de serveur, pas de compte, pas de télémétrie. L'IA est la surface ; la skill
est le composant ; ton markdown est l'état ; la conversation est l'interaction. (Cette
migration — et l'idée de « frontend IA-native » derrière — fait l'objet de l'article
compagnon.)

La v1 livre **une seule skill** : la **lecture du jour**.

## Comment ça marche (le design)

Hexagonal — ports & adaptateurs — pour que la méthode reste pure et que chaque provider soit
remplaçable :

- **Domaine** (`src/domain`) — entités, le calcul de charge (TSS → CTL/ATL/TSB en vraies
  moyennes exponentielles), le score de disponibilité, et **la règle de croisement**. Aucune
  I/O, aucun nom de provider. C'est le wedge, entièrement testé.
- **Ports** (`src/ports`) — `DataSource` (les activités), `Repository` (ton cœur markdown),
  `LectureDuJour` (la lecture en sortie).
- **Adaptateurs** (`src/adapters`) — `strava-mcp` (un provider, pas spécial — le « relative
  effort » est marqué incompatible et la charge est recalculée depuis le brut),
  `markdown-repo` (ton cœur), et deux adaptateurs pilotes sur le *même* moteur :
  `claude-skill` et `openclaw-skill` (un `SKILL.md` chacun — ils transforment le squelette
  déterministe en lecture du jour). Ajouter une surface est quasi gratuit : même bin, même
  domaine, manifeste différent.

Les chiffres et la couleur sont **déterministes** ; l'IA lit ton **journal narratif** sur la
durée pour les patterns qu'un tableur ne voit pas, et écrit la lecture.

**Deux mémoires.** Ton `journal/` est *ton* carnet (c'est toi qui l'écris). Le copilote tient
aussi *sa propre* mémoire de toi dans `wiki/` — un modèle compilé et maillé qu'il lit d'abord
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

```bash
npm install
npm run build
cp -r core-template ~/my-feezify-core      # ton cœur portable (profil, objectifs, journal, wiki)
feezify-lecture ~/my-feezify-core 2026-06-29
```

Puis pointe ton IA vers la skill — elle existe en **skill Claude**
(`src/adapters/claude-skill/SKILL.md`) **et** en **skill OpenClaw**
(`src/adapters/openclaw-skill/SKILL.md`), même moteur. Remplis `profil.md` avec tes repères,
dépose une entrée quotidienne dans `journal/`, et demande à ton IA comment tu vas aujourd'hui.

## Statut

Build précoce — **beta, retours bienvenus**. Ouvre une issue avec ce qui sonne juste et ce
qui ne va pas. Les prochaines étapes : des harnais d'évaluation pour la skill et une couche
world-model pour l'état courant.

## Licence

[Apache-2.0](../LICENSE). Le moat, c'est la méthode, la voix et la distribution — pas le code.
