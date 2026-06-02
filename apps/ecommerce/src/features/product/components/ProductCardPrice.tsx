import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/formatters/currency'

import { useProductCard } from '@/features/product/context'
import { Badge } from '@/components/ui/badge'

export function ProductCardPrice() {
  const { product } = useProductCard()
  const { price, discount } = product

  const finalPrice = discount ? Math.floor(price * (1 - discount)) : price

  const discountPercent = discount ? Math.floor(discount * 100) : null

  return (
    <div className="flex flex-col">
      {discount && (
        <span className="text-muted-foreground text-xs line-through">{formatCurrency(price)}</span>
      )}
      <div className="flex items-center gap-1.5">
        <span className={cn('text-base font-semibold')}>{formatCurrency(finalPrice)}</span>
        {discountPercent && (
          <Badge className="rounded-sm" variant="destructive">
            {discountPercent}%
          </Badge>
        )}
      </div>
    </div>
  )
}
