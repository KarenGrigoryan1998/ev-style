import { ArrowUpRight } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'
import { SOCIALS } from '@/components/layout/SocialLinks'
import { useLang } from '@/hooks/useLang'
import { onContactClick } from '@/lib/contact'

const ACCENT: Record<string, string> = {
  instagram: 'from-[#F58529]/25 via-[#DD2A7B]/20 to-[#8134AF]/25',
  facebook: 'from-[#1877F2]/25 to-[#1877F2]/5',
  tiktok: 'from-[#25F4EE]/20 via-transparent to-[#FE2C55]/20',
}

export function FollowUs() {
  const { t } = useLang()
  return (
    <section className="section" aria-labelledby="follow-title">
      <div className="container">
        <SectionTitle id="follow-title" eyebrow={t('follow.eyebrow')} title={t('follow.title')} subtitle={t('follow.subtitle')} />
        <ul className="grid gap-4 md:grid-cols-3">
          {SOCIALS.map(({ key, label, url, handle, Icon }, i) => (
            <Reveal as="li" key={key} delay={i * 0.08}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onContactClick(key, 'follow')}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-night-850 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 sm:p-7"
              >
                <div className={`absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-500 group-hover:opacity-100 ${ACCENT[key]}`} aria-hidden />
                <div className="relative flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-night-950/60 text-white">
                    <Icon size={24} />
                  </span>
                  <ArrowUpRight size={20} className="text-mist-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden />
                </div>
                <p className="relative mt-6 text-lg font-semibold text-white">{label}</p>
                <p className="relative text-sm text-mist-300">{handle}</p>
                <p className="relative mt-3 flex-1 text-[15px] text-mist-400">{t(`follow.${key}`)}</p>
                <span className="relative mt-6 inline-flex w-fit items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-night-950 transition-colors group-hover:bg-ev">
                  {t('follow.cta')}
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
