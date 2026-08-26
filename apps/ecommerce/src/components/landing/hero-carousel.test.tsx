import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { BannerSlide } from '@/lib/cms'

const autoplayPlugin = {
  name: 'autoplay',
  options: {},
  init: vi.fn(),
  destroy: vi.fn(),
}

const autoplayMock = vi.fn((_options?: unknown) => autoplayPlugin)

vi.mock('embla-carousel-autoplay', () => ({
  default: (options?: unknown) => autoplayMock(options),
}))

import HeroCarousel from '@/components/landing/hero-carousel'

const slides: BannerSlide[] = [
  {
    src: 'https://cdn.example/a.jpg',
    alt: 'Anillo oro',
    href: '/category/anillos',
    openInNewTab: false,
  },
  {
    src: 'https://cdn.example/b.jpg',
    alt: 'Cadena oro',
    href: null,
    openInNewTab: false,
  },
]

describe('HeroCarousel', () => {
  beforeEach(() => {
    autoplayMock.mockClear()
  })

  it('renders nothing when there are no slides', () => {
    const { container } = render(<HeroCarousel slides={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders slide images from CMS props', () => {
    render(<HeroCarousel slides={slides} />)
    expect(screen.getByRole('img', { name: 'Anillo oro' })).toHaveAttribute(
      'src',
      'https://cdn.example/a.jpg'
    )
    expect(screen.getByRole('img', { name: 'Cadena oro' })).toBeInTheDocument()
  })

  it('enables autoplay when there is more than one slide', () => {
    render(<HeroCarousel slides={slides} />)
    expect(autoplayMock).toHaveBeenCalled()
  })

  it('does not enable autoplay for a single slide', () => {
    render(<HeroCarousel slides={[slides[0]!]} />)
    expect(autoplayMock).not.toHaveBeenCalled()
  })

  it('hides prev/next and dots when there is only one slide', () => {
    render(<HeroCarousel slides={[slides[0]!]} />)
    expect(screen.queryByRole('button', { name: /previous slide/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /next slide/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /ir al banner/i })).not.toBeInTheDocument()
  })

  it('overlays prev/next and dots that stay hidden until hover on fine pointers', async () => {
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: query.includes('(hover: hover)'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    })

    try {
      const user = userEvent.setup()
      render(<HeroCarousel slides={slides} />)

      const region = screen.getByRole('region', { name: /banner promocional/i })
      const controls = region.querySelector('[data-hero-carousel-controls]')
      expect(controls).toBeTruthy()

      await waitFor(() => {
        expect(controls).toHaveAttribute('data-visible', 'false')
      })

      await user.hover(region)
      expect(controls).toHaveAttribute('data-visible', 'true')

      await user.unhover(region)
      expect(controls).toHaveAttribute('data-visible', 'false')
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      })
    }
  })

  it('exposes accessible prev/next controls over the image', () => {
    render(<HeroCarousel slides={slides} />)
    expect(screen.getByRole('button', { name: /previous slide/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next slide/i })).toBeInTheDocument()
  })
})
