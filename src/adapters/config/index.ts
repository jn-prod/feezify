import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { load } from 'js-yaml'
import { z } from 'zod'

const configSchema = z.object({
  connectors: z.record(z.boolean()).default({}),
  support: z.object({ remind: z.boolean().default(true) }).default({ remind: true }),
})

export type FeezifyConfig = z.infer<typeof configSchema>

// Driven adapter: the consent ledger (`<coreDir>/config.yml`). A connector that is
// `false` or absent = not consented — callers must not exchange data with that third
// party (AGENTS.md → Consent). Missing file = the safe default: nothing consented.
export async function readConfig(coreDir: string): Promise<FeezifyConfig> {
  let raw: string
  try {
    raw = await readFile(join(coreDir, 'config.yml'), 'utf8')
  } catch {
    return configSchema.parse({})
  }
  return configSchema.parse(load(raw) ?? {})
}
