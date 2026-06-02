import { getCollection } from 'astro:content'
import type { Product, ProductCategorySlug } from '@/features/product/domain'
import type { ProductRepository } from '@/features/product/repository'

async function loadProducts(): Promise<Product[]> {
  const entries = await getCollection('products')
  return entries.map((e) => e.data as Product)
}

export class StaticProductRepository implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    return loadProducts()
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await loadProducts()
    return products.find((p) => p.slug === slug) ?? null
  }

  async getProductsByCategory(category: ProductCategorySlug): Promise<Product[]> {
    const products = await loadProducts()
    return products.filter((p) => p.category === category)
  }

  async getCategories(): Promise<ProductCategorySlug[]> {
    const products = await loadProducts()
    const seen = new Set<ProductCategorySlug>()
    for (const p of products) {
      if (p.category) seen.add(p.category)
    }
    return [...seen]
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return []
    const products = await loadProducts()
    const idSet = new Set(ids)
    return products.filter((p) => idSet.has(p.id))
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = await loadProducts()
    const q = query.toLowerCase()
    return products.filter((p) => p.title.toLowerCase().includes(q))
  }
}

export const productRepository = new StaticProductRepository()
