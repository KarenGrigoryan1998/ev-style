/**
 * Contact links. Facebook Messenger is the main channel; WhatsApp / Viber / phone are alternatives.
 */
import i18n from './i18n'
import { site } from '@/config/site'
import type { Lang } from './types'
import { trackLead } from './analytics'
import { showToast } from './toast'

/** Pre-written order message in the visitor's language (templates: `whatsapp.*` in locale files) */
export function buildOrderMessage(productName?: string, model?: string, lang: Lang = 'hy'): string {
  const t = i18n.getFixedT(lang)
  if (productName && model) return t('whatsapp.productWithModel', { product: productName, model })
  if (productName) return t('whatsapp.product', { product: productName })
  return t('whatsapp.general')
}

/** WhatsApp link with the message pre-filled */
export function buildWhatsAppLink(productName?: string, model?: string, lang: Lang = 'hy'): string {
  return `https://wa.me/${site.contacts.whatsapp}?text=${encodeURIComponent(buildOrderMessage(productName, model, lang))}`
}

export const messengerLink = () => site.contacts.messenger
export const phoneLink = () => `tel:${site.contacts.phone}`
export const viberLink = () => `viber://chat?number=%2B${site.contacts.viber}`

/** Use as onClick on any contact link to report a lead to analytics */
export const onContactClick = (channel: string, label?: string) => () => trackLead(channel, label)

/**
 * onClick for "Order via Messenger": Messenger links can't carry a pre-filled text,
 * so we copy the order message to the clipboard and tell the visitor to paste it.
 */
export const orderViaMessenger = (productName: string, model: string | undefined, lang: Lang, label?: string) => () => {
  trackLead('messenger', label)
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
