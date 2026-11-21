---
name: add-product
description: Add a new product (or new photos of an existing product) to the EVStyle site from the user's EVStyle photo folder. Use when the user says they added a product/photos ("I added new product", "added photos in Tail Lights", "find the new product", "add <folder name>"), or asks to put a product from their folder on the site.
---

# Add a product from the EVStyle folder

Photos live in `~/Documents/EVStyle/products/<Folder>/` (path = `SOURCE` in `scripts/media.config.mjs`; override with `EVSTYLE_SRC`). The site never reads that folder directly — `npm run import-media` converts photos into `public/` and fills `images` in `src/data/products.json`.

## 1. Find it

```bash
npm run find-new-products                 # new folders + photos added since the last import
npm run find-new-products -- <part of name>   # the user named it, e.g. "tail", "glass" (case-insensitive)
```

- **New folder** → new product (continue below).
- **New photos in an existing product folder** → add them to that product's entry in `scripts/media.config.mjs` (or nothing to do if the entry is `{ folder }` without `photos`), then go to step 5.
- Nothing found → list `~/Documents/EVStyle/products` and ask which folder they mean (names may be Armenian, Russian-transliterated or misspelled, e.g. "Windshiled Wiper", "Բարձ Սիդելնիկի").

## 2. Look at the photos

```bash
node scripts/contact-sheet.mjs "<Folder>" <scratchpad>/sheet.jpg
```

Read the sheet image. Work out: what the product is, which car models it fits (Deepal logo/model text on the photo), colours, finishes/types (→ `variants`), and the best **main photo** (sharp, product clearly visible, preferably purple or orange interior shots; tall flat-lays are padded automatically, not cropped). Open single photos at full size if text on them matters. Check `~/Documents/EVStyle/EVStyle_notes.txt` for the price and any variants.

## 3. Register the photos — `scripts/media.config.mjs` → `PRODUCTS`

```js
'tail-lights': { folder: 'Tail Lights' },                                   // all photos A→Z
'tail-lights': { folder: 'Tail Lights', photos: ['best.jpg', 'other.jpg'] }, // when the main photo isn't first alphabetically
```

Skip screenshots, invoices, numbered collages and near-duplicates.

## 4. Create the catalogue entry — `src/data/products.json`

Copy an existing entry. Rules:

- `id`: kebab-case English, same key as in media.config. `slug`: descriptive English kebab-case (it is the URL), unique.
- `category`: one of `src/config/catalog.json` → `categories` (lights → `lighting`). New category/colour/model → add to `catalog.json` **and** to `categories`/`colors`/`models` in all 3 locale files.
- `models`: `SL03` `S05` `S07`, plus `OTHER` for universal items. Only what the photos/notes support; ask if unsure.
- `price`: number from the notes (prices are hidden on the site but kept in data), else `null` + `"priceOnRequest": true`.
- `status`: `preorder` unless the user says it's in stock (only pre-order shows a badge). `isNew: true` for new products. `freeInstallation`: only if the user says so.
- `colors`: ids from `catalog.json` that the photos actually show.
- `variants`: optional `[{ "id", "name": {hy,en,ru}, "note"?: {hy,en,ru} }]` for types/finishes.
- `images`: leave `[]` — the importer fills it.
- `name` / `description`: write all three languages — Armenian first and natural (not word-for-word from English), 1–3 short sentences: what it is, benefit, fit. Never claim stock, prepayment, or certifications you can't see.
- `featured`: `false` by default (home page holds 8 products; only change when asked, and keep orange/purple photos balanced).

## 5. Import, check, build

```bash
npm run import-media -- <id>
npm run check
npm run build
```

Fix anything `check` reports. Then preview (`npx vite preview --port 4173`) and screenshot `/product/<slug>` (desktop + 390px phone) to confirm the photos and texts look right; stop the preview server afterwards.

## 6. Report

Tell the user: product name (hy), page URL, which photo is main, models/colours/variants chosen, price used (and that prices are hidden), anything you guessed that they should confirm. **Do not commit or push** — give a commit message only if they ask.

## Preferences to respect

Facebook Messenger first, then Instagram, TikTok, WhatsApp, Viber · no "In stock" claims · no prepayment mentions · no invented reviews · headlines not Deepal-only · see `README.md` for the full data format.
