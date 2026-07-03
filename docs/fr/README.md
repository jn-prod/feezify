# feezify — documentation

**Un copilote d'entraînement, passé AI-native.** feezify lit ta journée — ta forme
objective (charge d'entraînement) croisée avec ton ressenti réel — et te dit, en mots
simples, si aujourd'hui est **vert, orange ou rouge**, et *pourquoi*. Il ne prescrit
aucune séance. Tu décides ; il t'aide juste à te lire plus clairement.

Il s'installe sur *ta propre* IA sous forme de **skill**, lit un dossier de **markdown qui
t'appartient**, et tourne entièrement **sur ta machine** — pas de serveur, pas de compte,
pas de télémétrie.

🇬🇧 English version: [`../README.md`](../README.md)

---

## Par où commencer

Choisis la porte qui te correspond — pas besoin de tout lire.

| Si tu… | Lis |
|---|---|
| veux juste savoir ce que c'est | [C'est quoi feezify ?](presentation.md) |
| **ne veux pas** toucher à un terminal | [Installation — sans terminal (3 gestes)](installation.md#a--sans-terminal-3-gestes) |
| es développeur / utilisateur OpenClaw | [Installation — parcours développeur](installation.md#b--parcours-développeur) |
| es installé et veux t'en servir | [Utilisation au quotidien](utilisation-quotidienne.md) |
| veux comprendre comment il te lit | [La méthode](la-methode.md) |
| tiens à tes données | [Confidentialité & consentement](confidentialite-et-consentement.md) |
| es bloqué ou as une question | [FAQ & dépannage](faq.md) |

## Tout, en une minute

1. **Connecte Strava** (optionnel) pour que feezify voie ta charge — via le connecteur
   Strava officiel de Claude (aucune clé), ou tes propres tokens en parcours développeur.
2. **Installe la skill** sur ton IA (upload d'un zip dans Claude, ou pointe un setup dev
   vers le `SKILL.md`).
3. **Tiens un court journal** — quelques lignes honnêtes par jour (sommeil, fatigue,
   humeur, une gêne).
4. **Demande « comment je vais aujourd'hui ? »** — feezify lance une lecture déterministe
   et répond **vert / orange / rouge** et *pourquoi*. Jamais de prescription.

Tout le reste ne fait que détailler ces quatre gestes.

## Les documents

- **[C'est quoi feezify ?](presentation.md)** — l'idée, ce qu'il fait et ne fait *pas*, et
  comment l'ancien SaaS est devenu un agent AI-native.
- **[Installation](installation.md)** — les deux portes : le parcours sans terminal en 3
  gestes pour les athlètes, et le parcours développeur (clone, build, tokens).
- **[Utilisation au quotidien](utilisation-quotidienne.md)** — ton dossier cœur expliqué,
  comment journaliser, comment demander la lecture, comment la lire.
- **[La méthode](la-methode.md)** — comment la lecture est calculée : charge (TSB),
  readiness, et la règle de croisement. Ouverte volontairement.
- **[Confidentialité & consentement](confidentialite-et-consentement.md)** — local-first,
  connecteurs sous consentement, où vivent les tokens, comment tout révoquer.
- **[FAQ & dépannage](faq.md)** — questions fréquentes et correctifs, pour les deux
  parcours.

## Sources canoniques dans le repo

Ces docs sont le manuel du lecteur. La source de vérité de chaque sujet vit avec le code et
l'emporte en cas de conflit :

- La méthode — [`src/adapters/claude-skill/method.md`](../../src/adapters/claude-skill/method.md)
- Les skills (ce que l'IA fait réellement) — `src/adapters/*/SKILL.md`
- Les checklists d'onboarding — [`onboarding.md`](../../onboarding.md) · [`fr/onboarding.md`](../../fr/onboarding.md)
- Règles agent / sécurité — [`AGENTS.md`](../../AGENTS.md)

## Statut & licence

Build précoce — **beta, retours bienvenus**. Ouvre une issue avec ce qui sonne juste et ce
qui ne va pas. Licence [Apache-2.0](../../LICENSE). Construit par Nicolas Jouanno — voir
[`author.md`](../../author.md).
