/**
 * ⭐ All business settings in one place.
 * Change a value here and it updates everywhere on the site.
 * Values marked TODO are placeholders — replace them before going live.
 */
export const site = {
  brand: 'EVStyle',
  /** Full name used in SEO, schema.org, copyright and social handles */
  brandFull: 'EVStyle Armenia',
  /** Public address — set automatically at build time (Vercel production domain, or SITE_URL env). See vite.config.ts */
  url: __SITE_URL__,

  contacts: {
    /** Shown on the site */
    phoneDisplay: '+374 77 31 65 66',
    /** Used for tel: links */
    phone: '+37477316566',
    /** WhatsApp number, digits only, no + */
    whatsapp: '37477316566',
    /** Viber number, digits only with country code */
    viber: '37477316566',
    /** Facebook Messenger (m.me/<page id>) */
    messenger: 'https://m.me/61594849786252',
    email: '',
  },

  /** Order here = order on the site (Facebook first, then Instagram, then TikTok) */
  social: {
    facebook: { handle: 'EVStyle Armenia', url: 'https://www.facebook.com/profile.php?id=61594849786252' },
    instagram: { handle: '@evstyle_armenia', url: 'https://www.instagram.com/evstyle_armenia' },
    tiktok: { handle: '@evstyle.armenia', url: 'https://www.tiktok.com/@evstyle.armenia' },
  },

  location: {
    city: 'Yerevan',
    country: 'AM',
    /** Street address per language */
    address: {
      hy: 'Հակոբ Հակոբյան 8 (Մերգելյանի ինստիտուտի մոտ), Երևան',
      en: 'Hakob Hakobyan 8 (near Mergelyan Institute), Yerevan',
      ru: 'Акоп Акопян 8 (возле института Мергеляна), Ереван',
    },
    /** Optional exact pin for schema.org (Google Maps → right click → copy coordinates). null = not published */
    coordinates: null as { lat: number; lng: number } | null,
    /** What the map searches for */
    mapQuery: 'Hakob Hakobyan 8, Yerevan',
  },

  hours: {
    hy: 'Ամեն օր՝ 10:00–23:00',
    en: 'Every day 10:00–23:00',
    ru: 'Ежедневно 10:00–23:00',
  },
  /** For schema.org */
  openingHoursSpec: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '10:00', closes: '23:00' },
  ],

  commerce: {
    currency: 'AMD',
    /** false = prices are hidden, cards say "Price — message us" (prices stay in products.json) */
    showPrices: false,
    freeDeliveryThreshold: 15000,
    preorderDiscountPercent: 10,
    inStockDeliveryDays: '1–2',
    preorderWeeks: '2–4',
  },

  analytics: {
    /** Meta (Facebook) Pixel ID, e.g. '1234567890'. Empty = disabled */
    metaPixelId: '',
    /** Google Analytics 4 ID, e.g. 'G-XXXXXXX'. Empty = disabled */
    gaId: '',
  },
} as const

