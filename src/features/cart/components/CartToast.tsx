'use client'

import { toast as sonnerToast } from 'sonner'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/utils/formatters/currency'
import { useCartUIStore } from '@/features/cart/store'
import { ProductThumbnail } from '@/components/ui/product-thumbnail'

interface CartToastProps {
  id: string | number
  title: string
  price: number
  quantity: number
  image?: string
}

function CartToast({ id, title, price, quantity, image }: CartToastProps) {
  const total = price * quantity
  const openSheet = useCartUIStore((state) => state.openSheet)

  return (
    <Card className="w-full max-w-sm shadow-lg select-none" size="sm">
      <CardContent className="flex items-center gap-3">
        <div className="bg-muted flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          {image ? (
            <ProductThumbnail src={image} alt={title} className="size-full object-cover" />
          ) : (
            <ShoppingBag className="text-muted-foreground size-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>

          <p className="text-muted-foreground text-xs">
            {quantity > 1 && <span className="mr-1">{quantity}×</span>}

            {formatCurrency(total)}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            sonnerToast.dismiss(id)
            openSheet()
          }}
        >
          Ver carrito
        </Button>
      </CardContent>
    </Card>
  )
}

export interface ShowCartToastOptions {
  title: string
  price: number
  quantity: number
  image?: string
}

export function showCartToast(options: ShowCartToastOptions) {
  sonnerToast.custom((id) => <CartToast id={id} {...options} />, {
    duration: 4000,
  })
}
