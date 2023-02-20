import path from 'path'
import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  platform: 'node',
  target: ['node10.4'],
  outfile: 'bundle.js',
})
