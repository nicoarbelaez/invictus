import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileMenuDrawer, NavActions, NavBrand, type NavCategory } from '@/components/global/nav'

interface NavMobileProps {
  categories: NavCategory[]
}

export function NavMobile({ categories }: NavMobileProps) {
  return (
    <div className="flex h-14 items-center gap-1 px-2">
      <MobileMenuDrawer categories={categories} />

      <Button variant="ghost" size="icon" aria-label="Abrir búsqueda" className="shrink-0">
        <Search className="size-5" />
      </Button>

      <NavBrand className="flex-1 justify-center" />

      <NavActions cartOnly />
    </div>
  )
}
