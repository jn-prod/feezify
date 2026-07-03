#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { makeLectureDuJour } from '../app/lecture-du-jour.js'
import { MarkdownRepository } from '../adapters/markdown-repo/index.js'
import { StravaMcpDataSource } from '../adapters/strava-mcp/index.js'
import { StravaRestDataSource } from '../adapters/strava-rest/index.js'
import { readConfig } from '../adapters/config/index.js'
import type { DataSource } from '../ports/data-source.js'

const [, , coreDir, date] = process.argv
if (!coreDir || !date) {
  console.error('usage: feezify-lecture <coreDir> <YYYY-MM-DD>')
  process.exit(2)
}

// Choose the Strava source — consent first (AGENTS.md → Consent): the REST API is a
// third-party exchange, so it is used only when BOTH hold: `connectors.strava: true` in
// <coreDir>/config.yml AND a token is in the environment (from .env — never hard-coded;
// run e.g. `node --env-file=.env dist/lecture.js …`). Otherwise fall back to an optional
// local cache <coreDir>/activities.json (Strava-shaped array) — a local read needs no
// consent. No infra either way.
const config = await readConfig(coreDir)
const token = process.env.STRAVA_ACCESS_TOKEN
if (token && !config.connectors.strava) {
  console.error(
    'note: STRAVA_ACCESS_TOKEN is set but `connectors.strava` is not `true` in config.yml — ' +
      'Strava not used (consent). Reading the local activities.json cache instead, if present.',
  )
}
const source: DataSource =
  token && config.connectors.strava
    ? new StravaRestDataSource({ accessToken: token })
    : new StravaMcpDataSource(async () => {
        try {
          return JSON.parse(await readFile(join(coreDir, 'activities.json'), 'utf8'))
        } catch {
          return []
        }
      })

const repo = new MarkdownRepository(coreDir)
const lecture = makeLectureDuJour({ source, repo })
try {
  const reading = await lecture(date)
  console.log(JSON.stringify(reading, null, 2))
} catch (err) {
  console.error(`error: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
}
