'use client'

import { ProductGrid } from '@/components/share/ProductGrid'
import type { Product } from '@/features/product/domain'

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  return <ProductGrid products={products} />
}
