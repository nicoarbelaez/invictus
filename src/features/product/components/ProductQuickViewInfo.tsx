import * as React from 'react'
import { Truck, Tag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { QuantitySelector } from '@/components/share/QuantitySelector'
import { formatCurrency } from '@/utils/formatters/currency'

import { useProductCard } from '@/features/product/context'
import {
  ProductCartButton,
  ProductCardPrice,
  ProductLikeButton,
  ProductShareButton,
} from '@/features/product/components'
import type { AccordionSection, Product, ProductMeasurement } from '@/features/product/domain'

const METAL_COLOR_LABEL: Record<string, string> = {
  yellow: 'amarillo',
  white: 'blanco',
  rose: 'rosado',
}

const GEMSTONE_TYPE_LABEL: Record<string, string> = {
  natural: 'natural',
  synthetic: 'sintética',
  'lab-grown': 'lab-grown',
}

function formatMeasurement(m: ProductMeasurement): string {
  switch (m.type) {
    case 'length':
      return `${m.value} ${m.unit}`
    case 'diameter':
      return `Ø ${m.value} mm`
    case 'ring-size':
      return `Talla ${m.value}${m.system ? ` (${m.system})` : ''}`
    case 'dimensions':
      return `${m.width} × ${m.height} ${m.unit}`
  }
}

function buildProductSections(product: Product): AccordionSection[] {
  const sections: AccordionSection[] = [
    { value: 'description', label: 'Descripción', content: product.description },
  ]

  if (product.metal) {
    const { color, karat, weightGrams } = product.metal
    const label = `Oro ${METAL_COLOR_LABEL[color]} ${karat}K${weightGrams ? ` · ${weightGrams}g` : ''}`
    sections.push({ value: 'material', label: 'Material', content: label })
  }

  if (product.gemstone) {
    const { name, type, cut, color, carat, count } = product.gemstone
    const parts = [name]
    if (type) parts.push(GEMSTONE_TYPE_LABEL[type] ?? type)
    if (cut) parts.push(cut)
    if (color) parts.push(color)
    if (carat) parts.push(`${carat}ct`)
    if (count && count > 1) parts.push(`×${count}`)
    sections.push({ value: 'gemstone', label: 'Piedra', content: parts.join(' · ') })
  }

  if (product.trust) {
    const { warrantyMonths, returnDays, certificate } = product.trust
    const parts: string[] = []
    if (warrantyMonths) parts.push(`Garantía ${warrantyMonths} meses`)
    if (returnDays) parts.push(`Devolución ${returnDays} días`)
    if (certificate) parts.push(certificate)
    if (parts.length > 0) {
      sections.push({ value: 'guarantee', label: 'Garantías', content: parts.join(' · ') })
    }
  }

  sections.push({
    value: 'shipping',
    label: 'Envío',
    content: 'Envío nacional gratuito en 3–5 días hábiles con guante blanco.',
  })

  return sections
}

function ProductSpecs({ product }: { product: Product }) {
  const specs: { label: string; value: string }[] = []

  if (product.metal) {
    specs.push({
      label: 'Metal',
      value: `Oro ${METAL_COLOR_LABEL[product.metal.color]} ${product.metal.karat}K`,
    })
  }

  if (product.metal?.weightGrams) {
    specs.push({ label: 'Peso', value: `${product.metal.weightGrams}g` })
  }

  if (product.measurement) {
    specs.push({ label: 'Medida', value: formatMeasurement(product.measurement) })
  }

  if (specs.length === 0) return null

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {specs.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs tracking-wide uppercase">{label}</span>
          <span className="text-sm font-medium">{value}</span>
        </div>
      ))}
    </div>
  )
}

function StockBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="size-2.5 shrink-0 rounded-full bg-green-500" />
      <p className="flex-1 text-sm leading-normal">{text}</p>
    </div>
  )
}

function DeliveryItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <li className="flex items-center gap-2.5">
      <Icon className="text-muted-foreground size-4 shrink-0" />
      <p className="flex-1 text-sm leading-normal">{text}</p>
    </li>
  )
}

export function ProductQuickViewInfo() {
  const { product, sections, onAddToCart, onBuyNow } = useProductCard()

  const [quantity, setQuantity] = React.useState(1)
  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount))
    : product.price
  const total = formatCurrency(finalPrice * quantity)

  const stockText = product.commercial?.stockText ?? 'Disponible para envío inmediato'
  const deliveryText = product.commercial?.deliveryText ?? 'Entrega con guante blanco incluida'
  const upgradeText = product.commercial?.upgradeText ?? 'Garantía de autenticidad incluida'

  const resolvedSections = sections.length > 0 ? sections : buildProductSections(product)

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-light tracking-tight">{product.title}</h2>
          <ProductCardPrice />
        </div>
        <ProductLikeButton />
      </div>

      <Separator />

      <ProductSpecs product={product} />

      <div className="space-y-2">
        <StockBadge text={stockText} />
        <ul className="space-y-2">
          <DeliveryItem icon={Truck} text={deliveryText} />
          <DeliveryItem icon={Tag} text={upgradeText} />
        </ul>
      </div>

      <div className="space-y-3">
        {!product.commercial?.soldOut ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="shrink-0">
                <QuantitySelector value={quantity} onChange={setQuantity} />
              </div>

              <div className="flex min-w-0 flex-1 gap-2">
                <ProductCartButton
                  soldOutContent="Agotado"
                  className="min-w-0 flex-1"
                  size="lg"
                  onClick={() => onAddToCart?.(quantity)}
                >
                  <span className="truncate">Agregar al carrito</span>
                </ProductCartButton>

                <div className="flex shrink-0 items-center rounded-md border px-4 text-sm font-semibold whitespace-nowrap">
                  {total}
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" size="lg" onClick={onBuyNow}>
              Comprar ahora
            </Button>
          </>
        ) : (
          <ProductCartButton soldOutContent="Agotado" className="min-w-0 flex-1" size="lg">
            <span className="truncate">Agotado</span>
          </ProductCartButton>
        )}
      </div>

      <Accordion type="single" collapsible className="border-y">
        {resolvedSections.map((section) => (
          <AccordionItem key={section.value} value={section.value}>
            <AccordionTrigger className="text-sm font-normal uppercase">
              {section.label}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {section.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="space-y-2">
        <ProductShareButton />
      </div>
    </div>
  )
}
