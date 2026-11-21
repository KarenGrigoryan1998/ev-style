/**
 * Contact links. Facebook Messenger is the main channel; WhatsApp / Viber / phone are alternatives.
 * Buttons use <ContactButton> (src/components/ui/ContactButton.tsx), which also tracks the click.
 */
import i18n from './i18n'
import { site } from '@/config/site'
import type { Lang } from './types'
import type { ContactChannel } from './analytics'
import { campaignRef } from './utm'
import { showToast } from './toast'

/** Adds "(ref: fb_logo_nov)" when the visitor came from an ad with UTMs — before an open "My car: " prompt, else at the end */
function withRef(message: string): string {
  const ref = campaignRef()
  if (!ref) return message
  const tag = `(ref: ${ref})`
  const open = message.match(/^([\s\S]*[.!?։])\s+([^.!?։]*\s)$/)
  return open ? `${open[1]} ${tag} ${open[2]}` : `${message.trimEnd()} ${tag}`
}

/** Pre-written order message in the visitor's language (templates: `whatsapp.*` in locale files) */
export function buildOrderMessage(productName?: string, model?: string, lang: Lang = 'hy'): string {
  const t = i18n.getFixedT(lang)
  if (productName && model) return withRef(t('whatsapp.productWithModel', { product: productName, model }))
  if (productName) return withRef(t('whatsapp.product', { product: productName }))
  return withRef(t('whatsapp.general'))
}

/** WhatsApp link with the message pre-filled */
export function buildWhatsAppLink(productName?: string, model?: string, lang: Lang = 'hy'): string {
  return `https://wa.me/${site.contacts.whatsapp}?text=${encodeURIComponent(buildOrderMessage(productName, model, lang))}`
}

export const messengerLink = () => site.contacts.messenger
export const phoneLink = () => `tel:${site.contacts.phone}`
export const viberLink = () => `viber://chat?number=%2B${site.contacts.viber}`

export function contactHref(channel: ContactChannel, productName?: string, model?: string, lang: Lang = 'hy'): string {
  switch (channel) {
    case 'whatsapp':
      return buildWhatsAppLink(productName, model, lang)
    case 'messenger':
      return messengerLink()
    case 'viber':
      return viberLink()
    case 'phone':
      return phoneLink()
  }
}

/**
 * Messenger links can't carry a pre-filled text, so for "Order via Messenger" we copy
 * the order message to the clipboard and tell the visitor to paste it.
 */
export function copyOrderMessage(productName: string, model: string | undefined, lang: Lang) {
  const text = buildOrderMessage(productName, model, lang).trim()
  try {
    void navigator.clipboard?.writeText(text).then(
      () => showToast(i18n.getFixedT(lang)('common.messageCopied')),
      () => {},
    )
  } catch {
    /* clipboard unavailable — Messenger still opens */
  }
}
