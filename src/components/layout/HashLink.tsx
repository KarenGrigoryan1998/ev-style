import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useLang } from '@/hooks/useLang'

/** Link to a landing-page section that works from any page */
export function HashLink({ id, children, className, onClick }: { id: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const { to } = useLang()
  const { pathname } = useLocation()
  const home = to('/')
  return (
    <Link
      to={{ pathname: home, hash: `#${id}` }}
      className={className}
      onClick={(e) => {
        onClick?.()
        if (pathname === home) {
          e.preventDefault()
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
          history.replaceState(null, '', `#${id}`)
        }
      }}
    >
      {children}
    </Link>
  )
}
