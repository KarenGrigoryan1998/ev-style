import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'

/** `vite preview`: serve pre-rendered /en/catalog from dist/en/catalog/index.html (like Vercel does) */
const prerenderedPreview = (): Plugin => ({
  name: 'prerendered-preview',
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = (req.url ?? '/').split('?')[0]
      if (!path.extname(url)) {
        const file = path.join('dist', url, 'index.html')
        if (fs.existsSync(file)) req.url = path.posix.join(url, 'index.html')
        else if (!fs.existsSync(path.join('dist', url))) req.url = '/spa.html'
      }
      next()
    })
  },
})

/**
 * Public address of the site (canonical URLs, sitemap, link-preview images).
 * 1. SITE_URL env var if set (e.g. SITE_URL=https://evstyle.am)
 * 2. on Vercel: the production domain Vercel provides (your custom domain once added, else *.vercel.app)
 * 3. fallback for local builds
 */
const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4173')
).replace(/\/$/, '')

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), prerenderedPreview()],
  define: { __SITE_URL__: JSON.stringify(SITE_URL) },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: 3000, open: true },
  ssr: { noExternal: ['react-helmet-async'] },
  build: {
    outDir: isSsrBuild ? 'dist-ssr' : 'dist',
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              react: ['react', 'react-dom', 'react-router-dom'],
              motion: ['framer-motion'],
              i18n: ['i18next', 'react-i18next'],
            },
          },
        },
  },
}))
