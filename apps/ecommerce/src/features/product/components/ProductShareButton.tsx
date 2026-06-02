'use client'

import { type ComponentProps } from 'react'
import { Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useProductCard } from '@/features/product/context'

type ButtonProps = ComponentProps<typeof Button>

interface Props extends Omit<ButtonProps, 'children'> {
  ariaLabel?: string
}

export function ProductShareButton({ ariaLabel = 'Compartir', ...rest }: Props) {
  const { handleShare } = useProductCard()

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-lg"
      onClick={handleShare}
      aria-label={ariaLabel}
      {...rest}
    >
      <Share2 className="size-4" />
    </Button>
  )
}
