# Incidente: Inter CDN + Geist local en conflicto

| Campo | Valor |
|-------|--------|
| **ID** | `2026-08-25-astro-inter-cdn-font` |
| **Estado** | `fixed` |
| **Área** | `ecommerce` |
| **Severidad** | `medium` |
| **Abierto** | 2026-08-25 |
| **Cerrado** | 2026-08-25 |

## Problema

`BaseHead.astro` hacía `preconnect` + CSS remoto a Inter (`rsms.me`), mientras `global.css` importaba `@fontsource-variable/geist` y el tema usaba `'Geist Variable'`. Doble descarga de tipografía, FOUT innecesario, y CSS `:root` aún refería `Inter` / `InterVariable`.

## Propuesta

1. Quitar links a `rsms.me` / Inter.
2. Unificar `font-family` a Geist Variable.
3. `preconnect` solo a orígenes de media (Cloudinary).

## Cómo se arregló

- Eliminados preload/stylesheet de Inter en `BaseHead.astro`; añadido preconnect a `res.cloudinary.com`.
- `global.css`: `font-family: 'Geist Variable', …`; eliminado bloque `@supports` de InterVariable.

### Verificar

En Network no debe aparecer `rsms.me` / `inter.css`. Computed style del body = Geist Variable.
