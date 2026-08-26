import { WHATSAPP_NUMBER } from '@/config/site'

import { formatCurrency } from '@/utils/formatters/currency'

import { CARD_PROVIDERS, PAYMENT_METHODS } from '@/features/cart/config/checkout.config'

import type { CardProvider, FormState, PaymentMethod } from '@/features/cart/types/checkout.types'

import type { CartItem } from '@/features/cart/store'

function getCurrentPageUrl() {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window.location.href
}

export function buildOrderMessage(
  form: FormState,
  items: CartItem[],
  paymentMethod: PaymentMethod,
  cardProvider: CardProvider,
  siteName: string,
  sourceUrl = getCurrentPageUrl()
): string {
  const paymentLabel =
    paymentMethod === 'card'
      ? `Tarjeta — ${CARD_PROVIDERS.find((p) => p.value === cardProvider)?.label ?? ''}`
      : (PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label ?? paymentMethod)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const itemLines = items
    .map(
      (item) => `- ${item.quantity}x ${item.title} — ${formatCurrency(item.price * item.quantity)}`
    )
    .join('\n')

  return [
    `Hola ${siteName}, quiero realizar el siguiente pedido 🛍️`,

    '',

    `👤 *Mis datos*`,
    `- Nombre: ${form.fullName}`,
    `- Correo: ${form.email}`,
    `- Teléfono: ${form.phone}`,

    '',

    `📦 *Productos*`,
    itemLines,

    '',

    `💰 *Total estimado: ${formatCurrency(subtotal)}*`,
    `_(El costo de envío se calcula aparte)_`,

    '',

    `🚚 *Dirección de entrega*`,
    `- ${form.address}`,
    `- ${form.city}, ${form.department}`,

    '',

    `💳 *Método de pago:* ${paymentLabel}`,

    ...(sourceUrl ? ['', `🔗 *Página de origen:*`, sourceUrl] : []),
  ].join('\n')
}

export function buildWhatsAppUrl(message: string): string {
  const normalized = message.normalize('NFC')

  const encoded = encodeURIComponent(normalized)

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (isMobile) {
    return `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encoded}`
  }

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`
}
