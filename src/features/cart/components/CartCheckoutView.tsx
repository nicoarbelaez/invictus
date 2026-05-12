'use client'

import { useId, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/utils/formatters/currency'
import { useCartStore } from '@/features/cart/store'
import { CartItemRow } from '@/features/cart/components'

type PaymentMethod = 'bank-transfer' | 'cod' | 'card'
type CardProvider = 'mercadopago' | 'wompi' | 'epayco'

const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  {
    value: 'bank-transfer',
    label: 'Depósito bancario',
    description: 'Datos bancarios enviados por WhatsApp tras confirmar el pedido.',
  },
  {
    value: 'cod',
    label: 'Pago contra entrega',
    description: 'Paga en efectivo al recibir tu pedido.',
  },
  {
    value: 'card',
    label: 'Tarjeta de crédito/débito',
    description: 'Pago seguro con pasarela de pago.',
  },
]

const CARD_PROVIDERS: { value: CardProvider; label: string }[] = [
  { value: 'mercadopago', label: 'Mercado Pago' },
  { value: 'wompi', label: 'Wompi' },
  { value: 'epayco', label: 'ePayco' },
]

interface PaymentMethodCardProps {
  id: string
  value: string
  label: string
  description: string
}

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

export function PaymentMethodCard({ id, value, label, description }: PaymentMethodCardProps) {
  return (
    <Label htmlFor={id} className="group block cursor-pointer">
      <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 relative flex w-full items-start gap-3 rounded-xl border p-4 shadow-xs transition-all">
        <RadioGroupItem
          value={value}
          id={id}
          className="peer mt-0.5 size-4 shrink-0 after:absolute after:inset-0 [&_svg]:size-3"
        />

        <div className="grid gap-1">
          <div className="text-sm leading-none font-medium">{label}</div>

          <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
        </div>
      </div>
    </Label>
  )
}

function OrderSummary() {
  const { items, remove, updateQuantity } = useCartStore()
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Resumen del pedido</h2>

      <ScrollArea className="max-h-[480px]">
        <div className="divide-y">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onRemove={() => remove(item.productId)}
              onQuantityChange={(qty) => updateQuantity(item.productId, qty)}
            />
          ))}
        </div>
      </ScrollArea>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Envío</span>
          <span className="text-muted-foreground">Por calcular</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <span className="text-base font-semibold">Total</span>
        <span className="text-base font-semibold">{formatCurrency(subtotal)}</span>
      </div>
    </div>
  )
}

interface FormState {
  email: string
  fullName: string
  phone: string
  address: string
  city: string
  department: string
}

function CheckoutForm() {
  const uid = useId()
  const items = useCartStore((state) => state.items)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const [form, setForm] = useState<FormState>({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    department: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [cardProvider, setCardProvider] = useState<CardProvider>('mercadopago')

  const field = (key: keyof FormState) => ({
    id: `${uid}-${key}`,
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  })

  const submitLabel =
    paymentMethod === 'card'
      ? `Pagar con ${CARD_PROVIDERS.find((p) => p.value === cardProvider)?.label ?? 'tarjeta'}`
      : 'Realizar pedido'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Order payload:', { form, paymentMethod, cardProvider, items, subtotal })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Finalizar compra</h1>

      {/* Contact */}
      <section className="flex flex-col gap-4">
        <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Información de contacto
        </h2>
        <FormField id={`${uid}-email`} label="Correo electrónico">
          <Input type="email" placeholder="correo@ejemplo.com" required {...field('email')} />
        </FormField>
        <FormField id={`${uid}-fullName`} label="Nombre completo">
          <Input placeholder="Tu nombre completo" required {...field('fullName')} />
        </FormField>
        <FormField id={`${uid}-phone`} label="Teléfono / WhatsApp">
          <Input type="tel" placeholder="+57 300 000 0000" required {...field('phone')} />
        </FormField>
      </section>

      <Separator />

      {/* Shipping */}
      <section className="flex flex-col gap-4">
        <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Dirección de entrega
        </h2>
        <FormField id={`${uid}-address`} label="Dirección">
          <Input placeholder="Calle, número, apartamento" required {...field('address')} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField id={`${uid}-city`} label="Ciudad">
            <Input placeholder="Ciudad" required {...field('city')} />
          </FormField>
          <FormField id={`${uid}-department`} label="Departamento">
            <Input placeholder="Departamento" required {...field('department')} />
          </FormField>
        </div>
      </section>

      <Separator />

      {/* Payment */}
      <section className="flex flex-col gap-4">
        <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Método de pago
        </h2>
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
          <div className="ml-4 flex flex-col gap-3 border-l pl-4">
            <p className="text-sm font-medium">Selecciona la pasarela</p>

            <RadioGroup
              value={cardProvider}
              onValueChange={(v) => setCardProvider(v as CardProvider)}
              className="gap-2"
            >
              {CARD_PROVIDERS.map((provider) => {
                const id = `${uid}-card-${provider.value}`

                return (
                  <Label key={provider.value} htmlFor={id} className="group block cursor-pointer">
                    <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 relative flex w-full items-center gap-3 rounded-lg border px-4 py-3 transition-all">
                      <RadioGroupItem
                        value={provider.value}
                        id={id}
                        className="peer size-4 shrink-0 after:absolute after:inset-0 [&_svg]:size-3"
                      />

                      <div className="flex flex-1 items-center justify-between gap-3">
                        <span className="text-sm font-medium">{provider.label}</span>
                      </div>
                    </div>
                  </Label>
                )
              })}
            </RadioGroup>
          </div>
        )}
      </section>

      <Button type="submit" size="lg" className="w-full">
        {submitLabel}
      </Button>

      <p className="text-muted-foreground text-center text-xs">
        Al confirmar aceptas nuestros términos y condiciones. Tus datos están protegidos.
      </p>
    </form>
  )
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <ShoppingBag className="text-muted-foreground size-16" />
      <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
      <p className="text-muted-foreground max-w-xs text-sm">
        Explora nuestra colección y agrega las joyas que más te gusten.
      </p>
      <Button asChild>
        <a href="/">Explorar colección</a>
      </Button>
    </div>
  )
}

export function CartCheckoutView() {
  const items = useCartStore((state) => state.items)

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="grid min-h-[60vh] gap-12 py-8 lg:grid-cols-[1fr_420px] lg:gap-16 lg:py-12">
      {/* Order Summary — right on mobile (order-2), left on desktop */}
      <div className="order-2 lg:order-1">
        <OrderSummary />
      </div>

      {/* Checkout Form — left on mobile (order-1), right on desktop */}
      <div className="order-1 rounded-xl border p-6 lg:order-2 lg:p-8">
        <CheckoutForm />
      </div>
    </div>
  )
}
