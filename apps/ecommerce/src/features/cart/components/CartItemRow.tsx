'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductThumbnail } from '@/components/ui/product-thumbnail'
import { QuantitySelector } from '@/components/share/QuantitySelector'
import { formatCurrency } from '@/utils/formatters/currency'
import type { CartItem } from '@/features/cart/store'

interface CartItemRowProps {
  item: CartItem
  onRemove: () => void
  onQuantityChange: (quantity: number) => void
}

export function CartItemRow({ item, onRemove, onQuantityChange }: CartItemRowProps) {
  return (
    <div className="flex gap-3 py-4">
      <ProductThumbnail src={item.image} alt={item.title} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {item.slug ? (
              <a
                href={`/products/${item.slug}`}
                className="line-clamp-2 text-sm font-medium hover:underline"
              >
                {item.title}
              </a>
            ) : (
              <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
            )}
            <p className="text-muted-foreground mt-0.5 text-sm">{formatCurrency(item.price)}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive size-7 shrink-0"
            onClick={onRemove}
            aria-label={`Eliminar ${item.title}`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <QuantitySelector value={item.quantity} onChange={onQuantityChange} className="w-28" />
          <span className="text-sm font-semibold">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
