/**
 * npm run feed → product catalogue feeds for catalogue ads (also runs as part of `npm run build`):
 *   public/feeds/meta-catalog.csv     Meta Commerce Manager → Catalogue → Data sources → Data feed (scheduled URL)
 *   public/feeds/tiktok-catalog.csv   TikTok Catalog Manager → Products → Data feed (scheduled URL)
 *   public/images/share/<id>.jpg      1200×1200 JPG of the main photo — feed image_link + product page link preview
 *
 * `id` / `sku_id` = product id in products.json = content_ids in Pixel events, so ads can match them.
 * Skipped: hidden products, products without photos, products without a price (priceOnRequest / price null)
 * — Meta and TikTok reject catalogue items without a price.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { site } from '../src/config/site.ts'

type Lang = 'hy' | 'en' | 'ru'
interface Product {
  id: string
  slug: string
  category: string
  models: string[]
  price: number | null
  priceOnRequest: boolean
  status: 'in_stock' | 'preorder'
  images: string[]
  name: Record<Lang, string>
  description: Record<Lang, string>
  hidden?: boolean
}

const root = path.resolve(import.meta.dirname, '..')
const pub = path.join(root, 'public')
const base = site.siteUrl.replace(/\/$/, '')
const products = (JSON.parse(fs.readFileSync(path.join(root, 'src/data/products.json'), 'utf8')) as Product[]).filter(
  (p) => !p.hidden && p.images.length > 0,
)

/* 1. Share images (JPG — Meta / TikTok catalogues don't accept WebP everywhere) */
const shareDir = path.join(pub, 'images/share')
fs.mkdirSync(shareDir, { recursive: true })
const keep = new Set<string>()
for (const p of products) {
  const src = path.join(pub, `${p.images[0]}-1440.webp`)
  const out = path.join(shareDir, `${p.id}.jpg`)
  keep.add(`${p.id}.jpg`)
  if (!fs.existsSync(src)) throw new Error(`${p.id}: missing ${path.relative(root, src)} — run npm run import-media`)
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue
  await sharp(src).resize(1200, 1200, { fit: 'cover' }).jpeg({ quality: 84, mozjpeg: true }).toFile(out)
  console.log(`  + images/share/${p.id}.jpg`)
}
for (const f of fs.readdirSync(shareDir)) if (!keep.has(f)) fs.rmSync(path.join(shareDir, f))

/* 2. Feeds */
const priced = products.filter((p) => !p.priceOnRequest && p.price != null)
const skipped = products.filter((p) => !priced.includes(p)).map((p) => p.id)

const csv = (rows: Record<string, string>[]) => {
  const cols = Object.keys(rows[0] ?? {})
  const cell = (v: string) => `"${v.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
  return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c] ?? '')).join(','))].join('\n') + '\n'
}

// Pre-order items need an expected date: today + the longest pre-order wait from site.ts ('2–4' weeks → 4)
const preorderWeeks = Math.max(...(String(site.commerce.preorderWeeks).match(/\d+/g) ?? ['4']).map(Number))
const preorderDate = new Date(Date.now() + preorderWeeks * 7 * 864e5).toISOString().slice(0, 10) + 'T00:00+04:00'

const row = (p: Product) => ({
  title: (p.name.hy || p.name.en).slice(0, 150),
  description: (p.description.hy || p.description.en).slice(0, 5000),
  availability: p.status === 'in_stock' ? 'in stock' : 'preorder',
  condition: 'new',
  price: `${p.price} ${site.commerce.currency}`,
  link: `${base}/product/${p.slug}`,
  image_link: `${base}/images/share/${p.id}.jpg`,
  brand: site.brand,
  custom_label_0: p.models.join(', '),
  custom_label_1: p.category,
})

const meta = priced.map((p) => {
  const { title, description, availability, ...rest } = row(p)
  return { id: p.id, title, description, availability, availability_date: availability === 'preorder' ? preorderDate : '', ...rest }
})
const tiktok = priced.map((p) => ({ sku_id: p.id, ...row(p) }))

fs.mkdirSync(path.join(pub, 'feeds'), { recursive: true })
fs.writeFileSync(path.join(pub, 'feeds/meta-catalog.csv'), csv(meta))
fs.writeFileSync(path.join(pub, 'feeds/tiktok-catalog.csv'), csv(tiktok))
console.log(`✓ feeds: ${priced.length} products → public/feeds/meta-catalog.csv, tiktok-catalog.csv`)
if (skipped.length) console.log(`  skipped (no price): ${skipped.join(', ')}`)
