'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WishlistStore {
  ids: string[]
  toggle: (productId: string) => void
  isLiked: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle(productId) {
        set((state) => {
          const exists = state.ids.includes(productId)
          return {
            ids: exists ? state.ids.filter((id) => id !== productId) : [...state.ids, productId],
          }
        })
      },

      isLiked(productId) {
        return get().ids.includes(productId)
      },

      clear() {
        set({ ids: [] })
      },
    }),
    {
      name: 'invictus:wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
