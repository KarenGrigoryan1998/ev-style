import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { site } from '@/config/site'
import { useLang } from '@/hooks/useLang'
import { useModelName } from '@/hooks/useModelName'
import { contactHref, copyOrderMessage } from '@/lib/contact'
import { productParams, track, type ContactChannel, type Placement } from '@/lib/analytics'
import type { Product } from '@/lib/types'

type AnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'>

interface ContactProps extends AnchorProps {
  channel: ContactChannel
  placement: Placement
  /** Set on "Order" buttons → tracked as Lead (otherwise Contact) and the order message names the product */
  product?: Product
  /** Name used in the order message, e.g. with the chosen variant. Defaults to the product name */
  orderName?: string
  /** Selected car model id (SL03 / S05 / S07 / OTHER) */
  model?: string
}

/**
 * Every WhatsApp / Messenger / Viber / Call button on the site.
 * Tracks the click first (Lead for product orders, Contact otherwise), then opens the link
 * (http links in a new tab, so the event is never lost).
 */
export function ContactButton({ channel, placement, product, orderName, model, onClick, children, ...rest }: ContactProps) {
  const { lang } = useLang()
  const modelName = useModelName()
  const name = orderName ?? product?.name[lang]
  const modelLabel = model ? modelName(model) : undefined
  const href = contactHref(channel, name, modelLabel, lang)
  const external = href.startsWith('http')

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (product) track('Lead', { ...productParams(product, model), channel, placement })
    else track('Contact', { channel, placement })
    // Rebuild the link at click time — the pre-rendered HTML can't know the ad campaign (ref tag)
    if (channel === 'whatsapp') e.currentTarget.href = contactHref(channel, name, modelLabel, lang)
    if (channel === 'messenger' && name) copyOrderMessage(name, modelLabel, lang)
    onClick?.(e)
  }

  return (
    <a {...rest} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={handleClick}>
      {children}
    </a>
  )
}

export type SocialNetwork = 'facebook' | 'instagram' | 'tiktok'

interface FollowProps extends AnchorProps {
  network: SocialNetwork
}

/** Facebook / Instagram / TikTok page links (not tracked) */
export function FollowLink({ network, children, ...rest }: FollowProps) {
  return (
    <a {...rest} href={site.social[network].url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
