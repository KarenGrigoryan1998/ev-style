/**
 * Meta Conversions API relay (Vercel Function) — POST /api/meta-capi
 *
 * The browser (src/lib/analytics.ts) sends every Meta event here too, with the same event_id as the Pixel,
 * so Meta counts it once and still gets it when the Pixel is blocked (ad blockers, iOS).
 *
 * Vercel → Settings → Environment Variables:
 *   META_CAPI_TOKEN        Events Manager → your Pixel → Settings → Conversions API → Generate access token
 *   META_PIXEL_ID          the same Pixel ID as in src/config/site.ts
 *   META_TEST_EVENT_CODE   optional, e.g. TEST12345 (Events Manager → Test events) — remove after testing
 * Missing token / pixel → does nothing and returns 204.
 */

/** Graph API version — update here if Meta retires it */
const GRAPH_VERSION = 'v24.0'
const EVENTS = new Set(['PageView', 'ViewContent', 'Lead', 'Contact'])
const CUSTOM_KEYS = [
  'value',
  'currency',
  'content_ids',
  'content_name',
  'content_type',
  'content_category',
  'model',
  'channel',
  'placement',
  'path',
  'language',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

const noContent = () => new Response(null, { status: 204 })
const str = (v: unknown, max = 500) => (typeof v === 'string' && v.length > 0 ? v.slice(0, max) : undefined)

function cookie(header: string | null, name: string) {
  const m = header?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  if (!m) return undefined
  try {
    return decodeURIComponent(m[1])
  } catch {
    return m[1]
  }
}

function customData(input: unknown) {
  if (!input || typeof input !== 'object') return {}
  const src = input as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const k of CUSTOM_KEYS) {
    const v = src[k]
    if (k === 'value') {
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) out.value = v
    } else if (k === 'content_ids') {
      if (Array.isArray(v)) out.content_ids = v.filter((x) => typeof x === 'string').slice(0, 20).map((x) => x.slice(0, 100))
    } else {
      const s = str(v, 200)
      if (s) out[k] = s
    }
  }
  return out
}

export async function POST(request: Request): Promise<Response> {
  const token = process.env.META_CAPI_TOKEN
  const pixelId = process.env.META_PIXEL_ID
  if (!token || !pixelId) return noContent()

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return noContent()
  }

  const eventName = str(body.event_name, 50)
  const eventId = str(body.event_id, 100)
  if (!eventName || !EVENTS.has(eventName) || !eventId) return noContent()

  const headers = request.headers
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || undefined
  const cookies = headers.get('cookie')

  const userData = Object.fromEntries(
    Object.entries({
      client_user_agent: headers.get('user-agent') || undefined,
      client_ip_address: ip,
      fbp: cookie(cookies, '_fbp') ?? str(body.fbp, 200),
      fbc: cookie(cookies, '_fbc') ?? str(body.fbc, 500),
    }).filter(([, v]) => v),
  )

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: str(body.event_source_url, 1000) ?? headers.get('referer') ?? undefined,
        action_source: 'website',
        user_data: userData,
        custom_data: customData(body.custom_data),
      },
    ],
  }
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) console.error('[meta-capi]', res.status, (await res.text()).slice(0, 500))
  } catch (err) {
    console.error('[meta-capi] request failed', err)
  }
  // Always quiet for the browser
  return noContent()
}
