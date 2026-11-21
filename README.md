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
npm run sitemap        # public/sitemap.xml + robots.txt (all languages, catalogue, products)
npm run feed           # public/feeds/meta-catalog.csv + tiktok-catalog.csv (+ share images)
npm run build          # check + sitemap + feed + production build → dist/ (all pages pre-rendered)
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
| Domain, phone, WhatsApp, Viber, Messenger, socials, address, hours, delivery threshold, pre-order %, tracking IDs, verification codes | `src/config/site.ts` |
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

## Tracking & Ads

Everything is off until you fill in an ID. With all IDs empty no script is loaded and no cookie banner is shown.

### 1. Where each ID goes

| What | Where |
|---|---|
| Meta Pixel ID | `src/config/site.ts` → `analytics.metaPixelId` |
| GA4 Measurement ID (`G-…`) | `src/config/site.ts` → `analytics.ga4Id` |
| TikTok Pixel ID | `src/config/site.ts` → `analytics.tiktokPixelId` |
| Meta domain verification code | `src/config/site.ts` → `verification.metaDomainVerification` |
| Google Search Console code | `src/config/site.ts` → `verification.googleSiteVerification` |
| `META_CAPI_TOKEN` (Conversions API token, **secret**) | Vercel → Project → Settings → Environment Variables |
| `META_PIXEL_ID` (same Pixel ID) | Vercel → Environment Variables |
| `META_TEST_EVENT_CODE` (optional, only while testing) | Vercel → Environment Variables |

After changing env vars in Vercel, redeploy. The token never goes in the code.

How it works:
- `src/lib/analytics.ts` contains `track(event, params)`, which sends each event to Meta Pixel, GA4 and TikTok with one shared `event_id`. Meta events also go to `/api/meta-capi` (`api/meta-capi.ts`), which forwards them to the Conversions API so Meta can de-duplicate them.
- Scripts load only after the visitor clicks **Accept** in the cookie banner, and only when the browser is idle after the page has loaded.
- Every WhatsApp / Messenger / Viber / Call button is a `<ContactButton>` (`src/components/ui/ContactButton.tsx`). Facebook / Instagram / TikTok page links (`<FollowLink>`) are not tracked.

| Action | Meta | GA4 | TikTok |
|---|---|---|---|
| Page / route change | PageView | page_view | PageView |
| Product page opened | ViewContent | view_item | ViewContent |
| "Order" on a product (Messenger or WhatsApp) | **Lead** | generate_lead | SubmitForm |
| Any other WhatsApp / Messenger / Viber / Call button | **Contact** | contact | Contact |

Every event also carries the visitor's `utm_*` / `fbclid` / `ttclid` (`src/lib/utm.ts`). When a visitor arrives from an ad with UTMs, the pre-filled message gets a tag like `(ref: fb_logo_nov)`, so you can see in WhatsApp/Messenger which ad brought them.

### 2. Verify evstyle.am in Meta

1. Meta Business Settings → **Brand safety → Domains** → Add → `evstyle.am`.
2. Choose **Meta-tag verification** and copy only the `content="…"` value.
3. Paste it into `verification.metaDomainVerification` in `site.ts`, then commit and deploy.
4. Back in Meta, click **Verify**.

Google Search Console works the same way ("HTML tag" method → `verification.googleSiteVerification`).

### 3. Testing

- Add **`?debug=1`** to any URL. Every event is logged to the browser console (name, params, event_id, sent / waiting for consent), and a "Tracking debug" badge appears. The cookie banner shows even with no IDs. `?debug=0` turns it off.
- **Meta:** Events Manager → your Pixel → **Test events**. Set `META_TEST_EVENT_CODE` in Vercel to see server events too. Browser and server events should show as *Deduplicated*. Remove the code when you're done.
- **GA4:** Admin → **DebugView**. Install the "Google Analytics Debugger" Chrome extension, or browse with it on.
- **TikTok:** install the **TikTok Pixel Helper** Chrome extension, open the site, click Accept, then click around.
- Click **Accept** in the cookie banner first. "Cookie settings" in the footer brings the banner back.

### 4. Feed and sitemap

`npm run build` runs both automatically, and Vercel builds keep them up to date.

- `npm run feed` writes `public/feeds/meta-catalog.csv` and `public/feeds/tiktok-catalog.csv` from `products.json`. It also writes a 1200×1200 JPG per product to `public/images/share/`, which is used for the feed `image_link` and for the product page link preview. Products without a price (`priceOnRequest: true`) are skipped, because the catalogues reject items with no price.
  - Meta: Commerce Manager → Catalogue → Data sources → Data feed → scheduled URL `https://evstyle.am/feeds/meta-catalog.csv`.
  - TikTok: Catalog Manager → Add products → Data feed → `https://evstyle.am/feeds/tiktok-catalog.csv`.
- `npm run sitemap` writes `public/sitemap.xml` (hy / en / ru, catalogue, model pages, products, with hreflang) and `public/robots.txt`. Submit `https://evstyle.am/sitemap.xml` in Google Search Console.

### 5. UTM links for ads

```
https://evstyle.am/?utm_source=fb&utm_medium=paid&utm_campaign=logo_nov
https://evstyle.am/product/glowing-deepal-logo?utm_source=ig&utm_medium=paid&utm_campaign=logo_nov&utm_content=reel1
https://evstyle.am/en/catalog/s07?utm_source=tt&utm_medium=paid&utm_campaign=s07_interior
```

Keep `utm_source` and `utm_campaign` short and lowercase, because they become the `(ref: …)` tag. Meta adds `fbclid` and TikTok adds `ttclid` automatically. In Meta Ads you can put the UTMs in **URL parameters**: `utm_source=fb&utm_medium=paid&utm_campaign={{campaign.name}}`.

## Deploy (Vercel)

1. Import the GitHub repo on [vercel.com](https://vercel.com). `vercel.json` already sets up the build.
2. Vercel → Settings → Domains: add `evstyle.am` **and** `www.evstyle.am`. `vercel.json` 301-redirects `www` → `evstyle.am`.
3. The site address used for canonical URLs, hreflang, Open Graph, the sitemap and the feeds is `siteUrl` in `src/config/site.ts` (`https://evstyle.am`).
4. For Conversions API, set the env vars from *Tracking & Ads* above.

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
  prerender.mjs         static HTML for every page
  build-sitemap.ts      public/sitemap.xml + robots.txt
  build-feed.ts         Meta / TikTok catalogue CSV feeds + share images
api/
  meta-capi.ts          Meta Conversions API relay (Vercel Function)
src/
  config/               site.ts (business settings), catalog.json (models, categories, colours)
  data/                 products.json, reviews.json, faq.json
  locales/              hy.json, en.json, ru.json
  lib/                  products (data access), contact (Messenger/WhatsApp links), analytics (tracking), utm, i18n, seo, toast
  hooks/                useLang, useModelName, useScrolled, useAutoplayInView
  components/
    layout/             Header, Footer, LanguageSwitcher, MobileContactBar, SocialDock, ContactChips, Seo, LangLayout, CookieConsent
    sections/           Hero, ProductsGrid, HowToOrder, WhyUs, Gallery, Reviews, FAQ, FollowUs, Contact
    product/            ProductCard, ProductBadges, ProductImage, ColorDots, CatalogCta, MoreProductsNote
    ui/                 Button, ContactButton (+ FollowLink), Accordion, Chip, Reveal, SectionTitle, Toast, BrandIcons
  pages/                Home, Catalog, Product, NotFound
  entry-server.tsx      used at build time for pre-rendering
```
