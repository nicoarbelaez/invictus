import { z } from 'zod'
import { ReactNode } from 'react'

export const ProductCategory = {
  EARRINGS: 'earrings',
  RINGS: 'rings',
  NECKLACES: 'necklaces',
  BRACELETS: 'bracelets',
  CHAINS: 'chains',
  CHARMS: 'charms',
  ANKLETS: 'anklets',
  PENDANTS: 'pendants',
} as const

export type ProductCategorySlug = (typeof ProductCategory)[keyof typeof ProductCategory]

export const ProductCategorySchema = z.enum(
  Object.values(ProductCategory) as [ProductCategorySlug, ...ProductCategorySlug[]]
)

const CATEGORY_LABELS: Record<ProductCategorySlug, string> = {
  earrings: 'Aretes',
  rings: 'Anillos',
  necklaces: 'Collares',
  bracelets: 'Pulseras',
  chains: 'Cadenas',
  charms: 'Dijes',
  anklets: 'Tobilleras',
  pendants: 'Colgantes',
}

export function getCategoryLabel(category: ProductCategorySlug): string {
  return CATEGORY_LABELS[category]
}

const discountSchema = z
  .number()
  .min(0)
  .max(1)
  .refine(
    (v) => {
      const decimals = v.toString().split('.')[1]
      return !decimals || decimals.length <= 3
    },
    { message: 'El descuento admite hasta 3 decimales (ej: 0.25, 0.125, 0.333)' }
  )

export const ProductImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
})

export const ProductMetalSchema = z.object({
  material: z.literal('gold'),
  color: z.enum(['yellow', 'white', 'rose']),
  karat: z.union([z.literal(10), z.literal(14), z.literal(18), z.literal(24)]),
  weightGrams: z.number().positive().optional(),
})

export const ProductGemstoneSchema = z.object({
  name: z.string(),
  type: z.enum(['natural', 'synthetic', 'lab-grown']).optional(),
  cut: z.string().optional(),
  color: z.string().optional(),
  carat: z.number().positive().optional(),
  count: z.number().int().positive().optional(),
})

// Medida física de la pieza. Discriminated union según tipo de joya:
//   length    → cadenas, pulseras, collares (valor en cm/mm)
//   diameter  → aretes de aro, medallones (Ø en mm)
//   ring-size → anillos (talla por sistema)
//   dimensions → dijes, colgantes (ancho × alto en mm)
// Joyas sin medida relevante (topos, maniñas) omiten este campo.
export const ProductMeasurementSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('length'),
    value: z.number().positive(),
    unit: z.enum(['cm', 'mm', 'in']),
  }),
  z.object({
    type: z.literal('diameter'),
    value: z.number().positive(),
    unit: z.literal('mm'),
  }),
  z.object({
    type: z.literal('ring-size'),
    value: z.number().positive(),
    system: z.enum(['CO', 'US', 'EU']).optional(),
  }),
  z.object({
    type: z.literal('dimensions'),
    width: z.number().positive(),
    height: z.number().positive(),
    unit: z.enum(['mm', 'cm']),
  }),
])

export const ProductCommercialDataSchema = z.object({
  sku: z.string().optional(),
  badgeText: z.string().optional(),
  stockText: z.string().optional(),
  deliveryText: z.string().optional(),
  upgradeText: z.string().optional(),
  inStock: z.boolean().optional(),
  soldOut: z.boolean().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  madeToOrder: z.boolean().optional(),
  leadTimeDays: z.number().int().positive().optional(),
})

export const ProductTrustDataSchema = z.object({
  certificate: z.string().optional(),
  warrantyMonths: z.number().int().positive().optional(),
  returnDays: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  newArrival: z.boolean().optional(),
})

export const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string().optional(),
  price: z.number().int().positive().optional(),
  discount: discountSchema.optional(),
  images: z.array(ProductImageSchema).optional(),
  active: z.boolean().optional(),
})

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),

  title: z.string(),
  description: z.string(),
  shortDescription: z.string().optional(),

  href: z.string().optional(),
  images: z.array(ProductImageSchema).min(1),

  // Price = precio original (antes del descuento).
  // Precio final = Math.round(price * (1 - discount)).
  price: z.number().int().positive(),
  discount: discountSchema.optional(),

  metal: ProductMetalSchema.optional(),
  gemstone: ProductGemstoneSchema.optional(),
  measurement: ProductMeasurementSchema.optional(),
  commercial: ProductCommercialDataSchema.optional(),
  trust: ProductTrustDataSchema.optional(),
  variants: z.array(ProductVariantSchema).optional(),

  category: ProductCategorySchema.optional(),
  collection: z.string().optional(),
  tags: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  relatedProductIds: z.array(z.string()).optional(),
})

export type ProductImage = z.infer<typeof ProductImageSchema>
export type ProductMetal = z.infer<typeof ProductMetalSchema>
export type ProductGemstone = z.infer<typeof ProductGemstoneSchema>
export type ProductCommercialData = z.infer<typeof ProductCommercialDataSchema>
export type ProductTrustData = z.infer<typeof ProductTrustDataSchema>
export type ProductMeasurement = z.infer<typeof ProductMeasurementSchema>
export type ProductVariant = z.infer<typeof ProductVariantSchema>
export type Product = z.infer<typeof ProductSchema>

export type AccordionSection = {
  value: string
  label: string
  content: ReactNode
}

export interface ProductCardState {
  liked?: boolean
}

export interface ProductCardCallbacks {
  onLike?: () => void
  onShare?: () => void
  onAddToCart?: (quantity: number) => void
  onBuyNow?: () => void
}

export interface ProductCardStyleProps {
  className?: string
  footerClassName?: string
}

export interface ProductCardProps
  extends ProductCardState, ProductCardCallbacks, ProductCardStyleProps {
  product: Product
  shareUrl?: string
  sections?: AccordionSection[]
}
