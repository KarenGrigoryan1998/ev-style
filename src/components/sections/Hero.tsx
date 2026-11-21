import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { ArrowDown, Check } from 'lucide-react'
import { Button, buttonClass } from '@/components/ui/Button'
import { ContactButton } from '@/components/ui/ContactButton'
import { MessengerIcon } from '@/components/ui/BrandIcons'
import { useLang } from '@/hooks/useLang'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const { t } = useLang()
  const trust = ['trust.delivery', 'trust.installation', 'trust.preorder', 'trust.photos'] as const
  // The poster image paints first (fast LCP); the video loads after the page is ready
  const [videoOn, setVideoOn] = useState(false)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer = 0
    const start = () => (timer = window.setTimeout(() => setVideoOn(true), 400))
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28" aria-labelledby="hero-title">
      {/* Night-drive backdrop: grid, green headlight glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-grid-fade [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-ev/[0.10] blur-[120px]" />
        <div className="absolute right-[-10%] top-1/3 h-[420px] w-[420px] animate-pulse-glow rounded-full bg-ev/[0.12] blur-[110px]" />
      </div>

      <div className="container relative grid items-center gap-12 pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-20">
        <div>
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-ev/25 bg-ev/[0.07] px-3 py-1.5 text-xs font-medium text-ev"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ev opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ev" />
            </span>
            {t('hero.eyebrow')}
          </m.p>

          <m.h1
            id="hero-title"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="text-balance text-[2.15rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]"
          >
            {t('hero.title')}
          </m.h1>

          <m.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="mt-5 max-w-xl text-pretty text-base text-mist-400 sm:text-lg"
          >
            {t('hero.subtitle')}
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button href="#products" size="lg" icon={<ArrowDown size={18} aria-hidden />}>
              {t('hero.ctaPrimary')}
            </Button>
            <ContactButton channel="messenger" placement="hero" className={buttonClass('secondary', 'lg')}>
              <MessengerIcon size={20} className="text-[#4FA3FF]" />
              {t('hero.ctaSecondary')}
            </ContactButton>
          </m.div>
        </div>

        {/* Glowing logo video in a "night" frame */}
        <m.div
          initial={{ scale: 0.96 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="relative mx-auto w-full max-w-[440px] lg:max-w-none"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-ev/20 blur-3xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-night-950 p-1.5 shadow-glow-lg">
            <div className="relative aspect-square overflow-hidden rounded-[1.6rem]">
              <img
                src="/images/hero/poster-960.webp"
                srcSet="/images/hero/poster-480.webp 480w, /images/hero/poster-960.webp 960w, /images/hero/poster-1440.webp 1440w"
                sizes="(min-width:1024px) 520px, 90vw"
                width={960}
                height={960}
                alt={t('hero.videoLabel')}
                {...{ fetchpriority: "high" }}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {videoOn && (
                <video
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? 'opacity-100' : 'opacity-0'}`}
                  src="/videos/hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden
                  onPlaying={() => setPlaying(true)}
                />
              )}
              <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-inset ring-white/10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night-950/80 to-transparent" />
            </div>
          </div>
        </m.div>
      </div>

      {/* Trust strip */}
      <div className="relative border-y border-white/[0.06] bg-night-850/60 backdrop-blur">
        <ul className="container grid grid-cols-1 gap-x-6 gap-y-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((k, i) => (
            <m.li
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="flex items-center gap-3 text-sm text-mist-300"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ev/15 text-ev">
                <Check size={14} strokeWidth={3} aria-hidden />
              </span>
              {t(k)}
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
