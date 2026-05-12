import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const countBadgeVariants = cva(
  'flex items-center justify-center rounded-full text-[10px] leading-none font-medium tabular-nums',
  {
    variants: {
      floating: {
        true: 'absolute size-4',
        false: 'size-5 min-w-5 px-1',
      },

      position: {
        'top-right': '-top-1 -right-1',
        'top-left': '-top-1 -left-1',
      },
    },

    defaultVariants: {
      floating: false,
      position: 'top-right',
    },
  }
)

type CountBadgeVariants = VariantProps<typeof countBadgeVariants>

export interface CountBadgeProps extends React.ComponentProps<typeof Badge> {
  count: number
  max?: number

  floating?: CountBadgeVariants['floating']

  position?: CountBadgeVariants['position']
}

export function CountBadge({
  count,
  max = 99,

  floating = false,
  position = 'top-right',

  className,
  ...props
}: CountBadgeProps) {
  if (count <= 0) {
    return null
  }

  const displayValue = count > max ? `${max}+` : count

  return (
    <Badge
      className={cn(
        countBadgeVariants({
          floating,
          position,
        }),
        className
      )}
      {...props}
    >
      {displayValue}
    </Badge>
  )
}
