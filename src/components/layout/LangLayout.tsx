import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LANG, getStoredLang, localizedPath } from '@/lib/i18n'
import { trackPageView } from '@/lib/analytics'
import type { Lang } from '@/lib/types'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileContactBar } from './MobileContactBar'
import { SocialDock } from './SocialDock'
import { Toast } from '@/components/ui/Toast'
import { CookieConsent, TrackingDebugBadge } from './CookieConsent'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Wraps every page: sets the language from the URL prefix (/, /en, /ru) and renders the chrome. */
export function LangLayout({ lang }: { lang: Lang }) {
  const { i18n } = useTranslation()
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()

  // Initial language comes from the URL at startup (lib/i18n.ts); this handles switching
  useIsoLayoutEffect(() => {
    if (i18n.language !== lang) void i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }, [lang, i18n])

  // Scroll to top on page change (but not on hash links)
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
    trackPageView(pathname, lang)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // A returning visitor who picked ENG/РУС before lands on "/" → send them to their language (once per mount)
  useEffect(() => {
    const stored = getStoredLang()
    if (lang === DEFAULT_LANG && stored && stored !== DEFAULT_LANG) {
      navigate(`${localizedPath(stored, pathname)}${search}${hash}`, { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <main id="main" className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <MobileContactBar />
      <SocialDock />
      <Toast />
      <CookieConsent />
      <TrackingDebugBadge />
    </>
  )
}
