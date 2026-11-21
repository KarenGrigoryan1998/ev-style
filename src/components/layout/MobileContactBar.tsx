import { Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, TikTokIcon, ViberIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { site } from '@/config/site'
import { useLang } from '@/hooks/useLang'
import { buildWhatsAppLink, onContactClick, phoneLink, viberLink } from '@/lib/contact'

/** Sticky bottom bar on phones: Facebook · Instagram · TikTok · WhatsApp · Viber · Call */
export function MobileContactBar() {
  const { t, lang } = useLang()
  const item = 'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors active:bg-white/5'
  const ext = { target: '_blank', rel: 'noopener noreferrer' }
  return (
    <nav
      aria-label={t('nav.contact')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-night-900/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="flex h-[4.25rem] items-stretch divide-x divide-white/[0.06]">
        <a href={site.social.facebook.url} {...ext} className={`${item} text-[#5AA2FF]`} onClick={onContactClick('facebook', 'mobile-bar')}>
          <FacebookIcon size={22} />
          Facebook
        </a>
        <a href={site.social.instagram.url} {...ext} className={`${item} text-[#F0679B]`} onClick={onContactClick('instagram', 'mobile-bar')}>
          <InstagramIcon size={22} />
          Instagram
        </a>
        <a href={site.social.tiktok.url} {...ext} className={`${item} text-white`} onClick={onContactClick('tiktok', 'mobile-bar')}>
          <TikTokIcon size={22} />
          TikTok
        </a>
        <a href={buildWhatsAppLink(undefined, undefined, lang)} {...ext} className={`${item} text-[#25D366]`} onClick={onContactClick('whatsapp', 'mobile-bar')}>
          <WhatsAppIcon size={22} />
          WhatsApp
        </a>
        <a href={viberLink()} className={`${item} text-[#A78BFA]`} onClick={onContactClick('viber', 'mobile-bar')}>
          <ViberIcon size={22} />
          Viber
        </a>
        <a href={phoneLink()} className={`${item} text-ev`} onClick={onContactClick('phone', 'mobile-bar')}>
          <Phone size={21} aria-hidden />
          {t('common.call')}
        </a>
      </div>
    </nav>
  )
}
