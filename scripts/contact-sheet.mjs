#!/usr/bin/env node
/**
 * Makes one numbered preview image of all photos in a product folder (to look at them quickly).
 *
 *   node scripts/contact-sheet.mjs "Tail Lights" [out.jpg]
 *   (folder is relative to <EVStyle>/products; default output: /tmp/evstyle-sheet.jpg)
 * Prints the number → file list.
 */
import sharp from 'sharp'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { SOURCE } from './media.config.mjs'

const [folder, outArg] = process.argv.slice(2)
if (!folder) {
  console.error('Usage: node scripts/contact-sheet.mjs "<folder>" [out.jpg]')
  process.exit(1)
}
const dir = path.join(SOURCE, 'products', folder)
const out = outArg || path.join(os.tmpdir(), 'evstyle-sheet.jpg')
const files = []
;(function walk(d) {
  for (const f of fs.readdirSync(d).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) f !== 'WB' && walk(p)
    else if (/\.(jpe?g|png|webp)$/i.test(f)) files.push(p)
  }
})(dir)
if (!files.length) {
  console.error('No photos in', dir)
  process.exit(1)
}

const T = 320
const cols = Math.min(4, files.length)
const comps = []
for (let i = 0; i < files.length; i++) {
  const meta = await sharp(files[i]).metadata()
  const tile = await sharp(files[i]).rotate().resize(T, T, { fit: 'contain', background: '#222' }).toBuffer()
  const label = Buffer.from(
    `<svg width="${T}" height="30"><rect width="${T}" height="30" fill="black" opacity=".75"/><text x="8" y="21" font-size="16" fill="#FFD84D" font-family="Arial">${i + 1}  ·  ${meta.width}×${meta.height}</text></svg>`,
  )
  const x = (i % cols) * T
  const y = Math.floor(i / cols) * T
  comps.push({ input: tile, left: x, top: y }, { input: label, left: x, top: y })
}
await sharp({ create: { width: cols * T, height: Math.ceil(files.length / cols) * T, channels: 3, background: '#222' } })
  .composite(comps)
  .jpeg({ quality: 80 })
  .toFile(out)
console.log(`Sheet: ${out}`)
files.forEach((f, i) => console.log(`  ${i + 1}. ${path.relative(dir, f)}`))
