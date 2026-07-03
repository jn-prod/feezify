import { defineConfig } from 'tsup'

// Self-contained build for the distributable skill zip: every dependency
// (gray-matter, zod, js-yaml) is inlined so `node scripts/lecture.js` runs with
// nothing but Node — no install, no node_modules (see scripts/package-skill.mjs).
export default defineConfig({
  entry: ['src/bin/lecture.ts', 'src/bin/memory-guard.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'es2022',
  outDir: 'packaging/scripts',
  noExternal: [/.*/],
  splitting: false,
  clean: true,
  banner: {
    // CJS deps (gray-matter) call require('fs') — shim it for the ESM bundle.
    js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
  },
})
