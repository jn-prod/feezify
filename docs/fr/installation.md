# Installer feezify

← [Retour à l'index de la doc](README.md)

Il y a deux portes d'entrée. **Choisis-en une — pas besoin des deux.**

- **[A — Sans terminal (3 gestes)](#a--sans-terminal-3-gestes)** — rien à installer, pas
  de code, pas de clés. Pour les athlètes sur Claude. **Commence ici si tu n'es pas
  développeur.**
- **[B — Parcours développeur](#b--parcours-développeur)** — clone le repo, build-le,
  utilise tes propres tokens. Pour les builders et les utilisateurs OpenClaw.

Les deux mènent au même endroit : ton IA peut lire ta journée. Elles diffèrent seulement
sur la façon dont le moteur y arrive.

---

## A — Sans terminal (3 gestes)

Fonctionne avec **Claude** sur le web et, au mieux, **Claude Cowork** (desktop). Cowork
garde tes données dans un dossier à toi, donc ton journal et la mémoire du copilote
persistent d'une conversation à l'autre.

### Geste 1 — Connecte Strava *(optionnel mais recommandé)*

> Nécessite un compte Strava. Le connecteur officiel est aujourd'hui réservé aux **abonnés
> Strava**. Pas de Strava ? feezify fonctionne quand même depuis ton journal seul (tu perds
> juste la moitié « charge objective »).

Dans Claude : **Customize → Connectors → ajouter Strava → autoriser (OAuth)**.

- C'est **en lecture seule** et **révocable à tout moment** depuis tes réglages Strava.
- Aucune clé API, aucun token, rien à copier-coller. Claude gère l'autorisation.

### Geste 2 — Installe la skill

1. Télécharge **`feezify-skill-<version>.zip`** depuis la
   [dernière release](https://github.com/jn-prod/feezify/releases/latest).
2. Dans Claude : **Settings → Capabilities → Skills → Upload skill**.
3. Vérifie que **l'exécution de code est activée** (la skill lance un petit moteur Node
   embarqué pour calculer tes nombres de façon déterministe).

Le zip est **autoportant** — le moteur, le template de cœur et la méthode ouverte y sont
tous embarqués. Rien d'autre à installer.

### Geste 3 — Demande ta lecture

Dis : **« comment je vais aujourd'hui ? »**

Au **premier run**, le copilote crée ton **cœur** (un dossier de markdown qui t'appartient
— profil, journal, sa propre mémoire de toi) et te configure en conversation : tes valeurs
de base, qui tu es, ton consentement Strava, ta première entrée de journal. Il te guide une
question à la fois, comme un onboarding sympa.

**C'est tout.** Au quotidien : quelques lignes honnêtes dans ton journal, puis demande ta
lecture.

> **Dans Cowork**, donne un dossier à Claude (ex. `Documents/feezify`) pour que ton cœur
> persiste. Dans un simple chat web sans accès fichiers, le copilote te le dira et proposera
> une lecture valable pour la session seulement.

---

## B — Parcours développeur

> **Règle de sécurité (non négociable) :** les tokens d'adaptateurs vivent **uniquement
> dans `.env`** (gitignoré). N'écris jamais un vrai token ailleurs. Voir
> [`AGENTS.md → Secrets`](../../AGENTS.md) et
> [confidentialité & consentement](confidentialite-et-consentement.md).

### Prérequis

- **Node.js** (LTS récent) et **pnpm**.
- Une **application API Strava** si tu veux la charge automatique —
  <https://www.strava.com/settings/api> (donne un client id, un secret, des tokens).

### Étapes

```bash
# 1. Installer & builder
pnpm install && pnpm build

# 2. Créer ton cœur portable (tes données, privées)
cp -r core-template ~/my-feezify-core

# 3. Configurer les tokens (optionnel — seulement si tu veux Strava)
cp .env.example .env          # puis ajoute tes clés Strava
git check-ignore .env         # doit afficher « .env » — prouve que c'est gitignoré

# 4. Première lecture
node --env-file=.env dist/lecture.js ~/my-feezify-core 2026-06-29
```

Puis remplis ton cœur :

- **`profil.md`** — bases physiologiques (FC max, seuil, FTP si capteur de puissance, tes
  faim/soif normales).
- **`user.md`** — qui tu es (nom, sport principal, niveau, objectif du moment). Du
  contexte, jamais un diagnostic.
- **`config.yml`** — mets `connectors.strava: true` **seulement si** tu veux que feezify
  lise tes données Strava (consentement — off par défaut).

> **Quand Strava est-il vraiment interrogé ?** Uniquement quand **à la fois** le token est
> dans `.env` **et** `connectors.strava: true` dans `config.yml`. Sinon le moteur lit un
> cache optionnel `<core>/activities.json` (format :
> [`core-template/templates/activities-cache.md`](../../core-template/templates/activities-cache.md)),
> ou travaille depuis le journal seul.

### Brancher la skill à ton IA

Pointe ton IA vers le bon `SKILL.md` :

- **Claude** → [`src/adapters/claude-skill/SKILL.md`](../../src/adapters/claude-skill/SKILL.md)
- **OpenClaw** → [`src/adapters/openclaw-skill/SKILL.md`](../../src/adapters/openclaw-skill/SKILL.md)

Même moteur, enveloppe différente. (Le zip sans terminal du parcours A emballe le même
`src/adapters/claude-skill-zip/SKILL.md`.)

### Régénérer le zip sans terminal

Pour reconstruire le zip distribuable de la skill (le fichier que les athlètes uploadent au
parcours A) :

```bash
pnpm package:skill     # build le bundle autoportant, puis package le zip
```

Le résultat atterrit dans `packaging/feezify-skill-<version>.zip`. Il est gitignoré
(artefact de build) et publié en asset de GitHub Release.

### Checklist complète

La version pas-à-pas à cocher vit dans [`fr/onboarding.md`](../../fr/onboarding.md)
(🇬🇧 [`onboarding.md`](../../onboarding.md)). L'onboarding est terminé quand chaque case
est cochée.

---

Suite → [Utilisation au quotidien](utilisation-quotidienne.md)
