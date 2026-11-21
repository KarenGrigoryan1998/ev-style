import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import './fonts.css'
import './index.css'
import './lib/i18n'
import App from './App'
import { captureUtm } from './lib/utm'

// Save utm_* / fbclid / ttclid from the ad click before anything else
captureUtm()

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
        </LazyMotion>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// Pages are pre-rendered at build time → hydrate; the SPA fallback (spa.html) is empty → render
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
