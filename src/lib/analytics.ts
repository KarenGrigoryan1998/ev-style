/**
 * One tracking module: Meta Pixel (+ Conversions API via /api/meta-capi), GA4 and TikTok Pixel.
 *
 * - IDs live in src/config/site.ts → `analytics`. A platform is used only when its ID is set.
 * - Nothing loads before the visitor clicks "Accept" in the cookie banner. Events fired while the
 *   banner is still open are kept in memory and sent on "Accept" (dropped on "Only necessary").
 * - Scripts are injected when the browser is idle after the page has loaded (keeps Lighthouse 90+).
 * - Every event gets a unique event_id, shared by the Pixel and the Conversions API (de-duplication).
 * - `?debug=1` in the URL logs every event to the console and shows a "Tracking debug" badge.
 */
import { site } from '@/config/site'
import type { Product } from './types'
import { getUtmParams, setFbcCookie, type UtmParams } from './utm'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: any
    _fbq?: any
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    ttq?: any
    TiktokAnalyticsObject?: string
  }
}

export type EventName = 'PageView' | 'ViewContent' | 'Lead' | 'Contact'
export type ContactChannel = 'whatsapp' | 'viber' | 'messenger' | 'phone'
/** Where on the site the click happened */
export type Placement =
  | 'header'
  | 'hero'
  | 'product'
  | 'sticky'
  | 'floating'
  | 'contact'
  | 'footer'
  | 'products'
  | 'catalog'
  | 'faq'

export interface TrackParams {
  path?: string
  language?: string
  content_ids?: string[]
  content_name?: string
  content_category?: string
  value?: number
  currency?: string
  model?: string
  channel?: ContactChannel
  placement?: Placement
}

/** Event name per platform */
const PLATFORM: Record<EventName, { meta: string; ga: string; tiktok: string }> = {
  PageView: { meta: 'PageView', ga: 'page_view', tiktok: 'PageView' },
  ViewContent: { meta: 'ViewContent', ga: 'view_item', tiktok: 'ViewContent' },
  Lead: { meta: 'Lead', ga: 'generate_lead', tiktok: 'SubmitForm' },
  Contact: { meta: 'Contact', ga: 'contact', tiktok: 'Contact' },
}

const ids = site.analytics
/** true when at least one tracking ID is set in site.ts */
export const trackingEnabled = Boolean(ids.metaPixelId || ids.ga4Id || ids.tiktokPixelId)

/* ───────────── Consent ───────────── */

export type Consent = 'all' | 'necessary'
const CONSENT_KEY = 'evstyle-consent'
let consent: Consent | null | undefined
const consentListeners = new Set<() => void>()

export function getConsent(): Consent | null {
  if (consent === undefined) {
    try {
      const v = localStorage.getItem(CONSENT_KEY)
      consent = v === 'all' || v === 'necessary' ? v : null
    } catch {
      consent = null
    }
  }
  return consent
}

/** 'all' = Accept, 'necessary' = Only necessary, null = ask again (shows the banner) */
export function setConsent(value: Consent | null) {
  const prev = getConsent()
  consent = value
  try {
    if (value) localStorage.setItem(CONSENT_KEY, value)
    else localStorage.removeItem(CONSENT_KEY)
  } catch {
    /* storage unavailable — choice lasts for this page view */
  }
  consentListeners.forEach((fn) => fn())
  if (value === 'all') {
    start()
    pending.splice(0).forEach(dispatch)
  } else if (value === 'necessary') {
    pending.length = 0
    // Scripts already running can't be unloaded — reload without them
    if (prev === 'all') window.location.reload()
  }
}

export function subscribeConsent(fn: () => void) {
  consentListeners.add(fn)
  return () => void consentListeners.delete(fn)
}

/* ───────────── Debug (?debug=1) ───────────── */

const DEBUG_KEY = 'evstyle-debug'
let debug: boolean | undefined
const debugListeners = new Set<(name: EventName) => void>()

export function isDebug(): boolean {
  if (typeof window === 'undefined') return false
  if (debug === undefined) {
    const q = new URLSearchParams(window.location.search).get('debug')
    try {
      if (q === '1') sessionStorage.setItem(DEBUG_KEY, '1')
      if (q === '0') sessionStorage.removeItem(DEBUG_KEY)
      debug = sessionStorage.getItem(DEBUG_KEY) === '1'
    } catch {
      debug = q === '1'
    }
  }
  return debug
}

export function onDebugEvent(fn: (name: EventName) => void) {
  debugListeners.add(fn)
  return () => void debugListeners.delete(fn)
}

/* ───────────── Tracking ───────────── */

interface QueuedEvent {
  name: EventName
  params: TrackParams & UtmParams
  id: string
  url: string
}

const pending: QueuedEvent[] = []

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })

/** Send one event to every configured platform (Meta Pixel + CAPI, GA4, TikTok). */
export function track(name: EventName, params: TrackParams = {}) {
  if (typeof window === 'undefined') return
  const ev: QueuedEvent = { name, params: { ...getUtmParams(), ...params }, id: uuid(), url: window.location.href }
  const c = getConsent()

  if (isDebug()) {
    const status = !trackingEnabled ? 'not sent (no IDs in site.ts)' : c === 'all' ? 'sent' : c === 'necessary' ? 'not sent (only necessary)' : 'waiting for consent'
    console.log(`%c[track] ${name}`, 'color:#71DB3D;font-weight:bold', { event_id: ev.id, params: ev.params, status })
    debugListeners.forEach((fn) => fn(name))
  }

  if (!trackingEnabled || c === 'necessary') return
  if (c === null) {
    if (pending.length < 30) pending.push(ev)
    return
  }
  start()
  dispatch(ev)
}

let lastPageView = ''
/** PageView on route change (skips repeats of the same path, e.g. React StrictMode double effects) */
export function trackPageView(path: string, language: string) {
  if (path === lastPageView) return
  lastPageView = path
  track('PageView', { path, language })
}

/** Standard params for a product (same `id` as the catalogue feed → content_ids) */
export function productParams(p: Product, model?: string): TrackParams {
  return {
    content_ids: [p.id],
    content_name: p.name.en,
    content_category: p.category,
    ...(p.price != null && !p.priceOnRequest ? { value: p.price } : {}),
    currency: site.commerce.currency,
    model: model ?? p.models.join(','),
  }
}

/** Call once when the app starts: loads tracking if the visitor already accepted earlier. */
export function initAnalytics() {
  if (trackingEnabled && getConsent() === 'all') start()
}

/* ───────────── Platforms ───────────── */

const clean = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '')) as Partial<T>

function metaData(p: QueuedEvent['params']) {
  return clean({ ...p, content_type: p.content_ids ? 'product' : undefined })
}

function gaData(name: EventName, p: QueuedEvent['params'], id: string, url: string) {
  const { content_ids, content_name, content_category, value, currency, path, ...rest } = p
  const base = { ...rest, event_id: id }
  if (name === 'PageView') return clean({ ...base, page_path: path, page_location: url })
  return clean({
    ...base,
    currency: content_ids ? currency : undefined,
    value,
    items: content_ids?.map((item_id) => clean({ item_id, item_name: content_name, item_category: content_category, price: value })),
  })
}

function tiktokData(p: QueuedEvent['params']) {
  const { content_ids, content_name, value, currency, channel, placement, model } = p
  return clean({
    contents: content_ids?.map((content_id) => clean({ content_id, content_name, content_type: 'product', price: value })),
    content_type: content_ids ? 'product' : undefined,
    value,
    currency: content_ids ? currency : undefined,
    channel,
    placement,
    model,
  })
}

function dispatch(ev: QueuedEvent) {
  const map = PLATFORM[ev.name]
  if (ids.metaPixelId && window.fbq) {
    const data = metaData(ev.params)
    window.fbq('track', map.meta, data, { eventID: ev.id })
    sendToConversionsApi(map.meta, ev, data)
  }
  if (ids.ga4Id && window.gtag) window.gtag('event', map.ga, gaData(ev.name, ev.params, ev.id, ev.url))
  if (ids.tiktokPixelId && window.ttq) {
    if (ev.name === 'PageView') window.ttq.page()
    else window.ttq.track(map.tiktok, tiktokData(ev.params), { event_id: ev.id })
  }
}

const readCookie = (name: string) => document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))?.[1]

/** Same event, same event_id, server-side → Meta de-duplicates it with the Pixel event */
function sendToConversionsApi(eventName: string, ev: QueuedEvent, customData: Record<string, unknown>) {
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(window.location.hostname)) return
  try {
    void fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        event_id: ev.id,
        event_source_url: ev.url,
        custom_data: customData,
        fbp: readCookie('_fbp'),
        fbc: readCookie('_fbc'),
      }),
    }).catch(() => {})
  } catch {
    /* never break the page because of tracking */
  }
}

let started = false

/** Creates the platform stubs now (they queue calls) and loads the real scripts when the browser is idle */
function start() {
  if (started || !trackingEnabled || typeof window === 'undefined') return
  started = true
  setFbcCookie()
  const scripts: string[] = []

  if (ids.metaPixelId && !window.fbq) {
    const n: any = function (...args: unknown[]) {
      n.callMethod ? n.callMethod(...args) : n.queue.push(args)
    }
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    // We send PageView ourselves on every route change — stop the Pixel from adding its own on history changes
    n.disablePushState = true
    window.fbq = n
    window._fbq = n
    window.fbq('set', 'autoConfig', false, ids.metaPixelId)
    window.fbq('init', ids.metaPixelId)
    scripts.push('https://connect.facebook.net/en_US/fbevents.js')
  }

  if (ids.ga4Id && !window.gtag) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', ids.ga4Id, { send_page_view: false })
    scripts.push(`https://www.googletagmanager.com/gtag/js?id=${ids.ga4Id}`)
  }

  if (ids.tiktokPixelId && !window.ttq) {
    /* Standard TikTok Pixel bootstrap (queue stub) — events.js is loaded by ttq.load() below */
    const w = window as any
    const t = 'ttq'
    w.TiktokAnalyticsObject = t
    const ttq: any = (w[t] = w[t] || [])
    ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent']
    ttq.setAndDefer = (o: any, m: string) => {
      o[m] = (...args: unknown[]) => o.push([m, ...args])
    }
    for (const m of ttq.methods) ttq.setAndDefer(ttq, m)
    ttq.instance = (id: string) => {
      const e = ttq._i[id] || []
      for (const m of ttq.methods) ttq.setAndDefer(e, m)
      return e
    }
    ttq.load = (id: string, opts?: unknown) => {
      const r = 'https://analytics.tiktok.com/i18n/pixel/events.js'
      ttq._i = ttq._i || {}
      ttq._i[id] = []
      ttq._i[id]._u = r
      ttq._t = ttq._t || {}
      ttq._t[id] = +new Date()
      ttq._o = ttq._o || {}
      ttq._o[id] = opts || {}
      const s = document.createElement('script')
      s.async = true
      s.src = `${r}?sdkid=${id}&lib=${t}`
      document.head.appendChild(s)
    }
  }

  whenIdle(() => {
    for (const src of scripts) {
      const s = document.createElement('script')
      s.async = true
      s.src = src
      document.head.appendChild(s)
    }
    if (ids.tiktokPixelId) window.ttq?.load(ids.tiktokPixelId)
  })
}

function whenIdle(fn: () => void) {
  const schedule = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: 4000 })
    else setTimeout(fn, 1500)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
}
