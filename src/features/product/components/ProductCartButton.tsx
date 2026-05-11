import { type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { useProductCard } from '@/features/product/context'

type ButtonProps = ComponentProps<typeof Button>

interface Props extends Omit<ButtonProps, 'children'> {
  children: ReactNode
  soldOutContent: ReactNode
}

export function ProductCartButton({
  children,
  soldOutContent,
  className,
  disabled,
  onClick,
  ...rest
}: Props) {
  const { product, onAddToCart } = useProductCard()
  const soldOut = product.commercial?.soldOut ?? false

  return (
    <Button
      type="button"
      className={cn('w-full', className)}
      disabled={soldOut || disabled}
      onClick={onClick ?? (() => onAddToCart?.(1))}
      {...rest}
    >
      {soldOut ? soldOutContent : children}
    </Button>
  )
}
