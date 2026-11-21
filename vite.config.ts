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

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), prerenderedPreview()],
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
