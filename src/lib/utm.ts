/**
 * Ad click / campaign parameters.
 * Saved for the browser session on landing (sessionStorage), added to every tracked event
 * and turned into a short "(ref: fb_logo_nov)" tag in the pre-filled order message.
 */

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid'] as const
export type UtmKey = (typeof KEYS)[number]
export type UtmParams = Partial<Record<UtmKey, string>>

const STORAGE_KEY = 'evstyle-utm'
let memory: UtmParams = {}

/** Call once on page load. A new ad click (URL with any of the keys) replaces the saved values. */
export function captureUtm() {
  if (typeof window === 'undefined') return
  const q = new URLSearchParams(window.location.search)
  const found: UtmParams = {}
  for (const k of KEYS) {
    const v = q.get(k)?.trim()
    if (v) found[k] = v.slice(0, 200)
  }
  if (Object.keys(found).length === 0) return
  memory = found
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found))
  } catch {
    /* storage unavailable — keep in memory */
  }
}

export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as UtmParams
  } catch {
    /* ignore */
  }
  return memory
}

const slug = (s = '') =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

/** Short campaign tag from utm_source + utm_campaign, e.g. "fb_logo_nov". Empty when there are no UTMs. */
export function campaignRef(): string {
  const { utm_source, utm_campaign } = getUtmParams()
  return [slug(utm_source), slug(utm_campaign)].filter(Boolean).join('_').slice(0, 40)
}

/**
 * Sets the `_fbc` cookie (fb.1.<timestamp>.<fbclid>) so the Conversions API can match the ad click.
 * Only called after the visitor accepted cookies.
 */
export function setFbcCookie() {
  const { fbclid } = getUtmParams()
  if (!fbclid || typeof document === 'undefined') return
  const current = document.cookie.match(/(?:^|;\s*)_fbc=([^;]*)/)?.[1]
  if (current?.endsWith(`.${fbclid}`)) return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `_fbc=fb.1.${Date.now()}.${fbclid}; Max-Age=7776000; Path=/; SameSite=Lax${secure}`
}
