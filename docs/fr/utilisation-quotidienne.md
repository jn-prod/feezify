# Utiliser feezify au quotidien

← [Retour à l'index de la doc](README.md)

Une fois [installé](installation.md), la boucle quotidienne est minuscule :

1. Écris quelques lignes honnêtes dans ton **journal**.
2. Demande à ton IA : **« comment je vais aujourd'hui ? »**
3. Lis la réponse — **vert / orange / rouge**, et *pourquoi*.

Tout le reste ci-dessous est du détail sur lequel tu peux revenir.

## Ton cœur, expliqué

Ton **cœur** est un dossier de markdown qui *t'appartient*. feezify ne garde jamais tes
données ailleurs. Le parcours sans terminal le crée pour toi au premier run ; le parcours
développeur le copie depuis `core-template/`. Dedans :

| Fichier / dossier | Ce que c'est | Qui l'écrit |
|---|---|---|
| `profil.md` | Bases physiologiques : FC max, seuil, FTP, faim/soif normales | Toi (une fois, rarement mis à jour) |
| `user.md` | Qui tu es : nom, sport principal, niveau, objectif — du contexte, jamais un diagnostic | Toi |
| `objectifs.md` | Ce que tu vises en ce moment (course, bloc, retour de blessure) | Toi |
| `config.yml` | Réglages & **consentement** : connecteurs activés, rappels de soutien | Toi |
| `journal/` | **Ton journal quotidien** — un `YYYY-MM-DD.md` par jour. Brut, immuable | **Toi** |
| `memory/` | La **propre mémoire du copilote sur toi** — compilée, reliée | **Le copilote** |
| `templates/` | Templates vierges (jour de journal, cache d'activités) | — |
| `activities.json` | Cache optionnel de tes activités Strava | Le copilote / le moteur |

**Deux mémoires, à ne pas confondre :** `journal/` est *à toi* — tu l'écris, feezify le lit
seulement. `memory/` est *au copilote* — il l'écrit et l'entretient, la lit en premier à
chaque fois pour cesser de te re-déduire de zéro. Chaque affirmation dans `memory/` est
tracée jusqu'à un jour de journal (pas de source, pas d'affirmation).

## Écrire une entrée de journal

Copie `templates/journal-day.md` vers `journal/YYYY-MM-DD.md` et remplis-la. (Au parcours
sans terminal, dis-le simplement au copilote et il le fera avec toi.)

Une entrée a deux parties :

- **Les marqueurs** — sommeil, fatigue, motivation, humeur, stress, appétit, soif.
  L'appétit et la soif sont lus comme un **écart à ton propre normal**, dans un sens comme
  dans l'autre — pas « plus c'est mieux ».
- **Quelques phrases honnêtes** — comment les jambes ont répondu, une gêne ou une douleur,
  ce qui se passe dans la vie (stress au boulot, mauvaise nuit, voyage). Ce narratif est le
  cœur du sujet : c'est ce qu'un tableur ne sait pas lire.

Tu n'es pas obligé de journaliser tous les jours, mais la lecture ne vaut que ce que tu lui
donnes. Un jour **sans** entrée de journal reçoit un score de readiness *neutre par
défaut* — et feezify le dira franchement plutôt que de prétendre t'avoir mesuré.

## Demander la lecture

Demande à ton IA, avec tes mots :

> *« Comment je vais aujourd'hui ? »* · *« Je m'entraîne ? »* · *« Lis ma forme. »*

En coulisses, le copilote :

1. Lit d'abord sa **mémoire** de toi.
2. Récupère tes **activités** (si tu as consenti à Strava) et reconstruit ta charge.
3. Lance le **moteur déterministe** — les nombres et le feu sont calculés, pas devinés, et
   l'IA ne les **écrase pas**.
4. Lit ton **journal + tes objectifs** du jour, croise avec ce qu'il sait déjà, et écrit la
   lecture.

## Lire la réponse

Une lecture est un court message pédagogique :

- **Le feu** — **vert** (go), **orange** (prudence / fatigue cachée probable) ou **rouge**
  (lève le pied — toujours rouge en cas de blessure ou de maladie).
- **La forme** — ta valeur `TSB` et ce que sa bande signifie (voir [la méthode](la-methode.md)).
- **La readiness** — un `score/100` et le(s) principal(aux) moteur(s) derrière.
- **Le pourquoi** — comment objectif et subjectif s'alignent. Rappel : **ton ressenti prime
  sur les chiffres.** Des jambes fraîches n'écrasent jamais un corps qui dit non.
- **Un schéma** — seulement si ton historique en montre réellement un.
- **Un point de vigilance** — une seule chose à auto-évaluer contre *ton propre* plan.

Ça s'arrête là. **feezify lit ; tu décides.** Aucune séance n'est prescrite.

## Avec le temps

Plus tu journalises, mieux le copilote te lit : il compile des enseignements durables dans
`memory/` et commence à reconnaître tes schémas (ta réponse à un bloc de charge, l'effet
d'une semaine de mauvais sommeil) au lieu de relire des mois d'entrées à chaque fois.

## Connecteurs & soutien

- **Connecteurs** — activables ou désactivables à tout moment dans `config.yml` (c'est ton
  consentement). Voir [confidentialité & consentement](confidentialite-et-consentement.md).
- **Soutien** — feezify est gratuit et open source, construit en public. S'il t'aide, tu
  peux soutenir le travail sur Tipeee → <https://www.tipeee.com/byNicolasJD> (voir
  [`author.md`](../../author.md)). Le copilote te le rappelle de temps en temps ; opt-out
  avec `support.remind: false` dans `config.yml`.

---

Envie de comprendre les nombres ? → [La méthode](la-methode.md)
