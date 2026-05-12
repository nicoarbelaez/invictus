'use client'

import { createContext, ReactNode, useContext } from 'react'
import { Product, AccordionSection } from '@/features/product/domain'

type ProductCardContextValue = {
  product: Product
  sections: AccordionSection[]
  liked: boolean
  onAddToCart?: (quantity: number) => void
  onBuyNow?: (quantity: number) => void
  handleLike?: () => void
  handleShare: () => void
  shareFeedback: boolean
}

const ProductCardContext = createContext<ProductCardContextValue | null>(null)

export function ProductCardProvider({
  value,
  children,
}: {
  value: ProductCardContextValue
  children: ReactNode
}) {
  return <ProductCardContext.Provider value={value}>{children}</ProductCardContext.Provider>
}

export function useProductCard() {
  const context = useContext(ProductCardContext)
  if (!context) {
    throw new Error('useProductCard must be used inside ProductCardProvider')
  }
  return context
}
