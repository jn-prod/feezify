import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { MarkdownRepository } from './index.js'

const coreDir = fileURLToPath(new URL('../../../test/fixtures/core', import.meta.url))
const repo = new MarkdownRepository(coreDir)

describe('MarkdownRepository', () => {
  it('parses profile', async () => {
    const p = await repo.getProfile()
    expect(p.maxHr).toBe(190)
    expect(p.thresholdHr).toBe(160)
    expect(p.faimNormal).toBe(3)
  })

  it('parses objectives', async () => {
    const objs = await repo.getObjectives()
    expect(objs).toHaveLength(1)
    expect(objs[0].kind).toBe('camp')
    expect(objs[0].sport).toBe('Ride')
  })

  it('parses a journal day with markers + narrative', async () => {
    const days = await repo.getJournal('2026-06-29', '2026-06-29')
    expect(days).toHaveLength(1)
    expect(days[0].intent).toBe('training')
    expect(days[0].markers.sommeil).toBe(4)
    expect(days[0].hrv).toBe(65)
    expect(days[0].narrative.length).toBeGreaterThan(0)
  })

  it('filters journal by date range', async () => {
    const days = await repo.getJournal('2026-06-30', '2026-07-05')
    expect(days).toHaveLength(0)
  })
})
