'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ComponentProps } from 'react'

import { useProductCard } from '@/features/product/context'

type ButtonProps = ComponentProps<typeof Button>

interface Props extends Omit<ButtonProps, 'children'> {
  ariaLabel?: string
}

export function ProductLikeButton({ ariaLabel = 'Me gusta', ...rest }: Props) {
  const { liked, handleLike } = useProductCard()

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-lg"
      className="relative overflow-hidden rounded-full shadow-sm"
      onClick={handleLike}
      aria-label={ariaLabel}
      {...rest}
    >
      <motion.span
        className="absolute inset-0 z-0 flex items-center justify-center"
        initial={false}
        animate={{
          scale: liked ? 1 : 0,
          opacity: liked ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className="size-10 rounded-full bg-red-500" />
      </motion.span>

      <motion.div
        className="relative z-10"
        initial={false}
        animate={{
          scale: liked ? [1, 1.25, 1] : 1,
        }}
        transition={{
          duration: 0.45,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <Heart
          className={cn(
            'size-4 transition-colors duration-300',
            liked ? 'fill-white text-white' : 'text-foreground fill-transparent'
          )}
        />
      </motion.div>
    </Button>
  )
}
