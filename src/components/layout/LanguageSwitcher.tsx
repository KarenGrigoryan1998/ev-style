import { Link, useLocation } from 'react-router-dom'
import { LANGS, LANG_LABELS, localizedPath, storeLang, stripLang } from '@/lib/i18n'
import { useLang } from '@/hooks/useLang'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, t } = useLang()
  const { pathname, search, hash } = useLocation()
  const base = stripLang(pathname)
  return (
    <nav aria-label={t('common.language')} className={`inline-flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5 ${className}`}>
      {LANGS.map((l) => {
        const active = l === lang
        return (
          <Link
            key={l}
            to={`${localizedPath(l, base)}${search}${hash}`}
            onClick={() => storeLang(l)}
            hrefLang={l}
            lang={l}
            aria-current={active ? 'true' : undefined}
            className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold tracking-wide transition-colors ${
              active ? 'bg-ev/15 text-ev' : 'text-mist-400 hover:text-white'
            }`}
          >
            {LANG_LABELS[l]}
          </Link>
        )
      })}
    </nav>
  )
}
