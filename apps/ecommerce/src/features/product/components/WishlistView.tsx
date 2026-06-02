'use client'

import { Heart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProductGrid } from '@/components/share/ProductGrid'
import { useWishlistStore } from '@/features/product/store'
import type { Product } from '@/features/product/domain'

interface WishlistViewProps {
  products: Product[]
}

export function WishlistView({ products }: WishlistViewProps) {
  const { ids, clear } = useWishlistStore()

  const wishlistProducts = products.filter((p) => ids.includes(p.id))
  const count = wishlistProducts.length

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-28 text-center">
        <Heart className="text-muted-foreground size-16" strokeWidth={1.5} />
        <h2 className="text-xl font-semibold">Tu lista de favoritos está vacía</h2>
        <p className="text-muted-foreground max-w-xs text-sm">
          Guarda las piezas que más te gusten para encontrarlas fácilmente después.
        </p>
        <Button asChild>
          <a href="/">Explorar colección</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-6 lg:py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Favoritos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {count} {count === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        <Button variant="ghost" size="sm" className="text-muted-foreground gap-2" onClick={clear}>
          <Trash2 className="size-4" />
          Vaciar lista
        </Button>
      </div>

      <Separator className="mb-8" />

      <ProductGrid products={wishlistProducts} getLiked={() => true} />
    </div>
  )
}
