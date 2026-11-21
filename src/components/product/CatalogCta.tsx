import { Link } from 'react-router-dom'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import { MODELS } from '@/config/catalog'
import { buttonClass } from '@/components/ui/Button'
import { useLang } from '@/hooks/useLang'
import { useModelName } from '@/hooks/useModelName'

/** Prominent link to the full catalogue, with quick links per car model */
export function CatalogCta({ className = '' }: { className?: string }) {
  const { t, to } = useLang()
  const modelName = useModelName()
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-night-800 via-night-850 to-night-900 p-6 sm:p-8 ${className}`}>
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ev/15 blur-3xl" aria-hidden />
      <div className="absolute inset-0 bg-grid-fade [background-size:40px_40px] opacity-40 [mask-image:linear-gradient(to_left,black,transparent_70%)]" aria-hidden />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ev text-night-950 shadow-glow">
            <LayoutGrid size={24} aria-hidden />
          </span>
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">{t('catalogCta.title')}</h3>
            <p className="mt-1 text-sm text-mist-300 sm:text-base">{t('catalogCta.text')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {MODELS.map((m) => (
                <Link
                  key={m.id}
                  to={to(`/catalog/${m.id.toLowerCase()}`)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-mist-300 transition-colors hover:border-ev/50 hover:text-ev"
                >
                  {modelName(m.id)}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Link to={to('/catalog')} className={buttonClass('primary', 'lg', 'w-full shrink-0 lg:w-auto')}>
          {t('catalogCta.cta')} <ArrowRight size={18} aria-hidden />
        </Link>
      </div>
    </div>
  )
}
