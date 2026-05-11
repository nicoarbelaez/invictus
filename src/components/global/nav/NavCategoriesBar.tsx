import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavCategory {
  label: string
  href: string
}

interface NavCategoriesBarProps {
  categories: NavCategory[]
  className?: string
}

export function NavCategoriesBar({ categories, className }: NavCategoriesBarProps) {
  return (
    <nav className={cn('bg-muted/30 border-t', className)} aria-label="Categorías de productos">
      <div className="mx-auto flex h-11 w-full max-w-6xl items-center gap-0.5 overflow-x-auto px-8 lg:px-12">
        {categories.map((cat) => (
          <a
            key={cat.href}
            href={cat.href}
            className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex h-8 items-center rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors"
          >
            {cat.label}
          </a>
        ))}

        <a
          href="/ofertas"
          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-semibold whitespace-nowrap text-orange-600 transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/20"
        >
          <Flame className="size-3.5" />
          Ofertas
        </a>
      </div>
    </nav>
  )
}
