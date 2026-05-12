'use client'

import { useState } from 'react'
import { Flame, Heart, Menu, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useWishlistStore } from '@/features/product/store'
import { useCartStore, useCartUIStore } from '@/features/cart/store'
import { CountBadge } from '@/components/share'
import type { NavCategory } from '@/components/global/nav/NavCategoriesBar'

interface MobileMenuDrawerProps {
  categories: NavCategory[]
}

export function MobileMenuDrawer({ categories }: MobileMenuDrawerProps) {
  const [open, setOpen] = useState(false)

  const wishlistCount = useWishlistStore((state) => state.ids.length)

  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  const openSheet = useCartUIStore((state) => state.openSheet)

  function close() {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menú" className="shrink-0">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex w-72 flex-col p-0" aria-describedby={undefined}>
        {/* Header */}
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

            <a href="/" onClick={close} className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                IJ
              </div>

              <span className="font-semibold tracking-tight">Invictus Joyas</span>
            </a>

            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Cerrar menú">
                <Menu className="hidden" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <p className="text-muted-foreground mb-2 px-3 text-xs font-medium tracking-wider uppercase">
            Categorías
          </p>

          <ul className="space-y-0.5">
            {categories.map((category) => (
              <li key={category.href}>
                <SheetClose asChild>
                  <a
                    href={category.href}
                    className="text-foreground hover:bg-accent flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors"
                  >
                    {category.label}
                  </a>
                </SheetClose>
              </li>
            ))}
          </ul>

          <Separator className="my-3" />

          <SheetClose asChild>
            <a
              href="/ofertas"
              className="flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/20"
            >
              <Flame className="size-4" />
              Ofertas
            </a>
          </SheetClose>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t p-3">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 justify-start gap-2" asChild>
              <SheetClose asChild>
                <a href="/wishlist">
                  <Heart className="size-4" />

                  <span>Favoritos</span>

                  <CountBadge count={wishlistCount} />
                </a>
              </SheetClose>
            </Button>

            <SheetClose asChild>
              <Button
                variant="outline"
                className="flex-1 justify-start gap-2"
                onClick={() => {
                  openSheet()
                }}
              >
                <ShoppingCart className="size-4" />

                <span>Carrito</span>

                <CountBadge count={cartCount} />
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
