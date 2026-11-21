import { MessageCircle, MousePointerClick, PackageCheck, Truck } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'
import { useLang } from '@/hooks/useLang'

const STEPS = [
  { key: 's1', Icon: MousePointerClick },
  { key: 's2', Icon: MessageCircle },
  { key: 's3', Icon: PackageCheck },
  { key: 's4', Icon: Truck },
] as const

export function HowToOrder() {
  const { t } = useLang()
  return (
    <section id="how-to-order" className="section overflow-hidden bg-night-950" aria-labelledby="how-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px glow-line opacity-30" aria-hidden />
      <div className="container">
        <SectionTitle id="how-title" eyebrow={t('howTo.eyebrow')} title={t('howTo.title')} subtitle={t('howTo.subtitle')} />
        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* connecting line on desktop */}
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-[2.6rem] hidden h-px bg-gradient-to-r from-ev/0 via-ev/40 to-ev/0 lg:block" aria-hidden />
          {STEPS.map(({ key, Icon }, i) => (
            <Reveal as="li" key={key} delay={i * 0.08} className="relative">
              <div className="card h-full p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-ev/30 bg-night-900 text-ev shadow-glow">
                    <Icon size={22} aria-hidden />
                  </span>
                  <span className="text-4xl font-black text-white/[0.06]">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{t(`howTo.steps.${key}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mist-400">{t(`howTo.steps.${key}.text`)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
