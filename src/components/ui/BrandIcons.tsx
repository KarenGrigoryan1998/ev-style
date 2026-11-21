/** Small brand icons (lucide-react has no WhatsApp/TikTok/Viber). Inherit currentColor. */
type P = { size?: number; className?: string }
const svg = (size: number, className = '') => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  className,
  'aria-hidden': true as const,
  focusable: false as const,
})

export const WhatsAppIcon = ({ size = 20, className }: P) => (
  <svg {...svg(size, className)} fill="none">
    <path d="M3.5 20.5l1.3-4.2A8.6 8.6 0 1 1 8 19.3l-4.5 1.2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9.1 7.9c.2-.4.5-.4.8-.4h.6c.2 0 .4.1.5.4l.8 1.8c.1.2 0 .5-.1.7l-.6.7c-.1.1-.1.3 0 .5.7 1.2 1.6 2.1 2.8 2.8.2.1.4.1.5 0l.7-.7c.2-.2.4-.2.6-.1l1.8.8c.3.1.4.3.4.6v.5c0 .4-.1.7-.4.9-.6.5-1.4.8-2.3.6-3.2-.7-5.8-3.3-6.5-6.5-.1-.8.1-1.6.4-2.1z" fill="currentColor" />
  </svg>
)

export const InstagramIcon = ({ size = 20, className }: P) => (
  <svg {...svg(size, className)} fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export const FacebookIcon = ({ size = 20, className }: P) => (
  <svg {...svg(size, className)} fill="currentColor">
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
  </svg>
)

export const TikTokIcon = ({ size = 20, className }: P) => (
  <svg {...svg(size, className)} fill="currentColor">
    <path d="M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v3.1c-1.4.1-2.7-.3-3.9-1.1v5.9c0 3.4-2.6 5.7-5.7 5.7-3.3 0-5.6-2.6-5.4-5.8.2-3 2.8-5.3 6.1-5v3.2c-.4-.1-.8-.2-1.2-.1-1.3.1-2.2 1.1-2.2 2.3 0 1.4 1.1 2.4 2.5 2.3 1.3-.1 2.2-1.1 2.2-2.5V3h3.7z" />
  </svg>
)

export const MessengerIcon = ({ size = 20, className }: P) => (
  <svg {...svg(size, className)} fill="none">
    <path d="M12 3C7 3 3 6.7 3 11.4c0 2.6 1.2 4.9 3.2 6.4V21l2.9-1.6c.9.3 1.9.4 2.9.4 5 0 9-3.7 9-8.4S17 3 12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M7.2 13.8l3.1-3.3 2 1.6 3.8-2.3-3.1 3.3-2-1.6-3.8 2.3z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
  </svg>
)

export const ViberIcon = ({ size = 20, className }: P) => (
  <svg {...svg(size, className)} fill="none">
    <path d="M12 3c4.8 0 8 2 8 7.5 0 4.6-2.3 7.2-7.3 7.4L9.5 21v-3.3C5.6 16.8 4 14.3 4 10.5 4 5 7.2 3 12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9.6 7.4c.3-.2.6-.2.8.1l.9 1.3c.2.3.1.6-.1.8l-.4.3c.4 1 1.1 1.8 2.1 2.2l.3-.4c.2-.3.5-.3.8-.1l1.3.9c.3.2.3.5.1.8-.5.9-1.4 1.2-2.4.8-1.8-.8-3.1-2.1-3.9-3.9-.4-1 0-1.9.5-2.8z" fill="currentColor" />
  </svg>
)
