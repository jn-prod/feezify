import { describe, it, expect } from 'vitest'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readConfig } from './index.js'

async function coreWith(yml?: string): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'feezify-config-'))
  if (yml !== undefined) await writeFile(join(dir, 'config.yml'), yml)
  return dir
}

describe('readConfig', () => {
  it('defaults when config.yml is missing: no connector consented', async () => {
    const cfg = await readConfig(await coreWith())
    expect(cfg.connectors).toEqual({})
  })

  it('parses connector consent booleans', async () => {
    const cfg = await readConfig(await coreWith('connectors:\n  strava: true\n'))
    expect(cfg.connectors.strava).toBe(true)
  })

  it('treats absent connector as not consented (template default)', async () => {
    const cfg = await readConfig(await coreWith('connectors:\n  strava: false\n'))
    expect(cfg.connectors.strava).toBe(false)
    expect(cfg.connectors.garmin).toBeUndefined()
  })

  it('still reads a config.yml written by an older version', async () => {
    const cfg = await readConfig(await coreWith('connectors:\n  strava: true\nsupport:\n  remind: true\n'))
    expect(cfg).toEqual({ connectors: { strava: true } })
  })
})
