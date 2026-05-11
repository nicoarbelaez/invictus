'use client'

import { useState, useEffect, useRef } from 'react'

export function useNavScroll(threshold = 108) {
  const [showFixed, setShowFixed] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY.current
      if (Math.abs(delta) < 4) return

      const scrollingUp = delta < 0

      if (currentY <= threshold) {
        setShowFixed(false)
      } else if (scrollingUp) {
        setShowFixed(true)
      } else {
        setShowFixed(false)
      }

      lastY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return { showFixed }
}
