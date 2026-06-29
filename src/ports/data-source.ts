import { Activity } from '../domain/types.js'

// Driven port: a provider of training activities. Strava is one adapter, not special.
export interface DataSource {
  getActivities(fromIso: string, toIso: string): Promise<Activity[]>
}
