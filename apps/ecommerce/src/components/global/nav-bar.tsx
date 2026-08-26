'use client'

import { CartSheet } from '@/features/cart/components'
import { NavbarMotion, NavDesktop, NavMobile, type NavCategory } from '@/components/global/nav'

interface NavBarProps {
  categories: NavCategory[]
  siteName: string
  logoUrl: string
}

export function NavBar({ categories, siteName, logoUrl }: NavBarProps) {
  return (
    <>
      <NavbarMotion className="hidden lg:block">
        <NavDesktop categories={categories} siteName={siteName} logoUrl={logoUrl} />
      </NavbarMotion>

      <NavbarMotion className="lg:hidden">
        <NavMobile categories={categories} siteName={siteName} logoUrl={logoUrl} />
      </NavbarMotion>

      <div aria-hidden="true" className="h-14 shrink-0 lg:h-[108px]" />

      <CartSheet />
    </>
  )
}
