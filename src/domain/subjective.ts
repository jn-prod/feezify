import { Markers, AthleteProfile } from './types.js'

// Subjective readiness ≈ Hooper-style index. Direct markers contribute m/5 (5 = best).
// faim/soif are NOT "more is better" — they are scored as deviation from a personal
// normal: 1 - |x - normal| / 4 (a swing of 4 from normal → 0).
export function computeSubjectiveScore(
  m: Markers,
  p: AthleteProfile,
): { score: number; lowestDrivers: string[] } {
  const direct: [string, number][] = [
    ['sommeil', m.sommeil],
    ['recuperation', m.recuperation],
    ['lassitude', m.lassitude],
    ['humeur', m.humeur],
    ['stress', m.stress],
  ]
  const devFaim = 1 - Math.abs(m.faim - p.faimNormal) / 4
  const devSoif = 1 - Math.abs(m.soif - p.soifNormal) / 4

  const parts: [string, number][] = [
    ...direct.map(([k, v]) => [k, v / 5] as [string, number]),
    ['faim', devFaim],
    ['soif', devSoif],
  ]

  const score = Math.round((parts.reduce((s, [, v]) => s + v, 0) / parts.length) * 100)
  const lowestDrivers = parts
    .filter(([, v]) => v <= 0.5)
    .sort((a, b) => a[1] - b[1])
    .map(([k]) => k)

  return { score, lowestDrivers }
}
