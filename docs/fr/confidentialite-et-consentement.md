# Confidentialité & consentement

← [Retour à l'index de la doc](README.md)

feezify est **local-first par design.** Tes données sont l'argument du produit, pas son
inventaire. Cette page est le compte-rendu honnête et complet de ce qui arrive à tes
données.

## La version courte

- Tes données vivent dans **ton dossier cœur**, sur **ta machine** (ou un dossier à toi
  dans Cowork). feezify ne les garde nulle part ailleurs.
- **Pas de serveur, pas de compte, pas de télémétrie.** Rien ne « téléphone à la maison ».
- Un connecteur (comme Strava) reste **off tant que tu ne l'actives pas explicitement** —
  c'est le consentement, et il est révocable à tout moment.
- Les tokens (parcours développeur) vivent **uniquement dans `.env`**, gitignoré et jamais
  commité.

## Où vivent tes données

Tout est dans ton **cœur** — un dossier de markdown qui t'appartient (`profil.md`,
`user.md`, `journal/`, `memory/`, `config.yml`…). Voir
[utilisation au quotidien](utilisation-quotidienne.md#ton-cœur-expliqué).

- **Parcours sans terminal :** dans Cowork, pointe Claude vers un dossier que tu gardes
  (ex. `Documents/feezify`) et il y persiste. Dans un simple chat web sans accès fichiers,
  le cœur est valable pour la session seulement — le copilote te le dit et propose de te
  remettre un zip à conserver.
- **Parcours développeur :** là où tu as copié le cœur (`~/my-feezify-core`). C'est du
  markdown clair que tu peux lire, éditer, sauvegarder ou supprimer avec des outils
  normaux.

## Consentement : les connecteurs sont opt-in

Un **connecteur** permet à feezify d'échanger tes données avec un tiers (aujourd'hui :
Strava, pour lire ta charge d'entraînement). La règle, appliquée dans le code :

> Un connecteur reste **OFF** tant que tu ne l'autorises pas explicitement. `false` par
> défaut. Le copilote ne **doit pas** utiliser un connecteur tant qu'il n'est pas `true`
> dans ton `config.yml`.

```yaml
# config.yml
connectors:
  strava: false      # mets à true seulement quand tu veux que feezify lise tes données Strava
```

**Strava n'est interrogé que si les *deux* conditions tiennent :**

1. `connectors.strava: true` dans `config.yml` (ton consentement), **et**
2. un identifiant Strava est disponible — le connecteur officiel (parcours sans terminal)
   *ou* un token dans `.env` (parcours développeur).

Si l'un manque, feezify ne touche pas à Strava. Il lit un cache local `activities.json`
optionnel s'il existe, ou travaille depuis ton journal seul. **Sans Strava du tout est un
mode pleinement supporté.**

## Le connecteur Strava officiel (parcours sans terminal)

Au parcours sans terminal, l'autorisation est gérée par le **connecteur Strava officiel de
Claude** via OAuth :

- Accès **en lecture seule** à tes activités.
- **Aucune clé API ni token** à manipuler ou stocker.
- **Révocable à tout moment** depuis tes réglages Strava (Settings → My Apps) — révoquer
  coupe feezify immédiatement.

## Tokens (parcours développeur)

Si tu utilises ta propre application API Strava, ses secrets sont des **credentials** et
reçoivent le traitement le plus strict :

- Ils vivent **uniquement dans `.env`**, qui est **gitignoré**. Vérifie avec
  `git check-ignore .env` (doit afficher `.env`).
- N'écris **jamais** un vrai token ailleurs — pas une note, pas un config, pas un commit.
  Non négociable ; voir [`AGENTS.md → Secrets`](../../AGENTS.md).
- Avant de commiter, confirme que rien n'a fuité :

  ```bash
  git grep -nE '(CLIENT_SECRET|ACCESS_TOKEN|REFRESH_TOKEN|_API_KEY)[[:space:]]*[:=][[:space:]]*[A-Za-z0-9._-]{12,}' -- ':!.env.example'
  ```

  Attendu : aucun résultat. (Un hook pre-commit scanne aussi, mais vérifie d'abord.) Si un
  token apparaît, déplace-le dans `.env` et retire-le du fichier.

## Tes deux mémoires

- **`journal/`** — *ton* journal quotidien. Brut et immuable ; feezify le lit mais ne le
  réécrit jamais.
- **`memory/`** — la *propre* mémoire compilée du copilote sur toi. Il l'écrit et
  l'entretient, et chaque affirmation y est tracée jusqu'à un jour de journal précis (règle
  de provenance : pas de source, pas d'affirmation). Les deux vivent dans ton cœur, sur ta
  machine.

## Tout révoquer / supprimer

- **Couper un connecteur :** remets-le à `false` dans `config.yml` (et révoque côté Strava
  si tu as utilisé le connecteur officiel).
- **Supprimer tes données :** c'est un dossier de fichiers — supprime le dossier cœur. Rien
  d'autre n'existe où que ce soit.
- **Retirer la skill :** désinstalle-la de ton IA (dans Claude : Settings → Skills).

## En une phrase

> Tes données d'entraînement restent à toi, sur ta machine ; feezify ne touche un tiers
> qu'après que tu aies dit oui explicitement, et tu peux annuler ça en une ligne.

---

Retour → [Index de la doc](README.md) · [FAQ](faq.md)
