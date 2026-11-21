#!/usr/bin/env node
/**
 * Checks the site content for mistakes before it goes live (runs automatically before every build).
 *
 *   npm run check
 *
 * - products.json: unique ids/slugs, valid category / models / colours, texts in all 3 languages, photos exist
 * - catalog.json: every model / category / colour has a translation
 * - hy.json / en.json / ru.json: the same keys in all three files
 */
import fs from 'node:fs'
import path from 'node:path'

const LANGS = ['hy', 'en', 'ru']
const read = (p) => JSON.parse(fs.readFileSync(path.resolve(p), 'utf8'))
const products = read('src/data/products.json')
const catalog = read('src/config/catalog.json')
const locales = Object.fromEntries(LANGS.map((l) => [l, read(`src/locales/${l}.json`)]))
const reviews = read('src/data/reviews.json')

const errors = []
const warnings = []
const err = (m) => errors.push(m)
const warnOnce = (m) => warnings.push(m)

const modelIds = new Set(catalog.models.map((m) => m.id))
const categories = new Set(catalog.categories)
const colors = new Set(Object.keys(catalog.colors))
const hasText = (o) => o && LANGS.every((l) => typeof o[l] === 'string' && o[l].trim())
const missingLangs = (o) => LANGS.filter((l) => !(o && typeof o[l] === 'string' && o[l].trim())).join(', ')

// ── products ──────────────────────────────────────────────
const seenIds = new Set()
const seenSlugs = new Set()
for (const [i, p] of products.entries()) {
  const at = `products.json → ${p.id ?? `#${i + 1}`}`
  if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) err(`${at}: "id" must be lowercase letters, numbers and dashes`)
  if (!p.slug || !/^[a-z0-9-]+$/.test(p.slug)) err(`${at}: "slug" must be lowercase letters, numbers and dashes (it is the page URL)`)
  if (seenIds.has(p.id)) err(`${at}: duplicate id`)
  if (seenSlugs.has(p.slug)) err(`${at}: duplicate slug "${p.slug}"`)
  seenIds.add(p.id)
  seenSlugs.add(p.slug)

  if (!categories.has(p.category)) err(`${at}: unknown category "${p.category}" (allowed: ${[...categories].join(', ')})`)
  if (!Array.isArray(p.models) || !p.models.length) err(`${at}: "models" must list at least one model`)
  for (const m of p.models ?? []) if (!modelIds.has(m)) err(`${at}: unknown model "${m}" (allowed: ${[...modelIds].join(', ')})`)
  for (const c of p.colors ?? []) if (!colors.has(c)) err(`${at}: unknown colour "${c}" — add it to src/config/catalog.json`)
  if (!['in_stock', 'preorder'].includes(p.status)) err(`${at}: "status" must be "in_stock" or "preorder"`)
  if (!p.priceOnRequest && typeof p.price !== 'number') err(`${at}: "price" must be a number, or set "priceOnRequest": true`)
  if (!hasText(p.name)) err(`${at}: "name" missing in ${missingLangs(p.name)}`)
  if (!hasText(p.description)) err(`${at}: "description" missing in ${missingLangs(p.description)}`)
  for (const v of p.variants ?? []) {
    if (!hasText(v.name)) err(`${at}: variant "${v.id}" name missing in ${missingLangs(v.name)}`)
    if (v.note && !hasText(v.note)) err(`${at}: variant "${v.id}" note missing in ${missingLangs(v.note)}`)
  }
  if (!p.hidden && !(p.images ?? []).length) warnOnce(`${at}: no photos (run "npm run import-media" or set "hidden": true)`)
  for (const img of p.images ?? []) {
    for (const w of [480, 960, 1440]) {
      if (!fs.existsSync(path.resolve('public', `.${img}-${w}.webp`))) {
        err(`${at}: image file missing public${img}-${w}.webp (run "npm run import-media")`)
        break
      }
    }
  }
  if (p.video && !fs.existsSync(path.resolve('public', `.${p.video}`))) err(`${at}: video missing public${p.video}`)
}
const featured = products.filter((p) => p.featured && !p.hidden).length
if (featured % 4 !== 0) warnOnce(`${featured} products have "featured": true — a multiple of 4 gives even rows on the home page`)

// ── reviews ───────────────────────────────────────────────
for (const r of reviews) if (!r.placeholder && !hasText(r.text)) err(`reviews.json → ${r.id}: text missing in ${missingLangs(r.text)}`)

// ── translations ──────────────────────────────────────────
const flatten = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flatten(v, p ? `${p}.${k}` : k) : [p ? `${p}.${k}` : k]))
const keySets = Object.fromEntries(LANGS.map((l) => [l, new Set(flatten(locales[l]))]))
for (const l of LANGS) {
  for (const other of LANGS) {
    if (l === other) continue
    for (const k of keySets[other]) if (!keySets[l].has(k)) err(`locales/${l}.json: missing "${k}" (exists in ${other}.json)`)
  }
}
for (const l of LANGS) {
  for (const c of categories) if (!locales[l].categories?.[c]) err(`locales/${l}.json: missing categories.${c}`)
  for (const c of colors) if (!locales[l].colors?.[c]) err(`locales/${l}.json: missing colors.${c}`)
  if (modelIds.has('OTHER') && !locales[l].models?.OTHER) err(`locales/${l}.json: missing models.OTHER`)
}

// ── report ────────────────────────────────────────────────
const unique = (a) => [...new Set(a)]
for (const w of unique(warnings)) console.warn('  ⚠', w)
if (errors.length) {
  for (const e of unique(errors)) console.error('  ✗', e)
  console.error(`\n✗ ${unique(errors).length} problem(s) found — fix them and run "npm run check" again.`)
  process.exit(1)
}
console.log(`✓ content OK — ${products.filter((p) => !p.hidden).length} products, ${categories.size} categories, ${LANGS.length} languages`)
