import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import hy from '@/locales/hy.json'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'
import { site } from '@/config/site'
import { formatAmd } from './formatPrice'
import type { Lang } from './types'

export const LANGS: Lang[] = ['hy', 'en', 'ru']
export const DEFAULT_LANG: Lang = 'hy'
export const LANG_LABELS: Record<Lang, string> = { hy: 'ՀԱՅ', en: 'ENG', ru: 'РУС' }
export const LANG_STORAGE_KEY = 'evstyle-lang'

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && (LANGS as string[]).includes(v)

/** Builds a language-prefixed path: ('en', '/catalog') → '/en/catalog', ('hy', '/') → '/' */
export function localizedPath(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (lang === DEFAULT_LANG) return clean
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`
}

/** Strips the language prefix: '/en/catalog' → '/catalog' */
export function stripLang(pathname: string): string {
  const m = pathname.match(/^\/(en|ru)(\/.*)?$/)
  return m ? m[2] || '/' : pathname
}

export function getStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY)
    return isLang(v) ? v : null
  } catch {
    return null
  }
}

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    /* storage unavailable — ignore */
  }
}

const c = site.commerce
const urlLang = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : ''

i18n.use(initReactI18next).init({
  resources: { hy: { translation: hy }, en: { translation: en }, ru: { translation: ru } },
  lng: isLang(urlLang) ? urlLang : DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: {
    escapeValue: false,
    // Business values from site.ts are available in every translation string
    defaultVariables: {
      freeFrom: formatAmd(c.freeDeliveryThreshold),
      percent: c.preorderDiscountPercent,
      days: c.inStockDeliveryDays,
      weeks: c.preorderWeeks,
    },
  },
  returnNull: false,
})

export default i18n
