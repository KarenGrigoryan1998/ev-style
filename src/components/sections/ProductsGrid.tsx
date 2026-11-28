import { ArrowRight, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '@/config/site'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'
import { ProductCard } from '@/components/product/ProductCard'
import { MoreProductsNote } from '@/components/product/MoreProductsNote'
import { CatalogCta } from '@/components/product/CatalogCta'
import { ContactChips } from '@/components/layout/ContactChips'
import { useLang } from '@/hooks/useLang'
import { getFeaturedProducts, getProducts } from '@/lib/products'

/** Landing page: a short selection ("featured": true) + a prominent link to the full catalogue */
export function ProductsGrid() {
  const { t, to } = useLang()
  const list = getFeaturedProducts()
  const moreCount = getProducts().length - list.length

  return (
    <section id="products" className="section" aria-labelledby="products-title">
      <div className="container">
        <SectionTitle
          id="products-title"
          eyebrow={t('products.eyebrow')}
          title={t('products.title')}
          subtitle={t(site.commerce.showPrices ? 'products.subtitle' : 'products.subtitleNoPrices')}
        />
        {!site.commerce.showPrices && <ContactChips placement="products" className="-mt-6 mb-10 sm:-mt-8 sm:mb-12" />}

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 4) * 0.05}>
              <ProductCard product={p} />
            </Reveal>
          ))}
          {moreCount > 0 && (
            <Reveal as="li" delay={(list.length % 4) * 0.05}>
              <Link
                to={to('/catalog')}
                className="group flex h-full min-h-[14rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ev/30 bg-ev/[0.04] p-5 text-center transition-colors hover:border-ev/60 hover:bg-ev/[0.08]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ev/15 text-ev transition-transform group-hover:scale-110">
                  <LayoutGrid size={22} aria-hidden />
                </span>
                <span className="text-base font-bold text-white sm:text-lg">{t('catalogCta.moreCount', { count: moreCount })}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-ev">
                  {t('catalogCta.cta')} <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          )}
        </ul>

        <CatalogCta className="mt-10" />
        <MoreProductsNote placement="products" className="mt-4" />
      </div>
    </section>
  )
}
