import * as React from 'react'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

import { ProductBadge } from '@/features/product/components'
import { useProductCard } from '@/features/product/context'
import type { ProductImage } from '@/features/product/domain'

export type { ProductImage }

export type ProductGalleryProps = {
  className?: string
}

function MainImage({ src, alt, priority }: ProductImage & { priority: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className="block size-full object-cover object-center"
    />
  )
}

type ThumbnailProps = ProductImage & {
  index: number
  isActive: boolean
  onClick: () => void
}

function Thumbnail({ src, alt, index, isActive, onClick }: ThumbnailProps) {
  return (
    <button
      type="button"
      aria-label={`Ver imagen ${index + 1}`}
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'border-border size-16 shrink-0 overflow-hidden rounded-md border transition-all duration-200',
        isActive ? 'ring-ring ring-2 ring-offset-2' : 'opacity-50 hover:opacity-100'
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block size-full object-cover object-center"
      />
    </button>
  )
}

export function ProductGallery({ className }: ProductGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  const { product } = useProductCard()
  const { images } = product
  const badgeText = product.commercial?.badgeText

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()

    api.on('select', onSelect)
    api.on('reInit', onSelect)

    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  return (
    <div className={cn('flex h-full flex-col gap-3', className)}>
      <div className="group relative min-h-0 flex-1 overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{ align: 'start', loop: true }}
          className="h-full **:data-[slot=carousel-content]:h-full"
        >
          <CarouselContent className="ml-0 h-full">
            {images.map((image, index) => (
              <CarouselItem key={image.src} className="h-full pl-0">
                <MainImage {...image} priority={index === 0} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="left-3 opacity-0 transition-all group-hover:opacity-100"
            onMouseDown={(e) => e.preventDefault()}
          />
          <CarouselNext
            className="right-3 opacity-0 transition-all group-hover:opacity-100"
            onMouseDown={(e) => e.preventDefault()}
          />
        </Carousel>

        {badgeText && (
          <ProductBadge className="rounded-full px-2 py-0.5 text-xs">{badgeText}</ProductBadge>
        )}

        {product.commercial?.soldOut && (
          <ProductBadge position="bottom-left" className="opacity-50">
            Agotado
          </ProductBadge>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex shrink-0 justify-center gap-2 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <Thumbnail
              key={image.src}
              {...image}
              index={index}
              isActive={current === index}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
