'use client'

import * as React from 'react'

import { ProductCard } from '@/features/product/components/ProductCard'
import type { Product, ProductImage } from '@/features/product/domain/product.schema'
import { ProductCategory } from '@/features/product/domain/product.schema'

const IMG_TOPOS_1: ProductImage = {
  src: 'https://napoleonejoyas.co/cdn/shop/files/photo_5050987308420631810_y_d7557d75-56f6-4464-86c2-f82ddede9cbc.jpg?v=1778347460',
  alt: 'Topos Trébol Oro Amarillo 18K — vista frontal',
}

const IMG_TOPOS_2: ProductImage = {
  src: 'https://napoleonejoyas.co/cdn/shop/files/5008277844387803134_fe6b0382-8119-4673-b509-1f466a164bad.jpg?v=1757075735',
  alt: 'Topos Trébol Oro Amarillo 18K — detalle',
}

const IMG_CADENA_1: ProductImage = {
  src: 'https://napoleonejoyas.co/cdn/shop/files/5008277844387803134_fe6b0382-8119-4673-b509-1f466a164bad.jpg?v=1757075735',
  alt: 'Cadena China Oro Amarillo 18K — vista completa',
}

const IMG_CADENA_2: ProductImage = {
  src: 'https://napoleonejoyas.co/cdn/shop/files/photo_5050987308420631810_y_d7557d75-56f6-4464-86c2-f82ddede9cbc.jpg?v=1778347460',
  alt: 'Cadena China Oro Amarillo 18K — detalle',
}

const products: Product[] = [
  {
    id: '1',
    slug: 'topos-trebol-oro-amarillo-18k',
    title: 'Topos Trébol Oro Amarillo 18K',
    description:
      'Sutiles y delicados, perfectos para el día a día. Acabado brillante con diseño de trébol y zirconias engastadas.',
    shortDescription: 'Aretes de oro 18K con diseño de trébol y zirconias.',
    href: '/products/topos-trebol-oro-amarillo-18k',
    images: [IMG_TOPOS_1, IMG_TOPOS_2],
    price: 85_000,
    discount: 0.1755,
    metal: { material: 'gold', color: 'yellow', karat: 18, weightGrams: 1.2 },
    gemstone: { name: 'Zirconia', type: 'synthetic', cut: 'princess', color: 'blanco', count: 3 },
    commercial: {
      sku: 'TOP-TRE-AMA-18K-001',
      badgeText: 'Nuevo',
      stockText: 'Preorder hoy — 28 disponibles',
      deliveryText: 'Entrega con guante blanco incluida',
      upgradeText: 'Ajuste de talla gratis',
      inStock: true,
      stockQuantity: 28,
    },
    trust: {
      warrantyMonths: 12,
      returnDays: 30,
      certificate: 'Certificado de autenticidad incluido',
      newArrival: true,
    },
    category: ProductCategory.EARRINGS,
    collection: 'trébol',
    tags: ['oro', 'aretes', '18k', 'trébol', 'zirconia'],
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: '2',
    slug: 'cadena-china-oro-amarillo-18k',
    title: 'Cadena China Oro Amarillo 18K',
    description:
      'Elegante y moderna para eventos especiales. Eslabones trabajados a mano con acabado espejo.',
    href: '/products/cadena-china-oro-amarillo-18k',
    images: [IMG_CADENA_1, IMG_CADENA_2],
    price: 7648000,
    metal: { material: 'gold', color: 'yellow', karat: 18, weightGrams: 14.5 },
    measurement: { type: 'length', value: 45, unit: 'cm' },
    category: ProductCategory.CHAINS,
    commercial: { soldOut: true },
  },
]

export function ProductList() {
  const [likedProducts, setLikedProducts] = React.useState<Record<string, boolean>>({})

  const handleLike = React.useCallback((productId: string) => {
    setLikedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }))
  }, [])

  return (
    <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          liked={likedProducts[product.id] ?? false}
          onLike={() => handleLike(product.id)}
          onAddToCart={(quantity) => console.log(`Add ${quantity} × ${product.title}`)}
          onShare={() => console.log(`Share ${product.title}`)}
        />
      ))}
    </div>
  )
}
