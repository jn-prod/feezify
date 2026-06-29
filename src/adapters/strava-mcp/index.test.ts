import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { StravaMcpDataSource } from './index.js'

const raw = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../../test/fixtures/strava-activity.json', import.meta.url)), 'utf8'),
)

describe('StravaMcpDataSource', () => {
  it('maps a strava activity to a domain Activity', async () => {
    const ds = new StravaMcpDataSource(async () => [raw])
    const [a] = await ds.getActivities('2026-06-01', '2026-06-29')
    expect(a.sport).toBe('Ride')
    expect(a.date).toBe('2026-06-29')
    expect(a.movingTimeSec).toBe(5400)
    expect(Math.round(a.avgHr!)).toBe(152)
  })

  it('flags strava "relative effort" as an incompatible provided metric', async () => {
    const ds = new StravaMcpDataSource(async () => [raw])
    const [a] = await ds.getActivities('2026-06-01', '2026-06-29')
    expect(a.providedTss).toBeDefined()
    expect(a.providedTss!.value).toBe(96)
    expect(a.providedTss!.provenance).toBe('strava:relative-effort')
    expect(a.providedTss!.incompatible).toBe(true)
  })

  it('maps Yoga (multi-sport native)', async () => {
    const ds = new StravaMcpDataSource(async () => [{ ...raw, type: 'Yoga', sport_type: 'Yoga', average_heartrate: undefined }])
    const [a] = await ds.getActivities('2026-06-01', '2026-06-29')
    expect(a.sport).toBe('Yoga')
  })
})
