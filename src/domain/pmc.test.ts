import { describe, it, expect } from 'vitest'
import { computePMC } from './pmc.js'

// UTC-anchored day helper so keys match computePMC's UTC stepping regardless of host TZ.
const dayMs = 86400000
const base = Date.UTC(2026, 0, 1)
const iso = (i: number) => new Date(base + i * dayMs).toISOString().slice(0, 10)

describe('computePMC (EWMA 42/7, TSB from yesterday)', () => {
  it('converges to constant load and TSB→0', () => {
    const series: Record<string, number> = {}
    for (let i = 0; i < 320; i++) series[iso(i)] = 100 // > 6 CTL time-constants of warm-up
    const { ctl, atl, tsb } = computePMC(series, iso(315))
    expect(Math.round(ctl)).toBe(100)
    expect(Math.round(atl)).toBe(100)
    expect(Math.abs(tsb)).toBeLessThan(1) // steady state → TSB ≈ 0
  })

  it('TSB is positive after a rest week (fresh)', () => {
    const series: Record<string, number> = {}
    for (let i = 0; i < 200; i++) series[iso(i)] = 100
    for (let i = 200; i < 210; i++) series[iso(i)] = 0
    const { tsb } = computePMC(series, iso(210))
    expect(tsb).toBeGreaterThan(15) // fatigue (ATL) dropped faster than fitness (CTL)
  })
})
