import { site } from '@/config/site'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'
import { ProductCard } from '@/components/product/ProductCard'
import { MoreProductsNote } from '@/components/product/MoreProductsNote'
import { CatalogCta } from '@/components/product/CatalogCta'
import { ContactChips } from '@/components/layout/ContactChips'
import { useLang } from '@/hooks/useLang'
import { getFeaturedProducts } from '@/lib/products'

/** Landing page: a short selection ("featured": true) + a prominent link to the full catalogue */
export function ProductsGrid() {
  const { t } = useLang()
  const list = getFeaturedProducts()

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
        </ul>

        <CatalogCta className="mt-10" />
        <MoreProductsNote placement="products" className="mt-4" />
      </div>
    </section>
  )
}
