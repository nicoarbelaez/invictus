'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWishlistStore } from '@/features/product/store'
import { useCartStore, useCartUIStore } from '@/features/cart/store'
import { CountBadge } from '@/components/share'

interface NavActionsProps {
  className?: string
  cartOnly?: boolean
}

export function NavActions({ className, cartOnly = false }: NavActionsProps) {
  const wishlistCount = useWishlistStore((state) => state.ids.length)
  const cartCount = useCartStore((state) => state.items.reduce((s, i) => s + i.quantity, 0))
  const openSheet = useCartUIStore((state) => state.openSheet)

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {!cartOnly && (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Favoritos${wishlistCount > 0 ? ` (${wishlistCount})` : ''}`}
            asChild
          >
            <a href="/wishlist">
              <Heart className="size-5" />
            </a>
          </Button>
          <CountBadge count={wishlistCount} />
        </div>
      )}

      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Carrito${cartCount > 0 ? ` (${cartCount})` : ''}`}
          onClick={openSheet}
        >
          <ShoppingCart className="size-5" />
        </Button>
        <CountBadge count={cartCount} />
      </div>
    </div>
  )
}
