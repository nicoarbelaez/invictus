import { cms } from '@/lib/cms/client'
import type { Producto, JoyeriaMetal } from '@/lib/cms/strapi.generated'
import type {
  Product,
  ProductCategorySlug,
  ProductCategoryInfo,
  ProductImage,
  ProductMetal,
} from '@/features/product/domain'
import type { ProductRepository } from '@/features/product/repository'

// ─── Populate config

const PRODUCT_POPULATE = {
  Portada: {
    populate: {
      MediaPrincipal: { fields: ['url', 'alternativeText', 'width', 'height', 'formats', 'mime'] },
      MediaHover: { fields: ['url', 'alternativeText', 'width', 'height', 'formats', 'mime'] },
    },
  },
  Galeria: {
    populate: {
      Imagen: { fields: ['url', 'alternativeText', 'width', 'height', 'formats', 'mime'] },
    },
  },
  Categorias: { fields: ['Label', 'Slug'] },
  Metales: true,
  Gemas: true,
  Dimensiones: true,
  Variantes: true,
} as const

const ONLY_PUBLISHED = { publishedAt: { $notNull: true } }

// ─── Helpers

/** Determines if a Strapi media MIME type is a video */
function isVideo(mime: string | null | undefined): boolean {
  return mime?.startsWith('video/') ?? false
}

// ─── Mappers

const ORO_COLOR: Record<string, ProductMetal['color']> = {
  amarillo: 'yellow',
  blanco: 'white',
  rosa: 'rose',
  dos_oros_amarillo_blanco: 'yellow',
  tricolor: 'yellow',
}

const VALID_KARATS = new Set<number>([10, 14, 18, 24])

function mapMetal(metal: JoyeriaMetal): ProductMetal {
  const isGold = metal.Material === 'oro' || metal.Material === 'oro_laminado'
  const karatNum = metal.PurezaLey ? parseInt(metal.PurezaLey.split('k')[0], 10) : 18
  return {
    material: isGold ? 'gold' : 'gold',
    color: ORO_COLOR[metal.Color ?? ''] ?? 'yellow',
    karat: (VALID_KARATS.has(karatNum) ? karatNum : 18) as ProductMetal['karat'],
    weightGrams: metal.PesoGramos ? parseFloat(metal.PesoGramos) : undefined,
  }
}

// Shape of the populated Portada component from the API
interface PopulatedPortada {
  MediaPrincipal?: { url?: string; alternativeText?: string | null; mime?: string } | null
  MediaHover?: { url?: string; alternativeText?: string | null; mime?: string } | null
}

function toDomain(entity: Producto): Product {
  // Required fields default to '' on null — Strapi guarantees these exist for published entries
  const titulo = entity.Titulo ?? ''
  const slug = entity.Slug ?? ''
  const descripcion = entity.Descripcion ?? ''
  const precio = parseInt(entity.Precio ?? '0', 10)
  const descuento = entity.Descuento != null ? parseFloat(entity.Descuento) : undefined
  const stock = entity.Stock ?? 0

  const images: ProductImage[] = []

  // Portada is now joyeria.portada-producto — a component with MediaPrincipal + optional MediaHover
  // Both slots accept images and videos (mime check to tell them apart in the storefront)
  const portada = entity.Portada as unknown as PopulatedPortada | null

  if (portada?.MediaPrincipal?.url) {
    images.push({
      src: portada.MediaPrincipal.url,
      alt: portada.MediaPrincipal.alternativeText ?? titulo,
      isVideo: isVideo(portada.MediaPrincipal.mime),
      hover: portada.MediaHover?.url ?? undefined,
      hoverIsVideo: portada.MediaHover ? isVideo(portada.MediaHover.mime) : undefined,
    } as ProductImage & { isVideo?: boolean; hover?: string; hoverIsVideo?: boolean })
  }

  if (Array.isArray(entity.Galeria)) {
    for (const item of entity.Galeria) {
      if (item.Imagen?.url && item.Imagen.url !== portada?.MediaPrincipal?.url) {
        images.push({
          src: item.Imagen.url,
          alt: item.Imagen.alternativeText ?? titulo,
          isVideo: isVideo((item.Imagen as { mime?: string }).mime),
        } as ProductImage & { isVideo?: boolean })
      }
    }
  }

  const primaryMetal =
    Array.isArray(entity.Metales) && entity.Metales.length > 0 ? entity.Metales[0] : undefined

  const categorias = Array.isArray(entity.Categorias) ? entity.Categorias : []

  return {
    id: entity.documentId,
    slug,
    title: titulo,
    description: descripcion,
    shortDescription: entity.DescripcionCorta ?? undefined,
    price: precio,
    discount: descuento,
    images: images.length > 0 ? images : [{ src: '', alt: titulo }],
    metal: primaryMetal ? mapMetal(primaryMetal) : undefined,
    category: (categorias[0]?.Slug as ProductCategorySlug) ?? undefined,
    categoryLabel: categorias[0]?.Label ?? undefined,
    tags: undefined,
    commercial: {
      stockQuantity: stock,
      inStock: stock > 0,
      soldOut: stock === 0,
    },
  }
}

// ─── Repository

/** In local dev without CMS_TOKEN, fail soft so the UI still boots. */
async function safeCms<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run()
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[cms]', err instanceof Error ? err.message : err)
      return fallback
    }
    throw err
  }
}

export class CmsProductRepository implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    return safeCms(async () => {
      const items = await cms.productos.find({
        populate: PRODUCT_POPULATE,
        filters: ONLY_PUBLISHED,
        sort: 'Titulo:asc',
        pagination: { pageSize: 100 },
      })
      return items.map(toDomain)
    }, [])
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return safeCms(async () => {
      const items = await cms.productos.find({
        populate: PRODUCT_POPULATE,
        filters: { Slug: { $eq: slug }, ...ONLY_PUBLISHED },
        pagination: { pageSize: 1 },
      })
      const entity = items[0]
      return entity ? toDomain(entity) : null
    }, null)
  }

  async getProductsByCategory(category: ProductCategorySlug): Promise<Product[]> {
    return safeCms(async () => {
      const items = await cms.productos.find({
        populate: PRODUCT_POPULATE,
        filters: { Categorias: { Slug: { $eq: category } }, ...ONLY_PUBLISHED },
        sort: 'Titulo:asc',
        pagination: { pageSize: 100 },
      })
      return items.map(toDomain)
    }, [])
  }

  async getCategories(): Promise<ProductCategoryInfo[]> {
    return safeCms(async () => {
      const items = await cms.categorias.find({ fields: ['Slug', 'Label'] })
      return items.map((c) => ({ slug: c.Slug ?? '', label: c.Label ?? '' }))
    }, [])
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return []
    return safeCms(async () => {
      const items = await cms.productos.find({
        populate: PRODUCT_POPULATE,
        filters: { documentId: { $in: ids }, ...ONLY_PUBLISHED },
        pagination: { pageSize: ids.length },
      })
      return items.map(toDomain)
    }, [])
  }

  async searchProducts(query: string): Promise<Product[]> {
    return safeCms(async () => {
      const items = await cms.productos.find({
        populate: PRODUCT_POPULATE,
        filters: {
          $or: [
            { Titulo: { $containsi: query } },
            { Descripcion: { $containsi: query } },
            { DescripcionCorta: { $containsi: query } },
          ],
          ...ONLY_PUBLISHED,
        },
        pagination: { pageSize: 100 },
      })
      return items.map(toDomain)
    }, [])
  }
}

export const productRepository = new CmsProductRepository()
