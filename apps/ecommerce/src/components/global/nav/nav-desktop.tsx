import {
  NavActions,
  NavBrand,
  NavCategoriesBar,
  NavSearch,
  type NavCategory,
} from '@/components/global/nav'

interface NavDesktopProps {
  categories: NavCategory[]
  siteName: string
  logoUrl: string
}

export function NavDesktop({ categories, siteName, logoUrl }: NavDesktopProps) {
  return (
    <>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-8 lg:px-12">
        <NavBrand siteName={siteName} logoUrl={logoUrl} />

        <div className="flex flex-1 justify-center">
          <NavSearch />
        </div>

        <NavActions />
      </div>

      <NavCategoriesBar categories={categories} />
    </>
  )
}
