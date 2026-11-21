/**
 * Data access layer for products & reviews.
 * Components only use these functions — to move products to a CMS / Google Sheet / Supabase
 * later, change the implementation here and nothing else.
 */
import productsData from '@/data/products.json'
import reviewsData from '@/data/reviews.json'
import type { Product, Review } from './types'
import type { ModelId } from '@/config/catalog'

const products = (productsData as unknown as Product[]).filter((p) => !p.hidden)
const reviews = reviewsData as unknown as Review[]

export const getProducts = (): Product[] => products
export const getFeaturedProducts = (): Product[] => products.filter((p) => p.featured)
export const getProductBySlug = (slug: string): Product | undefined => products.find((p) => p.slug === slug)
export const getProductsByModel = (model: ModelId, list: Product[] = products): Product[] =>
  list.filter((p) => p.models.includes(model))
export const getRelatedProducts = (p: Product, limit = 4): Product[] =>
  products
    .filter((x) => x.id !== p.id)
    .sort((a, b) => score(b, p) - score(a, p))
    .slice(0, limit)
const score = (x: Product, p: Product) =>
  (x.category === p.category ? 2 : 0) + x.models.filter((m) => p.models.includes(m)).length * 0.5

/** Real reviews only — entries with "placeholder": true are never shown */
export const getReviews = (): Review[] => reviews.filter((r) => !r.placeholder)
export const hasReviews = (): boolean => getReviews().length > 0

/** Responsive image sources for a product/gallery image base path */
export const IMG_WIDTHS = [480, 960, 1440] as const
export const imgSrc = (base: string, w: (typeof IMG_WIDTHS)[number] = 960) => `${base}-${w}.webp`
export const imgSrcSet = (base: string) => IMG_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ')
