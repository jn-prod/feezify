# La méthode — comment feezify lit une journée

← [Retour à l'index de la doc](README.md)

Voici le jugement qu'encode feezify, en langage clair. Il est **ouvert volontairement** :
la méthode est le sujet, pas un secret. Les nombres et le feu sont **déterministes** —
calculés par un moteur entièrement testé, pas devinés par l'IA.

> Cette page reflète la source canonique
> [`src/adapters/claude-skill/method.md`](../../src/adapters/claude-skill/method.md), qui
> l'emporte en cas de conflit. Les constantes exactes sont calibrées par athlète et peuvent
> évoluer.

## Deux lectures, croisées

feezify lit deux choses et les croise.

### Objectif — ta forme (TSB)

Depuis tes activités, il reconstruit une charge quotidienne (**TSS**), en préférant la
puissance, puis la fréquence cardiaque, puis l'effort perçu de séance (RPE) — toujours
recalculée depuis le brut quand c'est possible, pour que la série reste cohérente. (Le
« relative effort » de Strava est signalé incompatible et recalculé.) De cette charge il
suit :

- **CTL** (fitness) — une moyenne exponentielle lente ~42 jours de la charge.
- **ATL** (fatigue) — une moyenne exponentielle rapide ~7 jours de la charge.
- **TSB = CTL − ATL** de la veille (**forme**).

**Bandes de TSB :**

| TSB | Signification |
|---|---|
| au-dessus de **+15** | *frais* |
| **+5 à −10** | *optimal* |
| **−10 à −30** | *charge productive* |
| en dessous de **−30** | *surcharge* |

### Subjectif — ta readiness

Depuis ton journal quotidien (sommeil, fatigue, motivation, humeur, stress, appétit, soif)
il lit un **score de readiness**. Appétit et soif sont lus comme un **écart à ton propre
normal**, dans un sens comme dans l'autre — pas « plus c'est mieux ».

Si tu n'as écrit **aucune** entrée de journal pour un jour, le score est un **neutre par
défaut**, et feezify le dit franchement — il ne présente jamais un score non mesuré comme
mesuré.

## La règle de croisement (le wedge)

Le **subjectif prime sur l'objectif.** C'est la partie la plus solidement étayée de tout le
système : quand ton ressenti et les chiffres divergent, **c'est le ressenti qui gagne.**

- **Blessure ou maladie → rouge.** Toujours. Aucun nombre ne l'écrase.
- **Une readiness basse n'est jamais verte**, même sur des jambes fraîches.
- **Readiness haute + forme non négative → vert.**
- **Readiness haute + forme profondément négative → orange** (on suppose une fatigue
  cachée) — *sauf* si tu es sciemment dans un bloc de charge, où cette charge est le plan.
- **Un jour de repos** recadre un score bas comme attendu, pas alarmant.

Le « pourquoi » est toujours les marqueurs les plus bas et ce que **tes propres mots**
disent en être le moteur.

## Pourquoi déterministe + IA, ensemble

- Le **moteur** calcule les nombres et le feu. Pur, testable, reproductible — les mêmes
  entrées donnent toujours la même lecture. L'IA a pour consigne de **ne pas** recalculer ni
  écraser.
- L'**IA** lit ton journal *narratif* sur plusieurs jours — les schémas qu'un tableur ne
  voit pas — et écrit la lecture en langage clair et honnête, chaque affirmation tracée
  jusqu'à un jour de journal.

Ce partage est volontaire : des maths auxquelles se fier, un jugement qui reste lisible.

## Le résumé en une ligne

> **La charge donne ta forme. Ton journal donne ta readiness. Le ressenti prime sur les
> chiffres. feezify lit ; tu décides.**

---

Retour → [Utilisation au quotidien](utilisation-quotidienne.md) · [Index de la doc](README.md)
