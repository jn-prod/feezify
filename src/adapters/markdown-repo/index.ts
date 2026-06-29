import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import { Repository } from '../../ports/repository.js'
import { AthleteProfile, JournalDay, Objective, Sport, DayIntent } from '../../domain/types.js'

const sport = z.enum([
  'Ride', 'Run', 'Trail', 'Hike', 'Swim', 'Strength',
  'Stretch', 'Meditation', 'Yoga', 'Surf', 'SUP', 'Other',
]) satisfies z.ZodType<Sport>

const profileSchema = z.object({
  maxHr: z.number(),
  thresholdHr: z.number().optional(),
  ftp: z.number().optional(),
  faimNormal: z.number().min(1).max(5),
  soifNormal: z.number().min(1).max(5),
})

// YAML parses unquoted `2026-07-20` into a Date; accept both and normalize to ISO.
const isoDate = z
  .union([z.string(), z.date()])
  .transform((d) => (typeof d === 'string' ? d : d.toISOString().slice(0, 10)))

const objectivesSchema = z.object({
  objectives: z.array(
    z.object({
      name: z.string(),
      sport,
      startDate: isoDate,
      endDate: isoDate,
      kind: z.enum(['race', 'camp']),
    }),
  ),
})

const marker = z.number().min(1).max(5)
const journalSchema = z.object({
  intent: z.enum(['training', 'competition', 'rest']) satisfies z.ZodType<DayIntent>,
  blessure: z.boolean(),
  maladie: z.boolean(),
  hrv: z.number().optional(),
  poulsRepos: z.number().optional(),
  poids: z.number().optional(),
  markers: z.object({
    sommeil: marker, recuperation: marker, lassitude: marker,
    humeur: marker, stress: marker, faim: marker, soif: marker,
  }),
})

// Driven adapter: the portable markdown core on disk. Front-matter = structured
// state (validated with zod), body = the narrative coaching memory.
export class MarkdownRepository implements Repository {
  constructor(private readonly coreDir: string) {}

  async getProfile(): Promise<AthleteProfile> {
    const { data } = matter(await readFile(join(this.coreDir, 'profil.md'), 'utf8'))
    return profileSchema.parse(data)
  }

  async getObjectives(): Promise<Objective[]> {
    const { data } = matter(await readFile(join(this.coreDir, 'objectifs.md'), 'utf8'))
    return objectivesSchema.parse(data).objectives
  }

  async getJournal(fromIso: string, toIso: string): Promise<JournalDay[]> {
    const dir = join(this.coreDir, 'journal')
    let files: string[]
    try {
      files = await readdir(dir)
    } catch {
      return []
    }
    const days: JournalDay[] = []
    for (const f of files.filter((f) => f.endsWith('.md'))) {
      const date = f.replace(/\.md$/, '')
      if (date < fromIso || date > toIso) continue
      const { data, content } = matter(await readFile(join(dir, f), 'utf8'))
      const fm = journalSchema.parse(data)
      days.push({ date, narrative: content.trim(), ...fm })
    }
    return days.sort((a, b) => a.date.localeCompare(b.date))
  }
}
