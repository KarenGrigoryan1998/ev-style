/**
 * Pre-renders every page to static HTML after `vite build` so that:
 *  - the page paints instantly (no waiting for JavaScript)
 *  - Facebook / Instagram / Telegram link previews get the right title, description and image per language
 * sitemap.xml / robots.txt come from scripts/build-sitemap.ts (npm run sitemap → public/).
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const { render, MODELS, productSlugs } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href)
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

// Keep an un-rendered copy as the fallback for unknown URLs (see vercel.json)
fs.writeFileSync(path.join(dist, 'spa.html'), template)

const langs = [
  { lang: 'hy', prefix: '' },
  { lang: 'en', prefix: '/en' },
  { lang: 'ru', prefix: '/ru' },
]
const pages = ['/', '/catalog', ...MODELS.map((m) => `/catalog/${m.id.toLowerCase()}`), ...productSlugs().map((s) => `/product/${s}`)]

const stripDefaults = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace(/<meta property="og:(site_name|image|type)"[^>]*>\s*/g, (m) => (m.includes('og:type') ? m : ''))

let count = 0
for (const { lang, prefix } of langs) {
  for (const page of pages) {
    const url = page === '/' ? prefix || '/' : `${prefix}${page}`
    const { html, head, htmlAttrs } = await render(url, lang)
    const out = stripDefaults(template)
      .replace(/<html[^>]*>/, `<html ${htmlAttrs}>`)
      .replace('</head>', `${head}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    const file = path.join(dist, url === '/' ? '' : url, 'index.html')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, out)
    count++
  }
}

fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true })
console.log(`✓ pre-rendered ${count} pages`)
