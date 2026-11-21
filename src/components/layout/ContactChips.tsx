import { FacebookIcon, InstagramIcon, TikTokIcon, ViberIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { ContactButton, FollowLink, type SocialNetwork } from '@/components/ui/ContactButton'
import type { ContactChannel, Placement } from '@/lib/analytics'

const chip =
  'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-mist-300 transition-colors hover:border-white/25 hover:text-white'

type Item = { label: string; Icon: typeof FacebookIcon; color: string } & ({ channel: ContactChannel } | { network: SocialNetwork })

/** Row of all our channels (priority order: Facebook → Instagram → TikTok → WhatsApp → Viber) */
export function ContactChips({ placement, className = '' }: { placement: Placement; className?: string }) {
  const items: Item[] = [
    { channel: 'messenger', label: 'Facebook', Icon: FacebookIcon, color: 'text-[#5AA2FF]' },
    { network: 'instagram', label: 'Instagram', Icon: InstagramIcon, color: 'text-[#F0679B]' },
    { network: 'tiktok', label: 'TikTok', Icon: TikTokIcon, color: 'text-white' },
    { channel: 'whatsapp', label: 'WhatsApp', Icon: WhatsAppIcon, color: 'text-[#25D366]' },
    { channel: 'viber', label: 'Viber', Icon: ViberIcon, color: 'text-[#A77BD6]' },
  ]
  return (
    <ul className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {items.map((it) => {
        const inner = (
          <>
            <it.Icon size={16} className={it.color} />
            {it.label}
          </>
        )
        return (
          <li key={it.label}>
            {'channel' in it ? (
              <ContactButton channel={it.channel} placement={placement} className={chip}>
                {inner}
              </ContactButton>
            ) : (
              <FollowLink network={it.network} className={chip}>
                {inner}
              </FollowLink>
            )}
          </li>
        )
      })}
    </ul>
  )
}
