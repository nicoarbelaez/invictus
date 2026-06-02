'use client'

import { useId, useState } from 'react'
import { CARD_PROVIDERS, INITIAL_FORM } from '@/features/cart/config/checkout.config'
import { buildOrderMessage, buildWhatsAppUrl } from '@/features/cart/utils/checkout.utils'
import type { CardProvider, FormState, PaymentMethod } from '@/features/cart/types/checkout.types'
import type { CartItem } from '@/features/cart/store'

export type FieldBinder = (key: keyof FormState) => {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function useCheckoutForm(items: CartItem[]) {
  const uid = useId()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [cardProvider, setCardProvider] = useState<CardProvider>('mercadopago')

  const field: FieldBinder = (key) => ({
    id: `${uid}-${key}`,
    value: form[key],
    onChange: (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
  })

  const isWhatsApp = paymentMethod !== 'card'

  const submitLabel = isWhatsApp
    ? 'Realizar pedido'
    : `Pagar con ${CARD_PROVIDERS.find((p) => p.value === cardProvider)?.label ?? 'tarjeta'}`

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isWhatsApp) {
      const message = buildOrderMessage(form, items, paymentMethod, cardProvider)
      window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
    } else {
      // TODO: integrar pasarela de pago
      console.log('Card payment payload:', { form, cardProvider, items })
    }
  }

  return {
    field,
    uid,
    paymentMethod,
    setPaymentMethod,
    cardProvider,
    setCardProvider,
    submitLabel,
    handleSubmit,
    isWhatsApp,
  }
}
