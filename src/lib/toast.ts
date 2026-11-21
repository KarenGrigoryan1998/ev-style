/** Minimal global toast: showToast('text') from anywhere, <Toast /> renders it. */
type Listener = (msg: string | null) => void
const listeners = new Set<Listener>()
let timer: ReturnType<typeof setTimeout> | undefined

export function showToast(msg: string, ms = 3500) {
  listeners.forEach((l) => l(msg))
  clearTimeout(timer)
  timer = setTimeout(() => listeners.forEach((l) => l(null)), ms)
}

export function subscribeToast(l: Listener) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
