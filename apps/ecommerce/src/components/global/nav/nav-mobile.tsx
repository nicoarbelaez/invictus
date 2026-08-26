import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileMenuDrawer, NavActions, NavBrand, type NavCategory } from '@/components/global/nav'

interface NavMobileProps {
  categories: NavCategory[]
  siteName: string
  logoUrl: string
}

export function NavMobile({ categories, siteName, logoUrl }: NavMobileProps) {
  return (
    <div className="flex h-14 items-center gap-1 px-2">
      <MobileMenuDrawer categories={categories} siteName={siteName} logoUrl={logoUrl} />

      <Button variant="ghost" size="icon" aria-label="Abrir búsqueda" className="shrink-0">
        <Search className="size-5" />
      </Button>

      <NavBrand className="flex-1 justify-center" siteName={siteName} logoUrl={logoUrl} />

      <NavActions cartOnly />
    </div>
  )
}
