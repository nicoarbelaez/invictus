'use client'

import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'

import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
  'https://napoleonejoyas.co/cdn/shop/files/1_135efe58-a107-4a19-883e-e2e8788172b4.png?v=1765055665&width=375%20375w,//napoleonejoyas.co/cdn/shop/files/1_135efe58-a107-4a19-883e-e2e8788172b4.png?v=1765055665&width=740%20740w,//napoleonejoyas.co/cdn/shop/files/1_135efe58-a107-4a19-883e-e2e8788172b4.png?v=1765055665&width=750%20750w,//napoleonejoyas.co/cdn/shop/files/1_135efe58-a107-4a19-883e-e2e8788172b4.png?v=1765055665&width=1100%201100w,//napoleonejoyas.co/cdn/shop/files/1_135efe58-a107-4a19-883e-e2e8788172b4.png?v=1765055665&width=1370%201370w,//napoleonejoyas.co/cdn/shop/files/1_135efe58-a107-4a19-883e-e2e8788172b4.png?v=1765055665&width=1500%201500w,//napoleonejoyas.co/cdn/shop/files/1_135efe58-a107-4a19-883e-e2e8788172b4.png?v=1765055665&width=1770%201770w,//napoleonejoyas.co/cdn/shop/files/1_135efe58-a107-4a19-883e-e2e8788172b4.png?v=1765055665&width=1780%201780w,//napoleonejoyas.co/cdn/shop/files/1_135efe58-a107-4a19-883e-e2e8788172b4.png?v=1765055665&width=1880%201880w,',
  'https://napoleonejoyas.co/cdn/shop/files/Banner_superheroe_USA_2560_x_800_2.jpg?v=1750955157&width=375%20375w,//napoleonejoyas.co/cdn/shop/files/Banner_superheroe_USA_2560_x_800_2.jpg?v=1750955157&width=740%20740w,//napoleonejoyas.co/cdn/shop/files/Banner_superheroe_USA_2560_x_800_2.jpg?v=1750955157&width=750%20750w,//napoleonejoyas.co/cdn/shop/files/Banner_superheroe_USA_2560_x_800_2.jpg?v=1750955157&width=1100%201100w,//napoleonejoyas.co/cdn/shop/files/Banner_superheroe_USA_2560_x_800_2.jpg?v=1750955157&width=1370%201370w,//napoleonejoyas.co/cdn/shop/files/Banner_superheroe_USA_2560_x_800_2.jpg?v=1750955157&width=1500%201500w,//napoleonejoyas.co/cdn/shop/files/Banner_superheroe_USA_2560_x_800_2.jpg?v=1750955157&width=1770%201770w,//napoleonejoyas.co/cdn/shop/files/Banner_superheroe_USA_2560_x_800_2.jpg?v=1750955157&width=1780%201780w,//napoleonejoyas.co/cdn/shop/files/Banner_superheroe_USA_2560_x_800_2.jpg?v=1750955157&width=1880%201880w,',
  'https://napoleonejoyas.co/cdn/shop/files/5_61ace280-5a05-47d0-bd11-26eee729e4ae.png?v=1765055755&width=375%20375w,//napoleonejoyas.co/cdn/shop/files/5_61ace280-5a05-47d0-bd11-26eee729e4ae.png?v=1765055755&width=740%20740w,//napoleonejoyas.co/cdn/shop/files/5_61ace280-5a05-47d0-bd11-26eee729e4ae.png?v=1765055755&width=750%20750w,//napoleonejoyas.co/cdn/shop/files/5_61ace280-5a05-47d0-bd11-26eee729e4ae.png?v=1765055755&width=1100%201100w,//napoleonejoyas.co/cdn/shop/files/5_61ace280-5a05-47d0-bd11-26eee729e4ae.png?v=1765055755&width=1370%201370w,//napoleonejoyas.co/cdn/shop/files/5_61ace280-5a05-47d0-bd11-26eee729e4ae.png?v=1765055755&width=1500%201500w,//napoleonejoyas.co/cdn/shop/files/5_61ace280-5a05-47d0-bd11-26eee729e4ae.png?v=1765055755&width=1770%201770w,//napoleonejoyas.co/cdn/shop/files/5_61ace280-5a05-47d0-bd11-26eee729e4ae.png?v=1765055755&width=1780%201780w,//napoleonejoyas.co/cdn/shop/files/5_61ace280-5a05-47d0-bd11-26eee729e4ae.png?v=1765055755&width=1880%201880w,',
  'https://napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=375%20375w,//napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=740%20740w,//napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=750%20750w,//napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=1100%201100w,//napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=1370%201370w,//napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=1500%201500w,//napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=1770%201770w,//napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=1780%201780w,//napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=1880%201880w,//napoleonejoyas.co/cdn/shop/files/9f843dfd-57ef-4c25-a576-80052596d766.jpg?v=1743951870&width=2000%202000w,',
  'https://napoleonejoyas.co/cdn/shop/files/3_c0d77a32-17d8-47b6-bb37-92dcf12d9954.png?v=1765055530&width=375%20375w,//napoleonejoyas.co/cdn/shop/files/3_c0d77a32-17d8-47b6-bb37-92dcf12d9954.png?v=1765055530&width=740%20740w,//napoleonejoyas.co/cdn/shop/files/3_c0d77a32-17d8-47b6-bb37-92dcf12d9954.png?v=1765055530&width=750%20750w,//napoleonejoyas.co/cdn/shop/files/3_c0d77a32-17d8-47b6-bb37-92dcf12d9954.png?v=1765055530&width=1100%201100w,//napoleonejoyas.co/cdn/shop/files/3_c0d77a32-17d8-47b6-bb37-92dcf12d9954.png?v=1765055530&width=1370%201370w,//napoleonejoyas.co/cdn/shop/files/3_c0d77a32-17d8-47b6-bb37-92dcf12d9954.png?v=1765055530&width=1500%201500w,//napoleonejoyas.co/cdn/shop/files/3_c0d77a32-17d8-47b6-bb37-92dcf12d9954.png?v=1765055530&width=1770%201770w,//napoleonejoyas.co/cdn/shop/files/3_c0d77a32-17d8-47b6-bb37-92dcf12d9954.png?v=1765055530&width=1780%201780w,//napoleonejoyas.co/cdn/shop/files/3_c0d77a32-17d8-47b6-bb37-92dcf12d9954.png?v=1765055530&width=1880%201880w,',
]

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [hover, setHover] = useState(false)
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    const update = () => {
      setCurrent(api.selectedScrollSnap())
      setCount(api.scrollSnapList().length)
    }

    update()
    api.on('select', update)
    api.on('reInit', update)
  }, [api])

  return (
    <div
      className="relative h-[55vh] w-full overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: 'center', // 🔥 clave para centrar visualmente
        }}
        plugins={[
          Autoplay({
            delay: 3500,
            stopOnInteraction: false,
          }),
        ]}
        className="w-screen"
      >
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="basis-full">
              <div className="relative flex h-full items-center justify-center">
                <img src={src} className="h-full w-auto object-contain object-center" />
              </div>

              {/* overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/40" />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* NAV */}
        <button
          onClick={() => api?.scrollPrev()}
          className={cn(
            'absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition',
            hover ? 'opacity-100' : 'opacity-0'
          )}
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() => api?.scrollNext()}
          className={cn(
            'absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition',
            hover ? 'opacity-100' : 'opacity-0'
          )}
        >
          <ChevronRight />
        </button>

        {/* INDICATOR DOTS */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {Array.from({ length: count }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={cn(
                'h-2 rounded-full transition-all',
                idx === current ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              )}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
