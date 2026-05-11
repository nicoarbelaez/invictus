'use client'

import { ProductCard } from '@/features/product/components/ProductCard'
import { useWishlistStore } from '@/features/product/store'
import type { Product } from '@/features/product/domain/product.schema'

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const { toggle, isLiked } = useWishlistStore()

  return (
    <div className="grid grid-cols-2 justify-items-center gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          liked={isLiked(product.id)}
          onLike={() => toggle(product.id)}
          onAddToCart={(quantity) => console.log(`Add ${quantity} × ${product.title}`)}
        />
      ))}
    </div>
  )
}
