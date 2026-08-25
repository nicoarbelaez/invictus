# AGENTS.md — Invictus

Reglas del monorepo para agentes. No sustituye el README humano.

## Stack

| App | Rol | Stack |
|-----|-----|--------|
| `apps/cms` | Headless CMS | Strapi 5 + PostgreSQL 17 + Cloudinary |
| `apps/ecommerce` | Storefront | Astro 6 + React islands + Tailwind 4 |
| Root | Tooling | pnpm workspace + Turborepo |

Mantener **Astro** para el catálogo (SSG/SEO). No proponer migración a Next salvo que el producto necesite auth, pagos online, o personalización por sesión en casi todas las páginas.

---

## Rendimiento (ecommerce)

1. **Islas, no SPA.** Hidratar solo lo interactivo. Preferir `client:visible` / `client:idle` sobre `client:load`.
2. **`client:load` solo** cuando la UI debe ser interactiva de inmediato (p. ej. checkout/carrito).
3. **Nav / Toaster** → `client:idle`. Listas de productos / hero → `client:visible` (idealmente con `rootMargin`).
4. **No cargar fuentes por CDN** si ya hay `@fontsource` / Geist local. Una familia tipográfica.
5. **Media:** `preconnect` / `dns-prefetch` a Cloudinary; `image.remotePatterns` para `res.cloudinary.com`.
6. **Prefetch:** hover / intent; no prefetch agresivo de rutas pesadas sin necesidad.
7. **Bundle:** evitar arrastrar Strapi al storefront. Errores/cliente CMS livianos en `apps/ecommerce/src/lib/cms/`. Preferir iconos concretos (`lucide-react`) sobre `@iconify/react` en rutas calientes.
8. **No** añadir `useMemo` / `useCallback` por defecto; el proyecto no asume React Compiler obligatorio en cada caso.
9. Medir antes de “optimizar” a ciegas: Lighthouse / bundle, no refactors cosméticos.

---

## CMS (Strapi)

1. Versiones `@strapi/*` **pinnadas** (sin `^`) en el mismo patch (p. ej. `5.52.1`).
2. Node LTS soportado por Strapi (hoy 22 / 24 / 26). Odd “current” no.
3. CORS: orígenes explícitos vía `CORS_ORIGIN` / `config/middlewares.ts`. No abrir `*`.
4. Datos: Document Service API (`strapi.documents`), no Entity Service (v4).
5. Upgrade preferido: `@strapi/upgrade`. Si falla por `esbuild`, pin manual + install; no subir majors a ciegas.
6. Tras cambios de content-types: `pnpm cms:types`.

---

## Monorepo / cambios

1. Package manager: **pnpm** (ver `packageManager` en root `package.json`).
2. Alcance mínimo: tocar solo archivos necesarios para la tarea.
3. No commitear secretos, `.env`, ni binarios grandes (p. ej. instaladores).
4. No crear commits ni PRs salvo que el usuario lo pida.
5. No documentar en markdown fuera de `docs/` / `AGENTS.md` salvo petición explícita.

---

## Incidentes (`docs/incidents`)

Usar esta carpeta para **reportar y cerrar** problemas de rendimiento, CMS, build, o arquitectura.

### Cómo usarlo

1. Copiar `docs/incidents/_TEMPLATE.md` → `docs/incidents/YYYY-MM-DD-slug-corto.md`.
2. Rellenar **Estado**, **Problema**, **Propuesta**, y (si aplica) **Cómo se arregló**.
3. Estado permitido: `open` | `in_progress` | `fixed` | `wontfix`.
4. Al **arreglar** un incidente: actualizar el mismo archivo (no crear uno nuevo), poner `fixed`, fecha de cierre, y enlazar PR/commit si existe.
5. Al trabajar en una tarea relacionada: **leer** incidentes `open` / `in_progress` en `docs/incidents/` antes de reinventar el fix.
6. Si descubres un bug/regresión de rendimiento o CMS: **crear** el incidente en la misma sesión (aunque el fix quede para después).

### Qué no va ahí

- Changelogs generales, RFCs largos, o tutorials → otro sitio.
- Secretos, tokens, o dumps de `.env`.
