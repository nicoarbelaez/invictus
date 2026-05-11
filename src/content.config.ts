import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

import { ProductSchema } from '@/features/product/domain'

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '**/*.json' }),
  schema: ProductSchema,
})

export const collections = { products }
