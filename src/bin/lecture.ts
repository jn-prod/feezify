#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { makeLectureDuJour } from '../app/lecture-du-jour.js'
import { MarkdownRepository } from '../adapters/markdown-repo/index.js'
import { StravaMcpDataSource } from '../adapters/strava-mcp/index.js'
import { StravaRestDataSource } from '../adapters/strava-rest/index.js'
import type { DataSource } from '../ports/data-source.js'

const [, , coreDir, date] = process.argv
if (!coreDir || !date) {
  console.error('usage: feezify-lecture <coreDir> <YYYY-MM-DD>')
  process.exit(2)
}

// Choose the Strava source. If a token is in the environment (from .env — never hard-coded;
// run e.g. `node --env-file=.env dist/lecture.js …`), hit the REST API. Otherwise fall back
// to an optional local cache <coreDir>/activities.json (Strava-shaped array). No infra either way.
const token = process.env.STRAVA_ACCESS_TOKEN
const source: DataSource = token
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
const reading = await lecture(date)
console.log(JSON.stringify(reading, null, 2))
