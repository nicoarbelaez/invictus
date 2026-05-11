'use client'

import { useEffect, useRef } from 'react'
import { useAnimate } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'

import { useProductCard } from '@/features/product/context'
import { useWishlistStore } from '@/features/product/store'

type ButtonProps = ComponentProps<typeof Button>

interface Props extends Omit<ButtonProps, 'children'> {
  ariaLabel?: string
}

export function ProductLikeButton({ ariaLabel = 'Me gusta', ...rest }: Props) {
  const { product } = useProductCard()

  const ids = useWishlistStore((state) => state.ids)
  const toggle = useWishlistStore((state) => state.toggle)
  const liked = ids.includes(product.id)

  const [heartRef, animate] = useAnimate()
  const prevLiked = useRef(liked)
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      prevLiked.current = liked
      return
    }

    if (liked && !prevLiked.current) {
      animate(
        heartRef.current,
        { scale: [1, 1.3, 1] },
        { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }
      )
    }

    prevLiked.current = liked
  }, [liked, animate, heartRef])

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-lg"
      className="relative overflow-hidden rounded-full shadow-sm"
      onClick={() => toggle(product.id)}
      aria-label={ariaLabel}
      {...rest}
    >
      <span
        className={cn(
          'absolute inset-0 z-0 flex items-center justify-center',
          'transition-[transform,opacity] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)]',
          liked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        )}
      >
        <span className="size-10 rounded-full bg-red-500" />
      </span>

      <div ref={heartRef} className="relative z-10">
        <Heart
          className={cn(
            'size-4 transition-colors duration-300',
            liked ? 'fill-white text-white' : 'text-foreground fill-transparent'
          )}
        />
      </div>
    </Button>
  )
}
