import { cms } from '@/lib/cms/client'
import type { Producto, JoyeriaOro } from '@/lib/cms/strapi.generated'
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
  Imagenes: { fields: ['url', 'alternativeText', 'width', 'height', 'formats'] },
  Categorias: { fields: ['Label', 'Slug'] },
  Oro: true,
  Medidas: true,
} as const

const ONLY_PUBLISHED = { publishedAt: { $notNull: true } }

// ─── Mappers

const ORO_COLOR: Record<string, ProductMetal['color']> = {
  amarillo: 'yellow',
  blanco: 'white',
  rosa: 'rose',
}

const VALID_KARATS = new Set<number>([10, 14, 18, 24])

function mapOro(oro: JoyeriaOro): ProductMetal {
  return {
    material: 'gold',
    color: ORO_COLOR[oro.Color ?? ''] ?? 'yellow',
    karat: (VALID_KARATS.has(oro.Kilates ?? 0) ? oro.Kilates! : 18) as ProductMetal['karat'],
    weightGrams: parseFloat(oro.PesoGramos ?? '') || undefined,
  }
}

function toDomain(entity: Producto): Product {
  // Required fields default to '' on null — Strapi guarantees these exist for published entries
  const titulo = entity.Titulo ?? ''
  const slug = entity.Slug ?? ''
  const descripcion = entity.Descripcion ?? ''
  const precio = parseInt(entity.Precio ?? '0', 10)
  const descuento = entity.Descuento != null ? parseFloat(entity.Descuento) : undefined
  const stock = entity.Stock ?? 0

  const images: ProductImage[] = (entity.Imagenes ?? []).map((img) => ({
    src: img.url,
    alt: img.alternativeText ?? titulo,
  }))

  return {
    id: entity.documentId,
    slug,
    title: titulo,
    description: descripcion,
    shortDescription: entity.DescripcionCorta ?? undefined,
    price: precio,
    discount: descuento,
    images: images.length > 0 ? images : [{ src: '', alt: titulo }],
    metal: entity.Oro ? mapOro(entity.Oro) : undefined,
    category: (entity.Categorias?.[0]?.Slug as ProductCategorySlug) ?? undefined,
    categoryLabel: entity.Categorias?.[0]?.Label ?? undefined,
    tags: Array.isArray(entity.Tags) ? (entity.Tags as string[]) : undefined,
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
