#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { makeLectureDuJour } from '../app/lecture-du-jour.js'
import { MarkdownRepository } from '../adapters/markdown-repo/index.js'
import { StravaMcpDataSource } from '../adapters/strava-mcp/index.js'

const [, , coreDir, date] = process.argv
if (!coreDir || !date) {
  console.error('usage: feezify-lecture <coreDir> <YYYY-MM-DD>')
  process.exit(2)
}

// Activities are provided by the host (e.g. the Strava MCP, wired by the skill).
// For a standalone run, read an optional local cache: <coreDir>/activities.json
// (an array of Strava-shaped activities). No network, no infra.
const source = new StravaMcpDataSource(async () => {
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
