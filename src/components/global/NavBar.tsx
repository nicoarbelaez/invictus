'use client'

import { CartSheet } from '@/features/cart/components'
import { NavbarMotion, NavDesktop, NavMobile, type NavCategory } from '@/components/global/nav'

interface NavBarProps {
  categories: NavCategory[]
}

export function NavBar({ categories }: NavBarProps) {
  return (
    <>
      <NavbarMotion className="hidden lg:block">
        <NavDesktop categories={categories} />
      </NavbarMotion>

      <NavbarMotion className="lg:hidden">
        <NavMobile categories={categories} />
      </NavbarMotion>

      <div aria-hidden="true" className="h-14 shrink-0 lg:h-[108px]" />

      <CartSheet />
    </>
  )
}
