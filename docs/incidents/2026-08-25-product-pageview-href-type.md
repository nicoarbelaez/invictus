# Incidente: Typecheck — `href` inexistente en Product

| Campo | Valor |
|-------|--------|
| **ID** | `2026-08-25-product-pageview-href-type` |
| **Estado** | `fixed` |
| **Área** | `ecommerce` |
| **Severidad** | `low` |
| **Abierto** | 2026-08-25 |
| **Cerrado** | 2026-08-25 |

## Problema

`pnpm --filter ecommerce typecheck` falla:

```text
src/features/product/components/ProductPageView.tsx(21,78):
error TS2339: Property 'href' does not exist on type '{ id: string; slug: string; ... }'
```

El dominio `Product` no declara `href`; el componente lo lee igual.

## Propuesta

1. Revisar `ProductPageView.tsx` línea ~21: usar `slug` → `/products/${slug}` (o el campo real del dominio).
2. Si hace falta un `href` derivado, calcularlo en el mapper/repository, no asumir el campo en el schema.
3. No ampliar el schema Zod solo para callar el error si el dato no viene del CMS.

## Cómo se arregló

- `shareUrl` usa `window.location.href` en cliente y `/products/${product.slug}` en SSR.

### Verificar

`pnpm --filter ecommerce typecheck` pasa sin error de `href`.
