'use client'

import { cn } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

import {
  ProductCardPrice,
  ProductBadge,
  ProductCartButton,
  ProductCardActions,
  ProductCardImage,
} from '@/features/product/components'
import { ProductCardProps } from '@/features/product/domain'
import { useShare } from '@/features/product/hooks'
import { ProductCardProvider } from '@/features/product/context'

export function ProductCard({
  product,
  liked = false,
  shareUrl,
  sections = [],
  className,
  footerClassName,
  onLike,
  onShare,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  const { handleShare, shareFeedback } = useShare({
    title: product.title,
    description: product.shortDescription ?? product.description,
    shareUrl: shareUrl ?? product.href,
    onShare,
  })

  return (
    <ProductCardProvider
      value={{
        product,
        sections,
        liked,
        onAddToCart,
        onBuyNow,
        handleLike: onLike,
        handleShare,
        shareFeedback,
      }}
    >
      <Card
        className={cn(
          'group/card ring-foreground/10 w-full max-w-88 justify-between gap-0 overflow-hidden border-0 p-0 shadow-none ring-1',
          className
        )}
      >
        <CardContent className="p-0">
          <div className="relative">
            {product.commercial?.badgeText && (
              <ProductBadge position="top-left">{product.commercial.badgeText}</ProductBadge>
            )}

            {product.commercial?.soldOut && (
              <ProductBadge position="bottom-left" className="opacity-50">
                Agotado
              </ProductBadge>
            )}

            <ProductCardActions />
            <ProductCardImage />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent transition-opacity duration-1500 ease-out group-hover/card:opacity-0" />
          </div>

          <div className="space-y-3 p-4">
            <div className="space-y-1">
              <h3 className="line-clamp-2 text-sm leading-5 font-medium">{product.title}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm leading-5">
                {product.description}
              </p>
            </div>

            <ProductCardPrice />

            {shareFeedback && <p className="text-muted-foreground text-xs">Enlace copiado</p>}
          </div>
        </CardContent>

        <CardFooter className={cn('bg-muted/40 border-none p-4 pt-0', footerClassName)}>
          <ProductCartButton soldOutContent="Agotado">
            <ShoppingCart className="size-4" />
            Agregar al carrito
          </ProductCartButton>
        </CardFooter>
      </Card>
    </ProductCardProvider>
  )
}
