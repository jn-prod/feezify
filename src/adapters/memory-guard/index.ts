import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import matter from 'gray-matter'

export function computeChecksum(body: string): string {
  return createHash('sha256').update(body.trim()).digest('hex')
}

export interface GuardCheckResult {
  drift: boolean
  backupPath?: string
}

// Detects a hand-edit (or any other unexpected write) since the last `guardCommit`,
// so the coach never silently overwrites something it didn't itself produce.
export async function guardCheck(filePath: string): Promise<GuardCheckResult> {
  const raw = await readFile(filePath, 'utf8')
  const { data, content } = matter(raw)

  if (typeof data.checksum !== 'string') return { drift: false }
  if (computeChecksum(content) === data.checksum) return { drift: false }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = `${filePath}.bak.${timestamp}`
  await writeFile(backupPath, raw)
  return { drift: true, backupPath }
}

export interface GuardCommitResult {
  checksum: string
  writtenAt: string
}

// Stamps the page with the checksum + timestamp of this write, so the next
// `guardCheck` can tell whether anything touched the file in between.
export async function guardCommit(filePath: string): Promise<GuardCommitResult> {
  const { data, content } = matter(await readFile(filePath, 'utf8'))
  const checksum = computeChecksum(content)
  const writtenAt = new Date().toISOString()

  const updated = matter.stringify(content, { ...data, checksum, written_at: writtenAt })
  await writeFile(filePath, updated)

  return { checksum, writtenAt }
}
