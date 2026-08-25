# Incidente: `@strapi/upgrade` falla por esbuild

| Campo | Valor |
|-------|--------|
| **ID** | `2026-08-25-strapi-upgrade-esbuild` |
| **Estado** | `open` |
| **Área** | `cms` |
| **Severidad** | `medium` |
| **Abierto** | 2026-08-25 |
| **Cerrado** | — |

## Problema

`npx @strapi/upgrade latest` (y `--dry`) falla con `Cannot find module 'esbuild'` desde el cache de npx / `esbuild-register`. En el monorepo, `pnpm-workspace.yaml` tiene `allowBuilds.esbuild: false`, lo que complica builds nativos de esbuild.

Workaround usado: pin manual de `@strapi/*` a `5.52.1` + `pnpm install`.

## Propuesta

1. Evaluar `allowBuilds.esbuild: true` (o permitir solo para el paquete que lo necesite).
2. Alternativa: instalar `esbuild` como devDependency en `apps/cms` y correr upgrade desde ahí.
3. Documentar en scripts CMS: si upgrade CLI falla → pin + install (ya en `AGENTS.md`).
4. No depender solo de npx global sin deps resueltas.

## Cómo se arregló

— (pendiente; upgrade a 5.52.1 se hizo por pin manual, no por arreglar el CLI)
