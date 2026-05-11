'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  MobileMenuDrawer,
  NavActions,
  NavBrand,
  NavCategoriesBar,
  NavSearch,
  useNavScroll,
} from '@/components/global/nav'
import type { NavCategory } from '@/components/global/nav'

// desktop header = h-16 (64) + categories h-11 (44)
const DESKTOP_NAV_HEIGHT = 108

interface NavBarProps {
  categories: NavCategory[]
}

function DesktopInner({ categories }: NavBarProps) {
  return (
    <>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-8 lg:px-12">
        <NavBrand />
        <div className="flex flex-1 justify-center">
          <NavSearch />
        </div>
        <NavActions />
      </div>
      <NavCategoriesBar categories={categories} />
    </>
  )
}

export function NavBar({ categories }: NavBarProps) {
  const { showFixed } = useNavScroll(DESKTOP_NAV_HEIGHT)

  return (
    <>
      {/* ── Desktop static: lives in document flow, scrolls away naturally ── */}
      <header className="bg-background hidden w-full border-b lg:block">
        <DesktopInner categories={categories} />
      </header>

      {/* ── Desktop fixed clone: animates in from top when scrolling up ── */}
      <AnimatePresence>
        {showFixed && (
          <motion.header
            key="fixed-desktop-nav"
            className="bg-background/95 supports-backdrop-filter:bg-background/70 fixed inset-x-0 top-0 z-50 hidden border-b backdrop-blur lg:block"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.9 }}
          >
            <DesktopInner categories={categories} />
          </motion.header>
        )}
      </AnimatePresence>

      {/* ── Mobile: always fixed, never hides ── */}
      <header className="bg-background/95 supports-backdrop-filter:bg-background/70 fixed inset-x-0 top-0 z-50 border-b backdrop-blur lg:hidden">
        <div className="flex h-14 items-center gap-1 px-2">
          <MobileMenuDrawer categories={categories} />
          <Button variant="ghost" size="icon" aria-label="Buscar" className="shrink-0">
            <Search className="size-5" />
          </Button>
          <NavBrand className="flex-1 justify-center" />
          <NavActions cartOnly />
        </div>
      </header>
    </>
  )
}
