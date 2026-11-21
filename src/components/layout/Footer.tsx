import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NAV, NavEntry } from './Header'
import { SocialLinks } from './SocialLinks'
import { useLang } from '@/hooks/useLang'
import { site } from '@/config/site'

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="relative border-t border-white/[0.06] bg-night-950">
      <div className="glow-line absolute inset-x-0 top-0 h-px opacity-40" aria-hidden />
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_auto]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-mist-500">{t('footer.tagline')}</p>
          <SocialLinks className="mt-6" />
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-1">
          {NAV.map((n) => (
            <NavEntry key={n.key} item={n} className="text-mist-400 transition-colors hover:text-white" />
          ))}
        </nav>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <LanguageSwitcher />
          <p className="text-sm text-mist-500">{t('common.onlineStore')}</p>
        </div>
      </div>
      <div className="border-t border-white/[0.05]">
        <div className="container flex flex-col gap-2 py-6 text-xs text-mist-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.brandFull}. {t('footer.rights')}
          </p>
          <p className="max-w-md sm:text-right">{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
