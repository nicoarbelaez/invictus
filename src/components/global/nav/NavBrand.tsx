import { cn } from '@/lib/utils'

interface NavBrandProps {
  className?: string
}

export function NavBrand({ className }: NavBrandProps) {
  return (
    <a
      href="/"
      className={cn('flex shrink-0 items-center gap-2', className)}
      aria-label="Invictus Joyas"
    >
      <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full text-sm font-bold">
        IJ
      </div>
      <span className="text-lg font-semibold tracking-tight">Invictus Joyas</span>
    </a>
  )
}
