import { Sparkles, Tag, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Product } from '@/lib/types'

const base = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[11px]'

export function ProductBadges({ product, className = '' }: { product: Product; className?: string }) {
  const { t } = useTranslation()
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {/* No "In stock" label — stock changes often, so we only mark pre-order items */}
      {product.isNew && (
        <span className={`${base} bg-ev/90 text-night-950`}>
          <Sparkles size={12} aria-hidden /> {t('badges.new')}
        </span>
      )}
      {product.status === 'preorder' && (
        <span className={`${base} bg-red-500/90 text-white`}>
          <Tag size={12} aria-hidden /> {t('badges.preorder')}
        </span>
      )}
      {product.freeInstallation && (
        <span className={`${base} bg-white text-night-950 shadow-sm`}>
          <Wrench size={12} aria-hidden /> {t('badges.freeInstallation')}
        </span>
      )}
    </div>
  )
}
