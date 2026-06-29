# La méthode — comment feezify lit une journée

Voici le jugement encodé par feezify, en clair. Il est ouvert volontairement : la méthode
est le sujet, pas un secret. (Les constantes exactes sont calibrées par athlète et peuvent
évoluer.)

## Deux lectures, croisées

**Objectif — ta forme (TSB).** À partir de tes activités on reconstruit une charge
d'entraînement quotidienne (TSS), en privilégiant la puissance, puis la fréquence
cardiaque, puis le ressenti d'effort (RPE) — toujours recalculée depuis le brut quand on
peut, pour une série cohérente. On en tire :

- **CTL** (forme de fond) — moyenne exponentielle lente sur ~42 jours.
- **ATL** (fatigue) — moyenne exponentielle rapide sur ~7 jours.
- **TSB = CTL − ATL de la veille** (fraîcheur). Bandes : au-dessus de +15 *frais* ; +5 à
  −10 *optimal* ; −10 à −30 *charge productive* ; en dessous de −30 *surcharge*.

**Subjectif — ta disponibilité.** À partir de ton journal quotidien (sommeil, fatigue,
motivation, humeur, stress, faim, soif) on lit un score de disponibilité. Faim et soif
sont lues comme un **écart à ta normale**, dans les deux sens — pas « plus c'est mieux ».

## La règle de croisement (le wedge)

Le **subjectif arbitre l'objectif**. C'est la partie la mieux étayée scientifiquement :
quand ton ressenti et les chiffres divergent, le ressenti gagne.

- **Blessure ou maladie → rouge.** Toujours. Aucun chiffre ne passe avant.
- **Une faible disponibilité n'est jamais verte**, même jambes fraîches.
- **Bonne disponibilité + forme non négative → vert.**
- **Bonne disponibilité + forme très négative → orange** (on suppose une fatigue cachée) —
  *sauf* si tu es sciemment dans un bloc de charge, où cette fatigue est le plan.
- **Un jour de repos** recadre un score bas comme attendu, pas alarmant.

Le « pourquoi », ce sont toujours les marqueurs les plus bas et ce que tes propres mots
disent en moteur. feezify lit ; **c'est toi qui décides.**
