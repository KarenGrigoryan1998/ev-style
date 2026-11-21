import { site } from '@/config/site'
import { LANGS, localizedPath } from './i18n'
import { imgSrc } from './products'
import type { Lang, Product } from './types'

const abs = (path: string) => `${site.url.replace(/\/$/, '')}${path}`

/** hreflang alternates for a language-neutral path like '/catalog' */
export function alternates(path: string) {
  return [
    ...LANGS.map((l) => ({ hrefLang: l, href: abs(localizedPath(l, path)) })),
    { hrefLang: 'x-default', href: abs(localizedPath('hy', path)) },
  ]
}

export const canonical = (lang: Lang, path: string) => abs(localizedPath(lang, path))
export const absoluteUrl = abs

export const OG_LOCALE: Record<Lang, string> = { hy: 'hy_AM', en: 'en_US', ru: 'ru_RU' }

/** schema.org Store / LocalBusiness */
export function storeJsonLd(lang: Lang) {
  const sameAs = [site.social.facebook.url, site.social.instagram.url, site.social.tiktok.url]
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    '@id': abs('/#store'),
    name: site.brandFull,
    url: abs(localizedPath(lang, '/')),
    logo: abs('/images/logo.png'),
    image: abs('/images/og-image.jpg'),
    telephone: site.contacts.phone,
    priceRange: '֏֏',
    currenciesAccepted: site.commerce.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.location.address.en,
      addressLocality: site.location.city,
      addressCountry: site.location.country,
    },
    ...(site.location.coordinates
      ? { geo: { '@type': 'GeoCoordinates', latitude: site.location.coordinates.lat, longitude: site.location.coordinates.lng } }
      : {}),
    openingHoursSpecification: site.openingHoursSpec.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs,
    contactPoint: { '@type': 'ContactPoint', telephone: site.contacts.phone, contactType: 'sales', availableLanguage: ['hy', 'en', 'ru'] },
  }
}

/** schema.org Product */
export function productJsonLd(p: Product, lang: Lang) {
  const url = abs(localizedPath(lang, `/product/${p.slug}`))
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name[lang],
    description: p.description[lang],
    sku: p.id,
    category: p.category,
    brand: { '@type': 'Brand', name: site.brand },
    image: p.images.map((i) => abs(imgSrc(i, 1440))),
    url,
  }
  if (site.commerce.showPrices && !p.priceOnRequest && p.price != null) {
    data.offers = {
      '@type': p.priceMax ? 'AggregateOffer' : 'Offer',
      priceCurrency: site.commerce.currency,
      ...(p.priceMax ? { lowPrice: p.price, highPrice: p.priceMax } : { price: p.price }),
      availability: p.status === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: { '@id': abs('/#store') },
      url,
    }
  }
  return data
}
