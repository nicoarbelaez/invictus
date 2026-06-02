import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react'
import type { ComponentProps } from 'react'

export type IconProps = ComponentProps<typeof Icon>

export function ReactIcon({ className, ...props }: IconProps) {
  return <Icon className={cn('block shrink-0', className)} {...props} />
}
