# EVStyle Armenia — website

Landing page + catalogue for **EVStyle Armenia**, an online store for Deepal / EV / hybrid car accessories in Yerevan.

React + Vite + TypeScript + Tailwind · react-router · react-i18next (ՀԱՅ / ENG / РУС) · framer-motion · every page is pre-rendered to static HTML (fast first paint, correct Facebook/Instagram link previews).

## Commands

```bash
npm install
npm run dev            # http://localhost:3000
npm run import-media   # photos from your EVStyle folder → public/ (+ fills "images" in products.json)
npm run check          # checks products, translations and photos for mistakes
npm run find-new-products  # new photo folders / photos in your EVStyle folder that aren't on the site yet
npm run build          # check + production build → dist/ (all pages, sitemap.xml, robots.txt)
npm run preview        # serve the production build locally
```

## Add a product (e.g. tail lights)

With Claude Code: put the photos in a folder in `~/Documents/EVStyle/products/` and say *"I added a new product"* or *"add Tail Lights"* — the project skill `.claude/skills/add-product` finds the folder, looks at the photos, writes the entry in 3 languages, imports and checks it.

By hand:

1. **Photos** — put them in a folder in your EVStyle folder, e.g. `~/Documents/EVStyle/products/Tail Lights/`.
2. **Tell the importer where they are** — one line in `scripts/media.config.mjs` → `PRODUCTS`:
   ```js
   'tail-lights': { folder: 'Tail Lights' },                             // all photos, A→Z (first = main photo)
   'tail-lights': { folder: 'Tail Lights', photos: ['b.jpg', 'a.jpg'] }, // or pick the order
   ```
3. **Describe it** — add an entry to `src/data/products.json` (copy an existing one):
   ```jsonc
   {
     "id": "tail-lights",                 // same id as in media.config.mjs
     "slug": "deepal-led-tail-lights",    // page URL: /product/deepal-led-tail-lights
     "category": "lighting",              // see src/config/catalog.json
     "models": ["S05", "S07"],            // SL03 | S05 | S07 | OTHER
     "price": 45000,                      // or null + "priceOnRequest": true
     "priceOnRequest": false,
     "status": "preorder",                // in_stock | preorder (only pre-order gets a badge)
     "freeInstallation": false,
     "isNew": true,
     "colors": ["black"],                 // see src/config/catalog.json
     "variants": [                        // optional choices (e.g. filter type, glossy/matte)
       { "id": "smoked", "name": { "hy": "...", "en": "Smoked", "ru": "..." } }
     ],
     "images": [],                        // filled automatically by import-media — don't edit
     "name": { "hy": "...", "en": "...", "ru": "..." },
     "description": { "hy": "...", "en": "...", "ru": "..." },
     "featured": false                    // true = on the home page (keep 8 for even rows)
   }
   ```
4. Run `npm run import-media -- tail-lights`, then `npm run check`.

The product page `/product/<slug>` in all 3 languages, the catalogue entry and the sitemap are generated automatically.

- **Hide a product** without deleting it: `"hidden": true`.
- **New category / colour / car model**: add it to `src/config/catalog.json` and its name to `categories` / `colors` / `models` in the 3 locale files. `npm run check` tells you if something is missing. Categories only show in the catalogue filter once a product uses them.
- To move products to a CMS / Google Sheet later, only `src/lib/products.ts` needs to change.

## Where to change things

| What | File |
|---|---|
| Phone, WhatsApp, Viber, Messenger, socials, address, hours, delivery threshold, pre-order %, analytics IDs | `src/config/site.ts` |
| Show / hide prices | `showPrices` in `src/config/site.ts` (hidden now → "Price — message us") |
| Car models, categories, colour swatches | `src/config/catalog.json` |
| Products | `src/data/products.json` |
| Product / gallery / hero photos and videos | `scripts/media.config.mjs` → `npm run import-media` |
| All texts (3 languages) | `src/locales/hy.json`, `en.json`, `ru.json` |
| FAQ (which questions, order) | `src/data/faq.json` (texts in locale files under `faq.items`) |
| Reviews | `src/data/reviews.json` — the section and its menu link appear once there is a review without `"placeholder": true`; empty `"name"` shows "S07 owner" |
| Design colours | `tailwind.config.ts` (green `#71DB3D`, graphite `#252831` from the logo) |

Business numbers (`15 000 ֏`, `10%`, `1–2 days`, `2–4 weeks`) come from `site.ts` and are inserted into every translation automatically.

## Ordering flow

Facebook Messenger is the main channel. Messenger links can't carry a pre-filled text, so "Order" copies the message (product + type + car) to the clipboard and shows "Message copied — paste it in Messenger". WhatsApp links (`buildWhatsAppLink` in `src/lib/contact.ts`) are pre-filled. Templates: `whatsapp.*` in the locale files.

## Analytics

Set `metaPixelId` and/or `gaId` in `src/config/site.ts`. Every Messenger / WhatsApp / call / social click is tracked as a lead.

## Deploy (Vercel)

1. Import the GitHub repo on [vercel.com](https://vercel.com) — `vercel.json` already sets the build.
2. Add your domain in Vercel → Settings → Domains.
3. Nothing else to set: the site address (canonical URLs, sitemap, link-preview images) is taken automatically from Vercel's production domain — `*.vercel.app` now, your own domain once it's added as the production domain. To force one, set the env var `SITE_URL=https://your-domain` in Vercel.

Note: `npm run import-media` needs your local EVStyle folder; the generated files in `public/` are committed, so Vercel builds without it.

## Project structure

```
public/                 generated images (products, gallery, hero), videos, logo, favicons
scripts/
  media.config.mjs      where photos/videos come from
  import-media.mjs      photos → WebP, keeps products.json images in sync
  check-content.mjs     validates products / translations / photos (runs before build)
  find-new-products.mjs lists new photo folders / photos not on the site yet
  contact-sheet.mjs     one numbered preview image of a folder's photos
  prerender.mjs         static HTML for every page + sitemap.xml + robots.txt
src/
  config/               site.ts (business settings), catalog.json (models, categories, colours)
  data/                 products.json, reviews.json, faq.json
  locales/              hy.json, en.json, ru.json
  lib/                  products (data access), contact (Messenger/WhatsApp links), i18n, seo, analytics, toast
  hooks/                useLang, useModelName, useScrolled, useAutoplayInView
  components/
    layout/             Header, Footer, LanguageSwitcher, MobileContactBar, SocialDock, ContactChips, Seo, LangLayout
    sections/           Hero, ProductsGrid, HowToOrder, WhyUs, Gallery, Reviews, FAQ, FollowUs, Contact
    product/            ProductCard, ProductBadges, ProductImage, ColorDots, CatalogCta, MoreProductsNote
    ui/                 Button, Accordion, Chip, Reveal, SectionTitle, Toast, BrandIcons
  pages/                Home, Catalog, Product, NotFound
  entry-server.tsx      used at build time for pre-rendering
```
