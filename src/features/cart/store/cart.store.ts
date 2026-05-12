'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  productId: string
  slug?: string
  title: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  add: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  remove: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      add({ quantity = 1, ...item }) {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity }] }
        })
      },

      remove(productId) {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }))
      },

      updateQuantity(productId, quantity) {
        if (quantity <= 0) {
          get().remove(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }))
      },

      clear() {
        set({ items: [] })
      },
    }),
    {
      name: 'invictus:cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
