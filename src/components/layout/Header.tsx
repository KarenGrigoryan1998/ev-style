import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { HashLink } from './HashLink'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Button } from '@/components/ui/Button'
import { MessengerIcon } from '@/components/ui/BrandIcons'
import { useLang } from '@/hooks/useLang'
import { useScrolled } from '@/hooks/useScrolled'
import { messengerLink, onContactClick } from '@/lib/contact'
import { hasReviews } from '@/lib/products'

/** Menu items: `id` = section on the home page, `to` = separate page */
export type NavItem = { key: string; id?: string; to?: string }
export const NAV: NavItem[] = [
  { id: 'products', key: 'nav.products' },
  { to: '/catalog', key: 'nav.catalog' },
  { id: 'how-to-order', key: 'nav.howToOrder' },
  ...(hasReviews() ? [{ id: 'reviews', key: 'nav.reviews' }] : []),
  { id: 'faq', key: 'nav.faq' },
  { id: 'contact', key: 'nav.contact' },
]

/** Renders a menu item as a section link or a page link */
export function NavEntry({ item, className, onClick }: { item: NavItem; className?: string; onClick?: () => void }) {
  const { t, to } = useLang()
  if (item.to) {
    return (
      <Link to={to(item.to)} className={className} onClick={onClick}>
        {t(item.key)}
      </Link>
    )
  }
  return (
    <HashLink id={item.id!} className={className} onClick={onClick}>
      {t(item.key)}
    </HashLink>
  )
}

export function Header() {
  const { t } = useLang()
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'border-b border-white/[0.06] bg-night-900/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-ev focus:px-4 focus:py-2 focus:text-night-950">
        {t('nav.skip')}
      </a>
      <div className="container flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavEntry key={n.key} item={n} className="rounded-lg px-3 py-2 text-sm text-mist-300 transition-colors hover:bg-white/[0.04] hover:text-white" />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Button
            href={messengerLink()}
            variant="facebook"
            size="sm"
            icon={<MessengerIcon size={18} />}
            className="hidden md:inline-flex"
            onClick={onContactClick('messenger', 'header')}
          >
            {t('common.writeUs')}
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('nav.close') : t('nav.menu')}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.08] text-white lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/[0.06] bg-night-900 lg:hidden"
          >
            <nav className="container flex flex-col py-6" aria-label="Mobile">
              {NAV.map((n, i) => (
                <m.div key={n.key} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <NavEntry item={n} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-white/[0.05] py-4 text-lg font-medium text-white" />
                </m.div>
              ))}
              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm text-mist-500">{t('common.language')}</span>
                <LanguageSwitcher />
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
