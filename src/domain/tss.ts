import { Activity, AthleteProfile, Metric, metric } from './types.js'

// Foster session-RPE (CR-10) → training load per hour. Index = rounded RPE (1-10).
const RPE_PER_HOUR = [0, 20, 30, 40, 50, 60, 70, 80, 100, 120, 140]

// Fallback order: provided-same-definition > power > hrTSS > session-RPE.
// An incompatible provided metric with no raw fallback is taken but stays flagged.
export function computeTSS(a: Activity, profile: AthleteProfile): Metric {
  if (a.providedTss && !a.providedTss.incompatible) return a.providedTss

  const hours = a.movingTimeSec / 3600

  if (a.power && profile.ftp) {
    // power-based (canonical): TSS = hours × IF² × 100
    const np = a.np ?? a.power
    const intensity = np / profile.ftp
    return metric((a.movingTimeSec * np * intensity) / (profile.ftp * 3600) * 100, 'computed:JN-power')
  }

  if (a.avgHr && profile.thresholdHr) {
    const intensity = a.avgHr / profile.thresholdHr
    return metric(
      (a.movingTimeSec * a.avgHr * intensity) / (profile.thresholdHr * 3600) * 100,
      'computed:JN-hrTSS',
    )
  }

  if (a.rpe && a.rpe >= 1 && a.rpe <= 10) {
    return metric(RPE_PER_HOUR[Math.round(a.rpe)] * hours, 'computed:JN-rpeTSS')
  }

  if (a.providedTss) return { ...a.providedTss } // incompatible but logged (no raw to recompute)

  return metric(0, 'none', true)
}
