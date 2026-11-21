import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: ReactNode
  align?: 'left' | 'center'
  id?: string
}

export function SectionTitle({ eyebrow, title, subtitle, align = 'center', id }: Props) {
  const center = align === 'center'
  return (
    <Reveal className={`mb-10 sm:mb-14 ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      {eyebrow && (
        <p className={`mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ev ${center ? 'justify-center' : ''}`}>
          <span className="h-px w-6 bg-ev/60" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-pretty text-base text-mist-400 sm:text-lg">{subtitle}</p>}
    </Reveal>
  )
}
