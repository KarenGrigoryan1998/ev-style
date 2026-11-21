import { FacebookIcon, InstagramIcon, TikTokIcon } from '@/components/ui/BrandIcons'
import { site } from '@/config/site'
import { FollowLink } from '@/components/ui/ContactButton'

/** Facebook first, then Instagram, then TikTok */
export const SOCIALS = [
  { key: 'facebook', label: 'Facebook', url: site.social.facebook.url, handle: site.social.facebook.handle, Icon: FacebookIcon },
  { key: 'instagram', label: 'Instagram', url: site.social.instagram.url, handle: site.social.instagram.handle, Icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', url: site.social.tiktok.url, handle: site.social.tiktok.handle, Icon: TikTokIcon },
] as const

/** Brand colours for buttons */
export const SOCIAL_COLORS: Record<string, string> = {
  facebook: '#1877F2',
  instagram: 'linear-gradient(45deg,#F58529,#DD2A7B 55%,#8134AF)',
  tiktok: '#000000',
}

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {SOCIALS.map(({ key, label, Icon }) => (
        <li key={key}>
          <FollowLink
            network={key}
            aria-label={label}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] text-mist-300 transition-all hover:border-ev/40 hover:text-ev hover:shadow-glow"
          >
            <Icon size={18} />
          </FollowLink>
        </li>
      ))}
    </ul>
  )
}
