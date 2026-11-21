import { Helmet } from 'react-helmet-async'
import { useLang } from '@/hooks/useLang'
import { alternates, absoluteUrl, canonical, OG_LOCALE } from '@/lib/seo'
import { site } from '@/config/site'

interface Props {
  title: string
  description: string
  /** Language-neutral path, e.g. '/', '/catalog' */
  path: string
  image?: string
  /** Pixel size of `image` (default: the 1200×630 og-image.jpg) */
  imageSize?: { width: number; height: number }
  jsonLd?: object | object[]
  noindex?: boolean
  /** Hero image to preload (LCP) — { href, srcSet, sizes } */
  preloadImage?: { href: string; srcSet?: string; sizes?: string }
}

export function Seo({ title, description, path, image = '/images/og-image.jpg', imageSize = { width: 1200, height: 630 }, jsonLd, noindex, preloadImage }: Props) {
  const { metaDomainVerification, googleSiteVerification } = site.verification
  const { lang } = useLang()
  const url = canonical(lang, path)
  const img = image.startsWith('http') ? image : absoluteUrl(image)
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
  return (
    <Helmet prioritizeSeoTags>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {alternates(path).map((a) => (
        <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
      ))}
      {noindex && <meta name="robots" content="noindex" />}
      {metaDomainVerification && <meta name="facebook-domain-verification" content={metaDomainVerification} />}
      {googleSiteVerification && <meta name="google-site-verification" content={googleSiteVerification} />}
      {preloadImage && (
        <link rel="preload" as="image" type="image/webp" href={preloadImage.href} imageSrcSet={preloadImage.srcSet} imageSizes={preloadImage.sizes} {...{ fetchpriority: 'high' }} />
      )}
      <meta property="og:site_name" content={site.brandFull} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content={String(imageSize.width)} />
      <meta property="og:image:height" content={String(imageSize.height)} />
      <meta property="og:locale" content={OG_LOCALE[lang]} />
      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  )
}
