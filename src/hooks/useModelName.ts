import { useTranslation } from 'react-i18next'
import { findModel, type ModelId } from '@/config/catalog'

/** Display name for a model id — "OTHER" is translated */
export function useModelName() {
  const { t } = useTranslation()
  return (id: ModelId, short = false) => {
    if (id === 'OTHER') return t(short ? 'models.OTHER_short' : 'models.OTHER')
    const m = findModel(id)
    return short ? id : (m?.name ?? id)
  }
}
