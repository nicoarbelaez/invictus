import { cn } from '@/lib/utils'

interface NavBrandProps {
  className?: string
  siteName: string
  logoUrl: string
}

export function NavBrand({ className, siteName, logoUrl }: NavBrandProps) {
  return (
    <a href="/" className={cn('flex h-14 shrink-0 items-center', className)} aria-label={siteName}>
      <img
        src={logoUrl}
        alt={siteName}
        className="h-full w-auto object-contain"
        loading="eager"
        decoding="async"
      />
    </a>
  )
}
