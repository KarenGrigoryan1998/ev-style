import type { ReactNode } from 'react'

export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-mist-300 ${className}`}>
      {children}
    </span>
  )
}
