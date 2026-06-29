import { JournalDay, Objective, AthleteProfile } from '../domain/types.js'

// Driven port: the portable markdown "core" — profile, objectives, narrative journal.
export interface Repository {
  getProfile(): Promise<AthleteProfile>
  getObjectives(): Promise<Objective[]>
  getJournal(fromIso: string, toIso: string): Promise<JournalDay[]>
}
