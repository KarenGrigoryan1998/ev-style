import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useLang } from '@/hooks/useLang'
import { useModelName } from '@/hooks/useModelName'
import { formatProductPrice } from '@/lib/formatPrice'
import { messengerLink, orderViaMessenger } from '@/lib/contact'
import { ProductImage } from './ProductImage'
import { ProductBadges } from './ProductBadges'
import { ColorDots } from './ColorDots'
import { Chip } from '@/components/ui/Chip'
import { MessengerIcon } from '@/components/ui/BrandIcons'
import { buttonClass } from '@/components/ui/Button'

interface Props {
  product: Product
  /** Selected car model (pre-fills the WhatsApp message) */
  model?: string
}

export function ProductCard({ product, model }: Props) {
  const { lang, t, to } = useLang()
  const modelName = useModelName()
  const name = product.name[lang]
  const price = formatProductPrice(product)
  const detailsUrl = to(`/product/${product.slug}`)
  const waModel = model ? modelName(model) : undefined

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-night-850 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-ev/25 hover:shadow-[0_30px_60px_-30px_rgba(113,219,61,.35)]">
      <Link to={detailsUrl} className="relative block" tabIndex={-1} aria-hidden>
        <ProductImage
          base={product.images[0]}
          alt={name}
          className="aspect-square transition-transform duration-700 group-hover:scale-[1.04]"
          placeholderText={t('products.noPhoto')}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night-850 to-transparent" />
        <ProductBadges product={product} className="absolute left-2 right-2 top-2 sm:left-3 sm:right-3 sm:top-3" />
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-5">
        <div className="flex flex-wrap gap-1" aria-label={t('products.compatible')}>
          {product.models.map((m) => (
            <Chip key={m}>{modelName(m, true)}</Chip>
          ))}
        </div>

        <h3 className="text-sm font-semibold leading-snug text-white sm:text-base">
          <Link to={detailsUrl} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {name}
          </Link>
        </h3>
        {product.variants && product.variants.length > 0 && (
          <p className="-mt-1 text-xs leading-snug text-mist-400">{product.variants.map((v) => v.name[lang]).join(' · ')}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3">
          <p className={price ? 'text-base font-bold tracking-tight text-white sm:text-lg' : 'text-xs font-medium text-mist-400 sm:text-sm'}>
            {price ?? t('common.priceAsk')}
          </p>
          <ColorDots colors={product.colors} />
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-2 pt-1 sm:grid-cols-[1fr_auto]">
          <a
            href={messengerLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={orderViaMessenger(name, waModel, lang, product.id)}
            aria-label={`${t('common.orderMessenger')}: ${name}`}
            className={buttonClass('facebook', 'md', 'w-full min-w-0 !h-10 !px-2 text-sm sm:!h-11 sm:!px-3')}
          >
            <MessengerIcon size={18} className="shrink-0" />
            <span className="truncate">{t('common.order')}</span>
          </a>
          <Link to={detailsUrl} className={buttonClass('secondary', 'md', '!hidden !h-11 !w-11 !px-0 sm:!inline-flex')} aria-label={`${t('common.details')}: ${name}`}>
            <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}
