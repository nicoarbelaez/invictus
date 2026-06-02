'use client'

import { CartItem, useCartStore } from '@/features/cart/store'
import { showCartToast } from '@/features/cart/components'
import { computeFinalPrice, type Product } from '@/features/product/domain'

export function useProductActions(product: Product) {
  const cartStore = useCartStore()
  const finalPrice = computeFinalPrice(product)

  const cartPayload: Omit<CartItem, 'quantity'> = {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    price: finalPrice,
    image: product.images[0]?.src,
  }

  function onAddToCart(quantity: number) {
    cartStore.add({ ...cartPayload, quantity })
    showCartToast({ title: product.title, price: finalPrice, quantity, image: cartPayload.image })
  }

  function onBuyNow(quantity: number) {
    cartStore.add({ ...cartPayload, quantity })
    window.location.href = '/cart'
  }

  return { onAddToCart, onBuyNow, finalPrice }
}
