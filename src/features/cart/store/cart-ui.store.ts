'use client'

import { create } from 'zustand'

interface CartUIStore {
  open: boolean
  openSheet: () => void
  closeSheet: () => void
}

export const useCartUIStore = create<CartUIStore>()((set) => ({
  open: false,
  openSheet: () => set({ open: true }),
  closeSheet: () => set({ open: false }),
}))
