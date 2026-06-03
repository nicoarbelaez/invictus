import { AspectRatio } from '@/components/ui/aspect-ratio'
import { useProductCard } from '@/features/product/context'

export function ProductCardImage() {
  const { product } = useProductCard()
  const { src, alt } = product.images[0]
  const href = `/products/${product.slug}`

  const image = (
    <div className="overflow-hidden">
      <AspectRatio ratio={1}>
        <img
          src={src}
          alt={alt}
          className="h-full w-full transform-gpu object-cover object-center transition-transform duration-3000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover/card:scale-[1.05]"
        />
      </AspectRatio>
    </div>
  )

  return (
    <a href={href} className="block">
      {image}
    </a>
  )
}
