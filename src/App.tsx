import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LangLayout } from '@/components/layout/LangLayout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import { initAnalytics } from '@/lib/analytics'
import type { Lang } from '@/lib/types'

// Phase 2 pages are code-split so the landing page stays light
const Catalog = lazy(() => import('@/pages/Catalog'))
const Product = lazy(() => import('@/pages/Product'))

const PREFIXES: { path: string; lang: Lang }[] = [
  { path: '/', lang: 'hy' },
  { path: '/en', lang: 'en' },
  { path: '/ru', lang: 'ru' },
]

const Fallback = () => <div className="min-h-screen" />

export default function App() {
  // Loads tracking only if the visitor accepted cookies before (scripts are injected when the browser is idle)
  useEffect(initAnalytics, [])

  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {PREFIXES.map(({ path, lang }) => (
          <Route key={lang} path={path} element={<LangLayout lang={lang} />}>
            <Route index element={<Home />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="catalog/:model" element={<Catalog />} />
            <Route path="product/:slug" element={<Product />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        ))}
      </Routes>
    </Suspense>
  )
}
