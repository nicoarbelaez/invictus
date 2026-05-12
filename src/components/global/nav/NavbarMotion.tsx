'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useNavScroll } from '@/components/global/nav'

const variants = {
  visible: { y: 0 },
  hidden: { y: '-100%' },
}

const BASE_TRANSITION = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
const INSTANT_TRANSITION = { duration: 0 }

interface NavbarMotionProps {
  children: React.ReactNode
  className?: string
}

export function NavbarMotion({ children, className }: NavbarMotionProps) {
  const isVisible = useNavScroll()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.header
      initial={false}
      variants={variants}
      animate={isVisible ? 'visible' : 'hidden'}
      transition={shouldReduceMotion ? INSTANT_TRANSITION : BASE_TRANSITION}
      className={cn(
        'bg-background/95 supports-backdrop-filter:bg-background/70 fixed inset-x-0 top-0 z-50 border-b backdrop-blur',
        className
      )}
    >
      {children}
    </motion.header>
  )
}
