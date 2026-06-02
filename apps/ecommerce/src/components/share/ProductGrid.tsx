'use client'

import { useWishlistStore } from '@/features/product/store'
import { ProductCard } from '@/features/product/components'
import type { Product } from '@/features/product/domain'

interface ProductGridProps {
  products: Product[]
  getLiked?: (productId: string) => boolean
}

export function ProductGrid({ products, getLiked }: ProductGridProps) {
  const { toggle, isLiked } = useWishlistStore()
  const resolvedLiked = getLiked ?? isLiked

  return (
    <div className="grid grid-cols-2 justify-items-center gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          liked={resolvedLiked(product.id)}
          onLike={() => toggle(product.id)}
        />
      ))}
    </div>
  )
}
