# Incidente: CORS no cableado en Dokploy + Docker Node 20

| Campo | Valor |
|-------|--------|
| **ID** | `2026-08-25-cors-dokploy-docker-perf` |
| **Estado** | `fixed` |
| **Área** | `cms` / `infra` |
| **Severidad** | `high` |
| **Abierto** | 2026-08-25 |
| **Cerrado** | 2026-08-25 |

## Problema

1. `CORS_ORIGIN` existía en middleware / `.env.example` pero **no** en `infra/docker-compose.prod.yml`, así que Dokploy nunca inyectaba orígenes del storefront.
2. Dockerfile usaba `node:20`, `npm install` monolítico y `.dockerignore` con `*.lock` — builds lentos, imagen grande, Node fuera del rango documentado (22/24/26).
3. Puerto `1337` publicado en todas las interfaces del host.

## Propuesta

1. Añadir `CORS_ORIGIN` al compose con default seguro (**solo hosts live**: vercel.app + localhost).
2. Dominios `invictusjoyas.com` / www / `cms.invictusjoyas.com` quedan en **borrador** hasta crear zona DNS.
2. Completar CORS (methods, headers, `keepHeaderOnError`).
3. Dockerfile multi-stage Node 22 según docs Strapi Docker.
4. Quitar publish de puertos; Traefik vía red Docker.

## Cómo se arregló

- `apps/cms/config/middlewares.ts` — CORS completo.
- `infra/docker-compose.prod.yml` — `CORS_ORIGIN` + sin `ports` públicos.
- `apps/cms/Dockerfile` — multi-stage Node 22-alpine + prune.
- `apps/cms/.dockerignore` — deja de ignorar `package-lock.json`.

### Verificar

En Dokploy env (opcional si usas el default del compose):

```bash
CORS_ORIGIN=https://invictusjoyas.vercel.app,http://localhost:4321
# Draft (cuando exista zona): ,https://invictusjoyas.com,https://www.invictusjoyas.com
```

Rebuild compose CMS. Admin y API en `cmsinvictusjoyas.arbelaeznicolas.dev` deben responder; browser desde el storefront no debe ver errores CORS en llamadas cross-origin.
