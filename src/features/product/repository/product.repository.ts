import type { Product, ProductCategorySlug } from '@/features/product/domain'

export interface ProductRepository {
  getProducts(): Promise<Product[]>
  getProductBySlug(slug: string): Promise<Product | null>
  searchProducts(query: string): Promise<Product[]>
  getProductsByCategory(category: ProductCategorySlug): Promise<Product[]>
}
