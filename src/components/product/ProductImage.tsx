import { useEffect, useRef, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { imgSrc, imgSrcSet } from '@/lib/products'

interface Props {
  base?: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
  placeholderText?: string
}

/** Responsive WebP image with a shimmer while loading and a branded placeholder when there is no photo */
export function ProductImage({ base, alt, sizes = '(min-width:1280px) 300px, (min-width:1024px) 33vw, 50vw', className = '', priority, placeholderText }: Props) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)
  // Pre-rendered HTML: the image may finish loading before React hydrates and attaches onLoad
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [base])
  if (!base) {
    return (
      <div className={`relative grid place-items-center overflow-hidden bg-night-800 ${className}`}>
        <div className="absolute inset-0 bg-grid-fade [background-size:28px_28px] opacity-60" aria-hidden />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ev/10 blur-2xl" aria-hidden />
        <div className="relative flex flex-col items-center gap-2 text-mist-500">
          <ImageOff size={28} aria-hidden />
          {placeholderText && <span className="text-xs">{placeholderText}</span>}
        </div>
      </div>
    )
  }
  return (
    <div className={`relative overflow-hidden bg-night-800 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)] bg-[length:200%_100%]" aria-hidden />
      )}
      <img
        ref={ref}
        src={imgSrc(base, 960)}
        srcSet={imgSrcSet(base)}
        sizes={sizes}
        alt={alt}
        width={960}
        height={960}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchpriority: 'high' } : {})}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
