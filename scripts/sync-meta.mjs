// Rewrites the calculator count in index.html's static meta tags so the
// title/description/OG tags can never drift from the real registry size.
// Runs as part of `npm run build` (prebuild step).
import { readFileSync, writeFileSync } from 'node:fs'

// Bundle a tiny counter entry with esbuild's JS API, then execute it.
import { createRequire } from 'node:module'
const esbuild = createRequire(import.meta.url)('esbuild')
const result = esbuild.buildSync({
  stdin: {
    contents: `
import { CALCULATORS } from './src/data/calculators'
import { VARIANTS } from './src/data/variants'
globalThis.__calcstackCount = CALCULATORS.length
`,
    loader: 'ts',
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
  logLevel: 'silent',
})
eval(result.outputFiles[0].text)
const count = Number(globalThis.__calcstackCount)
if (!Number.isFinite(count) || count < 1) throw new Error(`bad count: ${count}`)
// Display as a rounded "N+" (e.g. 501 → "500+") so copy never drifts as we add calculators.
const display = `${Math.floor(count / 100) * 100}+`

let html = readFileSync('index.html', 'utf8')
html = html
  .replace(/— \d+\+? Free Calculators for Work, Money & Life/g, `— ${display} Free Calculators for Work, Money & Life`)
  .replace(/\d+\+? free calculators for every job/, `${display} free calculators for every job`)

writeFileSync('index.html', html)
console.log(`index.html meta synced: ${count} calculators`)
