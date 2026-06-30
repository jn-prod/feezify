import { Activity, Sport, metric } from '../../domain/types.js'

// Shape of a Strava activity (only the fields we read). Same in the REST API and via MCP.
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

export function toSport(s?: string): Sport {
  return (s && SPORT_MAP[s]) || 'Other'
}

// One mapping, shared by every Strava adapter (MCP, REST, …). "Relative effort"
// (suffer_score) is a different definition than our TSS, so we take it but flag it
// incompatible — the domain prefers recomputing from raw HR/power when possible.
export function mapStravaActivity(r: StravaActivity): Activity {
  const power = r.weighted_average_watts ?? r.average_watts
  return {
    date: r.start_date_local.slice(0, 10),
    sport: toSport(r.sport_type ?? r.type),
    movingTimeSec: r.moving_time,
    avgHr: r.average_heartrate,
    power: r.device_watts ? power : undefined,
    np: r.device_watts ? r.weighted_average_watts : undefined,
    providedTss:
      r.suffer_score != null ? metric(r.suffer_score, 'strava:relative-effort', true) : undefined,
  }
}
