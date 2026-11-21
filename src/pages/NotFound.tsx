import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/Button'
import { useLang } from '@/hooks/useLang'

export default function NotFound() {
  const { t, to } = useLang()
  return (
    <div className="container grid min-h-[70vh] place-items-center pt-24 text-center">
      <Seo title={t('meta.notFoundTitle')} description={t('notFound.text')} path="/404" noindex />
      <div>
        <p className="text-gradient text-7xl font-black">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">{t('notFound.title')}</h1>
        <p className="mt-2 text-mist-400">{t('notFound.text')}</p>
        <Button to={to('/')} className="mt-8">
          {t('notFound.cta')}
        </Button>
      </div>
    </div>
  )
}
