import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import matter from 'gray-matter'
import { computeChecksum, guardCheck, guardCommit } from './index.js'

describe('computeChecksum', () => {
  it('is deterministic for the same body', () => {
    expect(computeChecksum('hello')).toBe(computeChecksum('hello'))
  })

  it('differs for different bodies', () => {
    expect(computeChecksum('hello')).not.toBe(computeChecksum('world'))
  })
})

describe('guardCheck / guardCommit', () => {
  let dir: string
  let file: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'feezify-memory-guard-'))
    file = join(dir, 'athlete.md')
    await writeFile(file, '---\nupdated: 2026-06-29\nsources: []\n---\n\n# Athlete model\n')
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('reports no drift when the page has never been committed', async () => {
    const result = await guardCheck(file)
    expect(result.drift).toBe(false)
  })

  it('reports no drift when the on-disk checksum matches the last commit', async () => {
    await guardCommit(file)
    const result = await guardCheck(file)
    expect(result.drift).toBe(false)
  })

  it('detects drift and backs up the file when it changed since the last commit', async () => {
    await guardCommit(file)
    // Simulate a hand-edit: only the body changes, the checksum front-matter is left untouched.
    const committed = await readFile(file, 'utf8')
    await writeFile(file, `${committed}\nhand-edited\n`)

    const result = await guardCheck(file)

    expect(result.drift).toBe(true)
    expect(result.backupPath).toBeDefined()
    const backup = await readFile(result.backupPath!, 'utf8')
    expect(backup).toContain('hand-edited')
  })

  it('records a checksum and a written_at timestamp on commit', async () => {
    const { checksum, writtenAt } = await guardCommit(file)

    const { data } = matter(await readFile(file, 'utf8'))
    expect(data.checksum).toBe(checksum)
    expect(data.written_at).toBe(writtenAt)
  })
})
