import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

import { useProductCard } from '@/features/product/context'
import { ProductGallery, ProductQuickViewInfo } from '@/features/product/components'

type ProductQuickViewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ariaLabel?: string
}

export function ProductQuickViewDialog({ open, onOpenChange, ariaLabel }: ProductQuickViewProps) {
  const { product } = useProductCard()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" size="icon-lg" aria-label={ariaLabel}>
          <Eye className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          'scrollbar-hidden',
          'w-[calc(100dvw-2rem)]',
          'lg:w-[calc(100dvw-6rem)]',
          'h-[calc(100dvh-2rem)]',
          'lg:h-[min(calc(100dvh-4rem),900px)]',
          'max-w-none sm:max-w-none',
          'overflow-y-auto',
          'lg:overflow-hidden'
        )}
      >
        <DialogTitle className="sr-only">{product.title}</DialogTitle>

        <div className="flex flex-col gap-4 lg:h-full lg:min-h-0 lg:flex-row">
          <div className="aspect-square w-full shrink-0 lg:aspect-auto lg:h-full lg:w-1/2">
            <ProductGallery className="h-full w-full overflow-hidden rounded-t-md lg:rounded-l-md" />
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />
          <Separator orientation="horizontal" className="lg:hidden" />

          <div className="scrollbar-hidden flex flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">
            <div className="p-6 lg:p-10">
              <ProductQuickViewInfo />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
