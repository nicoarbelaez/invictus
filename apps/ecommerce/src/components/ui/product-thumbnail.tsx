import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface ProductThumbnailProps {
  src?: string
  alt: string
  ratio?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'size-12',
  md: 'size-16',
  lg: 'size-24',
}

export function ProductThumbnail({
  src,
  alt,
  ratio = 1,
  size = 'md',
  className,
}: ProductThumbnailProps) {
  if (!src) return null

  return (
    <div className={cn('shrink-0 overflow-hidden rounded-lg border', sizeMap[size], className)}>
      <AspectRatio ratio={ratio}>
        <img src={src} alt={alt} className="size-full object-cover" />
      </AspectRatio>
    </div>
  )
}
