'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWishlistStore } from '@/features/product/store'
import { useCartStore } from '@/features/cart/store'
import { Badge } from '@/components/ui/badge'

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <Badge
      variant="default"
      className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-medium"
    >
      {count > 99 ? '99+' : count}
    </Badge>
  )
}

interface NavActionsProps {
  className?: string
  cartOnly?: boolean
}

export function NavActions({ className, cartOnly = false }: NavActionsProps) {
  const wishlistCount = useWishlistStore((state) => state.ids.length)
  const cartCount = useCartStore((state) => state.items.reduce((s, i) => s + i.quantity, 0))

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {!cartOnly && (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Favoritos${wishlistCount > 0 ? ` (${wishlistCount})` : ''}`}
          >
            <Heart className="size-5" />
          </Button>
          <CountBadge count={wishlistCount} />
        </div>
      )}

      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Carrito${cartCount > 0 ? ` (${cartCount})` : ''}`}
        >
          <ShoppingCart className="size-5" />
        </Button>
        <CountBadge count={cartCount} />
      </div>
    </div>
  )
}
