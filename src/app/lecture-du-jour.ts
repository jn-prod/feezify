import { DataSource } from '../ports/data-source.js'
import { Repository } from '../ports/repository.js'
import { DayReading, LectureDuJour } from '../ports/use-cases.js'
import { computeTSS } from '../domain/tss.js'
import { computePMC } from '../domain/pmc.js'
import { computeSubjectiveScore } from '../domain/subjective.js'
import { readOfTheDaySkeleton } from '../domain/reading.js'
import { JournalDay, Markers } from '../domain/types.js'

const dayMs = 86400000
const LOOKBACK_DAYS = 200 // enough EWMA warm-up for the 42-day CTL constant
const RECENT_DAYS = 7

const shift = (iso: string, days: number) =>
  new Date(new Date(iso + 'T00:00:00Z').getTime() + days * dayMs).toISOString().slice(0, 10)

const neutralMarkers: Markers = { sommeil: 3, recuperation: 3, lassitude: 3, humeur: 3, stress: 3, faim: 3, soif: 3 }

// Composition root for the v1 skill: pull raw activities + the markdown core, run the
// pure domain (TSS → PMC → subjective → crossing rule), and hand the skeleton + the
// recent narrative to the driving adapter (the LLM writes the actual read).
export function makeLectureDuJour(deps: { source: DataSource; repo: Repository }): LectureDuJour {
  return async (date: string): Promise<DayReading> => {
    const from = shift(date, -LOOKBACK_DAYS)
    const [profile, activities, journal, objectives] = await Promise.all([
      deps.repo.getProfile(),
      deps.source.getActivities(from, date),
      deps.repo.getJournal(from, date),
      deps.repo.getObjectives(),
    ])

    const dailyTss: Record<string, number> = {}
    const provenances = new Set<string>()
    let tookIncompatible = false
    for (const a of activities) {
      const m = computeTSS(a, profile)
      dailyTss[a.date] = (dailyTss[a.date] ?? 0) + m.value
      if (m.provenance !== 'none') provenances.add(m.provenance)
      // Genuinely "took an incompatible provider value" — not the no-data case
      // (a Yoga with no HR contributes 0 load, which is fine, not incompatible).
      if (m.incompatible && m.provenance !== 'none') tookIncompatible = true
    }

    const { tsb } = computePMC(dailyTss, date)

    const today: JournalDay | undefined = journal.find((d) => d.date === date)
    const markers = today?.markers ?? neutralMarkers
    const { score, lowestDrivers } = computeSubjectiveScore(markers, profile)

    const inBuildBlock = objectives.some(
      (o) => o.kind === 'camp' && date >= o.startDate && date <= o.endDate,
    )

    const journalForRead: JournalDay = today ?? {
      date,
      intent: 'training',
      markers: neutralMarkers,
      blessure: false,
      maladie: false,
      narrative: '',
    }

    const skeleton = readOfTheDaySkeleton({ tsb, score, lowestDrivers, journal: journalForRead, inBuildBlock })

    const recentFrom = shift(date, -RECENT_DAYS)
    const recentNarrative = journal
      .filter((d) => d.date >= recentFrom && d.date <= date && d.narrative.length > 0)
      .map((d) => `${d.date}: ${d.narrative}`)

    const tsbProvenance = tookIncompatible
      ? `mixed — incompatible source taken (flagged): ${[...provenances].join(', ')}`
      : [...provenances].join(', ') || 'none'

    return {
      date,
      light: skeleton.light,
      tsb,
      tsbProvenance,
      score,
      reason: skeleton.reason,
      vigilance: skeleton.vigilance,
      recentNarrative,
    }
  }
}
