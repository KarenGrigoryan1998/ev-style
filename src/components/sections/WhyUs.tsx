import { BadgeCheck, Camera, HandCoins, MessageSquareText, Wrench } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'
import { useLang } from '@/hooks/useLang'

const ITEMS = [
  { key: 'fit', Icon: BadgeCheck },
  { key: 'photos', Icon: Camera },
  { key: 'prices', Icon: HandCoins },
  { key: 'help', Icon: Wrench },
  { key: 'replies', Icon: MessageSquareText },
] as const

export function WhyUs() {
  const { t } = useLang()
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container">
        <SectionTitle id="why-title" eyebrow={t('why.eyebrow')} title={t('why.title')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {ITEMS.map(({ key, Icon }, i) => (
            <Reveal
              key={key}
              delay={i * 0.06}
              className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-night-800 to-night-850 p-6 transition-colors hover:border-ev/25 sm:p-7">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-ev/0 blur-3xl transition-all duration-500 group-hover:bg-ev/15" aria-hidden />
                <Icon size={26} className="relative text-ev" aria-hidden />
                <h3 className="relative mt-5 text-lg font-semibold text-white">{t(`why.items.${key}.title`)}</h3>
                <p className="relative mt-2 text-[15px] leading-relaxed text-mist-400">{t(`why.items.${key}.text`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
