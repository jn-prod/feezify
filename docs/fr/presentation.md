# C'est quoi feezify ?

← [Retour à l'index de la doc](README.md)

feezify est un **copilote** d'entraînement — pas un coach. Il t'aide à *lire* ta propre
journée. Chaque matin (ou quand tu le demandes), il regarde deux choses et les croise :

- **Combien tu t'es entraîné** — ta *forme* objective, reconstruite depuis tes activités.
- **Comment tu te sens vraiment** — d'après quelques lignes honnêtes que tu écris dans un
  journal.

Puis il te dit, en langage clair, si aujourd'hui est **vert, orange ou rouge**, et
*pourquoi*. C'est tout. **Tu décides** quoi en faire.

## Ce qu'il fait

- Lit ta charge d'entraînement et la transforme en **forme** (un nombre appelé TSB — voir
  [la méthode](la-methode.md)).
- Lit ton **journal** (sommeil, fatigue, motivation, humeur, stress, appétit, soif, et
  quelques phrases) en un score de **readiness**.
- **Croise** les deux avec une règle claire — *ton ressenti prime sur les chiffres* — et te
  donne un feu plus la raison qui va avec.
- Garde sa **propre mémoire de toi** dans le temps, pour lire des schémas qu'un seul jour
  ne montre pas — chaque affirmation tracée jusqu'à une entrée de journal.

## Ce qu'il ne fait **pas**

- Il ne **prescrit jamais** une séance, une allure, une puissance ou une durée.
- Il ne se **présente jamais comme coach ou entraîneur**, et ne donne aucun avis médical.
- Il ne décide pas à ta place. Il éclaire ; tu choisis.
- Il ne tourne pas dans le cloud, ne garde pas de compte, n'envoie pas de télémétrie. Voir
  [confidentialité & consentement](confidentialite-et-consentement.md).

Ce n'est pas une limite à contourner — c'est le design. feezify fait de toi un meilleur
lecteur de ton propre corps ; il ne délègue pas le jugement.

## D'où il vient

feezify était un SaaS hébergé — une app Node/Express/Mongo avec comptes, base de données,
serveur, frontend, déploiements. La plupart, de la plomberie. La *vraie* valeur était une
petite chose enfouie dedans : une façon de **croiser charge objective et readiness
subjective**, et un jugement sur le moment où le ressenti doit primer sur les chiffres.

À l'arrivée des agents IA, ~90 % de cette app est devenu du poids mort. La méthode, non.
feezify a donc été reconstruit **AI-native**.

## Le remap AI-native

L'ancienne app web et le nouvel agent se correspondent étage par étage. Le navigateur fut
le dernier changement d'interface ; le LLM/chatbot est le prochain. Tu ne branches pas
l'ancienne app dessus — tu reconstruis le moteur un cran plus bas, en **agent**, et la base
de données devient une **mémoire** :

| App web classique | L'étage | feezify AI-native |
|---|---|---|
| Navigateur / frontend | l'**interface** | **le LLM / le chatbot** (Claude, OpenClaw…) |
| Serveur / backend | le **moteur applicatif** | **l'agent** — un cœur de méthode pur + adaptateurs vers des apps tierces |
| Base de données | la **persistance** | **une mémoire second-cerveau** — ton journal + la mémoire compilée du copilote |

Tu n'ouvres pas l'app feezify. Tu installes l'*agent* feezify sur ta propre IA.

## Pour qui

- **Les athlètes** qui s'entraînent assez sérieusement pour vouloir lire leur forme
  honnêtement — et qui préfèrent posséder leurs données plutôt que nourrir une plateforme
  de plus.
- **Les builders / utilisateurs OpenClaw** qui veulent un exemple propre, hexagonal et
  entièrement testé d'une réécriture AI-native à étendre.

Prêt ? → [Installer feezify](installation.md)
