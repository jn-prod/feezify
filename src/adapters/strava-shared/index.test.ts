import { describe, it, expect } from 'vitest'
import { mapStravaActivity } from './index.js'

describe('mapStravaActivity — date field tolerance (official Strava MCP connector)', () => {
  it('falls back to start_date (UTC) when start_date_local is absent', () => {
    const a = mapStravaActivity({ start_date: '2026-07-01T06:30:00Z', type: 'Ride', moving_time: 3600 })
    expect(a.date).toBe('2026-07-01')
    expect(a.sport).toBe('Ride')
  })

  it('prefers start_date_local when both are present', () => {
    const a = mapStravaActivity({
      start_date_local: '2026-07-02T23:30:00Z',
      start_date: '2026-07-03T06:30:00Z',
      sport_type: 'GravelRide',
      moving_time: 1800,
    })
    expect(a.date).toBe('2026-07-02')
    expect(a.sport).toBe('Ride')
  })

  it('throws a clear error when no date field is present', () => {
    expect(() => mapStravaActivity({ type: 'Run', moving_time: 600 } as never)).toThrow(/start_date/)
  })
})
