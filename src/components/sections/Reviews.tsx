import { Star, UserRound } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { FacebookIcon } from '@/components/ui/BrandIcons'
import { useLang } from '@/hooks/useLang'
import { useModelName } from '@/hooks/useModelName'
import { getReviews } from '@/lib/products'
import { site } from '@/config/site'

export function Reviews() {
  const { t, lang } = useLang()
  const modelName = useModelName()
  const reviews = getReviews()
  // Hidden until the first real review is added to src/data/reviews.json
  if (!reviews.length) return null

  return (
    <section id="reviews" className="section" aria-labelledby="reviews-title">
      <div className="container">
        <SectionTitle id="reviews-title" eyebrow={t('reviews.eyebrow')} title={t('reviews.title')} subtitle={t('reviews.subtitle')} />


        <ul className="grid gap-4 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 0.07}>
              <figure className="card relative flex h-full flex-col p-6">
                <div className="flex gap-0.5 text-ev" role="img" aria-label={t('reviews.stars', { count: r.rating })}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={16} fill={s < r.rating ? 'currentColor' : 'none'} aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-mist-300">«{r.text[lang]}»</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {r.photo ? (
                    <img src={r.photo} alt="" className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-night-700 text-mist-400">
                      <UserRound size={18} aria-hidden />
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{r.name || t('reviews.anonymous', { model: modelName(r.model) })}</p>
                    <p className="text-xs text-mist-500">{modelName(r.model)}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Button href={site.social.facebook.url} variant="secondary" icon={<FacebookIcon size={18} />}>
            {t('reviews.leave')}
          </Button>
        </div>
      </div>
    </section>
  )
}
