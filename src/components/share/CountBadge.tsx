import { Badge } from '@/components/ui/badge'

export function CountBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <Badge
      variant="default"
      className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-medium"
    >
      {count > 99 ? '99+' : count}
    </Badge>
  )
}
