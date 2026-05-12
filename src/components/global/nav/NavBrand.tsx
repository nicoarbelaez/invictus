import { SITE_LOGO_URL } from '@/config/site'
import { cn } from '@/lib/utils'

interface NavBrandProps {
  className?: string
}

export function NavBrand({ className }: NavBrandProps) {
  return (
    <a
      href="/"
      className={cn('flex h-14 shrink-0 items-center', className)}
      aria-label="Invictus Joyas"
    >
      <img
        src={SITE_LOGO_URL}
        alt="Invictus Joyas"
        className="h-full w-auto object-contain"
        loading="eager"
        decoding="async"
      />
    </a>
  )
}
