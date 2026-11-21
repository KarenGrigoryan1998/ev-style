import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Plus } from 'lucide-react'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null)
  const uid = useId()
  return (
    <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-night-850">
      {items.map((item) => {
        const isOpen = open === item.id
        const btnId = `${uid}-${item.id}-btn`
        const panelId = `${uid}-${item.id}-panel`
        return (
          <div key={item.id}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[15px] font-semibold text-white transition-colors hover:bg-white/[0.02] sm:px-6 sm:text-base"
              >
                {item.title}
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${isOpen ? 'rotate-45 border-ev/50 bg-ev/10 text-ev' : 'border-white/10 text-mist-400'}`}>
                  <Plus size={16} aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-[15px] leading-relaxed text-mist-400 sm:px-6">{item.content}</div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
