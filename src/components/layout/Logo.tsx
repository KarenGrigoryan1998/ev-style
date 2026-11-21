import { Link } from 'react-router-dom'
import { useLang } from '@/hooks/useLang'
import { site } from '@/config/site'

/** EVStyle wordmark from the real logo + a small "ARMENIA" locator */
export function Logo({ className = '', showTag = true }: { className?: string; showTag?: boolean }) {
  const { to } = useLang()
  return (
    <Link to={to('/')} className={`group inline-flex items-end gap-2 ${className}`} aria-label={site.brandFull}>
      <img src="/images/logo.webp" alt={site.brand} width={400} height={145} className="h-9 w-auto sm:h-10" decoding="async" />
      {showTag && (
        <span className="mb-[3px] hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-mist-500 transition-colors group-hover:text-mist-300 sm:inline">
          Armenia
        </span>
      )}
    </Link>
  )
}
