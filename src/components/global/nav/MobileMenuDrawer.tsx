'use client'

import { useState } from 'react'
import { Flame, Heart, Menu, ShoppingCart, X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useWishlistStore } from '@/features/product/store'
import { useCartStore } from '@/features/cart/store'
import { cn } from '@/lib/utils'
import type { NavCategory } from './NavCategoriesBar'

function ItemBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="bg-primary text-primary-foreground ml-auto flex size-5 items-center justify-center rounded-full text-[10px] font-medium">
      {count > 99 ? '99+' : count}
    </span>
  )
}

interface MobileMenuDrawerProps {
  categories: NavCategory[]
}

export function MobileMenuDrawer({ categories }: MobileMenuDrawerProps) {
  const [open, setOpen] = useState(false)
  const wishlistCount = useWishlistStore((state) => state.ids.length)
  const cartCount = useCartStore((state) => state.items.reduce((s, i) => s + i.quantity, 0))

  const close = () => setOpen(false)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menú" className="shrink-0">
          <Menu className="size-5" />
        </Button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/40" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'bg-background fixed top-0 left-0 z-50 flex h-full w-72 flex-col shadow-xl outline-none',
            'data-open:animate-in data-open:slide-in-from-left data-open:duration-300',
            'data-closed:animate-out data-closed:slide-out-to-left data-closed:duration-200'
          )}
        >
          <DialogPrimitive.Title className="sr-only">Menú de navegación</DialogPrimitive.Title>

          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
            <a href="/" onClick={close} className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                IJ
              </div>
              <span className="font-semibold tracking-tight">Invictus Joyas</span>
            </a>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Cerrar menú">
                <X className="size-4" />
              </Button>
            </DialogPrimitive.Close>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <p className="text-muted-foreground mb-2 px-3 text-xs font-medium tracking-wider uppercase">
              Categorías
            </p>
            <ul className="space-y-0.5">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <a
                    href={cat.href}
                    onClick={close}
                    className="text-foreground hover:bg-accent flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors"
                  >
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>

            <Separator className="my-3" />

            <a
              href="/ofertas"
              onClick={close}
              className="flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/20"
            >
              <Flame className="size-4" />
              Ofertas
            </a>
          </nav>

          {/* Footer actions */}
          <div className="shrink-0 border-t p-3">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 justify-start gap-2">
                <Heart className="size-4" />
                <span>Favoritos</span>
                <ItemBadge count={wishlistCount} />
              </Button>
              <Button variant="outline" className="flex-1 justify-start gap-2">
                <ShoppingCart className="size-4" />
                <span>Carrito</span>
                <ItemBadge count={cartCount} />
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
