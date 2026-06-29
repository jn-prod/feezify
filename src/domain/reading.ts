import { JournalDay } from './types.js'

export type Light = 'green' | 'amber' | 'red'

// TSB bands (intervals.icu convention).
function tsbBand(tsb: number): string {
  if (tsb > 15) return 'fresh'
  if (tsb >= -10) return 'optimal-training'
  if (tsb >= -30) return 'productive-load'
  return 'overreaching'
}

// The crossing rule v1 — the wedge. The SUBJECTIVE gates the objective:
//  - injury/illness is an absolute veto → red;
//  - a low readiness score can never be green, even on fresh legs;
//  - high readiness + non-negative form → green;
//  - high readiness + deeply negative form → amber (assumed hidden fatigue),
//    unless we're knowingly inside a build block where that load is the plan;
//  - a rest day reframes a low score as expected, not alarming.
export function readOfTheDaySkeleton(i: {
  tsb: number
  score: number
  lowestDrivers: string[]
  journal: JournalDay
  inBuildBlock: boolean
}): { light: Light; tsbBand: string; reason: string; vigilance: string } {
  const band = tsbBand(i.tsb)

  if (i.journal.blessure || i.journal.maladie)
    return { light: 'red', tsbBand: band, reason: 'injury/illness veto', vigilance: 'recover and seek care' }

  let light: Light
  if (i.score < 60) light = i.score < 45 ? 'red' : 'amber'
  else if (i.score >= 80 && i.tsb >= 0) light = 'green'
  else if (i.score >= 80 && i.tsb < -25) light = i.inBuildBlock ? 'green' : 'amber'
  else light = 'amber'

  if (i.journal.intent === 'rest') light = light === 'red' ? 'red' : 'green'

  const reason = i.lowestDrivers.length
    ? `dominant driver(s): ${i.lowestDrivers.join(', ')}`
    : `TSB ${i.tsb.toFixed(0)} (${band}), score ${i.score}`
  const vigilance =
    i.journal.intent === 'competition' && i.score < 80
      ? 'competition day with reduced readiness — read carefully'
      : 'self-assess against your plan'

  return { light, tsbBand: band, reason, vigilance }
}
