import { useTranslation } from 'react-i18next'
import { COLORS } from '@/config/catalog'

export function ColorDots({ colors, size = 'sm' }: { colors: string[]; size?: 'sm' | 'md' }) {
  const { t } = useTranslation()
  if (!colors.length) return null
  const dim = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'
  const names = colors.map((c) => t(`colors.${c}`)).join(', ')
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`${t('colors.label')}: ${names}`} title={names}>
      {colors.map((c) => (
        <span key={c} className={`${dim} rounded-full ring-1 ring-white/25 ring-offset-1 ring-offset-night-850`} style={{ background: COLORS[c] ?? '#666' }} />
      ))}
    </div>
  )
}
