'use client'

import { useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

const SCROLL_TOP_OFFSET = 10
const SCROLL_HIDE_THRESHOLD = 120

export function useNavScroll() {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = useState(true)

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0
    const direction = current - previous
    const shouldBeVisible =
      current <= SCROLL_TOP_OFFSET || direction < 0 || current < SCROLL_HIDE_THRESHOLD

    setIsVisible((prev) => (prev === shouldBeVisible ? prev : shouldBeVisible))
  })

  return isVisible
}
