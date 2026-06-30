import { DataSource } from '../../ports/data-source.js'
import { Activity } from '../../domain/types.js'
import { StravaActivity, mapStravaActivity } from '../strava-shared/index.js'

// Minimal fetch shape we depend on (so tests can inject a fake without DOM/Node fetch types).
export type FetchLike = (
  url: string,
  init?: { headers?: Record<string, string> },
) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>

export interface StravaRestOptions {
  accessToken: string
  fetch?: FetchLike
  baseUrl?: string
}

const PER_PAGE = 200
const MAX_PAGES = 10
const DAY = 86400

// Driven adapter: Strava via the public REST API (https://developers.strava.com).
// The OAuth access token comes from the composition root (read from .env), never hard-coded.
// Mapping is shared with the MCP adapter (strava-shared).
export class StravaRestDataSource implements DataSource {
  private readonly accessToken: string
  private readonly fetch: FetchLike
  private readonly baseUrl: string

  constructor(opts: StravaRestOptions) {
    this.accessToken = opts.accessToken
    this.fetch = opts.fetch ?? (globalThis.fetch as unknown as FetchLike)
    this.baseUrl = opts.baseUrl ?? 'https://www.strava.com/api/v3'
  }

  async getActivities(fromIso: string, toIso: string): Promise<Activity[]> {
    const after = Math.floor(Date.parse(fromIso + 'T00:00:00Z') / 1000)
    const before = Math.floor(Date.parse(toIso + 'T00:00:00Z') / 1000) + DAY // include the whole `toIso` day
    const out: Activity[] = []

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `${this.baseUrl}/athlete/activities?after=${after}&before=${before}&page=${page}&per_page=${PER_PAGE}`
      const res = await this.fetch(url, { headers: { Authorization: `Bearer ${this.accessToken}` } })
      if (!res.ok) throw new Error(`Strava REST API error ${res.status}`)
      const batch = (await res.json()) as StravaActivity[]
      if (!Array.isArray(batch) || batch.length === 0) break
      out.push(...batch.map(mapStravaActivity))
      if (batch.length < PER_PAGE) break
    }
    return out
  }
}
