#!/usr/bin/env node
/**
 * Converts photos/videos from your EVStyle folder into /public and keeps products.json in sync.
 *
 *   npm run import-media                    # everything (logo, products, gallery, hero, videos)
 *   npm run import-media -- tail-lights     # only these product ids (faster)
 *
 * What it does
 *  - each photo → public/images/products/<id>/<n>-480.webp, -960.webp, -1440.webp
 *    (square; tall flat-lay photos are padded instead of cropped)
 *  - writes the "images" list of every product in src/data/products.json — never edit it by hand
 *  - removes image folders of products that no longer exist
 *
 * Where photos come from: scripts/media.config.mjs
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { GALLERY, HERO_POSTER, LOGO, PRODUCTS, SOURCE, VIDEOS } from './media.config.mjs'

const PUB = path.resolve('public')
const PRODUCTS_JSON = path.resolve('src/data/products.json')
const WIDTHS = [480, 960, 1440]
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i
const productsDir = path.join(SOURCE, 'products')

const mkdir = (d) => fs.mkdirSync(d, { recursive: true })
const warn = (...m) => console.warn('  ⚠', ...m)

/** Resolves a product's photo list from its config entry */
function productPhotos(id, entry) {
  const base = entry.folder ? path.join(productsDir, entry.folder) : productsDir
  if (entry.folder && !entry.photos) {
    if (!fs.existsSync(base)) return warn(`${id}: folder not found → products/${entry.folder}`), []
    return fs
      .readdirSync(base)
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => path.join(base, f))
  }
  return (entry.photos ?? []).map((p) => path.join(base, p))
}

async function toWebp(src, outDir, name, { square = true } = {}) {
  if (!fs.existsSync(src)) return warn('missing', path.relative(SOURCE, src)), false
  mkdir(outDir)
  // Tall photos (e.g. flat-lays on white) are padded to a square with their own background colour instead of cropped
  const meta = await sharp(src).rotate().metadata()
  const tall = square && meta.height / meta.width > 1.1
  let bg = { r: 255, g: 255, b: 255 }
  if (tall) {
    const { data } = await sharp(src).extract({ left: 0, top: 0, width: 4, height: 4 }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    bg = { r: data[0], g: data[1], b: data[2] }
  }
  for (const w of WIDTHS) {
    const img = sharp(src).rotate()
    const pipeline = !square
      ? img.resize({ width: w, withoutEnlargement: true })
      : tall
        ? img.resize(w, w, { fit: 'contain', background: bg })
        : img.resize(w, w, { fit: 'cover', position: 'attention' })
    await pipeline.webp({ quality: 78, effort: 5 }).toFile(path.join(outDir, `${name}-${w}.webp`))
  }
  return true
}

/** Logo with the flat graphite background keyed out, favicons and the Open Graph image */
async function makeLogo() {
  const src = path.join(SOURCE, LOGO)
  if (!fs.existsSync(src)) return warn('missing logo', LOGO)
  const bg = [0x25, 0x28, 0x31]
  const keyed = async (region) => {
    const { data, info } = await sharp(src).extract(region).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    for (let i = 0; i < data.length; i += 4) {
      const d = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2])
      data[i + 3] = Math.max(0, Math.min(255, Math.round((d - 18) * 3.2)))
    }
    return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
  }
  mkdir(path.join(PUB, 'images'))
  const full = await keyed({ left: 180, top: 470, width: 1490, height: 540 })
  await sharp(full).resize({ width: 600 }).png({ compressionLevel: 9 }).toFile(path.join(PUB, 'images', 'logo.png'))
  await sharp(full).resize({ width: 400 }).webp({ quality: 90, alphaQuality: 90 }).toFile(path.join(PUB, 'images', 'logo.webp'))

  const ev = await keyed({ left: 195, top: 635, width: 530, height: 290 })
  for (const [name, s] of [['favicon-32.png', 32], ['favicon-192.png', 192], ['apple-touch-icon.png', 180]]) {
    await sharp({ create: { width: s, height: s, channels: 4, background: '#0F1115' } })
      .composite([{ input: await sharp(ev).resize({ width: Math.round(s * 0.8) }).toBuffer(), gravity: 'center' }])
      .png()
      .toFile(path.join(PUB, name))
  }
  const og = await sharp(src).extract({ left: 180, top: 470, width: 1490, height: 540 }).resize({ width: 880 }).toBuffer()
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#252831' } })
    .composite([{ input: og, gravity: 'center' }])
    .jpeg({ quality: 85 })
    .toFile(path.join(PUB, 'images', 'og-image.jpg'))
  console.log('✓ logo, favicons, og-image')
}

async function importProducts(only) {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'))
  const ids = new Set(products.map((p) => p.id))
  const outRoot = path.join(PUB, 'images', 'products')

  for (const [id, entry] of Object.entries(PRODUCTS)) {
    if (only.length && !only.includes(id)) continue
    if (!ids.has(id)) warn(`${id}: has photos in media.config.mjs but no entry in products.json`)
    const out = path.join(outRoot, id)
    const photos = productPhotos(id, entry).filter((f) => fs.existsSync(f) || (warn('missing', path.relative(SOURCE, f)), false))
    // Safety: never wipe existing images when the source photos can't be found (e.g. folder moved or deleted)
    if (!photos.length) {
      warn(`${id}: no source photos found — keeping the current images`)
      continue
    }
    // Convert into a temp folder first, then swap — a failed run never leaves a product without images
    const tmp = `${out}.tmp`
    fs.rmSync(tmp, { recursive: true, force: true })
    let n = 0
    for (const photo of photos) if (await toWebp(photo, tmp, n + 1)) n++
    fs.rmSync(out, { recursive: true, force: true })
    fs.renameSync(tmp, out)
    console.log(`✓ products/${id} (${n})`)
  }

  // Remove image folders of products that were deleted
  if (fs.existsSync(outRoot)) {
    for (const dir of fs.readdirSync(outRoot)) {
      if (dir.endsWith('.tmp') || (!ids.has(dir) && !PRODUCTS[dir])) {
        fs.rmSync(path.join(outRoot, dir), { recursive: true, force: true })
        console.log(`✗ removed unused images/products/${dir}`)
      }
    }
  }

  // Sync "images" in products.json with what is on disk
  for (const p of products) {
    const dir = path.join(outRoot, p.id)
    const count = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('-960.webp')).length : 0
    p.images = Array.from({ length: count }, (_, i) => `/images/products/${p.id}/${i + 1}`)
    if (!count && !p.hidden) warn(`${p.id}: no photos — add it to scripts/media.config.mjs or set "hidden": true`)
  }
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2) + '\n')
  console.log('✓ products.json images updated')
}

async function importGallery() {
  const out = path.join(PUB, 'images', 'gallery')
  const photos = GALLERY.map((g) => path.join(productsDir, g)).filter((f) => fs.existsSync(f))
  if (photos.length === GALLERY.length) {
    const tmp = `${out}.tmp`
    fs.rmSync(tmp, { recursive: true, force: true })
    let n = 0
    for (const f of photos) if (await toWebp(f, tmp, n + 1, { square: false })) n++
    fs.rmSync(out, { recursive: true, force: true })
    fs.renameSync(tmp, out)
    console.log(`✓ gallery (${n})`)
  } else {
    warn(`gallery: ${GALLERY.length - photos.length} source photo(s) missing — keeping the current gallery`)
  }
  if (await toWebp(path.join(productsDir, HERO_POSTER), path.join(PUB, 'images', 'hero'), 'poster')) console.log('✓ hero poster')
}

function copyVideos() {
  for (const [dest, src] of Object.entries(VIDEOS)) {
    const from = path.join(SOURCE, src)
    if (!fs.existsSync(from)) {
      warn('missing video', src)
      continue
    }
    mkdir(path.dirname(path.join(PUB, dest)))
    fs.copyFileSync(from, path.join(PUB, dest))
    console.log('✓', dest)
  }
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Source folder not found:', SOURCE, '\nSet EVSTYLE_SRC=/path/to/EVStyle')
    process.exit(1)
  }
  const only = process.argv.slice(2)
  console.log('Source:', SOURCE)
  if (only.length) {
    await importProducts(only)
    return
  }
  await makeLogo()
  await importProducts([])
  await importGallery()
  copyVideos()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
