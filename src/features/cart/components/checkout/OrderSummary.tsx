'use client'

import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/utils/formatters/currency'
import { useCartStore } from '@/features/cart/store'
import { CartItemRow } from '@/features/cart/components/CartItemRow'

export function OrderSummary() {
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
