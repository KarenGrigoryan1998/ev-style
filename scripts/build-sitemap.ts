/**
 * npm run sitemap → public/sitemap.xml + public/robots.txt
 * Pages: home, catalogue, catalogue per car model, every visible product — in hy (/), en (/en), ru (/ru),
 * each with hreflang alternates. Domain: `siteUrl` in src/config/site.ts. Also runs as part of `npm run build`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { site } from '../src/config/site.ts'

interface Product {
  slug: string
  hidden?: boolean
}

const root = path.resolve(import.meta.dirname, '..')
const readJson = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')) as T

const products = readJson<Product[]>('src/data/products.json').filter((p) => !p.hidden)
const { models } = readJson<{ models: { id: string }[] }>('src/config/catalog.json')

const base = site.siteUrl.replace(/\/$/, '')
const langs = [
  { lang: 'hy', prefix: '' },
  { lang: 'en', prefix: '/en' },
  { lang: 'ru', prefix: '/ru' },
]
const pages = ['/', '/catalog', ...models.map((m) => `/catalog/${m.id.toLowerCase()}`), ...products.map((p) => `/product/${p.slug}`)]
const loc = (prefix: string, page: string) => `${base}${page === '/' ? prefix || '/' : prefix + page}`

const urls = pages.flatMap((page) => {
  const alternates = [
    ...langs.map(({ lang, prefix }) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${loc(prefix, page)}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc('', page)}"/>`,
  ].join('\n')
  return langs.map(({ prefix }) => `  <url>\n    <loc>${loc(prefix, page)}</loc>\n${alternates}\n  </url>`)
})

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${base}/sitemap.xml
`

fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap)
fs.writeFileSync(path.join(root, 'public/robots.txt'), robots)
console.log(`✓ sitemap.xml (${urls.length} URLs) + robots.txt → public/`)
