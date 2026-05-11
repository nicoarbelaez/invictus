'use client'

import { Separator } from '@/components/ui/separator'
import { ProductCardProvider } from '@/features/product/context'
import { useShare } from '@/features/product/hooks/useShare'
import { useWishlistStore } from '@/features/product/store'
import { ProductGallery } from '@/features/product/components/ProductGalley'
import { ProductQuickViewInfo } from '@/features/product/components/ProductQuickViewInfo'
import type { Product } from '@/features/product/domain/product.schema'

interface ProductPageViewProps {
  product: Product
}

export function ProductPageView({ product }: ProductPageViewProps) {
  const { toggle, isLiked } = useWishlistStore()
  const liked = isLiked(product.id)

  const { handleShare, shareFeedback } = useShare({
    title: product.title,
    description: product.shortDescription ?? product.description,
    shareUrl: typeof window !== 'undefined' ? window.location.href : product.href,
  })

  return (
    <ProductCardProvider
      value={{
        product,
        sections: [],
        liked,
        handleLike: () => toggle(product.id),
        handleShare,
        shareFeedback,
        onAddToCart: (quantity) => console.log(`Add ${quantity} × ${product.title}`),
        onBuyNow: () => console.log(`Buy now: ${product.title}`),
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
