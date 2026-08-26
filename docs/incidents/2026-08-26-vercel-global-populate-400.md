# Incidente: Vercel build 400 en Global populate

| Campo | Valor |
|-------|--------|
| **ID** | `2026-08-26-vercel-global-populate-400` |
| **Estado** | `fixed` |
| **Área** | `ecommerce` |
| **Severidad** | `high` |
| **Abierto** | 2026-08-26 |
| **Cerrado** | 2026-08-26 |

## Problema

`astro build` en Vercel fallaba al prerenderizar `/404` (y cualquier página con `BaseLayout`):

`StrapiError: Strapi responded with 400` en `cms.global.find({ populate: Metadatos/Marca/CarruselBanner })`.

Causa probable: el CMS de producción aún no tiene el schema nuevo (componentes `metadatos` / `marca` / `enlace` / carrusel actualizado), así que Strapi rechaza keys de `populate` → 400. El storefront **lanzaba** ese error en prod y tumba todo el deploy SSG.

## Propuesta

1. No tumbar el build SSG por fallo de Global: loguear detalle y usar `FALLBACK` de branding/SEO/banner.
2. Incluir el `error.message` de Strapi en `StrapiError` para ver “Invalid key …” en logs de Vercel.
3. Ops: redeploy del CMS con el schema nuevo + permisos Public/Token `global.find` + publicar Global.

## Cómo se arregló

- `site-settings.ts`: catch → `console.error` + `FALLBACK` (DEV y PROD).
- `client.ts`: mensaje de error incluye el body de Strapi.
- Verificar: redeploy Vercel debe completar; si Global sigue en 400, el sitio sale con FALLBACK hasta sincronizar CMS.
