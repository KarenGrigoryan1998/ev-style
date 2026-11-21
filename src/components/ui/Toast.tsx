import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { subscribeToast } from '@/lib/toast'

export function Toast() {
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => subscribeToast(setMsg), [])
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8">
      <AnimatePresence>
        {msg && (
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="flex max-w-md items-center gap-2.5 rounded-xl border border-white/10 bg-night-800/95 px-4 py-3 text-sm text-white shadow-card backdrop-blur"
          >
            <CheckCircle2 size={18} className="shrink-0 text-ev" aria-hidden />
            {msg}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
