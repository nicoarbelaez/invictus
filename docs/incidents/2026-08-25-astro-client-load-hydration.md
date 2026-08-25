# Incidente: Hidratación excesiva con `client:load`

| Campo | Valor |
|-------|--------|
| **ID** | `2026-08-25-astro-client-load-hydration` |
| **Estado** | `fixed` |
| **Área** | `ecommerce` |
| **Severidad** | `high` |
| **Abierto** | 2026-08-25 |
| **Cerrado** | 2026-08-25 |

## Problema

Casi todas las islas React del storefront usaban `client:load` (NavBar, Toaster, HeroCarousel, ProductList, ProductPageView, WishlistView). Eso fuerza JS temprano en páginas de catálogo que deberían ser HTML-first, empeorando LCP/TBT y anulando la ventaja de Astro.

## Propuesta

1. Nav / Toaster → `client:idle` (con timeout corto si hace falta).
2. Listas / hero → `client:visible` + `rootMargin`.
3. PDP / wishlist → `client:idle`.
4. Cart / checkout → mantener `client:load`.
5. Documentar la regla en `AGENTS.md`.

## Cómo se arregló

- Directivas actualizadas en `BaseLayout.astro`, `Hero.astro`, `index.astro`, `category/[category].astro`, `products/[slug].astro`, `wishlist.astro`, `404.astro`.
- Prefetch hover + `image.remotePatterns` en `astro.config.mjs`.
- Regla permanente en `AGENTS.md` → sección **Rendimiento**.

### Verificar

Abrir home/categoría en DevTools → Network / Performance: hidratación de listas no debe bloquear el load inicial.
