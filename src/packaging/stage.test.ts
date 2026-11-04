import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { stageSkillDir } from './stage.js'

const SOURCES: Record<string, string> = {
  'src/adapters/claude-skill-zip/SKILL.md': 'skill',
  'src/adapters/claude-skill/method.md': 'method',
  'packaging/scripts/lecture.js': 'lecture',
  'packaging/scripts/memory-guard.js': 'guard',
  'core-template/profil.md': 'profil',
  'core-template/journal/.gitkeep': '',
  LICENSE: 'license',
}

describe('stageSkillDir', () => {
  let root: string
  let stage: string

  const write = async (files: Record<string, string>) => {
    for (const [path, content] of Object.entries(files)) {
      await mkdir(dirname(join(root, path)), { recursive: true })
      await writeFile(join(root, path), content)
    }
  }

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'feezify-stage-'))
    stage = join(root, 'packaging', 'stage')
    await mkdir(stage, { recursive: true })
  })

  afterEach(() => rm(root, { recursive: true, force: true }))

  it('lays out the skill the way its SKILL.md describes', async () => {
    await write(SOURCES)
    const staged = await stageSkillDir(root, stage)
    expect(staged).toEqual([
      'LICENSE',
      'SKILL.md',
      'core-template/journal/.gitkeep',
      'core-template/profil.md',
      'method.md',
      'scripts/lecture.js',
      'scripts/memory-guard.js',
    ])
    expect(await readFile(join(stage, 'SKILL.md'), 'utf8')).toBe('skill')
    expect(await readFile(join(stage, 'scripts/lecture.js'), 'utf8')).toBe('lecture')
  })

  it('fails when the bundle has not been built', async () => {
    const { 'packaging/scripts/lecture.js': _bundle, ...rest } = SOURCES
    await write(rest)
    await expect(stageSkillDir(root, stage)).rejects.toThrow(/lecture\.js/)
  })
})
