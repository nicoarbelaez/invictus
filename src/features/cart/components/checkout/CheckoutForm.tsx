'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup } from '@/components/ui/radio-group'
import { useCartStore } from '@/features/cart/store'
import { useCheckoutForm } from '@/features/cart/hooks/useCheckoutForm'
import { FORM_SECTIONS, PAYMENT_METHODS } from '@/features/cart/config/checkout.config'
import { PaymentMethodCard } from './PaymentMethodCard'
import { CardProviderSelector } from './CardProviderSelector'
import type { FieldBinder } from '@/features/cart/hooks/useCheckoutForm'
import type { FieldConfig, PaymentMethod } from '@/features/cart/types/checkout.types'
import { MessageCircleMore } from 'lucide-react'

function FormField({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">{title}</h2>
      {children}
    </section>
  )
}

function FieldRow({ row, field, uid }: { row: FieldConfig[]; field: FieldBinder; uid: string }) {
  const inputs = row.map((f) => (
    <FormField key={f.key} id={`${uid}-${f.key}`} label={f.label}>
      <Input type={f.type} placeholder={f.placeholder} required={f.required} {...field(f.key)} />
    </FormField>
  ))

  if (row.length === 1) return <>{inputs}</>
  return <div className="grid grid-cols-2 gap-3">{inputs}</div>
}

function WhatsAppNotice() {
  return (
    <div className="text-muted-foreground flex items-start justify-center gap-2 text-center text-xs leading-relaxed">
      <MessageCircleMore className="mt-0.5 size-4 shrink-0" />

      <p>
        Por ahora gestionamos los pedidos por WhatsApp.
        <br />
        Recibirás atención personalizada y confirmación en minutos.
      </p>
    </div>
  )
}

export function CheckoutForm() {
  const items = useCartStore((state) => state.items)
  const {
    field,
    uid,
    paymentMethod,
    setPaymentMethod,
    cardProvider,
    setCardProvider,
    submitLabel,
    handleSubmit,
    isWhatsApp,
  } = useCheckoutForm(items)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Finalizar compra</h1>

      {FORM_SECTIONS.map((section) => (
        <React.Fragment key={section.title}>
          <FormSection title={section.title}>
            {section.rows.map((row, i) => (
              <FieldRow key={i} row={row} field={field} uid={uid} />
            ))}
          </FormSection>
          <Separator />
        </React.Fragment>
      ))}

      <FormSection title="Método de pago">
        <RadioGroup
          value={paymentMethod}
          onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
          className="gap-3"
        >
          {PAYMENT_METHODS.map((method) => (
            <PaymentMethodCard
              key={method.value}
              id={`${uid}-pay-${method.value}`}
              value={method.value}
              label={method.label}
              description={method.description}
            />
          ))}
        </RadioGroup>

        {paymentMethod === 'card' && (
          <CardProviderSelector value={cardProvider} onValueChange={setCardProvider} uid={uid} />
        )}
      </FormSection>

      <Button type="submit" size="lg" className="w-full">
        {submitLabel}
      </Button>

      {isWhatsApp && <WhatsAppNotice />}

      <p className="text-muted-foreground text-center text-xs">
        Al confirmar aceptas nuestros términos y condiciones. Tus datos están protegidos.
      </p>
    </form>
  )
}
