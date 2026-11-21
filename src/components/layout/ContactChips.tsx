import { FacebookIcon, InstagramIcon, TikTokIcon, ViberIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { site } from '@/config/site'
import { useLang } from '@/hooks/useLang'
import { buildWhatsAppLink, messengerLink, onContactClick, viberLink } from '@/lib/contact'

/** Row of all our channels (priority order: Facebook → Instagram → TikTok → WhatsApp → Viber) */
export function ContactChips({ where, className = '' }: { where: string; className?: string }) {
  const { lang } = useLang()
  const items = [
    { key: 'messenger', label: 'Facebook', href: messengerLink(), Icon: FacebookIcon, color: 'text-[#5AA2FF]' },
    { key: 'instagram', label: 'Instagram', href: site.social.instagram.url, Icon: InstagramIcon, color: 'text-[#F0679B]' },
    { key: 'tiktok', label: 'TikTok', href: site.social.tiktok.url, Icon: TikTokIcon, color: 'text-white' },
    { key: 'whatsapp', label: 'WhatsApp', href: buildWhatsAppLink(undefined, undefined, lang), Icon: WhatsAppIcon, color: 'text-[#25D366]' },
    { key: 'viber', label: 'Viber', href: viberLink(), Icon: ViberIcon, color: 'text-[#A77BD6]' },
  ]
  return (
    <ul className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {items.map(({ key, label, href, Icon, color }) => (
        <li key={key}>
          <a
            href={href}
            {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onClick={onContactClick(key, where)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-mist-300 transition-colors hover:border-white/25 hover:text-white"
          >
            <Icon size={16} className={color} />
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}
