/** Server entry used only at build time to pre-render every route to static HTML (see scripts/prerender.mjs). */
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import i18n from './lib/i18n'
import { getProducts } from './lib/products'
import { site } from './config/site'
import { MODELS } from './config/catalog'
import App from './App'
import type { Lang } from './lib/types'

export { site, MODELS }
export const productSlugs = () => getProducts().map((p) => p.slug)

export async function render(url: string, lang: Lang) {
  await i18n.changeLanguage(lang)
  const helmetContext: { helmet?: HelmetServerState } = {}
  const html = await new Promise<string>((resolve, reject) => {
    let out = ''
    const stream = new PassThrough()
    stream.on('data', (c) => (out += c))
    stream.on('end', () => resolve(out))
    const { pipe } = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <LazyMotion features={domAnimation} strict>
            <MotionConfig reducedMotion="user">
              <App />
            </MotionConfig>
          </LazyMotion>
        </StaticRouter>
      </HelmetProvider>,
      { onAllReady: () => pipe(stream), onError: reject },
    )
  })
  const h = helmetContext.helmet!
  const head = [h.title, h.priority, h.meta, h.link, h.script].map((x) => x.toString()).join('\n')
  return { html, head, htmlAttrs: h.htmlAttributes.toString() }
}
