import type { Product } from './types'
import { site } from '@/config/site'

/** 12000 → "12 000 ֏" (non-breaking spaces, the format used in Armenia) */
export function formatAmd(amount: number): string {
  return `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ֏`
}

/** Returns a display price or null when the price is on request */
export function formatProductPrice(p: Product): string | null {
  if (!site.commerce.showPrices || p.priceOnRequest || p.price == null) return null
  if (p.priceMax && p.priceMax > p.price) return `${formatAmd(p.price).replace(' ֏', '')}–${formatAmd(p.priceMax)}`
  return formatAmd(p.price)
}
