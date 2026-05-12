import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <ShoppingBag className="text-muted-foreground size-16" />
      <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
      <p className="text-muted-foreground max-w-xs text-sm">
        Explora nuestra colección y agrega las joyas que más te gusten.
      </p>
      <Button asChild>
        <a href="/">Explorar colección</a>
      </Button>
    </div>
  )
}
