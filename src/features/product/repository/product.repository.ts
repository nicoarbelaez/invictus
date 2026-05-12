import type { Product, ProductCategorySlug } from '@/features/product/domain'

/**
 * Contrato del repositorio de productos.
 *
 * Todas las implementaciones trabajan con datos estáticos compilados en build-time.
 * El carrito y la wishlist son estado del usuario (client-side, Zustand) y
 * NO pertenecen a este repositorio.
 */
export interface ProductRepository {
  /** Todos los productos del catálogo. */
  getProducts(): Promise<Product[]>

  /** Un producto por su slug. Null si no existe. */
  getProductBySlug(slug: string): Promise<Product | null>

  /** Productos que pertenecen a una categoría. */
  getProductsByCategory(category: ProductCategorySlug): Promise<Product[]>

  /**
   * Categorías que tienen al menos un producto.
   * Retorna solo slugs; la conversión a labels/hrefs es responsabilidad del caller.
   */
  getCategories(): Promise<ProductCategorySlug[]>

  /**
   * Productos cuyos IDs están en la lista proporcionada.
   * Útil para pre-renderizar productos relacionados o cualquier subconjunto
   * conocido en build-time.
   */
  getProductsByIds(ids: string[]): Promise<Product[]>

  /** Búsqueda por texto en título. */
  searchProducts(query: string): Promise<Product[]>
}
