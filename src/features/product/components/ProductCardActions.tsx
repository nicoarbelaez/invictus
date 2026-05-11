import { useState } from 'react'

import {
  ProductLikeButton,
  ProductShareButton,
  ProductQuickViewDialog,
} from '@/features/product/components'

export function ProductCardActions() {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-100 transition-opacity duration-300 md:flex-row md:opacity-0 md:group-hover/card:opacity-100">
      <ProductLikeButton />

      <ProductShareButton />

      <ProductQuickViewDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
