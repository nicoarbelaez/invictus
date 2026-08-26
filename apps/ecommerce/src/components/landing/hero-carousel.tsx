'use client'

import { useEffect, useMemo, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'

import { Card } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import type { BannerSlide } from '@/lib/cms'
import { cn } from '@/lib/utils'

type HeroCarouselProps = {
  slides: BannerSlide[]
}

function SlideMedia({ slide, priority }: { slide: BannerSlide; priority: boolean }) {
  const img = (
    <img
      src={slide.src}
      alt={slide.alt}
      width={1920}
      height={800}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className="absolute inset-0 size-full scale-100 object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-105"
    />
  )

  if (!slide.href) return img

  return (
    <a
      href={slide.href}
      target={slide.openInNewTab ? '_blank' : undefined}
      rel={slide.openInNewTab ? 'noopener noreferrer' : undefined}
      className="absolute inset-0 block size-full"
    >
      {img}
    </a>
  )
}

/** Hero banner — ReUI c-carousel-5 (autoplay + arrows) + c-carousel-11 (dots/overlay). */
export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  /** Pointer devices hide chrome until hover; touch keeps controls visible. */
  const [fineHover, setFineHover] = useState(false)

  const showControls = slides.length > 1

  const plugins = useMemo(() => {
    if (!showControls || reduceMotion) return undefined
    return [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
  }, [showControls, reduceMotion])

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const syncMotion = () => setReduceMotion(motionMq.matches)
    const syncHover = () => setFineHover(hoverMq.matches)
    syncMotion()
    syncHover()
    motionMq.addEventListener('change', syncMotion)
    hoverMq.addEventListener('change', syncHover)
    return () => {
      motionMq.removeEventListener('change', syncMotion)
      hoverMq.removeEventListener('change', syncHover)
    }
  }, [])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  const handleSetApi = (emblaApi: CarouselApi) => {
    setApi(emblaApi)
    if (!emblaApi) return
    setCount(emblaApi.scrollSnapList().length)
    setCurrent(emblaApi.selectedScrollSnap())
  }

  if (slides.length === 0) return null

  const controlsVisible = !fineHover || hovered

  return (
    <Carousel
      setApi={handleSetApi}
      opts={{ loop: showControls, align: 'start' }}
      plugins={plugins}
      className="group/hero relative w-full"
      aria-label="Banner promocional"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setHovered(false)
        }
      }}
    >
      <CarouselContent className="ml-0">
        {slides.map((slide, index) => (
          <CarouselItem key={`${slide.src}-${index}`} className="basis-full pl-0">
            <Card className="group/card relative h-[min(55vh,560px)] w-full overflow-hidden rounded-none border-0 p-0 shadow-none ring-0">
              <SlideMedia slide={slide} priority={index === 0} />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/70 to-transparent"
                aria-hidden
              />
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      {showControls ? (
        <div
          data-hero-carousel-controls
          data-visible={controlsVisible ? 'true' : 'false'}
          className={cn(
            'pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ease-in-out',
            controlsVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          <CarouselPrevious
            variant="secondary"
            className="pointer-events-auto top-1/2 left-3 size-11 -translate-y-1/2 border-0 bg-black/45 text-white hover:bg-black/60 md:left-4"
          />
          <CarouselNext
            variant="secondary"
            className="pointer-events-auto top-1/2 right-3 size-11 -translate-y-1/2 border-0 bg-black/45 text-white hover:bg-black/60 md:right-4"
          />

          <div
            className="pointer-events-auto absolute inset-x-0 bottom-4 flex justify-center gap-2"
            role="tablist"
            aria-label="Diapositivas del banner"
          >
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === current}
                aria-label={`Ir al banner ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'h-2 cursor-pointer rounded-full transition-all duration-500 ease-in-out',
                  index === current
                    ? 'w-4 bg-white opacity-100'
                    : 'w-2 bg-white/50 opacity-70 hover:opacity-100'
                )}
              />
            ))}
          </div>
        </div>
      ) : null}
    </Carousel>
  )
}
