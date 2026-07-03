#!/usr/bin/env node
// Assembles the distributable claude.ai skill zip: packaging/feezify-skill-<version>.zip
// Prereq: `pnpm build:bundle` (self-contained scripts). Run via `pnpm package:skill`.
// Node ≥ 23.6 (native type stripping) — the repo targets Node ≥ 20 for the *product*,
// packaging is a maintainer task. Zip is built with fflate (no system `zip` needed).
import { rm, mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { zipSync } from 'fflate'
import { stageSkillDir } from '../src/packaging/stage.ts'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const { version } = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const stageRoot = join(root, 'packaging', 'stage')

await rm(stageRoot, { recursive: true, force: true })
await mkdir(stageRoot, { recursive: true })
const staged = await stageSkillDir(root, stageRoot)

const entries = {}
for (const rel of staged) entries[rel] = new Uint8Array(await readFile(join(stageRoot, rel)))
const zipName = `feezify-skill-${version}.zip`
await writeFile(join(root, 'packaging', zipName), zipSync(entries, { level: 9 }))
console.log(`staged ${staged.length} files → packaging/${zipName}`)
