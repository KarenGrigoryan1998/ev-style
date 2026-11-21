import { Accordion } from '@/components/ui/Accordion'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { MessengerIcon } from '@/components/ui/BrandIcons'
import { useLang } from '@/hooks/useLang'
import { messengerLink, onContactClick } from '@/lib/contact'
import faqIds from '@/data/faq.json'

export function FAQ() {
  const { t } = useLang()
  const items = (faqIds as string[]).map((id) => ({ id, title: t(`faq.items.${id}.q`), content: t(`faq.items.${id}.a`) }))
  return (
    <section id="faq" className="section bg-night-950" aria-labelledby="faq-title">
      <div className="container max-w-3xl">
        <SectionTitle id="faq-title" eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
        <Reveal>
          <Accordion items={items} defaultOpen={items[0]?.id} />
        </Reveal>
        <div className="mt-8 flex justify-center">
          <Button href={messengerLink()} variant="ghost" icon={<MessengerIcon size={18} className="text-[#4FA3FF]" />} onClick={onContactClick('messenger', 'faq')}>
            {t('faq.more')}
          </Button>
        </div>
      </div>
    </section>
  )
}
