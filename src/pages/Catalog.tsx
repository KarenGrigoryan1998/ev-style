/**
 * Phase 2 — Catalogue. Already functional (filters by model, category, availability, search, sort)
 * so it can be linked from the landing page. Extend the design here when the catalogue grows.
 */
import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { site } from '@/config/site'
import { CATEGORIES, MODELS, findModel, type CategoryId, type ModelId } from '@/config/catalog'
import { Seo } from '@/components/layout/Seo'
import { ProductCard } from '@/components/product/ProductCard'
import { MoreProductsNote } from '@/components/product/MoreProductsNote'
import { useLang } from '@/hooks/useLang'
import { useModelName } from '@/hooks/useModelName'
import { getProducts } from '@/lib/products'

type Sort = 'featured' | 'priceAsc' | 'priceDesc'

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active ? 'border-ev/50 bg-ev/15 text-ev' : 'border-white/[0.08] text-mist-300 hover:border-white/20 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

export default function Catalog() {
  const { t, lang, to } = useLang()
  const modelName = useModelName()
  const navigate = useNavigate()
  const { model: modelParam } = useParams()
  const [search] = useSearchParams()
  const raw = modelParam ?? search.get('model')
  const model: ModelId | null = findModel(raw)?.id ?? null

  const [category, setCategory] = useState<CategoryId | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('featured')

  const setModel = (id: ModelId | null) =>
    navigate(to(id ? `/catalog/${id.toLowerCase()}` : '/catalog'), { replace: true, preventScrollReset: true })

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const r = getProducts().filter(
      (p) =>
        (!model || p.models.includes(model)) &&
        (!category || p.category === category) &&
        (!q || p.name[lang].toLowerCase().includes(q) || p.name.en.toLowerCase().includes(q)),
    )
    const price = (x: (typeof r)[number]) => x.price ?? Number.POSITIVE_INFINITY
    if (sort === 'priceAsc') r.sort((a, b) => price(a) - price(b))
    if (sort === 'priceDesc') r.sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
    if (sort === 'featured') r.sort((a, b) => Number(b.featured) - Number(a.featured))
    return r
  }, [model, category, query, sort, lang])

  return (
    <div className="pb-20 pt-28 sm:pt-32">
      <Seo title={t('meta.catalogTitle')} description={t('catalog.subtitle')} path={model ? `/catalog/${model.toLowerCase()}` : '/catalog'} />
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t('catalog.title')}
          {model && <span className="text-gradient"> · {modelName(model)}</span>}
        </h1>
        <p className="mt-3 max-w-xl text-mist-400">{t('catalog.subtitle')}</p>

        <MoreProductsNote placement="catalog" className="mt-6" />

        <div className="mt-8 space-y-4 rounded-2xl border border-white/[0.06] bg-night-850 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">{t('catalog.search')}</span>
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-500" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('catalog.search')}
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-night-900 pl-10 pr-4 text-[15px] text-white placeholder:text-mist-500 focus:border-ev/50 focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-mist-400">
              {t('catalog.sort')}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 rounded-xl border border-white/[0.08] bg-night-900 px-3 text-[15px] text-white focus:border-ev/50 focus:outline-none"
              >
                <option value="featured">{t('catalog.sortFeatured')}</option>
                {site.commerce.showPrices && (
                  <>
                    <option value="priceAsc">{t('catalog.sortPriceAsc')}</option>
                    <option value="priceDesc">{t('catalog.sortPriceDesc')}</option>
                  </>
                )}
              </select>
            </label>
          </div>
          {[
            {
              label: t('catalog.model'),
              items: [{ k: null, l: t('catalog.all') }, ...MODELS.map((m) => ({ k: m.id, l: modelName(m.id) }))],
              value: model,
              set: (k: string | null) => setModel(k),
            },
            {
              label: t('catalog.category'),
              items: [{ k: null, l: t('catalog.all') }, ...CATEGORIES.filter((c) => getProducts().some((p) => p.category === c)).map((c) => ({ k: c, l: t(`categories.${c}`) }))],
              value: category,
              set: (k: string | null) => setCategory(k),
            },
          ].map((g) => (
            <div key={g.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs uppercase tracking-wider text-mist-500">{g.label}</span>
              <div className="no-scrollbar -mr-4 flex gap-2 overflow-x-auto pr-4">
                {g.items.map((it) => (
                  <Pill key={String(it.k)} active={g.value === it.k} onClick={() => g.set(it.k)}>
                    {it.l}
                  </Pill>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-mist-500" aria-live="polite">
          {t('catalog.results', { count: list.length })}
        </p>
        {list.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} model={model ?? undefined} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="card mt-4 p-8 text-center text-mist-300">{t('catalog.empty')}</p>
        )}
      </div>
    </div>
  )
}
