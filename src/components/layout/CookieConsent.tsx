import { useEffect, useState } from 'react'
import { buttonClass } from '@/components/ui/Button'
import { useLang } from '@/hooks/useLang'
import { getConsent, isDebug, onDebugEvent, setConsent, subscribeConsent, trackingEnabled, type EventName } from '@/lib/analytics'

/**
 * Cookie banner: one short notice with a single "OK" button that allows ads/analytics.
 * Shown only when a tracking ID is set in site.ts (or with ?debug=1). Client-only, so pre-rendered HTML stays the same.
 */
export function CookieConsent() {
  const { t } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const update = () => setShow((trackingEnabled || isDebug()) && getConsent() === null)
    update()
    return subscribeConsent(update)
  }, [])

  if (!show) return null
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('consent.title')}
      className="fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom)+0.75rem)] z-50 rounded-2xl border border-white/10 bg-night-850/95 p-4 shadow-card backdrop-blur-xl md:bottom-6 md:left-6 md:right-auto md:max-w-sm"
    >
      <div className="flex items-center gap-3">
        <p className="flex-1 text-sm text-mist-300">{t('consent.text')}</p>
        <button type="button" onClick={() => setConsent('all')} className={buttonClass('primary', 'sm')}>
          {t('consent.accept')}
        </button>
      </div>
    </div>
  )
}

/** Small badge shown with ?debug=1 — every tracked event is also logged to the console */
export function TrackingDebugBadge() {
  const [on, setOn] = useState(false)
  const [last, setLast] = useState<{ name: EventName; n: number } | null>(null)

  useEffect(() => {
    if (!isDebug()) return
    setOn(true)
    return onDebugEvent((name) => setLast((p) => ({ name, n: (p?.n ?? 0) + 1 })))
  }, [])

  if (!on) return null
  return (
    <div className="pointer-events-none fixed left-3 top-20 z-[60] rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-night-950 shadow-card">
      Tracking debug{last && ` · ${last.n} · ${last.name}`}
    </div>
  )
}
