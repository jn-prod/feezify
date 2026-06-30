import { DataSource } from '../../ports/data-source.js'
import { Activity } from '../../domain/types.js'
import { StravaActivity, mapStravaActivity } from '../strava-shared/index.js'

export type { StravaActivity }

// The host (Claude + Strava MCP, or a local cache) provides the fetch. Injecting it
// keeps this adapter testable and infra-free.
export type FetchActivities = (fromIso: string, toIso: string) => Promise<StravaActivity[]>

// Driven adapter: Strava via an MCP/host-provided fetch. Mapping is shared (strava-shared).
export class StravaMcpDataSource implements DataSource {
  constructor(private readonly fetchActivities: FetchActivities) {}

  async getActivities(fromIso: string, toIso: string): Promise<Activity[]> {
    const raw = await this.fetchActivities(fromIso, toIso)
    return raw.map(mapStravaActivity)
  }
}
