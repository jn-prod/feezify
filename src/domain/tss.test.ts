import { describe, it, expect } from 'vitest'
import { computeTSS } from './tss.js'
import type { Activity, AthleteProfile } from './types.js'

const profile: AthleteProfile = { thresholdHr: 160, maxHr: 190, faimNormal: 3, soifNormal: 3 }

describe('computeTSS', () => {
  it('uses provided TSS of same definition as fast-path', () => {
    const a = {
      date: '2026-06-29',
      sport: 'Ride',
      movingTimeSec: 3600,
      providedTss: { value: 70, provenance: 'computed:JN-hrTSS', incompatible: false },
    } as Activity
    expect(computeTSS(a, profile).value).toBe(70)
  })
  it('falls back to hrTSS from raw HR when no power', () => {
    const a = { date: '2026-06-29', sport: 'Ride', movingTimeSec: 3600, avgHr: 160 } as Activity
    const m = computeTSS(a, profile)
    expect(Math.round(m.value)).toBe(100) // 1h at threshold ≈ 100
    expect(m.provenance).toBe('computed:JN-hrTSS')
  })
  it('falls back to session-RPE (Foster) when no HR/power', () => {
    const a = { date: '2026-06-29', sport: 'Run', movingTimeSec: 3600, rpe: 5 } as Activity
    expect(computeTSS(a, profile).value).toBe(60) // RPE5 -> 60/h * 1h
    expect(computeTSS(a, profile).provenance).toBe('computed:JN-rpeTSS')
  })
  it('takes an incompatible provided metric (no raw) but keeps the flag', () => {
    const a = {
      date: '2026-06-29',
      sport: 'Ride',
      movingTimeSec: 3600,
      providedTss: { value: 88, provenance: 'strava:relative-effort', incompatible: true },
    } as Activity
    const m = computeTSS(a, profile)
    expect(m.value).toBe(88)
    expect(m.incompatible).toBe(true)
  })
})
