import { cp, readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

// Source (from the repo root) → destination inside the skill. The layout is the one
// src/adapters/claude-skill-zip/SKILL.md tells the host to expect.
const LAYOUT: ReadonlyArray<readonly [string, string]> = [
  ['src/adapters/claude-skill-zip/SKILL.md', 'SKILL.md'],
  ['src/adapters/claude-skill/method.md', 'method.md'],
  ['packaging/scripts/lecture.js', 'scripts/lecture.js'],
  ['packaging/scripts/memory-guard.js', 'scripts/memory-guard.js'],
  ['core-template', 'core-template'],
  ['LICENSE', 'LICENSE'],
]

// Copies the skill into stageRoot and returns its files, relative and sorted.
export async function stageSkillDir(root: string, stageRoot: string): Promise<string[]> {
  for (const [source, destination] of LAYOUT) {
    await cp(join(root, source), join(stageRoot, destination), { recursive: true })
  }
  const entries = await readdir(stageRoot, { recursive: true, withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => relative(stageRoot, join(entry.parentPath, entry.name)).split(sep).join('/'))
    .sort()
}
