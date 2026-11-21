import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { DEFAULT_LANG, isLang, localizedPath } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

/** Current language + helper to build language-prefixed links */
export function useLang() {
  const { i18n, t } = useTranslation()
  const lang: Lang = isLang(i18n.language) ? i18n.language : DEFAULT_LANG
  const to = useCallback((path = '/') => localizedPath(lang, path), [lang])
  return { lang, to, t }
}
