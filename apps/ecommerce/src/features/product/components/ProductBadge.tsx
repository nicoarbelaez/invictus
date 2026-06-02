import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { ComponentProps } from 'react'

type BadgeProps = ComponentProps<typeof Badge>

export type BadgePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

const POSITION_CLASSES: Record<BadgePosition, string> = {
  'top-left': 'top-3 left-3',
  'top-right': 'top-3 right-3',
  'bottom-left': 'bottom-3 left-3',
  'bottom-right': 'bottom-3 right-3',
}

interface Props extends BadgeProps {
  position?: BadgePosition
}

export function ProductBadge({ children, position = 'top-left', className, ...rest }: Props) {
  return (
    <Badge
      className={cn(
        'pointer-events-none absolute z-20 select-none',
        POSITION_CLASSES[position],
        className
      )}
      {...rest}
    >
      {children}
    </Badge>
  )
}
