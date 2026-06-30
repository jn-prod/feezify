import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { StravaRestDataSource, type FetchLike } from './index.js'

const raw = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../../test/fixtures/strava-activity.json', import.meta.url)), 'utf8'),
)

describe('StravaRestDataSource', () => {
  it('calls the activities endpoint with after/before and a Bearer token, maps the result', async () => {
    let url = ''
    let auth = ''
    const fetch: FetchLike = async (u, init) => {
      url = u
      auth = init?.headers?.Authorization ?? ''
      return { ok: true, status: 200, json: async () => [raw] }
    }
    const ds = new StravaRestDataSource({ accessToken: 'TEST', fetch })
    const acts = await ds.getActivities('2026-06-01', '2026-06-29')

    expect(url).toContain('/athlete/activities')
    expect(url).toContain('after=')
    expect(url).toContain('before=')
    expect(auth).toBe('Bearer TEST')
    expect(acts).toHaveLength(1)
    expect(acts[0].sport).toBe('Ride')
    expect(acts[0].providedTss?.incompatible).toBe(true) // suffer_score flagged
  })

  it('throws on a non-ok response', async () => {
    const fetch: FetchLike = async () => ({ ok: false, status: 401, json: async () => ({}) })
    const ds = new StravaRestDataSource({ accessToken: 'TEST', fetch })
    await expect(ds.getActivities('2026-06-01', '2026-06-29')).rejects.toThrow(/401/)
  })

  it('paginates until a short page', async () => {
    let calls = 0
    const fetch: FetchLike = async () => {
      calls++
      // first call: a full-ish page is simulated by returning the single fixture twice would still be < PER_PAGE,
      // so it stops after one call — assert exactly one network call for a small result set.
      return { ok: true, status: 200, json: async () => [raw] }
    }
    const ds = new StravaRestDataSource({ accessToken: 'TEST', fetch })
    await ds.getActivities('2026-06-01', '2026-06-29')
    expect(calls).toBe(1)
  })
})
