'use client'

import { useCartStore } from '@/features/cart/store'
import { CheckoutForm, EmptyCart, OrderSummary } from '@/features/cart/components/checkout'

export function CartCheckoutView() {
  const items = useCartStore((state) => state.items)

  if (items.length === 0) return <EmptyCart />

  return (
    <div className="grid min-h-[60vh] gap-12 py-8 lg:grid-cols-[1fr_420px] lg:gap-16 lg:py-12">
      <div className="order-2 lg:order-1">
        <OrderSummary />
      </div>

      <div className="order-1 rounded-xl border p-6 lg:order-2 lg:p-8">
        <CheckoutForm />
      </div>
    </div>
  )
}
