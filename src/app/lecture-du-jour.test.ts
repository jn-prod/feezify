import { describe, it, expect } from 'vitest'
import { makeLectureDuJour } from './lecture-du-jour.js'
import type { DataSource } from '../ports/data-source.js'
import type { Repository } from '../ports/repository.js'
import type { Activity, JournalDay } from '../domain/types.js'

const dayMs = 86400000
const iso = (i: number) => new Date(Date.UTC(2026, 0, 1) + i * dayMs).toISOString().slice(0, 10)
const TODAY = iso(150)

const fakeSource: DataSource = {
  async getActivities() {
    const acts: Activity[] = []
    for (let i = 0; i <= 150; i++)
      acts.push({ date: iso(i), sport: 'Run', movingTimeSec: 3600, avgHr: 160 }) // ~100 TSS/day
    return acts
  },
}

const fakeRepo: Repository = {
  async getProfile() {
    return { maxHr: 190, thresholdHr: 160, faimNormal: 3, soifNormal: 3 }
  },
  async getObjectives() {
    return []
  },
  async getJournal(): Promise<JournalDay[]> {
    return [
      { date: iso(148), intent: 'training', blessure: false, maladie: false, narrative: 'felt strong, long climb', markers: { sommeil: 4, recuperation: 4, lassitude: 4, humeur: 4, stress: 4, faim: 3, soif: 3 } },
      { date: iso(149), intent: 'training', blessure: false, maladie: false, narrative: 'a bit tired in the legs', markers: { sommeil: 3, recuperation: 3, lassitude: 3, humeur: 4, stress: 3, faim: 3, soif: 3 } },
      { date: TODAY, intent: 'training', blessure: false, maladie: false, narrative: 'short night, heavy legs, no pain', markers: { sommeil: 2, recuperation: 2, lassitude: 3, humeur: 3, stress: 3, faim: 3, soif: 3 } },
    ]
  },
}

describe('makeLectureDuJour', () => {
  it('produces a coherent DayReading', async () => {
    const lecture = makeLectureDuJour({ source: fakeSource, repo: fakeRepo })
    const r = await lecture(TODAY)
    expect(r.date).toBe(TODAY)
    expect(typeof r.tsb).toBe('number')
    // poor sleep/recovery pulls readiness down but not to a veto → amber, not green
    expect(r.score).toBeGreaterThan(0)
    expect(r.score).toBeLessThan(80)
    expect(r.light).toBe('amber')
    expect(r.recentNarrative.length).toBeGreaterThan(0)
    expect(r.recentNarrative.some((n) => n.includes(TODAY))).toBe(true)
    expect(r.tsbProvenance).toContain('computed:JN-hrTSS') // recomputed from raw HR
  })
})
