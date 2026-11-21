import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'facebook'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-ev text-night-950 hover:bg-ev-400 shadow-glow hover:shadow-glow-lg font-semibold',
  secondary: 'glass text-white hover:bg-white/[0.08] hover:border-white/15',
  ghost: 'text-mist-300 hover:text-white hover:bg-white/[0.05]',
  facebook: 'bg-[#1877F2] text-white hover:bg-[#2D88FF] font-semibold shadow-[0_0_24px_-6px_rgba(24,119,242,.7)]',
  whatsapp: 'bg-[#25D366] text-night-950 hover:bg-[#3be37a] font-semibold shadow-[0_0_24px_-6px_rgba(37,211,102,.6)]',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-[15px] gap-2 rounded-xl',
  lg: 'h-13 min-h-[3.25rem] px-6 text-base gap-2.5 rounded-xl',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') =>
  `inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${extra}`

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  /** Internal route (react-router) instead of a plain href */
  to?: string
}

/** Link styled as a button. External links (http, tel:, viber:) open safely. */
export const Button = forwardRef<HTMLAnchorElement, Props>(function Button(
  { variant = 'primary', size = 'md', icon, to, className = '', children, href, ...rest },
  ref,
) {
  const cls = buttonClass(variant, size, className)
  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} {...rest}>
        {icon}
        {children}
      </Link>
    )
  }
  const external = href?.startsWith('http')
  return (
    <a ref={ref} href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {icon}
      {children}
    </a>
  )
})
