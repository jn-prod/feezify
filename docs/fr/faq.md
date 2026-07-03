# FAQ & dépannage

← [Retour à l'index de la doc](README.md)

## Général

**Faut-il être développeur ?**
Non. Le [parcours sans terminal](installation.md#a--sans-terminal-3-gestes) tient en trois
gestes : connecter Strava, uploader le zip de la skill dans Claude, demander « comment je
vais aujourd'hui ? ». Pas de code, pas de clés.

**Ai-je besoin de Strava ?**
Non. Strava donne à feezify la moitié objective (ta charge d'entraînement). Sans lui,
feezify fonctionne quand même depuis ton journal seul — tu perds juste le TSB. Tu peux
ajouter Strava plus tard, à tout moment.

**C'est gratuit ?**
Oui — gratuit et open source ([Apache-2.0](../../LICENSE)), construit en public. S'il
t'aide, tu peux soutenir le travail sur Tipeee → <https://www.tipeee.com/byNicolasJD>.

**Va-t-il me dire quelle séance faire ?**
Non, par design. feezify est un *copilote*, pas un coach : il lit ta journée (vert/orange/
rouge et pourquoi) et **tu décides**. Il ne prescrit jamais de séance, d'allure, de
puissance ou de durée, et ne donne aucun avis médical. Voir [c'est quoi feezify ?](presentation.md).

**Envoie-t-il mes données quelque part ?**
Non. C'est local-first — pas de serveur, pas de compte, pas de télémétrie. Il ne touche un
tiers (Strava) qu'après ton consentement explicite, et c'est révocable. Voir
[confidentialité & consentement](confidentialite-et-consentement.md).

## Parcours sans terminal (Claude)

**La skill ne se lance pas / rien ne se passe quand je demande.**
Vérifie que **l'exécution de code est activée** pour la skill (Settings → Capabilities →
Skills). La skill lance un petit moteur Node embarqué pour calculer tes nombres.

**Où récupérer le zip de la skill ?**
Sur la [dernière release](https://github.com/jn-prod/feezify/releases/latest) —
`feezify-skill-<version>.zip`. Upload-le dans Claude : Settings → Capabilities → Skills →
Upload skill.

**Mon journal/ma mémoire disparaît entre deux chats.**
Un simple chat web n'a pas de fichiers persistants. Utilise **Claude Cowork** et donne-lui
un dossier à toi (ex. `Documents/feezify`) pour que ton cœur persiste. Le copilote te
prévient quand il est dans un contexte session-only et peut te remettre un zip à garder.

**Le connecteur Strava n'est pas disponible pour moi.**
Le connecteur officiel est aujourd'hui réservé aux **abonnés Strava**. Si tu ne peux pas
l'utiliser, soit tu sautes Strava (le mode journal-seul marche), soit tu passes au
[parcours développeur](installation.md#b--parcours-développeur) avec tes propres tokens API.

## Parcours développeur

**`git check-ignore .env` n'affiche rien.**
Alors `.env` n'est **pas** ignoré — arrête et corrige ton `.gitignore` avant d'ajouter le
moindre vrai token. Il doit afficher `.env`. Ne commite jamais un token.

**Strava n'est pas lu alors que j'ai mis un token.**
Strava n'est interrogé que si **à la fois** le token est dans `.env` **et**
`connectors.strava: true` dans ton `config.yml`. Vérifie le flag de consentement — il est
`false` par défaut. Voir
[confidentialité & consentement](confidentialite-et-consentement.md#consentement--les-connecteurs-sont-opt-in).

**La lecture montre une forme mais le score semble faux / neutre.**
Si tu n'as pas écrit d'entrée de journal pour cette date, le score de readiness est un
**neutre par défaut** (feezify le dit franchement). Ajoute une entrée
`journal/YYYY-MM-DD.md` pour une vraie lecture.

**Comment lancer une lecture à la main ?**

```bash
node --env-file=.env dist/lecture.js ~/my-feezify-core 2026-06-29
```

(Omets `--env-file=.env` si tu n'as pas encore de `.env`.) Ça imprime du JSON : `light`,
`tsb` + `tsbProvenance`, `score` + `scoreProvenance`, `reason`, `vigilance`, et
`recentNarrative`.

**Comment reconstruire le zip distribuable ?**

```bash
pnpm package:skill
```

Sortie : `packaging/feezify-skill-<version>.zip` (artefact de build gitignoré).

**Tests / typecheck ?**

```bash
pnpm test        # tests unitaires (les maths du domaine sont entièrement couvertes)
pnpm typecheck   # tsc --noEmit
```

## Comprendre la lecture

**Que veulent dire vert / orange / rouge ?**
Vert = go ; orange = prudence (fatigue cachée probable) ; rouge = lève le pied (toujours
rouge en cas de blessure ou de maladie). Règle complète dans
[la méthode](la-methode.md#la-règle-de-croisement-le-wedge).

**C'est quoi le TSB ?**
Ta *forme* — fitness moins fatigue (`CTL − ATL`). Bandes et détails dans
[la méthode](la-methode.md#objectif--ta-forme-tsb).

**Pourquoi le ressenti a-t-il primé sur les chiffres ?**
Parce que c'est la règle centrale : **le subjectif prime sur l'objectif.** Une readiness
basse n'est jamais verte ; blessure/maladie est toujours rouge — aucun nombre n'écrase ton
ressenti réel.

## Toujours bloqué ?

Ouvre une issue sur le repo avec ce que tu attendais et ce que tu as vu — **les retours
sont bienvenus** (c'est une beta précoce). Voir [`author.md`](../../author.md) pour savoir
qui est derrière.

---

Retour → [Index de la doc](README.md)
