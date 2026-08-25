# Incidente: CMS no arranca — `strapi-typed-client` + pnpm

| Campo | Valor |
|-------|--------|
| **ID** | `2026-08-25-cms-strapi-typed-client-pnpm` |
| **Estado** | `fixed` |
| **Área** | `cms` |
| **Severidad** | `high` |
| **Abierto** | 2026-08-25 |
| **Cerrado** | 2026-08-25 |

## Problema

`pnpm dev` (turbo → `strapi develop`) fallaba al cargar plugins:

`Error loading the plugin strapi-typed-client because strapi-typed-client is not installed`

Con `enabled: true` sin `resolve`, Strapi deja `pathToPlugin` vacío bajo pnpm. Con `resolve: 'strapi-typed-client'`, `require.resolve` tampoco resuelve de forma fiable el root del paquete (exports ESM / junction).

## Propuesta

1. Deshabilitar el plugin en `config/plugins.ts` (`enabled: false`).
2. Seguir generando tipos con `pnpm cms:types` (no depende del plugin en runtime).
3. En Docker/Dokploy (npm ci) el paquete puede seguir instalado; el plugin permanece off.

## Cómo se arregló

- `apps/cms/config/plugins.ts`: `'strapi-typed-client': { enabled: false }`.

### Verificar

`pnpm dev` debe levantar ecommerce en `:4321` y CMS en `:1337` sin el error de plugin.
