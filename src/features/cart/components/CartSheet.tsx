'use client'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatCurrency } from '@/utils/formatters/currency'
import { useCartStore, useCartUIStore } from '@/features/cart/store'
import { CartItemRow } from '@/features/cart/components'

export function CartSheet() {
  const { open, closeSheet } = useCartUIStore()
  const { items, remove, updateQuantity } = useCartStore()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={(value) => !value && closeSheet()}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className={cn('flex h-full w-full flex-col p-0 sm:max-w-md')}
      >
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4" />

            <SheetTitle className="text-base">Tu carrito</SheetTitle>

            {items.length > 0 && (
              <span className="text-muted-foreground text-sm">({items.length})</span>
            )}
          </div>
        </SheetHeader>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="text-muted-foreground size-12" />

            <p className="text-muted-foreground text-sm">Tu carrito está vacío</p>

            <SheetClose asChild>
              <Button variant="outline" size="sm" asChild>
                <a href="/">Explorar productos</a>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            {/* Body */}
            <ScrollArea className="flex-1">
              <div className="divide-y px-4">
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

            {/* Footer */}
            <div className="shrink-0 border-t p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>

                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              <Separator className="mb-3" />

              <div className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <a href="/cart">Ir al carrito</a>
                  </Button>
                </SheetClose>

                <SheetClose asChild>
                  <Button variant="ghost" className="w-full">
                    Seguir comprando
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
