/**
 * Typed access to catalog.json (car models, categories, colours).
 * To add a car model / category / colour: edit catalog.json + add its translation in src/locales/*.json.
 * `npm run check` verifies everything matches.
 */
import catalog from './catalog.json'

export interface CarModel {
  id: string
  name: string
  type: 'sedan' | 'suv' | 'other'
}

export type ModelId = string
export type CategoryId = string
export type ColorId = string

export const MODELS = catalog.models as CarModel[]
export const CATEGORIES = catalog.categories as CategoryId[]
export const COLORS = catalog.colors as Record<ColorId, string>

export const findModel = (id: string | null | undefined) => MODELS.find((m) => m.id.toLowerCase() === id?.toLowerCase())
