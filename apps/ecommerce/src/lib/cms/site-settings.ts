import { cms } from '@/lib/cms/client'
import { isStrapiError } from '@/lib/cms/errors'
import { oncePerBuild } from '@/lib/cms/once-per-build'
import type { Global } from '@/lib/cms/strapi.generated'

export type BannerSlide = {
  src: string
  /** From Media Library `alternativeText` (empty = decorative). */
  alt: string
  href: string | null
  openInNewTab: boolean
}

export type SiteSettings = {
  /** TituloCorto — brand / og:site_name / schema name */
  siteName: string
  /** TituloLargo — default document title & og:image:alt */
  titleLong: string
  /** Metadatos.Descripcion — default meta description */
  description: string
  /** Marca.Imagotipo URL */
  logoUrl: string
  /** Marca.Isotipo URL (optional) */
  isotipoUrl: string | null
  /** Global.CarruselBanner slides with a resolvable image URL */
  bannerSlides: BannerSlide[]
}

const FALLBACK: SiteSettings = {
  siteName: 'Invictus Joyas',
  titleLong: 'Invictus Joyas | Joyería en Oro 18K en Cali, Colombia',
  description:
    'Joyería en Oro 18K en Cali, Colombia. Cadenas, dijes, aretes, rosarios y joyas personalizadas con garantía de por vida y envíos nacionales.',
  logoUrl: 'https://res.cloudinary.com/dv8ipi5yp/image/upload/f_auto,q_auto/logo_xiedet.png',
  isotipoUrl: null,
  bannerSlides: [],
}

const GLOBAL_POPULATE = {
  Metadatos: true,
  Marca: {
    populate: {
      Imagotipo: { fields: ['url', 'alternativeText', 'width', 'height'] },
      Isotipo: { fields: ['url', 'alternativeText', 'width', 'height'] },
    },
  },
  CarruselBanner: {
    populate: {
      Imagen: { fields: ['url', 'alternativeText', 'width', 'height'] },
      Enlace: true,
    },
  },
} as const

function mapBannerSlides(entity: Global): BannerSlide[] {
  const slides = entity.CarruselBanner ?? []
  return slides.flatMap((slide) => {
    const src = slide.Imagen?.url?.trim()
    if (!src) return []
    return [
      {
        src,
        alt: slide.Imagen.alternativeText?.trim() || '',
        href: slide.Enlace?.Url?.trim() || null,
        openInNewTab: slide.Enlace?.AbrirEnNuevaPestana ?? false,
      },
    ]
  })
}

function mapGlobal(entity: Global): SiteSettings {
  const meta = entity.Metadatos
  const marca = entity.Marca

  return {
    siteName: meta?.TituloCorto?.trim() || FALLBACK.siteName,
    titleLong: meta?.TituloLargo?.trim() || FALLBACK.titleLong,
    description: meta?.Descripcion?.trim() || FALLBACK.description,
    logoUrl: marca?.Imagotipo?.url || FALLBACK.logoUrl,
    isotipoUrl: marca?.Isotipo?.url ?? null,
    bannerSlides: mapBannerSlides(entity),
  }
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const entity = await cms.global.find({ populate: GLOBAL_POPULATE })
    return mapGlobal(entity)
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(
        '[cms] getSiteSettings:',
        isStrapiError(err) ? err.message : err instanceof Error ? err.message : err
      )
      return FALLBACK
    }
    throw err
  }
}

/** Branding + SEO + banner from Global. Build-time only; see `oncePerBuild`. */
export function getSiteSettings(): Promise<SiteSettings> {
  return oncePerBuild('site-settings', fetchSiteSettings)
}
