// Performance Management Chart, EWMA form (the verified model, not a simple moving average).
// CTL = chronic load (fitness), ATL = acute load (fatigue), TSB = form.
// TSB is read from YESTERDAY's CTL/ATL — today's session hasn't been "absorbed" yet.
const CTL_TC = 42
const ATL_TC = 7
const dayMs = 86400000

// Recursive EWMA: value_today = value_yesterday + (TSS_today - value_yesterday) × (1/tc).
// Walk ~6 time-constants of history so the series has effectively warmed up.
function ewmaUpTo(dailyTss: Record<string, number>, end: Date, tc: number): number {
  let v = 0
  const startMs = end.getTime() - tc * 6 * dayMs
  for (let t = startMs; t <= end.getTime(); t += dayMs) {
    const key = new Date(t).toISOString().slice(0, 10)
    const tss = dailyTss[key] ?? 0
    v = v + (tss - v) * (1 / tc)
  }
  return v
}

export function computePMC(
  dailyTss: Record<string, number>,
  asOf: string,
): { ctl: number; atl: number; tsb: number } {
  const today = new Date(asOf + 'T00:00:00Z')
  const yesterday = new Date(today.getTime() - dayMs)
  const ctl = ewmaUpTo(dailyTss, yesterday, CTL_TC)
  const atl = ewmaUpTo(dailyTss, yesterday, ATL_TC)
  return { ctl, atl, tsb: ctl - atl }
}
