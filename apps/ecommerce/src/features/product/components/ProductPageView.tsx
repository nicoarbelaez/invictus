'use client'

import { Separator } from '@/components/ui/separator'
import type { Product } from '@/features/product/domain'
import { useProductActions, useShare } from '@/features/product/hooks'
import { useWishlistStore } from '@/features/product/store'
import { ProductCardProvider } from '@/features/product/context'
import { ProductGallery, ProductQuickViewInfo } from '@/features/product/components'

interface ProductPageViewProps {
  product: Product
}

export function ProductPageView({ product }: ProductPageViewProps) {
  const { toggle, isLiked } = useWishlistStore()
  const liked = isLiked(product.id)

  const { handleShare, shareFeedback } = useShare({
    title: product.title,
    description: product.shortDescription ?? product.description,
    shareUrl: typeof window !== 'undefined' ? window.location.href : `/products/${product.slug}`,
  })

  const { onAddToCart, onBuyNow } = useProductActions(product)

  return (
    <ProductCardProvider
      value={{
        product,
        sections: [],
        liked,
        handleLike: () => toggle(product.id),
        handleShare,
        shareFeedback,
        onAddToCart,
        onBuyNow,
      }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <div className="w-full shrink-0 lg:w-1/2">
          <ProductGallery className="overflow-hidden rounded-xl" />
        </div>

        <Separator orientation="vertical" className="hidden lg:block" />
        <Separator orientation="horizontal" className="lg:hidden" />

        <div className="flex flex-1 flex-col">
          <ProductQuickViewInfo />
        </div>
      </div>
    </ProductCardProvider>
  )
}
