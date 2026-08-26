export { StrapiError, StrapiConnectionError, isStrapiError, isStrapiErrorOf } from './client'
export { getSiteSettings } from './site-settings'
export type { SiteSettings, BannerSlide } from './site-settings'
export { oncePerBuild } from './once-per-build'
export type {
  StrapiImageFormat,
  StrapiMedia,
  JoyeriaOro,
  JoyeriaMedidas,
  ComponentesEnlace,
  ComponentesMarca,
  ComponentesMetadatos,
  ComponentesCarruselDeBanner,
  StrapiPagination,
  StrapiListResponse,
  StrapiSingleResponse,
  Categoria,
  Global,
  Producto,
} from './strapi.generated'
