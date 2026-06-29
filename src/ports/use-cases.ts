import { Light } from '../domain/reading.js'

// The driving port output: everything the skill needs to write the day's read.
export interface DayReading {
  date: string
  light: Light
  tsb: number
  tsbProvenance: string
  score: number
  reason: string
  vigilance: string
  recentNarrative: string[]
}

// Driving port: "read me today".
export type LectureDuJour = (date: string) => Promise<DayReading>
