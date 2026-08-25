# Incidentes

Registro de problemas del monorepo Invictus (rendimiento, CMS, build, arquitectura).

## Uso rápido

1. Copia [`_TEMPLATE.md`](./_TEMPLATE.md) → `YYYY-MM-DD-slug-corto.md`.
2. Completa **Problema** + **Propuesta**.
3. Al cerrar: mismo archivo → `fixed` + sección **Cómo se arregló**.

Las reglas para agentes están en el root [`AGENTS.md`](../../AGENTS.md) (sección **Incidentes**).

## Índice

| Archivo | Estado | Área | Título |
|---------|--------|------|--------|
| [2026-08-25-astro-client-load-hydration](./2026-08-25-astro-client-load-hydration.md) | fixed | ecommerce | Hidratación excesiva con `client:load` |
| [2026-08-25-astro-inter-cdn-font](./2026-08-25-astro-inter-cdn-font.md) | fixed | ecommerce | Inter CDN + Geist local en conflicto |
| [2026-08-25-strapi-upgrade-esbuild](./2026-08-25-strapi-upgrade-esbuild.md) | open | cms | `@strapi/upgrade` falla por esbuild |
| [2026-08-25-ecommerce-strapi-typed-client](./2026-08-25-ecommerce-strapi-typed-client.md) | fixed | ecommerce | `strapi-typed-client` arrastra Strapi al storefront |
| [2026-08-25-cms-strapi-typed-client-pnpm](./2026-08-25-cms-strapi-typed-client-pnpm.md) | fixed | cms | CMS no arranca: plugin + pnpm |
| [2026-08-25-product-pageview-href-type](./2026-08-25-product-pageview-href-type.md) | open | ecommerce | Typecheck: `href` inexistente en Product |
