import { site } from '@/config/site'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

let started = false

/** Loads Meta Pixel / GA4 only if IDs are set in site.ts. Called once after the page is interactive. */
export function initAnalytics() {
  if (started || typeof window === 'undefined') return
  started = true
  const { metaPixelId, gaId } = site.analytics

  if (gaId) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId, { send_page_view: false })
  }

  if (metaPixelId) {
    /* Standard Meta Pixel bootstrap */
    const f = window as unknown as Record<string, unknown>
    if (!f.fbq) {
      const n: any = function (...args: unknown[]) {
        n.callMethod ? n.callMethod(...args) : n.queue.push(args)
      }
      n.push = n
      n.loaded = true
      n.version = '2.0'
      n.queue = []
      f.fbq = n
      f._fbq = n
      const s = document.createElement('script')
      s.async = true
      s.src = 'https://connect.facebook.net/en_US/fbevents.js'
      document.head.appendChild(s)
    }
    window.fbq!('init', metaPixelId)
  }
}

export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', { page_path: path })
  window.fbq?.('track', 'PageView')
}

/** A click on WhatsApp / call / Messenger etc. */
export function trackLead(channel: string, label?: string) {
  window.gtag?.('event', 'generate_lead', { method: channel, item_name: label })
  window.fbq?.('track', 'Contact', { content_name: label, channel })
}
