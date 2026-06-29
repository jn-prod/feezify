import { describe, it, expect } from 'vitest'
import { computeSubjectiveScore } from './subjective.js'
import type { Markers, AthleteProfile } from './types.js'

const p = { maxHr: 190, faimNormal: 3, soifNormal: 3 } as AthleteProfile
const good: Markers = { sommeil: 5, recuperation: 5, lassitude: 5, humeur: 5, stress: 5, faim: 3, soif: 3 }

describe('computeSubjectiveScore', () => {
  it('all-good (markers maxed, faim/soif at normal) ≈ 100', () => {
    expect(computeSubjectiveScore(good, p).score).toBe(100)
  })
  it('penalizes faim/soif deviation in BOTH directions', () => {
    const tooMuch = { ...good, faim: 5 } // far from normal=3
    const tooLittle = { ...good, faim: 1 }
    expect(computeSubjectiveScore(tooMuch, p).score).toBeLessThan(100)
    expect(computeSubjectiveScore(tooLittle, p).score).toBeLessThan(100)
  })
  it('reports lowest drivers', () => {
    const m = { ...good, sommeil: 1, recuperation: 2 }
    expect(computeSubjectiveScore(m, p).lowestDrivers).toContain('sommeil')
  })
})
