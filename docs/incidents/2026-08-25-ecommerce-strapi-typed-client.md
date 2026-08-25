# Incidente: `strapi-typed-client` arrastra Strapi al storefront

| Campo | Valor |
|-------|--------|
| **ID** | `2026-08-25-ecommerce-strapi-typed-client` |
| **Estado** | `fixed` |
| **Área** | `ecommerce` |
| **Severidad** | `medium` |
| **Abierto** | 2026-08-25 |
| **Cerrado** | 2026-08-25 |

## Problema

`apps/ecommerce` dependía de `strapi-typed-client` solo por clases de error (`StrapiError`, etc.). El paquete arrastra peers de `@strapi/*` / React 18, genera warnings masivos de peer deps con React 19, y rompió junctions de pnpm tras upgrades. Viola la regla de no meter Strapi en el storefront.

## Propuesta

1. Implementar errores CMS locales en `src/lib/cms/errors.ts`.
2. Actualizar `client.ts` para importar desde ahí.
3. `pnpm --filter ecommerce remove strapi-typed-client`.
4. Dejar codegen/plugin solo en `apps/cms` si hace falta.

## Cómo se arregló

- Añadido `apps/ecommerce/src/lib/cms/errors.ts`.
- `client.ts` ya no importa `strapi-typed-client`.
- Dependencia eliminada de `apps/ecommerce/package.json`.

### Verificar

`pnpm --filter ecommerce typecheck` no debe reportar módulo `strapi-typed-client`. `pnpm why @strapi/strapi --filter ecommerce` no debería listar el storefront (salvo hoisting residual).
