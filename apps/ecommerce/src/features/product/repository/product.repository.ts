import type { Product, ProductCategorySlug, ProductCategoryInfo } from '@/features/product/domain'

export interface ProductRepository {
  getProducts(): Promise<Product[]>
  getProductBySlug(slug: string): Promise<Product | null>
  getProductsByCategory(category: ProductCategorySlug): Promise<Product[]>
  getCategories(): Promise<ProductCategoryInfo[]>
  getProductsByIds(ids: string[]): Promise<Product[]>
  searchProducts(query: string): Promise<Product[]>
}
