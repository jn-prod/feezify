import { DataSource } from '../../ports/data-source.js'
import { Activity, Sport, metric } from '../../domain/types.js'

// Shape of a Strava activity (only the fields we read).
export interface StravaActivity {
  type?: string
  sport_type?: string
  start_date_local: string
  moving_time: number
  average_heartrate?: number
  average_watts?: number
  weighted_average_watts?: number
  device_watts?: boolean
  suffer_score?: number
}

// The host (Claude + Strava MCP, or a local cache) provides the fetch. Injecting it
// keeps this adapter testable and infra-free.
export type FetchActivities = (fromIso: string, toIso: string) => Promise<StravaActivity[]>

const SPORT_MAP: Record<string, Sport> = {
  Ride: 'Ride', VirtualRide: 'Ride', EBikeRide: 'Ride', MountainBikeRide: 'Ride', GravelRide: 'Ride',
  Run: 'Run', VirtualRun: 'Run', TrailRun: 'Trail',
  Hike: 'Hike', Walk: 'Hike',
  Swim: 'Swim',
  WeightTraining: 'Strength', Workout: 'Strength', Crossfit: 'Strength',
  Yoga: 'Yoga', Pilates: 'Stretch',
  Surfing: 'Surf', StandUpPaddling: 'SUP',
  Meditation: 'Meditation',
}

function toSport(s?: string): Sport {
  return (s && SPORT_MAP[s]) || 'Other'
}

// Driven adapter: Strava is one provider among many. "Relative effort" (suffer_score)
// is a different definition than our TSS, so we take it but flag it incompatible —
// the domain will prefer recomputing from raw HR/power when possible.
export class StravaMcpDataSource implements DataSource {
  constructor(private readonly fetchActivities: FetchActivities) {}

  async getActivities(fromIso: string, toIso: string): Promise<Activity[]> {
    const raw = await this.fetchActivities(fromIso, toIso)
    return raw.map((r): Activity => {
      const power = r.weighted_average_watts ?? r.average_watts
      return {
        date: r.start_date_local.slice(0, 10),
        sport: toSport(r.sport_type ?? r.type),
        movingTimeSec: r.moving_time,
        avgHr: r.average_heartrate,
        power: r.device_watts ? power : undefined,
        np: r.device_watts ? r.weighted_average_watts : undefined,
        providedTss:
          r.suffer_score != null
            ? metric(r.suffer_score, 'strava:relative-effort', true)
            : undefined,
      }
    })
  }
}
