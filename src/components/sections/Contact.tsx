import { Clock, ExternalLink, MapPin, Phone, Store } from 'lucide-react'
import type { ReactNode } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'
import { InstagramIcon, MessengerIcon, ViberIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { useLang } from '@/hooks/useLang'
import { site } from '@/config/site'
import { ContactButton, FollowLink } from '@/components/ui/ContactButton'
import type { ContactChannel } from '@/lib/analytics'

function Channel({ icon, label, sub, color, channel }: { icon: ReactNode; label: string; sub: string; color: string; channel: ContactChannel | 'instagram' }) {
  const className = 'group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-night-850 p-4 transition-all hover:-translate-y-0.5 hover:border-white/15'
  const inner = (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: `${color}1f`, color }}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-white">{label}</span>
        <span className="block truncate text-sm text-mist-500">{sub}</span>
      </span>
    </>
  )
  return channel === 'instagram' ? (
    <FollowLink network="instagram" className={className}>
      {inner}
    </FollowLink>
  ) : (
    <ContactButton channel={channel} placement="contact" className={className}>
      {inner}
    </ContactButton>
  )
}

export function Contact() {
  const { t, lang } = useLang()
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.location.mapQuery)}&z=16&hl=${lang}&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.location.mapQuery)}`

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionTitle id="contact-title" eyebrow={t('contact.eyebrow')} title={t('contact.title')} subtitle={t('contact.subtitle')} />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-3">
            <Reveal className="grid gap-3 sm:grid-cols-2">
              <Channel channel="messenger" icon={<MessengerIcon size={24} />} label="Messenger" sub={site.social.facebook.handle} color="#4FA3FF" />
              <Channel channel="whatsapp" icon={<WhatsAppIcon size={24} />} label="WhatsApp" sub={site.contacts.phoneDisplay} color="#25D366" />
              <Channel channel="viber" icon={<ViberIcon size={24} />} label="Viber" sub={site.contacts.phoneDisplay} color="#8F5DB7" />
              <Channel channel="instagram" icon={<InstagramIcon size={24} />} label="Instagram" sub={site.social.instagram.handle} color="#E1306C" />
              <div className="sm:col-span-2">
                <Channel channel="phone" icon={<Phone size={22} />} label={t('common.call')} sub={site.contacts.phoneDisplay} color="#71DB3D" />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="card mt-1 space-y-4 p-5">
              <div className="flex gap-3">
                <MapPin size={20} className="mt-0.5 shrink-0 text-ev" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-wider text-mist-500">{t('contact.address')}</p>
                  <p className="text-[15px] text-white">{site.location.address[lang]}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock size={20} className="mt-0.5 shrink-0 text-ev" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-wider text-mist-500">{t('contact.hours')}</p>
                  <p className="text-[15px] text-white">{site.hours[lang]}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl bg-ev/[0.07] p-3 text-sm text-ev-300">
                <Store size={18} className="mt-0.5 shrink-0" aria-hidden />
                {t('contact.note')}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/[0.07] bg-night-800 lg:min-h-full">
            <iframe
              title={t('contact.mapTitle')}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full [filter:invert(92%)_hue-rotate(180deg)_saturate(.6)_brightness(.95)]"
            />
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-night-950/85 px-3.5 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:text-ev"
            >
              <ExternalLink size={16} aria-hidden /> {t('contact.openMap')}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
