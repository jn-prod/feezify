import { describe, it, expect } from 'vitest'
import { readOfTheDaySkeleton } from './reading.js'
import type { JournalDay } from './types.js'

const base: JournalDay = {
  date: '2026-06-29',
  intent: 'training',
  blessure: false,
  maladie: false,
  markers: { sommeil: 4, recuperation: 4, lassitude: 4, humeur: 4, stress: 4, faim: 3, soif: 3 },
  narrative: '',
}

describe('readOfTheDaySkeleton', () => {
  it('veto: injury → red regardless of fresh numbers', () => {
    const r = readOfTheDaySkeleton({ tsb: 20, score: 95, lowestDrivers: [], journal: { ...base, blessure: true }, inBuildBlock: false })
    expect(r.light).toBe('red')
  })
  it('signature: low score never green even if TSB fresh', () => {
    const r = readOfTheDaySkeleton({ tsb: 15, score: 55, lowestDrivers: ['sommeil'], journal: base, inBuildBlock: false })
    expect(r.light).not.toBe('green')
    expect(r.reason).toMatch(/sommeil/)
  })
  it('high score + TSB>=0 → green', () => {
    expect(readOfTheDaySkeleton({ tsb: 5, score: 85, lowestDrivers: [], journal: base, inBuildBlock: false }).light).toBe('green')
  })
  it('high score + very negative TSB → amber (assumed fatigue) unless build block', () => {
    expect(readOfTheDaySkeleton({ tsb: -28, score: 85, lowestDrivers: [], journal: base, inBuildBlock: false }).light).toBe('amber')
    expect(readOfTheDaySkeleton({ tsb: -28, score: 85, lowestDrivers: [], journal: base, inBuildBlock: true }).light).toBe('green')
  })
  it('rest-day intent: a low score is not alarming → green (unless a veto)', () => {
    const rest = { ...base, intent: 'rest' as const }
    expect(readOfTheDaySkeleton({ tsb: -5, score: 50, lowestDrivers: ['lassitude'], journal: rest, inBuildBlock: false }).light).toBe('green')
    expect(readOfTheDaySkeleton({ tsb: -5, score: 50, lowestDrivers: [], journal: { ...rest, maladie: true }, inBuildBlock: false }).light).toBe('red')
  })
})
