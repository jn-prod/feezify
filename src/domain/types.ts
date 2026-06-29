export type Sport =
  | 'Ride'
  | 'Run'
  | 'Trail'
  | 'Hike'
  | 'Swim'
  | 'Strength'
  | 'Stretch'
  | 'Meditation'
  | 'Yoga'
  | 'Surf'
  | 'SUP'
  | 'Other'

// Free-form provenance tag, e.g. 'computed:JN-hrTSS' | 'strava:relative-effort'.
export type Provenance = string

export interface Metric {
  value: number
  provenance: Provenance
  incompatible: boolean
}

export const metric = (value: number, provenance: Provenance, incompatible = false): Metric => ({
  value,
  provenance,
  incompatible,
})

export interface Activity {
  date: string
  sport: Sport
  movingTimeSec: number
  avgHr?: number
  power?: number
  np?: number
  rpe?: number // 1-10 CR-10 session-RPE
  providedTss?: Metric
}

export type DayIntent = 'training' | 'competition' | 'rest'

// Markers are 1-5, 5 = best — EXCEPT faim/soif which are scored as deviation
// from a personal normal (see AthleteProfile.faimNormal/soifNormal).
export interface Markers {
  sommeil: number
  recuperation: number
  lassitude: number
  humeur: number
  stress: number
  faim: number
  soif: number
}

export interface JournalDay {
  date: string
  intent: DayIntent
  markers: Markers
  blessure: boolean
  maladie: boolean
  hrv?: number
  poulsRepos?: number
  poids?: number
  narrative: string
}

export interface Objective {
  name: string
  sport: Sport
  startDate: string
  endDate: string
  kind: 'race' | 'camp'
}

export interface AthleteProfile {
  thresholdHr?: number
  ftp?: number
  maxHr: number
  faimNormal: number // 1-5 personal baseline
  soifNormal: number // 1-5 personal baseline
}
