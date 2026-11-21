#!/usr/bin/env node
/**
 * Lists product photo folders in the EVStyle folder that are not on the site yet,
 * and photos added to existing product folders after that product was last imported
 * (photos that were deliberately left out earlier are not listed again).
 *
 *   npm run find-new-products            # everything new
 *   npm run find-new-products -- tail    # folders whose name contains "tail" (case-insensitive)
 */
import fs from 'node:fs'
import path from 'node:path'
import { PRODUCTS, SOURCE } from './media.config.mjs'

const IMAGE_EXT = /\.(jpe?g|png|webp|heic)$/i
const VIDEO_EXT = /\.(mp4|mov)$/i
const root = path.join(SOURCE, 'products')
if (!fs.existsSync(root)) {
  console.error('Products folder not found:', root)
  process.exit(1)
}
const query = process.argv.slice(2).join(' ').toLowerCase()

// Every source file already used by a product (absolute paths) and which product uses each top-level folder
const used = new Set()
const folderOwner = new Map()
for (const [id, e] of Object.entries(PRODUCTS)) {
  const base = e.folder ? path.join(root, e.folder) : root
  const files = e.photos ?? (fs.existsSync(base) ? fs.readdirSync(base) : [])
  for (const f of files) {
    const abs = path.join(base, f)
    used.add(abs)
    const top = path.relative(root, abs).split(path.sep)[0]
    if (!top.startsWith('..')) folderOwner.set(top, [...new Set([...(folderOwner.get(top) ?? []), id])])
  }
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    if (d.isDirectory()) return d.name === 'WB' ? [] : walk(p) // WB = marketplace exports, not site photos
    return [p]
  })

const rows = []
for (const d of fs.readdirSync(root, { withFileTypes: true })) {
  if (!d.isDirectory()) continue
  if (query && !d.name.toLowerCase().includes(query)) continue
  const files = walk(path.join(root, d.name))
  const photos = files.filter((f) => IMAGE_EXT.test(f))
  const videos = files.filter((f) => VIDEO_EXT.test(f))
  const owners = folderOwner.get(d.name)
  // Last import time of the product(s) using this folder = newest generated image
  const importedAt = Math.max(
    0,
    ...(owners ?? []).map((id) => {
      const out = path.resolve('public/images/products', id, '1-960.webp')
      return fs.existsSync(out) ? fs.statSync(out).mtimeMs : 0
    }),
  )
  const newPhotos = photos.filter((f) => !used.has(f) && fs.statSync(f).mtimeMs > importedAt)
  const modified = Math.max(...files.map((f) => fs.statSync(f).mtimeMs), 0)
  rows.push({ name: d.name, owners, photos, videos, newPhotos, modified })
}
rows.sort((a, b) => b.modified - a.modified)

const fresh = rows.filter((r) => !r.owners)
const updated = rows.filter((r) => r.owners && r.newPhotos.length)
const date = (ms) => new Date(ms).toISOString().slice(0, 16).replace('T', ' ')

console.log(`Source: ${root}\n`)
if (fresh.length) {
  console.log('NEW FOLDERS (not on the site yet):')
  for (const r of fresh) {
    console.log(`  • ${r.name}  — ${r.photos.length} photo(s), ${r.videos.length} video(s), changed ${date(r.modified)}`)
    for (const f of r.photos) console.log(`      ${path.relative(path.join(root, r.name), f)}`)
  }
  console.log()
}
if (updated.length) {
  console.log('NEW PHOTOS IN EXISTING PRODUCT FOLDERS:')
  for (const r of updated) {
    console.log(`  • ${r.name}  (product: ${r.owners.join(', ')}) — ${r.newPhotos.length} not used yet`)
    for (const f of r.newPhotos) console.log(`      ${path.relative(path.join(root, r.name), f)}  (${date(fs.statSync(f).mtimeMs)})`)
  }
  console.log()
}
if (!fresh.length && !updated.length) console.log(query ? `Nothing new matching "${query}".` : 'Nothing new — every folder and photo is already on the site.')
