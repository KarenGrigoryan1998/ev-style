import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { MessengerIcon, InstagramIcon, TikTokIcon, ViberIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { site } from '@/config/site'
import { useLang } from '@/hooks/useLang'
import { buildWhatsAppLink, messengerLink, onContactClick, viberLink } from '@/lib/contact'

interface Channel {
  key: string
  label: string
  href: string
  bg: string
  icon: ReactNode
}

/**
 * Expandable contact button at the bottom right (tablet/desktop; phones use MobileContactBar).
 * One "Message us" button → opens Facebook Messenger, Instagram, TikTok, WhatsApp, Viber.
 */
export function SocialDock() {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const channels: Channel[] = [
    { key: 'messenger', label: 'Facebook Messenger', href: messengerLink(), bg: '#1877F2', icon: <MessengerIcon size={22} /> },
    { key: 'instagram', label: 'Instagram', href: site.social.instagram.url, bg: 'linear-gradient(45deg,#F58529,#DD2A7B 55%,#8134AF)', icon: <InstagramIcon size={22} /> },
    { key: 'tiktok', label: 'TikTok', href: site.social.tiktok.url, bg: '#000000', icon: <TikTokIcon size={22} /> },
    { key: 'whatsapp', label: 'WhatsApp', href: buildWhatsAppLink(undefined, undefined, lang), bg: '#25D366', icon: <WhatsAppIcon size={22} /> },
    { key: 'viber', label: 'Viber', href: viberLink(), bg: '#7360F2', icon: <ViberIcon size={22} /> },
  ]

  // Close on Esc or a click outside
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 md:flex">
      <AnimatePresence>
        {open && (
          <m.ul
            id="contact-dock"
            className="flex flex-col items-end gap-2.5"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{ open: { transition: { staggerChildren: 0.04, staggerDirection: -1 } }, closed: { transition: { staggerChildren: 0.03 } } }}
          >
            {channels.map((c) => (
              <m.li
                key={c.key}
                variants={{ open: { opacity: 1, y: 0, scale: 1 }, closed: { opacity: 0, y: 12, scale: 0.9 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              >
                <a
                  href={c.href}
                  {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => {
                    onContactClick(c.key, 'dock')()
                    setOpen(false)
                  }}
                  className="group flex items-center gap-3"
                >
                  <span className="rounded-lg border border-white/10 bg-night-850/95 px-3 py-1.5 text-sm font-medium text-white shadow-card backdrop-blur transition-colors group-hover:border-white/25">
                    {c.label}
                  </span>
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,.8)] ring-1 ring-white/15 transition-transform group-hover:scale-110"
                    style={{ background: c.bg }}
                  >
                    {c.icon}
                  </span>
                </a>
              </m.li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>

      <m.button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          setSeen(true)
        }}
        aria-expanded={open}
        aria-controls="contact-dock"
        aria-label={open ? t('nav.close') : t('common.writeUs')}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        className="group relative flex items-center gap-3"
      >
        {!open && (
          <span className="pointer-events-none translate-x-2 rounded-lg border border-white/10 bg-night-850/95 px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-card backdrop-blur transition-all group-hover:translate-x-0 group-hover:opacity-100">
            {t('common.writeUs')}
          </span>
        )}
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-ev text-night-950 shadow-glow-lg transition-transform group-hover:scale-105">
          {!seen && <span className="absolute inset-0 animate-ping rounded-full bg-ev/40 [animation-duration:2.5s]" aria-hidden />}
          <m.span key={open ? 'x' : 'chat'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }} className="relative">
            {open ? <X size={26} /> : <MessageCircle size={26} />}
          </m.span>
        </span>
      </m.button>
    </div>
  )
}
