#!/usr/bin/env node
import { join } from 'node:path'
import { guardCheck, guardCommit } from '../adapters/memory-guard/index.js'

const [, , op, coreDir, relPath] = process.argv
if ((op !== 'check' && op !== 'commit') || !coreDir || !relPath) {
  console.error('usage: feezify-memory-guard <check|commit> <coreDir> <memory/relative-path.md>')
  process.exit(2)
}

const filePath = join(coreDir, relPath)

if (op === 'check') {
  const result = await guardCheck(filePath)
  console.log(JSON.stringify(result, null, 2))
  process.exit(result.drift ? 1 : 0)
} else {
  const result = await guardCommit(filePath)
  console.log(JSON.stringify(result, null, 2))
}
