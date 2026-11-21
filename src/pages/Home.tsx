import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Seo } from '@/components/layout/Seo'
import { Hero } from '@/components/sections/Hero'
import { ProductsGrid } from '@/components/sections/ProductsGrid'
import { HowToOrder } from '@/components/sections/HowToOrder'
import { WhyUs } from '@/components/sections/WhyUs'
import { Gallery } from '@/components/sections/Gallery'
import { Reviews } from '@/components/sections/Reviews'
import { FAQ } from '@/components/sections/FAQ'
import { FollowUs } from '@/components/sections/FollowUs'
import { Contact } from '@/components/sections/Contact'
import { useLang } from '@/hooks/useLang'
import { storeJsonLd } from '@/lib/seo'

export default function Home() {
  const { t, lang } = useLang()
  const { hash } = useLocation()
  // Arriving from another page with #section → scroll to it
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
    return () => clearTimeout(timer)
  }, [hash])

  return (
    <>
      <Seo
        title={t('meta.title')}
        description={t('meta.description')}
        path="/"
        jsonLd={storeJsonLd(lang)}
        preloadImage={{
          href: '/images/hero/poster-960.webp',
          srcSet: '/images/hero/poster-480.webp 480w, /images/hero/poster-960.webp 960w, /images/hero/poster-1440.webp 1440w',
          sizes: '(min-width:1024px) 520px, 90vw',
        }}
      />
      <Hero />
      <ProductsGrid />
      <HowToOrder />
      <WhyUs />
      <Gallery />
      <Reviews />
      <FAQ />
      <FollowUs />
      <Contact />
    </>
  )
}
