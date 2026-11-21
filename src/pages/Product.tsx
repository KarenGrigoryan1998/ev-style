/**
 * Phase 2 — Product page: gallery, video, compatible models, colours, price, badges,
 * "Order via WhatsApp" (with model picker) and related products.
 */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Clock, PlayCircle, Truck, Wrench, Zap } from 'lucide-react'
import { Seo } from '@/components/layout/Seo'
import { ProductImage } from '@/components/product/ProductImage'
import { ProductBadges } from '@/components/product/ProductBadges'
import { ColorDots } from '@/components/product/ColorDots'
import { ProductCard } from '@/components/product/ProductCard'
import { buttonClass } from '@/components/ui/Button'
import { MessengerIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { ContactButton } from '@/components/ui/ContactButton'
import { useLang } from '@/hooks/useLang'
import { useModelName } from '@/hooks/useModelName'
import { getProductBySlug, getRelatedProducts, imgSrc } from '@/lib/products'
import { formatProductPrice } from '@/lib/formatPrice'
import { productJsonLd } from '@/lib/seo'
import { productParams, track } from '@/lib/analytics'
import NotFound from './NotFound'

export default function Product() {
  const { slug = '' } = useParams()
  const { t, lang, to } = useLang()
  const modelName = useModelName()
  const product = getProductBySlug(slug)
  const [active, setActive] = useState(0)
  const [variantId, setVariantId] = useState<string>('')
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    if (product) track('ViewContent', productParams(product))
  }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return <NotFound />

  const name = product.name[lang]
  const variant = product.variants?.find((v) => v.id === variantId)
  /** Name used in the order message — includes the chosen type */
  const orderName = variant ? `${name} — ${variant.name[lang]}` : name
  const price = formatProductPrice(product)
  const related = getRelatedProducts(product)
  const thumbs = product.images

  return (
    <div className="pb-20 pt-24 sm:pt-28">
      <Seo
        title={`${name} — EVStyle Armenia`}
        description={product.description[lang]}
        path={`/product/${product.slug}`}
        image={product.images[0] ? `/images/share/${product.id}.jpg` : undefined}
        imageSize={product.images[0] ? { width: 1200, height: 1200 } : undefined}
        jsonLd={productJsonLd(product, lang)}
      />
      <div className="container">
        <Link to={to('/') + '#products'} className="mb-6 inline-flex items-center gap-1 text-sm text-mist-400 hover:text-white">
          <ChevronLeft size={16} aria-hidden /> {t('common.back')}
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07]">
              {showVideo && product.video ? (
                <video src={product.video} className="aspect-square w-full bg-night-950 object-cover" autoPlay muted loop playsInline controls />
              ) : (
                <ProductImage base={thumbs[active]} alt={name} priority className="aspect-square" sizes="(min-width:1024px) 50vw, 100vw" placeholderText={t('products.noPhoto')} />
              )}
              <ProductBadges product={product} className="absolute left-4 top-4" />
            </div>
            {(thumbs.length > 1 || product.video) && (
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                {thumbs.map((b, i) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setActive(i)
                      setShowVideo(false)
                    }}
                    aria-label={`${name} ${i + 1}`}
                    aria-pressed={!showVideo && active === i}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${!showVideo && active === i ? 'border-ev' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={imgSrc(b, 480)} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
                {product.video && (
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    aria-pressed={showVideo}
                    className={`grid h-20 w-20 shrink-0 place-items-center rounded-xl border-2 bg-night-800 text-xs text-mist-300 ${showVideo ? 'border-ev text-ev' : 'border-transparent'}`}
                  >
                    <PlayCircle size={24} aria-hidden />
                    {t('product.video')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{name}</h1>
            <p className="mt-4 text-3xl font-bold text-white">{price ?? <span className="text-xl text-mist-400">{t('common.priceAsk')}</span>}</p>
            <p className="mt-5 text-pretty leading-relaxed text-mist-300">{product.description[lang]}</p>

            <div className="mt-6 space-y-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-mist-500">{t('product.compatibleModels')}</p>
                <ul className="flex flex-wrap gap-2">
                  {product.models.map((m) => (
                    <li key={m} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-mist-300">
                      {modelName(m)}
                    </li>
                  ))}
                </ul>
              </div>
              {product.variants && product.variants.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-mist-500">{t('product.type')}</p>
                  <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={t('product.type')}>
                    {product.variants.map((v) => {
                      const on = variantId === v.id
                      return (
                        <button
                          key={v.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setVariantId(on ? '' : v.id)}
                          className={`rounded-xl border p-3 text-left transition-colors ${on ? 'border-ev bg-ev/10' : 'border-white/10 hover:border-white/25'}`}
                        >
                          <span className={`block text-sm font-semibold ${on ? 'text-ev' : 'text-white'}`}>{v.name[lang]}</span>
                          {v.note && <span className="mt-0.5 block text-xs text-mist-400">{v.note[lang]}</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {product.colors.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-mist-500">{t('colors.label')}</p>
                  <div className="flex items-center gap-3">
                    <ColorDots colors={product.colors} size="md" />
                    <span className="text-sm text-mist-400">{product.colors.map((c) => t(`colors.${c}`)).join(', ')}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ContactButton channel="messenger" placement="product" product={product} orderName={orderName} className={buttonClass('facebook', 'lg', 'w-full sm:w-auto')}>
                <MessengerIcon size={22} /> {t('common.orderMessenger')}
              </ContactButton>
              <ContactButton channel="whatsapp" placement="product" product={product} orderName={orderName} className={buttonClass('ghost', 'lg', 'w-full sm:w-auto')}>
                <WhatsAppIcon size={20} className="text-[#25D366]" /> {t('common.orWhatsApp')}
              </ContactButton>
            </div>

            <ul className="card mt-8 space-y-3 p-5 text-sm text-mist-300">
              <li className="flex gap-3">
                {product.status === 'preorder' ? <Clock size={18} className="shrink-0 text-amber-300" aria-hidden /> : <Zap size={18} className="shrink-0 text-ev" aria-hidden />}
                {product.status === 'preorder' ? t('product.deliveryPreorder') : t('product.deliveryAsk')}
              </li>
              {product.freeInstallation && (
                <li className="flex gap-3">
                  <Wrench size={18} className="shrink-0 text-ev" aria-hidden />
                  {t('badges.freeInstallation')}
                </li>
              )}
              <li className="flex gap-3">
                <Truck size={18} className="shrink-0 text-ev" aria-hidden />
                {t('product.freeDelivery')}
              </li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-title">
            <h2 id="related-title" className="mb-6 text-2xl font-bold text-white">
              {t('product.related')}
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
