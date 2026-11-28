import { LayoutGrid, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FacebookIcon, InstagramIcon, ViberIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { ContactButton, FollowLink } from '@/components/ui/ContactButton'
import { useLang } from '@/hooks/useLang'

/** Sticky bottom bar on phones: Facebook · Instagram · Catalog · WhatsApp · Viber · Call */
export function MobileContactBar() {
  const { t, to } = useLang()
  const item = 'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors active:bg-white/5'
  return (
    <nav
      aria-label={t('nav.contact')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-night-900/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="flex h-[4.25rem] items-stretch divide-x divide-white/[0.06]">
        <FollowLink network="facebook" className={`${item} text-[#5AA2FF]`}>
          <FacebookIcon size={22} />
          Facebook
        </FollowLink>
        <FollowLink network="instagram" className={`${item} text-[#F0679B]`}>
          <InstagramIcon size={22} />
          Instagram
        </FollowLink>
        <Link to={to('/catalog')} className={`${item} text-ev`}>
          <LayoutGrid size={22} aria-hidden />
          {t('nav.catalog')}
        </Link>
        <ContactButton channel="whatsapp" placement="sticky" className={`${item} text-[#25D366]`}>
          <WhatsAppIcon size={22} />
          WhatsApp
        </ContactButton>
        <ContactButton channel="viber" placement="sticky" className={`${item} text-[#A78BFA]`}>
          <ViberIcon size={22} />
          Viber
        </ContactButton>
        <ContactButton channel="phone" placement="sticky" className={`${item} text-ev`}>
          <Phone size={21} aria-hidden />
          {t('common.call')}
        </ContactButton>
      </div>
    </nav>
  )
}
