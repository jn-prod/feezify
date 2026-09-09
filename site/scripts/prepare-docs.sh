#!/usr/bin/env sh
# Prepares the copied /docs for the site build. Run from site/ after copying
# the repo's /docs into site/docs. Two jobs:
#
# 1. Rewrites links that point outside /docs (repo files that don't ship in
#    the site build: author.md, AGENTS.md, src/**, onboarding.md, LICENSE…)
#    to their GitHub URLs. Links between docs pages stay relative — Jekyll's
#    relative-links plugin converts those to the rendered pages.
# 2. Prepends front matter (per-page description + EN↔FR alternate for
#    hreflang) so the SEO tags aren't the site-wide defaults. Injected at
#    build time to keep the repo's markdown clean.
set -e

GITHUB_BLOB="https://github.com/jn-prod/feezify/blob/master"

for f in docs/fr/*.md; do
  sed -i -E "s|\]\(\.\./\.\./|](${GITHUB_BLOB}/|g" "$f"
done

for f in docs/*.md; do
  sed -i -E "s|\]\(\.\./|](${GITHUB_BLOB}/|g" "$f"
done

# add_fm <file> <alternate-url> <description> [permalink]
# READMEs need an explicit permalink: front matter turns them into regular
# pages, which bypasses the readme-index plugin.
add_fm() {
  [ -f "$1" ] || { echo "prepare-docs: missing $1" >&2; exit 1; }
  tmp="$1.fm"
  {
    printf -- '---\ndescription: >-\n  %s\nalternate: %s\n' "$3" "$2"
    [ -n "${4:-}" ] && printf 'permalink: %s\n' "$4"
    printf -- '---\n'
  } > "$tmp"
  cat "$1" >> "$tmp" && mv "$tmp" "$1"
}

add_fm docs/README.md /docs/fr/ \
  "feezify documentation — what it is, how to install it (no-terminal or developer path), daily use, the method, privacy and consent." \
  /docs/
add_fm docs/what-is-feezify.md /docs/fr/presentation.html \
  "What feezify is and is not: a training copilot on your own AI that reads your day — green, amber or red — and never prescribes."
add_fm docs/install.md /docs/fr/installation.html \
  "Install feezify in three moves, no terminal — connect Strava in Claude, upload the skill, ask for your read. Developer path included."
add_fm docs/daily-use.md /docs/fr/utilisation-quotidienne.html \
  "Your core folder explained, how to keep the journal, and how to ask for — and read — feezify's read of the day."
add_fm docs/the-method.md /docs/fr/la-methode.html \
  "How feezify reads a day: training load (TSS, CTL, ATL, TSB), readiness from your journal, and the crossing rule — open on purpose."
add_fm docs/privacy-and-consent.md /docs/fr/confidentialite-et-consentement.html \
  "Local-first by design: your data stays in a folder you own, connectors are consent-gated and revocable, no server, no telemetry."
add_fm docs/faq.md /docs/fr/faq.html \
  "Frequently asked questions and troubleshooting for feezify, on both the no-terminal path and the developer path."

add_fm docs/fr/README.md /docs/ \
  "La documentation de feezify — ce que c'est, l'installation (sans terminal ou parcours développeur), l'usage quotidien, la méthode, la confidentialité." \
  /docs/fr/
add_fm docs/fr/presentation.md /docs/what-is-feezify.html \
  "Ce que feezify est — et n'est pas : un copilote d'entraînement sur ta propre IA qui lit ta journée, vert, orange ou rouge, sans jamais prescrire."
add_fm docs/fr/installation.md /docs/install.html \
  "Installer feezify en trois gestes, sans terminal — connecter Strava dans Claude, uploader la skill, demander sa lecture. Parcours développeur inclus."
add_fm docs/fr/utilisation-quotidienne.md /docs/daily-use.html \
  "Ton cœur expliqué, comment tenir ton journal, et comment demander — et lire — la lecture du jour de feezify."
add_fm docs/fr/la-methode.md /docs/the-method.html \
  "Comment feezify lit une journée : charge (TSS, CTL, ATL, TSB), disponibilité du journal, et la règle du croisement — publique, volontairement."
add_fm docs/fr/confidentialite-et-consentement.md /docs/privacy-and-consent.html \
  "Local d'abord : tes données restent dans un dossier à toi, les connecteurs sont soumis à consentement et révocables, zéro serveur, zéro télémétrie."
add_fm docs/fr/faq.md /docs/faq.html \
  "Questions fréquentes et dépannage pour feezify, parcours sans terminal et parcours développeur."
