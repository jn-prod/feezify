---
# Your personal baselines. Edit these — the copilot never hard-codes them.
maxHr: 190            # your max heart rate (bpm)
thresholdHr: 160      # your threshold/LTHR (bpm) — used for hrTSS
ftp: 0                # your functional threshold power (W); 0 if you don't ride with power
faimNormal: 3         # your NORMAL appetite on a 1–5 scale (deviation either way is a signal)
soifNormal: 3         # your NORMAL thirst on a 1–5 scale
---

# Athlete profile

These baselines are yours and only yours. `faimNormal` / `soifNormal` are *your* normal —
the copilot scores appetite and thirst as deviation from them, in either direction, not
"more is better". Update threshold/FTP as you retest; nothing is assumed.
