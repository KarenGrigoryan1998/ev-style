import { PackageSearch } from 'lucide-react'
import { InstagramIcon, MessengerIcon, TikTokIcon, ViberIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { buttonClass } from '@/components/ui/Button'
import { useLang } from '@/hooks/useLang'
import { site } from '@/config/site'
import { buildWhatsAppLink, messengerLink, onContactClick, viberLink } from '@/lib/contact'

/** Highlighted note: the site doesn't list every product — ask us for the full range */
export function MoreProductsNote({ className = '', where }: { className?: string; where: string }) {
  const { t, lang } = useLang()
  // Priority: Messenger (primary) → Instagram → TikTok → WhatsApp → Viber
  const secondary = [
    { key: 'instagram', label: 'Instagram', href: site.social.instagram.url, Icon: InstagramIcon, color: 'text-[#F0679B]' },
    { key: 'tiktok', label: 'TikTok', href: site.social.tiktok.url, Icon: TikTokIcon, color: 'text-white' },
    { key: 'whatsapp', label: 'WhatsApp', href: buildWhatsAppLink(undefined, undefined, lang), Icon: WhatsAppIcon, color: 'text-[#25D366]' },
    { key: 'viber', label: 'Viber', href: viberLink(), Icon: ViberIcon, color: 'text-[#A78BFA]' },
  ]
  return (
    <aside
      className={`relative overflow-hidden rounded-2xl border border-ev/30 bg-gradient-to-r from-ev/[0.10] via-ev/[0.05] to-transparent p-5 sm:p-6 ${className}`}
      aria-label={t('moreProducts.title')}
    >
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-ev/20 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
        <div className="flex gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ev/30 bg-night-900 text-ev shadow-glow">
            <PackageSearch size={22} aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-white">{t('moreProducts.title')}</p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-mist-300">{t('moreProducts.text')}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <a
            href={messengerLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onContactClick('messenger', `more-products-${where}`)}
            className={buttonClass('facebook', 'md', 'w-full sm:w-auto')}
          >
            <MessengerIcon size={18} /> {t('moreProducts.ctaMessenger')}
          </a>
          <div className="grid grid-cols-4 gap-2 sm:flex">
            {secondary.map(({ key, label, href, Icon, color }) => (
              <a
                key={key}
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={onContactClick(key, `more-products-${where}`)}
                className={buttonClass('secondary', 'md', 'min-w-0 !h-auto flex-col !gap-1 !px-2 py-2.5 text-xs sm:!h-11 sm:flex-row sm:!gap-1.5 sm:!px-3 sm:py-0 sm:text-sm')}
              >
                <Icon size={18} className={`shrink-0 ${color}`} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
