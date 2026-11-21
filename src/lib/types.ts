import type { CategoryId, ColorId, ModelId } from '@/config/catalog'

export type Lang = 'hy' | 'en' | 'ru'
export type Localized = Record<Lang, string>
export type Status = 'in_stock' | 'preorder'

/** A product option, e.g. filter type. Shown as a choice on the product page and added to the order message. */
export interface Variant {
  id: string
  name: Localized
  /** Optional short description under the name */
  note?: Localized
}

export interface Product {
  id: string
  slug: string
  category: CategoryId
  models: ModelId[]
  /** Price in AMD (or the lowest price when there is a range) */
  price: number | null
  /** Optional upper bound for a price range, e.g. 16 000 – 21 000 */
  priceMax?: number
  priceOnRequest: boolean
  status: Status
  freeInstallation: boolean
  isNew?: boolean
  colors: ColorId[]
  variants?: Variant[]
  /** Image base paths without size suffix: "/images/products/x/1" → 1-480.webp, 1-960.webp, 1-1440.webp */
  images: string[]
  video?: string
  name: Localized
  description: Localized
  featured: boolean
  /** true = not shown anywhere on the site (kept for later, e.g. until photos are ready) */
  hidden?: boolean
}

export interface Review {
  id: string
  placeholder?: boolean
  name: string
  model: string
  rating: number
  photo: string | null
  text: Localized
}
